const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const TagSchema = new Schema({
    tag:String
});

const Tag = mongoose.model('tags',TagSchema);

module.exports = Tag;