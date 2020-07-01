const router = require('express').Router();
let Team = require('../models/team.model');

router.route('/').get((req, res) => {
    Team.find()
        .then(teams => res.json(teams))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const teamname = req.body.teamname;

    const newTeam = new Team({teamname});

    newTeam.save()
    .then(() => res.json('Team added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;