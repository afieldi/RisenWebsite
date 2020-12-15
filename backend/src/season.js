const Season = require('./../models/season.model');
const { createTournament } = require('./codes');

async function findCreateSeason(seasonName) {
  let seasonDO = await Season.findOne({seasonName: seasonName, active: true});
  console.log(seasonDO === null)
  if (seasonDO === null) {
    console.log("!!");
    let sId = seasonName.toLocaleLowerCase().split(" ").join('');
    console.log(sId);
    let sNumber = await createTournament(seasonName);
    console.log(sNumber);
    seasonDO = await Season.create({
      seasonName: seasonName,
      stringid: sId,
      active: true,
      teams: [],
      seasonApiNumber: sNumber
    });
  }
  return seasonDO;
}

module.exports = {
  findCreateSeason: findCreateSeason
}