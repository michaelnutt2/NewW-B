const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
var moment = require('moment');
// Create Schema and Model

const CommentSchema =  new Schema({
    u_id : {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    date : Date, 
    text : String,
    rank : Number
});

CommentSchema
.virtual('user_url')
.get(function() {
    return "/user/" + this.u_id;
})

CommentSchema
.virtual('post_date')
.get(function() {
    return moment(this.date).format('MMMM Do, YYYY');
})

const Comment = mongoose.model('comments', CommentSchema);
module.exports = Comment;
