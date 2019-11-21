// Tag Model
const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

// Create Schema
const TagSchema = new Schema({
    tag:String
});

// Schema methods
TagSchema
.virtual('url')
.get(function() {
    return '/article/tags/' + this._id;
});

// export model
const Tag = mongoose.model('tags',TagSchema);
module.exports = Tag;