const LeagueJS = require('leaguejs');
const process = require('process');
const leagueJs = new LeagueJS(process.env.RIOT_API);

module.exports = {
    leagueApi: leagueJs
}