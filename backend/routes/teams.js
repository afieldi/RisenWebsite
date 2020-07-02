const router = require('express').Router();
let Team = require('../models/team.model');
const { addPlayerByName } = require('../src/player');

router.route('/').get((req, res) => {
    Team.find()
        .then(teams => res.json(teams))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const teamname = req.body.teamname;
    const teamshortname = req.body.teamshortname;

    const newTeam = new Team({
        teamname: teamname,
        teamshortname: teamshortname
    });

    newTeam.save()
    .then(() => res.json(newTeam))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add/player').post((req, res) => {
    const playername = req.body.player;
    addPlayerByName(playername).then((player) => {
        res.json(player);
    }).catch((err) => {
        res.status(500).json("Error: " + err);
    })
});

module.exports = router;