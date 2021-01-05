const TeamModel = require('../models/team.model');

async function addTeam(teamName, teamShort, players, seasonDO) {
  let team = await TeamModel.findOne({
    teamshortname: teamShort,
    season: seasonDO
  });
  if (team === null) {
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
    team.players = players;
    team.save();
  }
  
  return team;
}

module.exports = {
  addTeam: addTeam
}