const XLSX = require('xlsx');

const Season = require('../models/season.model');

const { leagueApi, constants } = require('./api')
const { addPlayerByName } = require('./player');
const { addTeam } = require('./team');

const mapping = {
  'Name': 'A',
  'Short': 'C',
  'Players': [
    'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'
  ],
  "Week": "2"
}

function getMaxRow(ref) {
  let l = ref.length - 1;
  let s = "";

  while (1) {
    try {
      if (isNaN(Number(ref.charAt(l)))) {
        break;
      }
      s = ref.charAt(l) + s;
      l --;
    } catch (error) {
      console.log(error)
      break;
    }
  }
  return Number(s);
}

async function loadTeam(teamSheet, row, seasonDO) {
  let tName = teamSheet[mapping.Name + row].v;
  let tShort = teamSheet[mapping.Short + row].v;
  let players = [];
  for (let c of mapping.Players) {
    if (teamSheet[c + row]) {
      try {
        console.log("adding Player: " + teamSheet[c + row].v);
        let player = await addPlayerByName(teamSheet[c + row].v);
        players.push(player);
      } catch (error) {
        console.log("Bad Player Name: " + teamSheet[c + row].v);
      }
    }
  }
  console.log("Adding team: " + tName);
  let team = await addTeam(tName, tShort, players, seasonDO)
  for (let p of players) {
    if(!p.teams.includes(team)) {
      p.teams.push(team);
      p.save()
    }
  }
  // console.log(players);
  console.log("Added team: " + tName)
}

function loadMatches(scheduleSheet, seasonDO) {
  const cells = Object.keys(scheduleSheet);

  // The keys are in a specific order, left to right then top to bottom
  // Abuse this to load matches

  // Merged cells are taken as the top left position, so if we use the "Week 1", "Week 2", etc row we can get the match cols

  for (let i in cells) {
    if(cell.endsWith(mapping.Week)) {
      for (let c = i; c < cells.length; c ++) {

      }
      break;
    }
  }
}

async function loadXlFile(buffer, season) {
  console.log(typeof buffer)
  const wb = XLSX.read(buffer);
  // console.log(wb);
  let teamSheetName = '';
  let scheduleSheetName = '';
  for (let sheet of wb.Props.SheetNames) {
    if (sheet.includes('Teams')) {
      teamSheetName = sheet;
    }
    if (sheet.includes('Schedule')) {
      scheduleSheetName = sheet;
    }
  }
  console.log(teamSheetName);
  const teamSheet = wb.Sheets[teamSheetName];
  const scheduleSheet = wb.Sheets[scheduleSheetName];

  const maxRow = getMaxRow(teamSheet['!ref']);
  const sMaxRow = getMaxRow(scheduleSheet['!ref']);
  
  let seasonDO = await Season.findOne({seasonName: season, active: true});
  if (seasonDO === null) {
    let sId = season.toLocaleLowerCase().split(" ").join('');
    seasonDO = await Season.create({
      seasonName: season,
      stringid: sId,
      active: true,
      teams: []
    });
  }
  console.log(teamSheet['!ref'])
  for (let i = 3; i <= maxRow; i++) {
    // Fuck you DTC who has a 3 letter name
    if(teamSheet[mapping.Name + i] && teamSheet[mapping.Name + i].v.length >= 3 &&
       teamSheet[mapping.Short + i] && teamSheet[mapping.Short + i].v.length >= 2) {
      await loadTeam(teamSheet, i, seasonDO);
    }
    else {
      continue; // Just here to make me feel better. And if you decide to pay me by line of code
    }
  }
  seasonDO.save();
}

// setTimeout(() => {
//   loadXlFile('uploads/51ba0ceae31c38d466750cbefc7405d6', 'Season 1: Return of My Idiot Programming')
//   // console.log(getMaxRow('A1:R26'));
// }, 1500);

console.log(getMaxRow("A1:R30"))

module.exports = {
  loadXlFile: loadXlFile
}