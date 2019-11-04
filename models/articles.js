const mongoose = require('mongoose');
const Tag = require('./tags');
const Comment = require('./comments')
const Schema =  mongoose.Schema;
// Create Schema and Model

const ArticleSchema =  new Schema({
    newsgroup: String,
    title : String,
    author : String,
    date : Date,
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

ArticleSchema
.virtual('article_url')
.get(function() {
    return '/article/' + this.id;
})

ArticleSchema
.virtual('author_url')
.get(function(){
    auth = this.author.split(" ");
    author = auth[0];
    for(var i = 1; i < auth.length; i++) {
        author += "_" + auth[i];
    }
    return '/article/author/' + author;
});

const Article = mongoose.model('articles', ArticleSchema);
module.exports = Article;
