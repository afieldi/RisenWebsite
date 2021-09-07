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
            searchName: summoner.name.toLowerCase().replace(/\s/g, ''),
            teams: [],
            notes: ''
        });
    }
    return player;
}

async function createPlayer(summonerData) {
    let player = await PlayerModel.findOne({ accountId: summonerData.player.accountId });

    if (player === null) {
        console.log(summonerData);
        player = await PlayerModel.create({
            accountId: summonerData.player.accountId,
            name: summonerData.player.summonerName,
            searchName: summonerData.player.summonerName.toLowerCase().replace(/\s/g, ''),
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
            searchName: summoner.name.toLowerCase().replace(/\s/g, ''),
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

async function updatePlayerName(summoner) {
    let player = await PlayerModel.findOne({ accountId: summoner.accountId });

    if (player.name !== summoner.summonerName) {
        player.name = summoner.summonerName;
        await player.save();
    }
    return player;
}

module.exports = {
    'verifyPlayer': verifyPlayer,
    'addPlayerByName': addPlayerByName,
    'searchPlayer': searchPlayer,
    'createPlayer': createPlayer,
    'updatePlayerName': updatePlayerName
}