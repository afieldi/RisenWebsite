const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSchema = new Schema({
    strid: { type: String, unique: true },
    tag: { type: String },
    name: { type: String }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;