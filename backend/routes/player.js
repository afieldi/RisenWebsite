const router = require('express').Router();	
const Player = require('./../models/player.model');
const { searchPlayer } = require('../src/player');

router.route("/search/:playername").get((req, res) => {
  let pname = req.params.playername;
  try {
    res.json(searchPlayer(pname));
  } catch (error) {
    res.status(404).json("No player found");
  }
})