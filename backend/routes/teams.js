const router = require('express').Router();
let Team = require('../models/team.model');
const Season = require("../models/season.model");
const { addPlayerByName } = require('../src/player');
const { loadXlFile } = require('../src/gsheets');

const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage})

router.route('/').get((req, res) => {
    const seasonName = req.query.season;
    Season.findOne({
        stringid: seasonName
    }).then(season => {
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
});

router.route('/:teamshort/:season').put((req, res) => {
    const seasonName = req.params.season;
    const tShort = req.params.teamshort;
    Season.findOne({
        stringid: seasonName
    }).then(season => {
        Team.findOne({season: season, teamshortname: tShort})
            .then(teams => {
                res.status(200).send();
            })
            .catch(err => res.status(400).json('Error: ' + err));
    }).catch(err => res.status(404).json("Couldn't find season: " + err));
});

router.route('/').post((req, res) => {
    const teamname = req.body.teamname;
    const teamshortname = req.body.teamshortname;
    const division = req.body.division;
    const seasonId = req.body.seasonId;

    Season.findById(seasonId).then((season) => {
        if (season != null) {
            const newTeam = new Team({
                teamname: teamname,
                teamshortname: teamshortname,
                division: division,
                season: season
            });
            newTeam.save()
                .then(() => res.json(newTeam))
                .catch(err => res.status(400).json('Error: ' + err));
        }
        else {
            res.json("Season does not exist");
        }
    }).catch((error) => {res.json(error)});
});

router.route("/").put((req, res) => {
    const teamId = req.body._id;
    Team.findById(teamId).then((team) => {
        if (team !== null) {
            if (req.body.teamname) { team.teamname = req.body.teamname; }
            if (req.body.teamshortname) { team.teamshortname = req.body.teamshortname; }
            if (req.body.division) { team.division = req.body.division; }
            if (req.body.seasonId) {
                Season.findById(req.body.seasonId).then((season) => {
                    if (season !== null) {
                        team.season = season;
                    }
                    team.save()
                        .then(() => res.json(team))
                        .catch(err => res.status(400).json('Error: ' + err));
                })
            }
            else {
                team.save()
                    .then(() => res.json(team))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        }
        else {
            console.log(req.body);
            res.status(404).json("Team not found");
        }
    })
})

router.route('/add/player').post((req, res) => {
    const playername = req.body.player;
    addPlayerByName(playername).then((player) => {
        res.json(player);
    }).catch((err) => {
        res.status(500).json("Error: " + err);
    })
});

router.route('/load').post( upload.single('teamSheet'), (req, res) => {
    const seasonName = req.body.seasonName;
    
    if(seasonName.length > 3) {
        loadXlFile(req.file.buffer, seasonName);
        res.redirect(req.headers.referer);
    }
    else {
        res.send("Invalid seasonName sent. Must be longer than 3 characters")
    }
});

module.exports = router;