const { leagueApi, constants } = require('./api');
const PlayerModel = require('../models/player.model');


async function playerExists() {
    const summoner = (await leagueApi.Summoner.getByAccountID(accountId, constants.Regions.AMERICA_NORTH)).response;
}

// Ensure player exists and create if it doesn't
async function verifyPlayer(accountId) {
    let player = await PlayerModel.findOne({ accountId: accountId });
    if (player === null) {
        const summoner = (await leagueApi.Summoner.getByAccountID(accountId, constants.Regions.AMERICA_NORTH)).response;
        player = await PlayerModel.create({
            accountId: accountId,
            name: summoner.name,
            teams: [],
            notes: ''
        });
    }
    return player;
}

async function addPlayerByName(name) {
    const summoner = (await leagueApi.Summoner.getByName(name, constants.Regions.AMERICA_NORTH).catch((err) => {
        console.log(err);
        throw Error("Summoner not found!");
    })).response;

    let player = await PlayerModel.findOne({ accountId: summoner.accountId });

    if (player === null) {
        player = await PlayerModel.create({
            accountId: summoner.accountId,
            name: summoner.name,
            teams: [],
            notes: ''
        });
    }
    return player;
}

async function searchPlayer(name) {
    return (await leagueApi.Summoner.getByName(name, constants.Regions.AMERICA_NORTH).catch((err) => {
        console.log(err);
        throw Error("Summoner not found!");
    })).response;
}

module.exports = {
    'verifyPlayer': verifyPlayer,
    'addPlayerByName': addPlayerByName,
    'searchPlayer': searchPlayer,
}