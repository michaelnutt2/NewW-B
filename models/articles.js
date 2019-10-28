const mongoose = require('mongoose');
const Tag = require('./tags');
const Comment = require('./comments')
const Schema =  mongoose.Schema;
// Create Schema and Model

const ArticleSchema =  new Schema({
    title : String,
    author : String,
    date : String,
    URL : String,
    tags : [Tag.schema],
    rank : Number,
    comments : [Comment.schema]
});

const Article = mongoose.model('articles', ArticleSchema);
module.exports = Article;