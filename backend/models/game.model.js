const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    teamname: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true },
}, {
    timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;