const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// I don't do much database design in my job...
const userSchema = new Schema({
    user: { type: String },
    auth: { type: String },
    expiry: { type: Date }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;