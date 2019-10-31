var mongoose = require('mongoose');
var assert = require('assert')
var Article = require('../models/articles');
var Tag = require('../models/tags');
var Article = require('../models/articles');
var User = require('../models/users');
var articles = require('../Articles/metadata.json');
var users = require('../Users/users.json');

 var before = function(){
            // Connect to mongodb
            var db = mongoose.connect('mongodb://newsDev:newB@10.125.187.72:9002/news', {
                useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:false});

            mongoose.connection.once('open', function(){
                console.log('Connection made...');
            }).on('error',function(error){
                console.log('Connection error:', error);
            });

            mongoose.connection.collections.articles.drop(function(){
            });

            mongoose.connection.collections.tags.drop(function(){
            });

            mongoose.connection.collections.users.drop(function(){
            });

            return db;
            };

var addArticles = function(){

    return Article.collection.insertMany(articles).then(function(records){
            assert.equal(articles.length, records['result']['n']);
            console.log('articles inserted');
            }).catch('error insering articles');
};

var addTags = function(){

    var makeTags = function(articles){
        var tags = [];
        for (obj in articles) {
            var tag = articles[obj]['tags']
            tags.push(tag)
        };

        var tags = [...new Set(tags)]

        tag_dict = []
        for (obj in tags) {
            var tag = tags[obj];
            tag_dict.push({'tag':tag});
        };
        return tag_dict;
    };


    var tags = makeTags(articles);
    return Tag.collection.insertMany(tags).then(function(records){
        assert.equal(tags.length, records['result']['n']);
        console.log('tags inserted')
    }).catch('error inserting tags');;
};

var addUsers = function(){
    
    return User.collection.insertMany(users).then(function(records){
        assert.equal(users.length, records['result']['n']);
        console.log('users inserted');
        }).catch('error insering articles');

}

before().then(function(){
    addArticles().then(function(){
        addTags().then(function(){
            addUsers().then(function(){
                mongoose.connection.close();
            });
        });  
    });
});

//mongoose.connection.close();







