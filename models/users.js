const mongoose = require('mongoose');
const Article = require('./articles');
const Tag = require('./tags');
const Schema =  mongoose.Schema;

const UserSchema =  new Schema({
    u_id : String,
    f_name : String,
    l_name : String,
    email : String,
    pw : String,
    create_date : String,
    rank : Number,
    follows : [Tag.schema],
    favorites : [Article.schema],
    voted_on : [
        {article: Article.schema,
         vote : Number}]
});

const User = mongoose.model('users',UserSchema);

module.exports = User;