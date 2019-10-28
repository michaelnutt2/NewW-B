const mongoose = require('mongoose');
const Article = require('./articles');
const Tag = require('./tags');
const Schema =  mongoose.Schema;

const UserSchema =  new Schema({
    u_id : {type: String, required: true},
    f_name : String,
    l_name : String,
    email : String,
    pw : {type: String, required: true},
    create_date : String,
    rank : Number,
    follows : [Tag.schema],
    favorites : [mongoose.Schema.Types.ObjectId],
    voted_on : [
        {article: mongoose.Schema.Types.ObjectId,
         vote : Number}],
    comments : [mongoose.Schema.Types.ObjectId]
});

const User = mongoose.model('users',UserSchema);

module.exports = User;