const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamgameSchema = new Schema({
    gameId: { type: Number },
    gameDuration: { type: Number },
    blueTeam: {type: Schema.Types.ObjectId, ref: 'Team' },
    redTeam: {type: Schema.Types.ObjectId, ref: 'Team' },
    blueTowerKills: { type: Number },
    redTowerKills: { type: Number },
    blueRiftHeraldKills: { type: Number },
    redRiftHeraldKills: { type: Number },
    blueFirstBlood: { type: Boolean },
    redFirstBlood: { type: Boolean },
    blueInhibitorKills: { type: Number },
    redInhibitorKills: { type: Number },
    blueBans: { type: [] },
    redBans: { type: [] },
    blueDragonKills: { type: Number },
    redDragonKills: { type: Number },
    blueBaronKills: { type: Number },
    redBaronKills: { type: Number },
    blueWin: { type: Boolean },
    redWin: { type: Boolean }
}, {
  timestamps: true
});

const TeamGame = mongoose.model('TeamGame', teamgameSchema);

module.exports = TeamGame;