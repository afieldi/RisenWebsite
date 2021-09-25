const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    player: {type: Schema.Types.ObjectId, ref: 'Player', required: true },
    season: {type: Schema.Types.ObjectId, ref: 'Season', required: true },
    gameId: { type: String },
    gameStart: { type: Number },
    patch: { type: String },
    gameDuration: { type: Number, sparse: true },
    championId: { type: Number },
    teamId: { type: Number }, // 100 for blue, 200 for red
    spell1Id: { type: Number },
    spell2Id: { type: Number },

    // Base Stats
    kills: { type: Number, sparse: true },
    deaths: { type: Number, sparse: true },
    assists: { type: Number, sparse: true },
    champLevel: { type: Number },
    win: { type: Boolean },
    championTransform: { type: Number },

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
    goldEarned: { type: Number, sparse: true },
    goldSpent: { type: Number },
    totalMinionsKilled: { type: Number, sparse: true },
    neutralMinionsKilled: { type: Number },
    firstItemTime: { type: Number },

    // Damage
    physicalDamageDealtToChampions: { type: Number },
    magicDamageDealtToChampions: { type: Number },
    trueDamageDealtToChampions: { type: Number },
    totalDamageDealtToChampions: { type: Number, sparse: true },
    physicalDamageTaken: { type: Number },
    magicalDamageTaken: { type: Number },
    trueDamageTaken: { type: Number },
    totalDamageTaken: { type: Number },
    damageSelfMitigated: { type: Number },
    
    totalHeal: { type: Number },
    totalHealsOnTeammates: { type: Number },
    totalDamageShieldedOnTeammates: { type: Number },
    
    // Vision
    visionScore: { type: Number, sparse: true },
    wardsPlaced15: { type: Number },
    wardsPlaced: { type: Number },
    wardsKilled15: { type: Number },
    wardsKilled: { type: Number },
    visionWardsBoughtInGame: { type: Number },
    
    // Objectives
    damageDealtToObjectives: { type: Number },
    dragonKills: { type: Number },
    firstTowerTakedown: { type: Boolean },
    firstBloodTakedown: { type: Boolean },

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
    consumablesPurchased: { type: Number },

    // Timeline
    csDiff10: { type: Number },
    csDiff20: { type: Number },
    csDiff30: { type: Number },
    xpDiff10: { type: Number },
    xpDiff20: { type: Number },
    xpDiff30: { type: Number },
    goldDiff10: { type: Number },
    goldDiff20: { type: Number },
    goldDiff30: { type: Number },

    goldMap: { type: [Number] },
    csMap: { type: [Number] },
    xpMap: { type: [Number] },

    // Items
    items: { type: [Number]},
    trinket: { type: Number },

    lane: { type: String },

    primaryRunes: { type: [Number] },
    secondaryRunes: { type: [Number] },
    primaryStyle: { type: Number },
    secondaryStyle: { type: Number },
    shards: { type: [Number] },

    summoner1Id: { type: Number },
    summoner1Casts: { type: Number },
    summoner2Id: { type: Number },
    summoner2Casts: { type: Number },

    // Computed
    damagePerGold: { type: Number },
    damageShare: { type: Number },
    goldShare: { type: Number },
    visionShare: { type: Number }
}, {
    timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;