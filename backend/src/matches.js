// require('dotenv').config();
const { leagueApi, constants, makeRequest } = require('./api')
const { verifyPlayer, createPlayer, updatePlayerName } = require('./player')
const {spawn} = require('child_process');
const mongoose = require('mongoose');
const fetch = require("node-fetch");

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
const TeamModel = require('../models/team.model');
const TeamGameModel = require('../models/teamgame.model');
const SeasonModel = require('../models/season.model');
const CodeModel = require('../models/code.model');
const { exception } = require('console');

// This will be used later
async function saveGames(matchIds, tCode) {
    for ( const matchId of matchIds ) {
        try {
            // console.log("adding game: " + matchId);
            await saveGame(matchId, tCode);
            // console.log("Saved game: " + matchId);
        } catch (error) {
            console.log(error);
            console.log("Failed saving game: " + matchId);
        }
    }
}

async function getRoles(gameData, timeline) {
    return new Promise( (resolve, reject) => {
    //     const python = spawn('python', ['./src/roles.py']);
    //     python.stdin.write(JSON.stringify(gameData));
    //     python.stdin.write("\r\n");

    //     python.stdin.write(JSON.stringify(timeline));
    //     python.stdin.end();
        
    //     python.stdout.on('data', function (data) {
    //         console.log(data);
    //         resolve(data);
    //     });

    //     python.stdout.on('error', (data) => {
    //         reject();
    //     })
    // The above stuff involving running python doesn't work with GCP as you can't have nodejs and python at the same time
    // So instead just return filler stuff so nothing else has to be changed. Anything involving role will have to be commented out
    //  on the front end as well.
    // Update: Risen should be using LCS order, so this will be the order they will appear in the match history. Bless
        resolve({
            "1": "TOP",
            "2": "JUNGLE",
            "3": "MIDDLE",
            "4": "BOTTOM",
            "5": "SUPPORT",
            "6": "TOP",
            "7": "JUNGLE",
            "8": "MIDDLE",
            "9": "BOTTOM",
            "10": "SUPPORT"
        })
    });

}

async function saveTeamGame(gameData, teams, season) {
    let bD = gameData.teams[0]; // BlueData
    let rD = gameData.teams[1]; // RedData
    let btO = await TeamGameModel.create({
        gameId: gameData.gameId,
        season: season,
        gameDuration: gameData.gameDuration,
        team: teams[0],
        side: 'blue',
        towerKills: bD.towerKills,
        riftHeraldKills: bD.riftHeraldKills,
        firstBlood: bD.firstBlood,
        inhibitorKills: bD.inhibitorKills,
        bans: bD.bans.map(b => b.championId),
        dragonKills: bD.dragonKills,
        baronKills: bD.baronKills,
        win: bD.win === "Win",
    });

    let rtO = await TeamGameModel.create({
        gameId: gameData.gameId,
        season: season,
        gameDuration: gameData.gameDuration,
        team: teams[1],
        side: 'red',
        towerKills: rD.towerKills,
        riftHeraldKills: rD.riftHeraldKills,
        firstBlood: rD.firstBlood,
        inhibitorKills: rD.inhibitorKills,
        bans: rD.bans.map(b => b.championId),
        dragonKills: rD.dragonKills,
        baronKills: rD.baronKills,
        win: rD.win === "Win"
    });
    console.log("aa")
    return [btO, rtO];
}

