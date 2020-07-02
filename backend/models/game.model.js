const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    id: {
        type: Number,
        autoIncrement: true,
        primaryKey: true
    },
    player: {type: Schema.Types.ObjectId, ref: 'Player', required: true },
    team: {type: Schema.Types.ObjectId, ref: 'Team', required: true },
    gameId: { type: Number },
    gameDuration: { type: Number },
    championId: { type: Number },
    teamId: { type: Number }, // 100 for blue, 200 for red
    spell1Id: { type: Number },
    spell2Id: { type: Number },

    // Base Stats
    kills: { type: Number },
    deaths: { type: Number },
    assists: { type: Number },
    champLevel: { type: Number },
    win: { type: Boolean },

    // Income
    goldEarned: { type: Number },
    totalMinionsKilled: { type: Number },
    neutralMinionsKilled: { type: Number },
    neutralMinionsKilledTeamJungle: { type: Number },
    neutralMinionsKilledEnemyJungle: {type: Number },

    // Damage
    physicalDamageDealtToChampions: { type: Number },
    magicDamageDealtToChampions: { type: Number },
    trueDamageDealtToChampions: { type: Number },
    totalDamageDealtToChampions: { type: Number },
    physicalDamageTaken: { type: Number },
    magicalDamageTaken: { type: Number },
    trueDamageTaken: { type: Number },
    totalDamageTaken: { type: Number },
    damageDealtToObjectives: { type: Number },
    damageSelfMitigated: { type: Number },

    totalHeal: { type: Number },

    // Vision
    visionScore: { type: Number },
    wardsKilled: { type: Number },
    visionWardsBoughtInGame: { type: Number },

    // Fun
    firstBloodKill: { type: Boolean },
    firstBloodAssist: { type: Boolean },
    firstTowerKill: { type: Boolean },
    firstTowerAssist: { type: Boolean },
    turretKills: { type: Number },
    doubleKills: { type: Number },
    tripleKills: { type: Number },
    quadraKills: { type: Number },
    pentaKills: { type: Number },

    // Timeline
    csDiff10: { type: Number },
    csDiff20: { type: Number },
    csDiff30: { type: Number },
    lane: { type: String },

    // Computed
    damagePerGold: { type: Number },



    // teamname: { type: String, required: true },
    // duration: { type: Number, required: true },
    // date: { type: Date, required: true },
}, {
    timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;