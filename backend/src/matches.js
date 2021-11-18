// require('dotenv').config();
const { leagueApi, constants, makeRequest } = require('./api');
const { verifyPlayer, createPlayer, updatePlayerName } = require('./player');
const {spawn} = require('child_process');
// const uri = "mongodb+srv://admin:letmeinplease@cluster0.bwvsn.mongodb.net/newdb?retryWrites=true&w=majority";
// mongoose
//     .connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log("MongoDB database connection established successfully");
// });

const roles = require('./roles');
const timelineAnalyizer = require('./timeline')

const GameModel = require('../models/game.model');
const PlayerModel = require('../models/player.model');
const TeamGameModel = require('../models/teamgame.model');
const SeasonModel = require('../models/season.model');
const CodeModel = require('../models/code.model');

async function updateGames(name) {
    let summoner = (await leagueApi.Summoner.getByName(name, constants.Regions.AMERICA_NORTH)).response;
    let matchUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${summoner.puuid}/ids?type=tourney&start=0&count=20`;
    let matches = await (await makeRequest(matchUrl, "GET", process.env.RIOT_API)).json();
    await saveGames(matches);
    return "Done";
}

// This will be used later
async function saveGames(matchIds, tCode) {
    for ( const matchId of matchIds ) {
        try {
            // console.log("adding game: " + matchId);
            await saveGame(matchId);
            // console.log("Saved game: " + matchId);
        } catch (error) {
            console.log(error);
            console.log("Failed saving game: " + matchId);
        }
    }
}

function getRoles(gameData) {
    let roleMapping = {};
    for (let p of gameData.info.participants) {
        if (p.teamPosition === "UTILITY") {
            roleMapping[String(p.participantId)] = "SUPPORT";
        }
        else {
            roleMapping[String(p.participantId)] = 
                p.teamPosition;
        }
    }
    return roleMapping;
}

function calculateTeamTotal(participants) {
    let base = {
        "gold": 0,
        "exp": 0,
        "damageDealt": 0,
        "damageTaken": 0,
        "vision": 0
    }

    let data = {};
    for (let player of participants) {
        if (!data[player.teamId]) {
            data[player.teamId] = {...base};
        }
        data[player.teamId].damageDealt += player.totalDamageDealtToChampions;
        data[player.teamId].gold += player.goldEarned;
        data[player.teamId].vision += player.visionScore;
    }
    return data;
}

async function saveTeamGame(gameData, season) {
    let bD = gameData.info.teams[0]; // BlueData
    let rD = gameData.info.teams[1]; // RedData

    let bO = bD.objectives;
    let rO = rD.objectives;
    // Me good coder. Me no duplicate code
    let btO = await TeamGameModel.create({
        gameId: gameData.gameId,
        season: season,
        gameDuration: gameData.gameDuration,
        side: 'blue',
        towerKills: bO.tower.kills,
        riftHeraldKills: bO.riftHerald.kills,
        firstBlood: bO.champion.first,
        inhibitorKills: bO.inhibitor.kills,
        bans: bD.bans.map(b => b.championId),
        dragonKills: bO.dragon.kills,
        baronKills: bO.baron.kills,
        win: bD.win,
    });

    let rtO = await TeamGameModel.create({
        gameId: gameData.gameId,
        season: season,
        gameDuration: gameData.gameDuration,
        side: 'red',
        towerKills: rO.tower.kills,
        riftHeraldKills: rO.riftHerald.kills,
        firstBlood: rO.champion.first,
        inhibitorKills: rO.inhibitor.kills,
        bans: bD.bans.map(b => b.championId),
        dragonKills: rO.dragon.kills,
        baronKills: rO.baron.kills,
        win: rD.win
    });
    return [btO, rtO];
}

async function saveGame(matchId) {
    const teamgames = await TeamGameModel.find({gameId: matchId});
    const games = await GameModel.find({gameId: matchId});
    if (teamgames.length > 0 && games.length > 0) {
        console.log(`Already had game ${matchId} in db`);
        // We already have this game in our db. Move on.
        return;
    }

    let url = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`;
    // console.log(url)
    // Wait 1.3 seconds so we can't overload the api key. 
    // await setTimeout(() => {}, 1300);
    makeRequest(
        url, "GET", process.env.RIOT_API
    ).then(
        async gameData => {
            gameData = await gameData.json();
            let tCode = gameData.info.tournamentCode;
            if (!tCode) {
                console.log("Will not save game! No associated tournament code");
                return;
            }
            const metadata = gameData.metadata;
            const info = gameData.info;
            const code = await CodeModel.findOne({code: tCode});
            if (!code) {
                console.log(`Will not save game! Code (${tCode}) was not generated by us`);
                return;
            }
            if (teamgames.length === 0) {
                saveTeamGame(gameData, code.season);
            }
            if (games.length !== 0) {
                return;
            }
            
            if (games.length > 0) {
                // We already have this game in our db. Move on.
                return;
            }
            // const timeline = (await leagueApi.Match.timeline(matchId, constants.Regions.AMERICA_NORTH)).response;
            const timelineUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}/timeline`
            const timeline = await (await makeRequest(timelineUrl, "GET", process.env.RIOT_API)).json();
            const laneAssignments = getRoles(gameData);
            
            const timelineStats = timelineAnalyizer.getStats(timeline.info, laneAssignments);
            const teamTotals = calculateTeamTotal(gameData.info.participants);
            for (const [i, player] of Object.entries(gameData.info.participants)) {
                console.log("Saving match: " + matchId + " for player: " + player.summonerName);
                let playerObject = await verifyPlayer(player);
                
                const stats = player.stats; // Just so I have to type less

                // Burn this code
                await GameModel.create({
                    player: playerObject._id,
                    season: code.season,
                    gameId: matchId,
                    gameStart: info.gameCreation,
                    patch: info.gameVersion,
                    gameDuration: info.gameDuration,
                    championId: player.championId,
                    teamId: player.teamId, // 100 for blue, 200 for red
                    spell1Id: player.spell1Id,
                    spell2Id: player.spell2Id,
                
                    // Base Stats
                    kills: player.kills ? player.kills : 0,
                    deaths: player.deaths ? player.deaths : 0,
                    assists: player.assists ? player.assists : 0,
                    champLevel: player.champLevel,
                    win: player.win,

                    // Combat
                    kills15: timelineStats[+i+1].kills15,
                    killMap: timelineStats[+i+1].killMap,
                    soloKills: timelineStats[+i+1].soloKills,
                    gankKills: timelineStats[+i+1].gankKills,
                    deaths15: timelineStats[+i+1].deaths15,
                    deathMap: timelineStats[+i+1].deathMap,
                    soloDeaths: timelineStats[+i+1].soloDeaths,
                    gankDeaths: timelineStats[+i+1].gankDeaths,
                    assists15: timelineStats[+i+1].assists15,
                    assistMap: timelineStats[+i+1].assistMap,
                
                    // Income
                    goldEarned: player.goldEarned,
                    totalMinionsKilled: player.totalMinionsKilled ? player.totalMinionsKilled : 0,
                    neutralMinionsKilled: player.neutralMinionsKilled ? player.neutralMinionsKilled : 0,
                    firstItemTime: timelineStats[+i+1].firstItemTime,
                
                    // Damage
                    physicalDamageDealtToChampions: player.physicalDamageDealtToChampions,
                    magicDamageDealtToChampions: player.magicDamageDealtToChampions,
                    trueDamageDealtToChampions: player.trueDamageDealtToChampions,
                    totalDamageDealtToChampions: player.totalDamageDealtToChampions,
                    physicalDamageTaken: player.physicalDamageTaken,
                    magicalDamageTaken: player.magicalDamageTaken,
                    trueDamageTaken: player.trueDamageTaken,
                    totalDamageTaken: player.totalDamageTaken,
                    damageSelfMitigated: player.damageSelfMitigated,
                    
                    totalHeal: player.totalHeal,
                    totalHealsOnTeammates: player.totalHealsOnTeammates,
                    totalDamageShieldedOnTeammates: player.totalDamageShieldedOnTeammates,
                    
                    // Vision
                    visionScore: player.visionScore,
                    wardsPlaced15: timelineStats[+i+1].wardsPlaced15,
                    wardsPlaced: player.wardsPlaced ? player.wardsPlaced : 0,
                    wardsKilled15: timelineStats[+i+1].wardsKilled15,
                    wardsKilled: player.wardsKilled ? player.wardsKilled : 0,
                    visionWardsBoughtInGame: player.visionWardsBoughtInGame,
                    
                    // Objectives
                    damageDealtToObjectives: player.damageDealtToObjectives,
                    dragonKills: player.dragonKills,
                    firstTowerTakedown: player.firstTowerKill || player.firstTowerAssist,
                    firstBloodTakedown: player.firstBloodKill || player.firstBloodAssist,
                
                    // Fun
                    firstBloodKill: player.firstBloodKill,
                    firstBloodAssist: player.firstBloodAssist,
                    firstTowerKill: player.firstTowerKill,
                    firstTowerAssist: player.firstTowerAssist,
                    turretKills: player.turretKills,
                    doubleKills: player.doubleKills,
                    tripleKills: player.tripleKills,
                    quadraKills: player.quadraKills,
                    pentaKills: player.pentaKills,
                
                    // Timeline
                    csDiff10: timelineStats[+i+1].CSD10,
                    csDiff20: timelineStats[+i+1].CSD20,
                    csDiff30: timelineStats[+i+1].CSD30,
                    xpDiff10: timelineStats[+i+1].XPD10,
                    xpDiff20: timelineStats[+i+1].XPD20,
                    xpDiff30: timelineStats[+i+1].XPD30,
                    goldDiff10: timelineStats[+i+1].GDD10,
                    goldDiff20: timelineStats[+i+1].GDD20,
                    goldDiff30: timelineStats[+i+1].GDD30,
                    lane: laneAssignments[String(player.participantId)],

                    goldMap: timelineStats[+i+1].goldMap,
                    csMap: timelineStats[+i+1].csMap,
                    xpMap: timelineStats[+i+1].xpMap,
                    
                    items: [
                        player.item0,
                        player.item1,
                        player.item2,
                        player.item3,
                        player.item4,
                        player.item5
                    ],
                    trinket: player.item6,

                    primaryRunes: [
                        player.perks.styles[0].selections[0].perk,
                        player.perks.styles[0].selections[1].perk,
                        player.perks.styles[0].selections[2].perk,
                        player.perks.styles[0].selections[3].perk
                    ],

                    secondaryRunes: [
                        player.perks.styles[1].selections[0].perk,
                        player.perks.styles[1].selections[1].perk
                    ],

                    shards: [
                        player.perks.statPerks.defense,
                        player.perks.statPerks.flex,
                        player.perks.statPerks.offense
                    ],

                    summoner1Id: player.summoner1Id,
                    summoner1Casts: player.summoner1Casts,
                    summoner2Id: player.summoner2Id,
                    summoner2Casts: player.summoner2Casts,

                    primaryStyle :player.perks.styles[1].style,
                    secondaryStyle: player.perks.styles[1].style,

                    // Computed
                    damagePerGold: player.totalDamageDealtToChampions / player.goldEarned,
                    goldShare: player.goldEarned / teamTotals[player.teamId].gold,
                    damageShare: player.totalDamageDealtToChampions / teamTotals[player.teamId].damageDealt,
                    visionShare: player.visionScore / teamTotals[player.teamId].vision
                });
            }
            console.log(`Added ${matchId} to db`);
        },
        (error) => {
            console.log(error.message);
        }
    )
}


// saveGames([
//     3478174506,
//     3478147318,
//     3475852754,
//     3491311607,
//     3491178375,
//     3490794102,
//     3490769912,
//     3490406651,
//     3490308718,
//     3490311851,
//     3490245081,
//     3490169087,
//     3490184363,
//     3490068881,
//     3490123843,
//     3489994608,
//     // 3516542892
// ]).then(() => {
//     console.log("donezo")
// });
// saveGame("NA1_4039543209");
// saveGame("NA1_4039703136");
module.exports = {
    'saveGames': saveGames,
    'saveGame': saveGame,
    'updateGames': updateGames
}