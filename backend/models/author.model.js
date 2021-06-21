const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    strid: { type: String },
    name: { type: String }
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;