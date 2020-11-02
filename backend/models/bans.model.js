const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const banSchema = new Schema({
    champion: { type: String },
    expiryDate: { type: Date }
  }, {
  timestamps: true
});

const Ban = mongoose.model('Ban', banSchema);

module.exports = Ban;