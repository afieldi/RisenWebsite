const TeamModel = require('../models/team.model');

async function addTeam(teamName, teamShort, players, seasonDO) {
  console.log("A")
  let team = await TeamModel.findOne({
    teamshortname: teamShort,
    season: seasonDO
  });
  if (team === null) {
    console.log("B")
    team = await TeamModel.create({
      teamname: teamName,
      teamshortname: teamShort,
      players: players,
      season: seasonDO,
      division: 1
    });
    seasonDO.teams.push(team);
    await seasonDO.save();
  }
  else {
    console.log("C");
    team.players = players;
    team.save();
  }
  
  return team;
}

module.exports = {
  addTeam: addTeam
}