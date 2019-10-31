const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const TagSchema = new Schema({
    tag:String
});

TagSchema
.virtual('url')
.get(function() {
    return '/article/tags/' + this._id;
});

const Tag = mongoose.model('tags',TagSchema);

module.exports = Tag;