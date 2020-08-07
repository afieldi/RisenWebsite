const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user: { type: String },
    auth: { type: String },
    name: { type: String },
    level: { type: Number }, // 0 user, 1 admin, can add more
    expiry: { type: Date }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;