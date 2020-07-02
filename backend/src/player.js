const { leagueApi } = require('./api');
const PlayerModel = require('../models/player.model');


async function playerExists() {
    const summoner = await leagueApi.Summoner.gettingByAccount(accountId);
}

// Ensure player exists and create if it doesn't
async function verifyPlayer(accountId) {
    let player = await PlayerModel.findOne({ accountId: accountId });
    if (player === null) {
        const summoner = await leagueApi.Summoner.gettingByAccount(accountId);
        player = await PlayerModel.create({
            accountId: accountId,
            name: summoner.name
        });
    }
    return player;
}

async function addPlayerByName(name) {
    console.log(name);
    const summoner = await leagueApi.Summoner.gettingByName(name).catch((err) => {
        console.log(err);
        throw Error("Summoner not found!");
    });
    console.log(summoner);

    let player = await PlayerModel.findOne({ accountId: summoner.accountId });
    if (player === null) {
        player = await PlayerModel.create({
            accountId: summoner.accountId,
            name: summoner.name
        });
    }
    return player;
}

module.exports = {
    'verifyPlayer': verifyPlayer,
    'addPlayerByName': addPlayerByName
}