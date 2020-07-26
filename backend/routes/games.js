const router = require('express').Router();	
let Game = require('../models/game.model');	
const matcher = require('../src/matches');	

router.route('/').get((req, res) => {	
    Game.find()	
        .then(games => res.json(games))	
        .catch(err => res.status(400).json('Error: ' + err));	
});	


router.route('/add/:gameid').post((req, res) => {	
  matcher.saveGames([req.params.gameid]).then(data => {	
    res.send("Game added");	
  }, (err) => {	
    res.status(400).json('Error: ' + err);	
  });	
});

router.route('/:id').get((req, res) => {	
  Game.findById(req.params.id)	
    .then(game => res.json(game))	
    .catch(err => res.status(400).json('Error: ' + err));	
});	

router.route('/:id').delete((req, res) => {	
  Game.findByIdAndDelete(req.params.id)	
    .then(() => res.json('Game deleted.'))	
    .catch(err => res.status(400).json('Error: ' + err));	
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

module.exports = router; 