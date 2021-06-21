const router = require('express').Router();
let Team = require('../models/team.model');
const Season = require("../models/season.model");
let Game = require('../models/game.model');
let TeamGame = require('../models/teamgame.model');
const { createTournament } = require('../src/codes');
const { findCreateSeason } = require('../src/season');
const { blockAll, blockNotGet, blockNone } = require('../helper');
const mongoose = require('mongoose');

// router.use('/', (req, res, next) => {
//   blockNotGet(req, res, next, 1);
// });
router.use('/new', (req, res, next) => {
  blockAll(req, res, next, 1);
});

router.route('/').get((req, res) => {
  Season.find().then(data => {
    res.json(data);
  }, err => {res.status(400).json("Something went wrong: " + err)})
});

router.route('/codeable').get((req, res) => {
  Season.find({
    active: true,
    seasonApiNumber: { "$gt": 1 }
  }).then( data => {
    res.json(data);
  }, err => {res.status(400).json("Something went wrong: " + err)});
})

router.route('/active').get((req, res) => {
  const active = req.query.active ? req.query.active : true;
  Season.find({
    active: active
  }).then(data => {
    res.json(data);
  }, err => {res.status(400).json("Something went wrong: " + err)})
});

router.route('/new').post((req, res) => {
  const body = req.body;
  console.log(body);
  if (body.name) {
    findCreateSeason(body.name).then(seasonBO => {
      res.json(seasonBO);
    }).catch(err => {
      res.status(500).json(err);
    });
  }
  else {
    res.status(500).json("Require name body parameter");
  }
});

router.route('/:season').get((req, res) => {
  const season = req.params.season;
  let id;
  try {
    id = mongoose.Types.ObjectId(season);
  } catch (error) {
    res.status(400).json("Invalid season ID");
    return;
  }
  Season.findById().then(season => {
    Team.aggregate(
      [
          {$match: {season: season._id}},
          {$lookup: {
              from: 'players',
              localField: 'players',
              foreignField: '_id',
              as: 'playerObject'
          }}
      ])
      .then(teams => res.json({
          season: season,
          teams: teams
      }))
      .catch(err => res.status(400).json('Error: ' + err));
  }).catch(err => res.status(404).json("Couldn't find season: " + err));
})

router.route('/games/:season').delete((req, res) => {
  const season = req.params.season;
  let id;
  try {
    id = mongoose.Types.ObjectId(season);
  } catch (error) {
    res.status(400).json("Invalid season ID");
    return;
  }
  let c = 0;
  Game.deleteMany({season: id}).then(deleted => {
    // console.log(deleted);
    c += deleted.deletedCount;
    TeamGame.deleteMany({season: id}).then(deleted => {
      c += deleted.deletedCount;
      // console.log(deleted);
      res.json(`Deleted ${c} entries`);
    }).catch(err => {
      res.status(500).json(err);
    });
  }).catch(err => {
    res.status(500).json(err);
  });
})

module.exports = router;