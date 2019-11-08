const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
// Create Schema and Model

const CommentSchema =  new Schema({
    u_id : {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    date : Date, 
    txt : String,
    rank : Number
});

const Comment = mongoose.model('comments', CommentSchema);
module.exports = Comment;
