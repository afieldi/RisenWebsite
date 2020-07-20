const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const draftSchema = new Schema({
    gameLink: { type: String },
    blueName: { type: String },
    blueAuth: { type: String },
    redName: { type: String },
    redAuth: { type: String },
    time: { type: Number },
    backtrack: { type: Boolean },
    ruleset: { type: String }, // NORMAL or RISEN. Might add more in the future?
    redPicks: [ { type: String } ],
    redBans: [ { type: String } ],
    bluePicks: [ { type: String } ],
    blueBans: [ { type: String } ]
}, {
  timestamps: true
});

const Draft = mongoose.model('Draft', draftSchema);

module.exports = Draft;