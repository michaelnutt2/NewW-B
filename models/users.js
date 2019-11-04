const mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
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
    favorites : [{type: mongoose.Schema.Types.ObjectId, ref:'Article'}],
    voted_on : [
        {article: mongoose.Schema.Types.ObjectId,
         vote : Number}],
    comments : [mongoose.Schema.Types.ObjectId]
});

UserSchema..methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

const User = mongoose.model('users',UserSchema);

module.exports = User;
