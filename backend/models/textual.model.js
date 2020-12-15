const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const textualSchema = new Schema({
    title: { type: String },
    preview: { type: String },
    body: { type: String },
    type: { type: String, enum: ['rule', 'article'] }
}, {
  timestamps: true
});

const Textual = mongoose.model('Textual', textualSchema);

module.exports = Textual;