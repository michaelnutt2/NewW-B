import json
from random import randint, sample
from itertools import combinations
import names
from essential_generators import DocumentGenerator
from pymongo import MongoClient
from bson import ObjectId
import rss_reader
from datetime import datetime
from dateutil import parser


## Connect to Mongo and generatr collection objects
client = MongoClient('mongodb://newsDev:newB@10.125.187.72:9002/news')
db = client.news
# drop users as we will make some more
db.users.drop()
user_col = db.users
article_col = db.articles
tag_col = db.tags

# create random document generator
gen = DocumentGenerator()

## udpate the rss articles
rss_reader

with open('../Articles/metadata.json', 'r') as fp:
    new_articles = json.load(fp)

for article in new_articles:
    article_col.update({'title':article['title']},article, upsert=True)
    #article_col.insert_many(new_articles)

# get the the eavilable tags from the db
tags = []
for doc in tag_col.find():
    tags.append(doc['tag'])

# get all the articles from the db
article_id = []
for doc in article_col.find():
    article_id.append(str(doc['_id']))

# genrate the users to insert
users = []

# a test user
test_user = {
            'u_id':'test',
            'f_name':'Testy',
            'l_name':'Tester',
            'pw': 'test',
            'email': 'test@email.com',
            'create_date': datetime.utcnow(),
            'follows': sample(tags, k = randint(1,7)),
            'favorites': [ObjectId(id) for id in sample(article_id, k = randint(0,20))],
            'voted_on' : [{'article': ObjectId(id), 'vote':sample([-1,1], 1)[0]} for id in sample(article_id, k = randint(0,len(article_id)))],
            'commented_on' : [ObjectId(id) for id in sample(article_id, k = randint(0,10))]
            }

users.append(test_user)

# 100 random users
for i in range(100):
    m_f = randint(0,1)
    if m_f == 0: 
        gender = 'male'
    else:
        gender = 'female'
    
    f_name = names.get_first_name(gender)
    l_name = names.get_last_name()
    u_id = f_name[0]+l_name
    pw = f_name[0:2]+l_name[0:2] + "".join([str(randint(0,9)) for i in range(5)])
    email = u_id + '@email.com'
    user = {
        'u_id':u_id,
        'f_name':f_name,
        'l_name':l_name,
        'pw': pw,
        'email': email,
        'create_date': datetime.utcnow(),          
        'follows': sample(tags, k = randint(1,7)),
        'favorites': [ObjectId(id) for id in sample(article_id, k = randint(0,20))],
        'voted_on' : [{'article': ObjectId(id), 'vote':sample([-1,1], 1)[0]} for id in sample(article_id, k = randint(0,len(article_id)))],
        'commented_on' : [ObjectId(id) for id in sample(article_id, k = randint(0,10))]
         }
    users.append(user)

# insering the users
user_col.insert_many(users)


# generating random comments

# first drop existing comments
article_col.update({}, {'$unset': {'comments':""}},multi=True)

for article in article_id:
    rank = 0
    for user in users:
        # check each user and comment if there are any
        for c_article in user['commented_on']:
            if c_article==ObjectId(article):
                user = user_col.find_one({'u_id': user['u_id']})
                comment = gen.sentence()
                article_col.find_one_and_update(
                    {'_id':ObjectId(c_article)}, 
                    {"$push": {'comments':
                        [{'u_id': user['_id'], 
                          'text': comment,
                          'rank':randint(-10,10),
                          'date':datetime.utcnow()
                          }]
                          }
                    })
        # check each user and update rank vote if there are any
        for v_article in user['voted_on']:
            if v_article['article']==ObjectId(article):
                rank += v_article['vote']
    # update rank
    article_col.find_one_and_update(
                    {'_id':ObjectId(article)}, 
                    {"$set": {'rank':rank}})

    # # fix datetime column
    # record = article_col.find_one({'_id':ObjectId(article)})
    # article_col.find_one_and_update(
    #                 {'_id':ObjectId(article)}, 
    #                 {"$set": {'date':parser.parse(record['date'])}})


# removing some duplicates
remove_dups = [
    {'$group': {'_id': {'title': '$title'}, 
                'dups': {'$addToSet': '$_id'}, 
                'count': {'$sum': 1}}
    },
    {'$match': {'count': {'$gt': 1}}
    }
]
duplicates = list(article_col.aggregate(remove_dups))

for d in duplicates:
    print(d['dups'][0])
    article_col.delete_one({'_id':d['dups'][0]})
         
      
