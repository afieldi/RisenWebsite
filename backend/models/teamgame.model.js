const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Change to be side independent
// One variable to say which side it is
const teamgameSchema = new Schema({
    gameId: { type: Number },
    season: {type: Schema.Types.ObjectId, ref: 'Season', required: true },
    gameDuration: { type: Number },
    team: {type: Schema.Types.ObjectId, ref: 'Team' },
    towerKills: { type: Number },
    riftHeraldKills: { type: Number },
    firstBlood: { type: Boolean },
    inhibitorKills: { type: Number },
    bans: { type: [] },
    side: { type: String, enum: ["red", "blue"], default: "blue" },
    dragonKills: { type: Number },
    baronKills: { type: Number },
    win: { type: Boolean },
}, {
  timestamps: true
});

const TeamGame = mongoose.model('TeamGame', teamgameSchema);

module.exports = TeamGame;