const router = require('express').Router();
const mongoose = require('mongoose');

const GameModel = require('../models/game.model');

router.route("/").get((req, res) => {
  let season = req.query.season;
  let prop = req.query.property;
  let type = req.query.type;
  let count = req.query.count ? Number(req.query.count) : 10;
  let direction = req.query.direction ? Number(req.query.direction) : -1;

  if ( type !== "sum" &&
       type !== "total" &&
       type !== "single" )
  {
    res.status(400).send("Type was invalid type. Should be one of: ['sum', 'total', 'single']")
    return;
  }
  if (!prop) {
    res.status(400).send("'property' is required");
    return;
  }

  let pipeline = [];
  let finder = {}

  if (season) {
    try {
      pipeline.push({
        $match: {
          season: mongoose.Types.ObjectId(season)
        }
      })
      finder = {
        season: mongoose.Types.ObjectId(season)
      }
    } catch (error) {
      
    }
  }
  let sorter = {};
  sorter[prop] = direction;
  pipeline.push({ $sort: sorter });
  pipeline.push({ $limit: count });
  pipeline.push({
    $lookup: {
        from: 'players',
        localField: 'player',
        foreignField: '_id',
        as: 'playername'
    }
});
  GameModel.aggregate(pipeline).then(games => {
    res.json(games);
  }, (err) => {
    res.status(500).json("Error: " + err);
  })

})

module.exports = router;