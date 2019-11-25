# NewW-B
News Group Aggregation Web App

## Design
Our program was built using Node.js and MongoDB with a focus on user experience. The main landing page displays all articles in the system that the user is subscribed to, or all if not logged in. The users can then navigate to specific sections for each tag or search and filter by keyword.

### Database Design
The website utilizes 4 main Document templates: 

```
// Holds data for articles to be displayed to users
Article: 
{
    _id: Object ID Primary key
    newsgroup: String       // News Source
    title: String           // Article Title
    author: String          // Article Author
    date: Date              // Published date
    url: String             // Original page URL
    filepath: String        // HTML file path for article
    summary: String         // Summary for preview
    tags: String            // Main category of the article
    keywords: [String]      // Selected keywords
    rank: Number            // Article ranking by users
    comments: [Comment]     // Subdocument for comments left on article
    text: String            // Article text for searching
    img: String             // Filepath for image for preview
}

// Holds data for users signed in to the website
Users: 
{
    _id: Object ID Primary key
    u_id: String required       // Username
    f_name: String              // First Name
    l_name: String              // Last Name
    email: String required      // User email
    pw: String required         // User password
    create_date: Date           // Auto generated date user created
    follows: [String]           // Tags the user is subscribed to
    favorites: [Article Object ID] // List of favorite articles
    voted_on: {                 // List of articles voted on and the vote given
        article: Object ID
        vote: Number
    }
    commented_on: [Article Object ID]   // List of articles commented on
}

// Holds comment information, is saved as a subdocument in the Article schema
Comments: 
{
    _id: Object ID Primary key
    u_id: User Object ID        // Object ID for User that left comment
    date: Date                  // Auto generated date comment was left
    text: String                // Actual comment text
}

// Holds information on the various tags in the article
// Created for easier filtering/managing of tags user is subscribed to
Tags: 
{
    _id: Object ID Primary Key
    tag: String                 // String name of the tag
}
```

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