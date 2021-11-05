const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    summonerId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    puuid: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    name: {
        type: String
    },
    searchName: {
        type: String
    },
    notes: { type: String }
}, {
    timestamps: true,
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;