// const LeagueJS = require('leaguejs');
// import { LolApi, Constants } from 'twisted';
const Twisted = require('twisted');
const fetch = require('node-fetch');
const process = require('process');
const e = require('express');
// const leagueJs = new LeagueJS(process.env.RIOT_API);
const api = new Twisted.LolApi({
    rateLimitRetry: true,
    rateLimitRetryAttempts: 3,
    key: process.env.RIOT_API
});

function makeRequest(url, method, key, body) {
    return fetch(url, {
        method: method,
        headers: {
            'X-Riot-Token': key,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }).then(async response => {
        if (response.ok) {
            return response;
        }
        else if (response.status === 429) {
            await setTimeout(() => {
            }, 2000);
            return await makeRequest(url, method, key, body)
        }
        else {
            throw new Error(response.text);
        }
    });
}

module.exports = {
    leagueApi: api,
    constants: Twisted.Constants,
    makeRequest: makeRequest
}