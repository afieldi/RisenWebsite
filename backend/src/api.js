// const LeagueJS = require('leaguejs');
// import { LolApi, Constants } from 'twisted';
const Twisted = require('twisted');

const process = require('process');
// const leagueJs = new LeagueJS(process.env.RIOT_API);
const api = new Twisted.LolApi({
    rateLimitRetry: true,
    key: process.env.RIOT_API
})


module.exports = {
    leagueApi: api,
    constants: Twisted.Constants
}