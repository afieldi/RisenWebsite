const router = require('express').Router();	
const Team = require('../models/team.model');

router.route("/:teamid").get((req, res) => {
  Team.findById(req.params.teamid).then(data => {
    if (data === null) {
      res.status(404).json("Team does not exist");
      return;
    }
    res.json(data.players);
  })
}).post((req, res) => {
  const pid = req.params.playerid;
  Team.findById(req.params.teamid).then(team => {
    if (team === null) {
      res.status(404).json("Team does not exist");
      return;
    }
    if (team.players.includes(pid)) {
      
    }
  })
}).delete((req, res) => {

});