async function saveGame(matchId, tCode) {
    const teamgames = await TeamGameModel.find({gameId: matchId});
    const games = await GameModel.find({gameId: matchId});
    if (teamgames.length > 0 && games.length > 0) {
        console.log(`Already had game ${matchId} in db`);
        // We already have this game in our db. Move on.
        return;
    }

    let url = `https://na1.api.riotgames.com/lol/match/v4/matches/${matchId}/by-tournament-code/${tCode}`;
    // console.log(url)
    // Wait 1.3 seconds so we can't overload the api key. 
    // await setTimeout(() => {}, 1300);
    makeRequest(
        url, "GET", process.env.RIOT_TOURNEY_API
    ).then(
        async gameData => {
            gameData = await gameData.json();
        
            const teams = await getTeams(gameData.participantIdentities);
            const code = await CodeModel.findOne({code: tCode});

            if (teamgames.length === 0) {
                saveTeamGame(gameData, teams, code.season);
            }
            if (games.length !== 0) {
                return;
            }
            
            if (games.length > 0) {
                // We already have this game in our db. Move on.
                return;
            }
            const timeline = (await leagueApi.Match.timeline(matchId, constants.Regions.AMERICA_NORTH)).response;
            const laneAssignments = await getRoles(gameData, timeline);
            
            const timelineStats = timelineAnalyizer.getStats(timeline, laneAssignments);
            
            for (const [i, player] of Object.entries(gameData.participants)) {
                console.log(matchId);
                const playerTeam = await verifyExistence(
                    gameData.participantIdentities[i].player.accountId,
                    i < 5 ? teams[0] : teams[1]
                );

                updatePlayerName(gameData.participantIdentities[i].player);
                
                const stats = player.stats; // Just so I have to type less
                if (!player.timeline.csDiffPerMinDeltas) {
                    // Do this so it is set to 0 later and doesn't error out
                    player.timeline.csDiffPerMinDeltas = {}
                }

                // Burn this code
                await GameModel.create({
                    player: playerTeam[0]._id,
                    team: playerTeam[1]._id,
                    season: code.season,
                    gameId: matchId,
                    gameStart: gameData.gameCreation,
                    patch: gameData.gameVersion,
                    gameDuration: gameData.gameDuration,
                    championId: player.championId,
                    teamId: player.teamId, // 100 for blue, 200 for red
                    spell1Id: player.spell1Id,
                    spell2Id: player.spell2Id,
                
                    // Base Stats
                    kills: stats.kills ? stats.kills : 0,
                    deaths: stats.deaths ? stats.deaths : 0,
                    assists: stats.assists ? stats.assists : 0,
                    champLevel: stats.champLevel,
                    win: stats.win,

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
                    goldEarned: stats.goldEarned,
                    totalMinionsKilled: stats.totalMinionsKilled ? stats.totalMinionsKilled : 0,
                    neutralMinionsKilled: stats.neutralMinionsKilled ? stats.neutralMinionsKilled : 0,
                    neutralMinionsKilledTeamJungle: stats.neutralMinionsKilledTeamJungle ? stats.neutralMinionsKilledTeamJungle : 0,
                    neutralMinionsKilledEnemyJungle: stats.neutralMinionsKilledEnemyJungle ? stats.neutralMinionsKilledEnemyJungle : 0,
                    firstItemTime: timelineStats[+i+1].firstItemTime,
                    goldGen10: player.timeline.goldPerMinDeltas["0-10"],
                    goldGen20: player.timeline.goldPerMinDeltas["10-20"],
                    goldGen30: player.timeline.goldPerMinDeltas["20-30"],
                    xpGen10: player.timeline.xpPerMinDeltas["0-10"],
                    xpGen20: player.timeline.xpPerMinDeltas["10-20"],
                    xpGen30: player.timeline.xpPerMinDeltas["20-30"],
                    csGen10: player.timeline.creepsPerMinDeltas["0-10"],
                    csGen20: player.timeline.creepsPerMinDeltas["10-20"],
                    csGen30: player.timeline.creepsPerMinDeltas["20-30"],
                
                    // Damage
                    physicalDamageDealtToChampions: stats.physicalDamageDealtToChampions,
                    magicDamageDealtToChampions: stats.magicDamageDealtToChampions,
                    trueDamageDealtToChampions: stats.trueDamageDealtToChampions,
                    totalDamageDealtToChampions: stats.totalDamageDealtToChampions,
                    physicalDamageTaken: stats.physicalDamageTaken,
                    magicalDamageTaken: stats.magicalDamageTaken,
                    trueDamageTaken: stats.trueDamageTaken,
                    totalDamageTaken: stats.totalDamageTaken,
                    damageDealtToObjectives: stats.damageDealtToObjectives,
                    damageSelfMitigated: stats.damageSelfMitigated,
                
                    totalHeal: stats.totalHeal,
                
                    // Vision
                    visionScore: stats.visionScore,
                    wardsPlaced15: timelineStats[+i+1].wardsPlaced15,
                    wardsPlaced: stats.wardsPlaced ? stats.wardsPlaced : 0,
                    wardsKilled15: timelineStats[+i+1].wardsKilled15,
                    wardsKilled: stats.wardsKilled ? stats.wardsKilled : 0,
                    visionWardsBoughtInGame: stats.visionWardsBoughtInGame,
                
                    // Fun
                    firstBloodKill: stats.firstBloodKill,
                    firstBloodAssist: stats.firstBloodAssist,
                    firstTowerKill: stats.firstTowerKill,
                    firstTowerAssist: stats.firstTowerAssist,
                    turretKills: stats.turretKills,
                    doubleKills: stats.doubleKills,
                    tripleKills: stats.tripleKills,
                    quadraKills: stats.quadraKills,
                    pentaKills: stats.pentaKills,
                
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
                    lane: laneAssignments[+i+1],

                    goldMap: timelineStats[+i+1].goldMap,
                    csMap: timelineStats[+i+1].csMap,
                    xpMap: timelineStats[+i+1].xpMap,
                    
                    items: [
                        stats.item0,
                        stats.item1,
                        stats.item2,
                        stats.item3,
                        stats.item4,
                        stats.item5
                    ],
                    trinket: stats.item6,

                    primaryRunes: [
                      stats.perk0,
                      stats.perk1,
                      stats.perk2,
                      stats.perk3  
                    ],

                    secondaryRunes: [
                        stats.perk4,
                        stats.perk5
                    ],

                    shards: [
                        stats.statPerk0,
                        stats.statPerk1,
                        stats.statPerk2,
                    ],

                    summoners: [
                        player.spell1Id,
                        player.spell2Id
                    ],

                    primaryStyle: stats.perkPrimaryStyle,
                    secondaryStyle: stats.perkSubStyle,

                    // Computed
                    damagePerGold: stats.totalDamageDealtToChampions / stats.goldEarned,
                });
            }
            console.log(`Added ${matchId} to db`);
        },
        (error) => {
            console.log(error.message);
        }
    )
}


