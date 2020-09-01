const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const matchSchema = new Schema({
    team1: { type: Schema.Types.ObjectId, ref: 'Team' },
    team2: { type: Schema.Types.ObjectId, ref: 'Team' },
    team1Score: { type: Number },
    team2Score: { type: Number },
    team1Win: { type: Boolean },
    season: {type: Schema.Types.ObjectId, ref: 'Season'}
}, {
  timestamps: true
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;