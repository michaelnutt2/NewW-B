#! /usr/bin/env node

console.log('This script populates some test articles, users, comments and tags');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async')
var Article = require('./models/articles')
var User = require('./models/users')
var Comments = require('./models/comments')
var Tags = require('./models/tags')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));

var articles = []
var users = []
var comments = []
var tags = []

function tagsCreate(tag) {
    tagdetail = {tag: tag}

    var tag = new Tags(tagdetail);

    tag.save(function(err) {
        if(err) {
            cb(err, null)
            return
        }
        console.log('New Tag: ' + tag);
        tags.push(tag)
        cb(null, tag)
    });
}

function commentCreate()

function articleCreate(title, author, date, url, tags, rank, comments) {
    articledetail = {title: title, author: author, date: date, URL: url, tags: tags, comments: comments}

    var article = new Article(articledetail);

    article.save(function (err) {
        if(err) {
            cb(err, null)
            return
        }
        console.log('New Article: ' + article);
        articles.push(article)
        cb(null, article)
    });
}