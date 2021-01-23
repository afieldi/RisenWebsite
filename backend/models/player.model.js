const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    accountId: {
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
    notes: { type: String },
    teams: [{type: Schema.Types.ObjectId, ref: 'Team'}]
}, {
    timestamps: true,
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;