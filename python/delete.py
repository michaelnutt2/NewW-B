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
from rss_reader import ArticleLoader

## Connect to Mongo and generatr collection objects
client = MongoClient('mongodb://newsDev:newB@10.125.187.72:9002/news')
db = client.news
user_col = db.users
article_col = db.articles
tag_col = db.tags


def remove_test():
    # removing duplicate articles
    tests = user_col.find({'u_id':{'$regex':'test'},'f_name':""})
    for t in tests:
        user_col.delete_one({'u_id':t['u_id']})
         

if __name__ == "__main__":
    remove_test()