// Get the backend teams for participants
// Participants is 10 length. first 5 are blue team, second 5 are red team
// Returns [blueTeam, redTeam]
async function getTeams(participants) {
    let participantsCopy = JSON.parse(JSON.stringify(participants));

    function getTeam(members) {
        let teamCounter = {}
        for (const member of members) {
            for (const teamId of member.teams) {
                if (!teamCounter[teamId]) { teamCounter[teamId] = 0 }
                teamCounter[teamId] += 1;
            }
        }

        if (0 === Object.keys(teamCounter).length) {
            return "000000000000";
        }

        // Get the key with the largest value. This will be the valid team
        // https://stackoverflow.com/questions/27376295/getting-key-with-the-highest-value-from-object
        return Object.keys(teamCounter).reduce((a, b) => teamCounter[a] > teamCounter[b] ? a : b);
    }
    for ( let p of participantsCopy ) {
        await createPlayer(p);
    }

    let ids = participantsCopy.splice(0, 5).map((p) => {
        return p.player.accountId;
    });
    
    const teams1 = await PlayerModel.find(
        { 'accountId': { "$in": ids } }
    );
    
    let team1 = getTeam(teams1);
    team1 = await verifyTeam(team1);
    // participants has already been spliced
    ids = participantsCopy.map((p) => {
        return p.player.accountId;
    });

    const teams2 = await PlayerModel.find(
        { 'accountId': { "$in": ids } }
    );
    let team2 = getTeam(teams2);
    team2 = await verifyTeam(team2);
    // [blue, red]
    return [team1._id, team2._id];
}

// Ensure team exists and create if it doesn't
async function verifyTeam(teamId) {
    let team = await TeamModel.findById(mongoose.Types.ObjectId(teamId));
    if (team === null) {
        team = await TeamModel.findOne({teamname: 'Unknown'});
        if (team === null) {
            team = await TeamModel.create({
                teamshortname: 'UKN',
                teamname: 'Unknown',
            });
        }
    }
    console.log(team);
    return team;
}

// Verifies player exists within our database, if not, it creates the player
// Returns mongo [player, team] objects
async function verifyExistence(accountId, teamId) {

    // Check/create player
    let player = await verifyPlayer(accountId);
    
    // Check/create Team
    let team = await verifyTeam(teamId);
    console.log("p");    

    if (!player.teams.includes(team._id)) {
        player.teams.push(team._id);
        player.save();
    }

    if (!team.players.includes(player._id)) {
        team.players.push(player._id);
        team.save();
    }

    return [player, team];
    
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

module.exports = {
    'saveGames': saveGames,
    'saveGame': saveGame
}