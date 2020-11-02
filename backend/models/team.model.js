const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    teamname: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    teamshortname: {
        type: String,
        required: true
    },
    division: { type: Number },
    players: [{type: Schema.Types.ObjectId, ref: 'Player'}],
    season: {type: Schema.Types.ObjectId, ref: 'Season'}
}, {
    timestamps: true,
});

teamSchema.methods.addPlayer = function addPlayer(playerObject) {
    if (this.players.includes(playerObject._id)) {
        return;
    }
    this.players.push(playerObject);
}

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;