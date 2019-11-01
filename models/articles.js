const mongoose = require('mongoose');
const Tag = require('./tags');
const Comment = require('./comments')
const Schema =  mongoose.Schema;
// Create Schema and Model

const ArticleSchema =  new Schema({
    newsgroup: String,
    title : String,
    author : String,
    date : String,
    url : String,
    filename : String,
    summary: String,
    tags : String,
    keywords: [String],
    rank : Number,
    comments : [Comment.schema], 
    text : String,
    img : String
});

const Article = mongoose.model('articles', ArticleSchema);
module.exports = Article;
