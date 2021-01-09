const SeasonModel = require('./../models/season.model');
const { createTournament } = require('./codes');

async function findCreateSeason(seasonName) {
  let seasonDO = await SeasonModel.findOne({seasonName: seasonName, active: true});
  if (seasonDO === null) {
    let sId = seasonName.toLocaleLowerCase().split(" ").join('');
    let sNumber = await createTournament(seasonName);
    seasonDO = await SeasonModel.create({
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