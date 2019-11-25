# NewW-B
News Group Aggregation Web App

## How to Run Locally
* For all accesses must either be on the UNT network or VPN
* Node.js required to run web server locally, database is hosted on lab server on UNT network
* After Node is installed run the following: 
  ```
    npm install
  ```
* This will install all dependencies found in package.json
* Then go to localhost:3000 in web browser

## How to Access on Server
* Server address: http://10.125.187.72:8000/article
* Can create a new user or login with:
> u: test\
> p: test

## Limitations
Main limitation is currently only pulls from one news source, future work would involve adding feature to add other news source RSS feeds by users.

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
* run python/genUsers.py and python/RssReader.py to generate Users, Articles, and Tags
* run node modules/populateDB.js to upload collections to DB (note it should drop all previous data)

## References
“Express Web Framework (Node.js/JavaScript).” MDN Web Docs, Mozilla, developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs.​

“Free JavaScript Training, Resources and Examples for the Community.” JavaScript.com, www.javascript.com/.​

“Getting Started.” Pugjs.org, www.pugjs.org/.​

“The Most Popular Database for Modern Apps.” MongoDB, www.mongodb.com/.​

“Stack Exchange.” Hot Questions - Stack Exchange, stackexchange.com/.​

“Where Developers Learn, Share, & Build Careers.” Stack Overflow, stackoverflow.com/.​