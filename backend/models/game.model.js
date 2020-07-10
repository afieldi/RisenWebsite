const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
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

    // Combat
    kills15: { type: Number },
    killMap: { type: [[]] },
    soloKills: { type: Number },
    gankKills: { type: Number },
    deaths15: { type: Number },
    deathMap: { type: [[]] },
    soloDeaths: { type: Number },
    gankDeaths: { type: Number },
    assists15: { type: Number },
    assistMap: [[]],

    // Income
    goldEarned: { type: Number },
    totalMinionsKilled: { type: Number },
    neutralMinionsKilled: { type: Number },
    neutralMinionsKilledTeamJungle: { type: Number },
    neutralMinionsKilledEnemyJungle: { type: Number },
    firstItemTime: { type: Number },

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
    wardsPlaced15: { type: Number },
    wardsKilled15: { type: Number },
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

}, {
    timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;