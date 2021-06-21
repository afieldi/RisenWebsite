const router = require('express').Router();	
let Game = require('../models/game.model');
let CodeModel = require('../models/code.model');
let TeamGame = require('../models/teamgame.model');
const mongoose = require('mongoose');
const matcher = require('../src/matches');
const { updateCodes } = require('../src/codes');

router.route('/').get((req, res) => {	
    Game.find()	
        .then(games => res.json(games))	
        .catch(err => res.status(400).json('Error: ' + err));	
});

router.route('/callback').post((req, res) => {
  // Game submission endpoint
  let seasonNumber = 0;
  try {
    seasonNumber = Number(req.body.metaData);
  } catch (error) { }
  matcher.saveGame(req.body.gameId, req.body.shortCode).then(data => {
    res.json("Success");
  }, err => {
    console.log("crying")
    res.status(500).send(err);
  })
})

router.route('/update/tournament/:season').put((req, res) => {
  let id;
  try {
    id = mongoose.Types.ObjectId(req.params.season);
  } catch (error) {
    res.status(400).json("Bad season ID");
    return;
  }
  CodeModel.find({season: id}).then(codes => {
    updateCodes(codes).then(d => {
      res.json("Updated");
    }).catch(err => res.status(500).json('Error: ' + err));
  }).catch(err => res.status(400).json('Error: ' + err));	
});


router.route('/add/:gameid').post((req, res) => {	
  res.status(404).json("Nothing to see here");
  return;
  matcher.saveGames([req.params.gameid]).then(data => {	
    res.send("Game added");	
  }, (err) => {	
    res.status(400).json('Error: ' + err);	
  });	
});

router.route('/:id').get((req, res) => {	
  Game.find({gameId: Number(req.params.id)}).populate('player')	
    .then(game => res.json(game))	
    .catch(err => res.status(400).json('Error: ' + err));	
});	

router.route('/:id').delete((req, res) => {	
  // res.json('Game deleted.')
  let c = 0;
  Game.deleteMany({gameId: Number(req.params.id)}).then(deleted => {
    // console.log(deleted);
    c += deleted.deletedCount;
    TeamGame.deleteMany({gameId: Number(req.params.id)}).then(deleted => {
      c += deleted.deletedCount;
      // console.log(deleted);
      res.json(`Deleted ${c} entries`);
    }).catch(err => {
      res.status(500).json(err);
    });
  }).catch(err => {
    res.status(500).json(err);
  });
  // Game.find({gameId: Number(req.params.id)})	
  //   .then(games => {
  //     for (let g of games) {
  //       Game.deleteMany()
  //     }
  //   })	
  //   .catch(err => res.status(400).json('Error: ' + err));	
});

router.route('/update/:id').post((req, res) => {	
  Game.findById(req.params.id)	
    .then(game => {	
      game.username = req.body.username;	
      game.duration = Number(req.body.duration);	
      game.date = Date.parse(req.body.date);	

      game.save()	
        .then(() => res.json('Game updated!'))	
        .catch(err => res.status(400).json('Error: ' + err));	
    })	
    .catch(err => res.status(400).json('Error: ' + err));	
});	

router.route("/pray/:game/:code").put((req, res) => {
  matcher.saveGame(req.params.game, req.params.code).then(data => {
    res.json("Success");
  }, err => {
    res.status(500).send(err);
  });
});

module.exports = router; 