# NewW-B
News Group Aggregation Web App

## Tests
__Current Tests__:

* connect to db
* saving records to db
* updating records in db
* delete record from db
* find records in db
* nesting collections in db
* module test
    * create user
    * change user password
    * modify user (first name, last name, and email)

can be run with:
> npm run test

## Local web app dev:
* cd .\express-neww-b\
* npm start

## Populating DB
* run python/genUsers.py and python/RssReader.py to generate Users, articles, and Tags
* run node modules/populateDB.js to upload collections to DB (note it should drop all previous data)


