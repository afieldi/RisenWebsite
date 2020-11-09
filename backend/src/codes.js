const fetch = require("node-fetch");
const CodeModel = require('../models/code.model');

async function generateCodes(count, callback) {
  const codes = await requestMatchCodes(count, process.env.TOURNEY_ID);
  callback(codes);
  for (const code of codes) {
    let codeInst = await CodeModel.findOne({
      "code": code
    });
    if ( codeInst === null ) {
      CodeModel.create({
        "code": code
      })
    }
  }
}

async function requestMatchCodes(count, id) {
  const url = process.env.NA_TOURNEY_BASE + `/lol/tournament-stub/v4/codes?count=${count}&tournamentId=${id}`;
  return fetch(url, {
      method: 'POST',
      headers: {
          'X-Riot-Token': process.env.RIOT_API,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "mapType": "SUMMONERS_RIFT",
          "pickType": "TOURNAMENT_DRAFT",
          "spectatorType": "ALL",
          "teamSize": 5
      })
  }).then(response => {
      if (!response.ok) {
        return response.statusText
      }
      return response.json();
  })
  
}

module.exports = {
  generateCodes: generateCodes
}