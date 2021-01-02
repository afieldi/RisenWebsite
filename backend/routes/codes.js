const router = require('express').Router();	
const Season = require('../models/season.model');
const { generateCodes } = require('../src/codes');
const { blockAll, blockNotGet } = require('../helper');

// console.log(Season.schema);

router.use('/create', (req, res, next) => {
  blockNotGet(req, res, next, 1);
});

router.route("/create").post((req, res) => {
  const count = req.body.count;
  const seasonId = req.body.season;

  if (count === undefined || seasonId === undefined) {
    res.status(400).json("Must include season and count body parameters");
    return;
  }

  Season.findById(seasonId).then(season => {
    console.log(req.body);
    if (season == null) {
      res.status(404).json("Season not found");
      return;
    }
    if (!season.seasonApiNumber) {
      res.status(400).json("Season has invalid api number " + season.seasonApiNumber);
      return;
    }
    generateCodes(season.seasonApiNumber, count, season, (codes) => {
      res.json(codes);
    }).catch((err) => {
      res.status(500).json(err);
    })
  });
});

// Maybe add in future?
// router.route("/callback").post((req, res) => {

// });

module.exports = router;