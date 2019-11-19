const mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

const Article = require('./articles')
const Schema =  mongoose.Schema;

const UserSchema =  new Schema({
    u_id : {type: String, required: true},
    f_name : String,
    l_name : String,
    email : String,
    pw : {type: String, required: true},
    create_date : Date,
    rank : Number,
    follows : [String],
    favorites : [{type: Schema.Types.ObjectId, ref: "Article"}],
    voted_on : [
        {
            article: {type:Schema.Types.ObjectId, ref: "Article"},
            vote : Number
        }
    ],
    commented_on : [{type: Schema.Types.ObjectId, ref: "Article"}]
});

// UserSchema
// .virtual('votes')
// .get(function() {
//     votes = {};
//     for(article of voted_on) {
//         votes[article.article] = article.vote;
//     }

//     return votes;
// })

UserSchema.methods.generateHash = function(password) {
    //return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return password
};

UserSchema.methods.validPassword = function(password) {
    //return bcrypt.compareSync(password, this.pw);
    return (this.pw === password)
};

const User = mongoose.model('users',UserSchema);

module.exports = User;
