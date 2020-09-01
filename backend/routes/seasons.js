const router = require('express').Router();
let Team = require('../models/team.model');
const Season = require("../models/season.model");

router.route('/active').get((req, res) => {
  const active = req.query.active ? req.query.active : true;
  Season.find({
    active: active
  }).then(data => {
    res.json(data);
  }, err => {res.status(400).json("Something went wrong: " + err)})
});

module.exports = router;