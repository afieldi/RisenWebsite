// require('dotenv').config();
const { leagueApi } = require('./api');
const { verifyPlayer } = require('./player')

const mongoose = require('mongoose');

// const uri = "mongodb+srv://admin:letmeinplease@cluster0.bwvsn.mongodb.net/newdb?retryWrites=true&w=majority";
// mongoose
//     .connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log("MongoDB database connection established successfully");
// });

const roles = require('./roles');

const GameModel = require('../models/game.model');
const PlayerModel = require('../models/player.model');
const TeamModel = require('../models/team.model');

// This will be used later
async function saveGames(matchIds) {
    for ( const matchId of matchIds ) {
        await saveGame(matchId);
    }
}

async function saveGame(matchId) {
    const games = await GameModel.find({gameId: matchId});
    if (games.length > 0) {
        // We already have this game in our db. Move on.
        return;
    }
    // TODO: change this to tourney
    await leagueApi.Match.gettingById(matchId).then(
        async gameData => {
            const teams = await getTeams(gameData.participantIdentities);
            const timeline = await leagueApi.Match.gettingTimelineById(matchId);
            const laneAssignments = roles.getRoles(gameData, timeline);
            await gameData.participants.forEach(async (player, i) => {
                const playerTeam = await verifyExistence(
                    gameData.participantIdentities[i].player.accountId,
                    i < 5 ? teams[0] : teams[1]
                );
                const stats = player.stats; // Just so I have to type less
                if (!player.timeline.csDiffPerMinDeltas) {
                    // Do this so it is set to 0 later and doesn't error out
                    player.timeline.csDiffPerMinDeltas = {}
                }

                // Burn this code
                const gameEntry = await GameModel.create({
                    player: playerTeam[0]._id,
                    team: playerTeam[1]._id,
                    gameId: matchId,
                    gameDuration: gameData.gameDuration,
                    championId: player.championId,
                    teamId: player.teamId, // 100 for blue, 200 for red
                    spell1Id: player.spell1Id,
                    spell2Id: player.spell2Id,
                
                    // Base Stats
                    kills: stats.kills,
                    deaths: stats.deaths,
                    assists: stats.assists,
                    champLevel: stats.champLevel,
                    win: stats.win,
                
                    // Income
                    goldEarned: stats.goldEarned,
                    totalMinionsKilled: stats.totalMinionsKilled,
                    neutralMinionsKilled: stats.neutralMinionsKilled,
                    neutralMinionsKilledTeamJungle: stats.neutralMinionsKilledTeamJungle,
                    neutralMinionsKilledEnemyJungle: stats.neutralMinionsKilledEnemyJungle,
                
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
                    wardsKilled: stats.wardsKilled,
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
                    csDiff10: player.timeline.csDiffPerMinDeltas["0-10"] ? player.timeline.csDiffPerMinDeltas["0-10"] * 10 : 0,
                    csDiff20: player.timeline.csDiffPerMinDeltas["10-20"] ? player.timeline.csDiffPerMinDeltas["10-20"] * 10 : 0,
                    csDiff30: player.timeline.csDiffPerMinDeltas["20-30"] ? player.timeline.csDiffPerMinDeltas["20-30"] * 10 : 0,
                    lane: laneAssignments[i + 1],
                
                    // Computed
                    damagePerGold: stats.totalDamageDealtToChampions / stats.goldEarned,
                });
            });
        },
        (error) => {
            console.log(error.message);
        }
    )
}

async function generatePlayers(participants) {
    // await verifyExistence(participants[0].player.accountId, 1);
    // await verifyExistence(participants[1].player.accountId, 1);
    await verifyExistence(participants[2].player.accountId, 2);
    await verifyExistence(participants[3].player.accountId, 2);
    await verifyExistence(participants[4].player.accountId, 2);

    // await verifyExistence(participants[5].player.accountId, 1);
    // await verifyExistence(participants[6].player.accountId, 1);
    await verifyExistence(participants[7].player.accountId, 3);
    await verifyExistence(participants[8].player.accountId, 3);
    await verifyExistence(participants[9].player.accountId, 3);
}

// Get the backend teams for participants
// Participants is 10 length. first 5 are blue team, second 5 are red team
// Returns [blueTeam, redTeam]
async function getTeams(participants) {
    let participantsCopy = JSON.parse(JSON.stringify(participants));

    // Remove later. Just gen's dummy data
    // await generatePlayers(participants);

    function getTeam(members) {
        let teamCounter = {}
        for (const member of members) {
            for (const teamId of member.teams) {
                if (!teamCounter[teamId]) { teamCounter[teamId] = 0 }
                teamCounter[teamId] += 1;
            }
        }

        if (0 === Object.keys(teamCounter).length) {
            return -1;
        }

        // Get the key with the largest value. This will be the valid team
        // https://stackoverflow.com/questions/27376295/getting-key-with-the-highest-value-from-object
        return Object.keys(teamCounter).reduce((a, b) => teamCounter[a] > teamCounter[b] ? a : b);
    }

    const players = await PlayerModel.find();
    let ids = participantsCopy.splice(0, 5).map((p) => {
        return p.player.accountId;
    });

    const teams1 = await PlayerModel.find(
        { 'accountId': { "$in": ids } }
    );

    const team1 = getTeam(teams1);
           
    // participants has already been spliced
    ids = participantsCopy.map((p) => {
        return p.player.accountId;
    });
    const teams2 = await PlayerModel.find(
        { 'accountId': { "$in": ids } }
    );
    const team2 = getTeam(teams2);
    // [blue, red]
    return [team1, team2];
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
    return team;
}

// Verifies player exists within our database, if not, it creates the player
// Returns mongo [player, team] objects
async function verifyExistence(accountId, teamId) {

    // Check/create player
    let player = await verifyPlayer(accountId);
    

    // Check/create Team
    let team = await verifyTeam(teamId);

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
//     3475852754
// ]).then(() => {
//     console.log("donezo")
// })

// setTimeout(() => {
//     console.log("waitin");
// }, 10000);


module.exports = {
    'saveGames': saveGames
}