const { leagueApi, constants, makeRequest } = require('./api');
const PlayerModel = require('../models/player.model');
const { urlencoded } = require('body-parser');

// Ensure player exists and create if it doesn't
async function verifyPlayer(summoner) {
    let player = await PlayerModel.findOne({ summonerId: summoner.summonerId });
    if (player === null) {
        // const summoner = (await leagueApi.Summoner.getByAccountID(accountId, constants.Regions.AMERICA_NORTH)).response;
        player = await PlayerModel.create({
            summonerId: summoner.summonerId,
            puuid: summoner.puuid,
            name: summoner.summonerName,
            searchName: summoner.summonerName.toLowerCase().replace(/\s/g, ''),
            notes: ''
        });
    }
    updatePlayerName(summoner, player);
    return player;
}

async function createPlayer(playerName) {
    let player = await PlayerModel.findOne({ searchName: playerName.toLowerCase().replace(/\s/g, '')});
    if (player === null) {
        // Does not exist. Lets make
        let url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(playerName)}`;
        let playerData = await (await makeRequest(url, "GET", process.env.RIOT_API)).json();
        player = await PlayerModel.create({
            summonerId: playerData.id,
            name: playerData.name,
            puuid: playerData.puuid,
            searchName: playerData.name.toLowerCase().replace(/\s/g, ''),
            notes: ''
        });
    }
    return player;
}

// HARD DEPRECATED
async function addPlayerByName(name) {
    const summoner = (await leagueApi.Summoner.getByName(name, constants.Regions.AMERICA_NORTH).catch((err) => {
        console.log(err);
        throw Error("Summoner not found!");
    })).response;

    let player = await PlayerModel.findOne({ summonerId: summoner.summonerId });

    if (player === null) {
        player = await PlayerModel.create({
            summonerId: summoner.summonerId,
            name: summoner.name,
            puuid: summoner.puuid,
            searchName: summoner.name.toLowerCase().replace(/\s/g, ''),
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

async function updatePlayerName(summoner, playerObject) {
    if (playerObject.name !== summoner.summonerName) {
        playerObject.name = summoner.summonerName;
        playerObject.searchName = summonerData.player.summonerName.toLowerCase().replace(/\s/g, '');
        await playerObject.save();
    }
    return playerObject;
}

module.exports = {
    'verifyPlayer': verifyPlayer,
    'addPlayerByName': addPlayerByName,
    'searchPlayer': searchPlayer,
    'createPlayer': createPlayer,
}