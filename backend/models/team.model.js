const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    teamname: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    teamshortname: {
        type: String,
        required: true
    },
    players: [{type: Schema.Types.ObjectId, ref: 'Player'}]
}, {
    timestamps: true,
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;