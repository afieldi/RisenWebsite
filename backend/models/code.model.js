const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// I don't do much database design in my job...
const codeSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
}, {
  timestamps: true
});

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;