const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const seasonSchema = new Schema({
    seasonName: { type: String },
    stringid: { type: String, unique: true }, // An identifier that will be used in urls
    active: { type: Boolean },
    teams: [{type: Schema.Types.ObjectId, ref: 'Team'}],
    spreadsheet: {type: String, required: false} //Spreadsheet url, optional
}, {
  timestamps: true
});

const Season = mongoose.model('Season', seasonSchema);

module.exports = Season;