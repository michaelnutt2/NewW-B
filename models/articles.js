const mongoose = require('mongoose');
const Tag = require('./tags');
const Schema =  mongoose.Schema;

// Create Schema and Model

const CommentSchema =  new Schema({
    userid : String,
    date : String, 
    txt : String,
    rank : Number
})

const ArticleSchema =  new Schema({
    a_id : String,
    title : String,
    author : String,
    date : String,
    URL : String,
    tags : [Tag.schema],
    rank : Number,
    comment : [CommentSchema]
});

const Article = mongoose.model('articles', ArticleSchema);

module.exports = Article;