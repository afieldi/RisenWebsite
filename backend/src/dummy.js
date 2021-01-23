// Just generates dummy data for testing
const { leagueApi, constants } = require('./api')

const mongoose = require('mongoose');
require('dotenv').config();

const uri = "mongodb+srv://admin:letmeinplease@cluster0.bwvsn.mongodb.net/newdb?retryWrites=true&w=majority";
mongoose
    .connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

const PlayerModel = require('../models/player.model');
const TeamModel = require('../models/team.model');

async function genMyStuff() {
    let myTeam = await TeamModel.findOne({
        teamname: "Fried Chicken Esports"
    });
    if (myTeam === null) {
        myTeam = await TeamModel.create({
            teamname: "Fried Chicken Esports",
            teamshortname: 'KFC'
        });
    }


    async function addPlayer(accountId, team) {
        const summoner = (await leagueApi.Summoner.getByAccountID(accountId, constants.Regions.AMERICA_NORTH)).response;
        const player = await PlayerModel.create({
            accountId: accountId,
            name: summoner.name,
            searchName: summoner.name.toLowerCase().replace(/\s/g, '')
        });
        player.teams.push(team._id);
        await player.save();
        team.players.push(player._id);
        await team.save();
    }

    await addPlayer('WnMRRDrlBLbfYK2AL5ceBmgL1tsKqRb_Hcxujt6aUnwKdg', myTeam);
    await addPlayer('hXGVVgIjYepjKGi_5RweKaQ6-lkmkxhLB3mVWSWp5Z6LMcM', myTeam);
    await addPlayer('4jZgaj8sL9pzcx9_hMxjYL3BaTlgKQYKmaU0Xsm11FJsnw4', myTeam);
    await addPlayer('cdK6EuWTbI1pgdH0-tRst2x3_eUIlN2bxwgxd60YqqUriQ', myTeam);
    await addPlayer('mzfNfldP1yHuf8xdlUTWmIIj3RmTg2mHWRAGCdZ--OLhwA', myTeam);
    await addPlayer('Dd99pMN5CWtzptY_66jrM6f7qSGzRFF2kXkRdU9oqrE9iw', myTeam);
    console.log("done");
}

// db.model.Player.sync({force: true});
// db.model.Team.sync({force: true});
// db.model.PlayerTeam.sync({force: true});
// db.model.GameEntry.sync({force: true});

genMyStuff();
// setTimeout( () => {
//     genMyStuff();
// }, 500);