const fetch = require("node-fetch");
const CodeModel = require('../models/code.model');
const { makeRequest } = require('./api');
const { saveGames } = require('./matches');

async function createNewTournament(name) {
  let url = process.env.NA_TOURNEY_BASE;
  if (process.env.NODE_ENV === 'production') {
    url += `/lol/tournament/v4/tournaments`;
  }
  else {
    url += `/lol/tournament-stub/v4/tournaments`;
  }
  console.log(url);
  return makeRequest(url, "POST",
    {
        "name": name,
        "providerId": process.env.TOURNEY_ID
    }
  ).then(response => {
    
      if (!response.ok) {
        return response.statusText
      }
      return response.json();
  })
}

async function generateCodes(id, count, seasonDO, callback) {
  let codes;
  try {
    codes = await requestMatchCodes(count, id)
  } catch (error) {
    throw error;
  }
  callback(codes);
  for (const code of codes) {
    let codeInst = await CodeModel.findOne({
      "code": code
    });
    if ( codeInst === null ) {
      CodeModel.create({
        "code": code,
        "season": seasonDO
      })
    }
  }
}

async function requestMatchCodes(count, id) {
  let url = process.env.NA_TOURNEY_BASE;
  if (process.env.NODE_ENV === "production") {
    url += `/lol/tournament/v4/codes?count=${count}&tournamentId=${id}`;
  }
  else {
    url += `/lol/tournament-stub/v4/codes?count=${count}&tournamentId=${id}`;
    // url += `/lol/tournament/v4/codes?count=${count}&tournamentId=${id}`;
  }
  console.log(url);
  return makeRequest(url, "POST",
      {
          "mapType": "SUMMONERS_RIFT",
          "metadata": `${id}`,
          "pickType": "TOURNAMENT_DRAFT",
          "spectatorType": "ALL",
          "teamSize": 5
      }
  ).then(response => {
      if (!response.ok) {
        throw response.statusText;
      }
      return response.json();
  })
  
}

async function updateCodes(codes) {
  for (let code of codes) {
    let url = process.env.NA_BASE + `/lol/match/v4/matches/by-tournament-code/${code.code}/ids`
    try {
      let response = await makeRequest(url, "GET", process.env.RIOT_TOURNEY_API);
      let ids = await response.json();
      saveGames(ids, code.code);
    } catch (error) { }
  }
}

module.exports = {
  generateCodes: generateCodes,
  createTournament: createNewTournament,
  updateCodes: updateCodes
}