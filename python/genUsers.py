import json
from random import randint
import names


users = []

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
        'email': email
        }
    users.append(user)

with open('../Users/users.json', 'a') as fp:
    json.dump(users,fp)