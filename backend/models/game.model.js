const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    player: {type: Schema.Types.ObjectId, ref: 'Player', required: true },
    team: {type: Schema.Types.ObjectId, ref: 'Team', required: true },
    season: {type: Schema.Types.ObjectId, ref: 'Season', required: true },
    gameId: { type: Number },
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
    totalMinionsKilled: { type: Number, sparse: true },
    neutralMinionsKilled: { type: Number },
    neutralMinionsKilledTeamJungle: { type: Number },
    neutralMinionsKilledEnemyJungle: { type: Number },
    firstItemTime: { type: Number },
    goldGen10: { type: Number },
    goldGen20: { type: Number },
    goldGen30: { type: Number },
    xpGen10: { type: Number },
    xpGen20: { type: Number },
    xpGen30: { type: Number },
    csGen10: { type: Number },
    csGen20: { type: Number },
    csGen30: { type: Number },

    // Damage
    physicalDamageDealtToChampions: { type: Number },
    magicDamageDealtToChampions: { type: Number },
    trueDamageDealtToChampions: { type: Number },
    totalDamageDealtToChampions: { type: Number, sparse: true },
    physicalDamageTaken: { type: Number },
    magicalDamageTaken: { type: Number },
    trueDamageTaken: { type: Number },
    totalDamageTaken: { type: Number },
    damageDealtToObjectives: { type: Number },
    damageSelfMitigated: { type: Number },

    totalHeal: { type: Number },

    // Vision
    visionScore: { type: Number, sparse: true },
    wardsPlaced15: { type: Number },
    wardsPlaced: { type: Number },
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
    summoners: { type: [Number] },

    // Computed
    damagePerGold: { type: Number },

}, {
    timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;