const router = require('express').Router();
const PlayerModel = require('../models/player.model');
const GameModel = require('../models/game.model');
const mongoose = require('mongoose');

router.route('/player/id/:id').get((req, res) => {
    GameModel.find({player: mongoose.Types.ObjectId(req.params.id)}).then(games => {
        res.json(games);
    }, (err) => {
        res.status(404).json("Error: " + err);
    });
});

router.route('/player/name/:id').get((req, res) => {
    PlayerModel.findOne({name: req.params.id}).then((player) => {
        GameModel.find({player: player._id}).then(games => {
            res.json(games);
        }, (err) => {
            res.status(404).json("Error: " + err);
        });
    }, (err) => {
        res.status(404).json("Error: " + err);
    });
});

router.route('/player/name/:id/agg').get((req, res) => {
    PlayerModel.findOne({name: req.params.id}).then((player) => {
        if (player == null) {
            res.status(404).json("Could not find player: " + player);
            return;
        }
        GameModel.aggregate([
            {
                $match: {
                    player: player._id
                }
            },
            {
                $lookup: {
                    from: 'players',
                    localField: 'player',
                    foreignField: '_id',
                    as: 'playername'
                }
            },
            {
                $group: {
                    _id: { player: "$playername.name", playerId: "$player" },
                    avg_kills: { $avg: "$kills" },
                    avg_deaths: { $avg: "$deaths" },
                    avg_assists: { $avg: "$assists" },
                    avg_gold: { $avg: "$goldEarned" },
                    avg_cs: { $avg: "$totalMinionsKilled" },
                    avg_damage: { $avg: "$totalDamageDealtToChampions" },
                    avg_duration: { $avg: "$gameDuration" },
                    avg_dpg: { $avg: "$damagePerGold"},
                    avg_vision: { $avg: "$visionScore" },
                    avg_wards_killed: { $avg: "$wardsKilled" },
                    avg_damage_taken: { $avg: "$totalDamageTaken" },
                    wins: {$sum: { $cond : [ "$win", 1, 0 ] } },
                    total_games: { $sum: 1 }
                }
            }
        ]).then(games => {
            games["wr"] = games["total_games"] > 0 ? games["wins"] / games["total_games"] : 0;
            games["dpm"] = games["avg_damage"] / games["avg_duration"];
            games["vspm"] = games["avg_vision"] / games["avg_duratiopn"];
            res.json(games);
        }, (err) => {
            res.status(404).json("Error: " + err);
        });
    }, (err) => {
        res.status(404).json("Error: " + err);
    });
});

router.route('/player/id/:id/team/:team').get((req, res) => {
    GameModel.find({ 
            player: mongoose.Types.ObjectId(req.params.id),
            team: mongoose.Types.ObjectId(req.params.team)
    }).then(games => {
        res.json(games);
    }, (err) => {
        res.status(404).json("Error: " + err);
    });
});

router.route('/lane/:lane').get((req, res) => {
    GameModel.find(
        { lane: req.params.lane }
    ).then(games => {

        res.json(games);
    }, (err) => {
        res.status(404).json("Error: " + err);
    });
});

router.route('/brief').get((req, res) => {
    GameModel.aggregate([
        {
            $lookup: {
                from: 'players',
                localField: 'player',
                foreignField: '_id',
                as: 'playername'
            }
        },
        {
            $group: {
                _id: { player: "$playername.name", lane: "$lane", playerId: "$player" },
                avg_kills: { $avg: "$kills" },
                avg_deaths: { $avg: "$deaths" },
                avg_assists: { $avg: "$assists" },
                avg_gold: { $avg: "$goldEarned" },
                avg_cs: { $avg: "$totalMinionsKilled" },
                avg_damage: { $avg: "$totalDamageDealtToChampions" },
                wins: {$sum: { $cond : [ "$win", 1, 0 ] } },
                total_games: { $sum: 1 }
            }
        }
    ]).then(games => {
        res.json(games);
    }, (err) => {
        res.status(404).json("Error: " + err);
    });
});

router.route('/brief/lane/:lane').get((req, res) => {
    GameModel.aggregate([
        {
            $match: {
                lane: req.params.lane
            }
        },
        {
            $lookup: {
                from: 'players',
                localField: 'player',
                foreignField: '_id',
                as: 'playername'
            }
        },
        {
            $group: {
                _id: { player: "$playername.name", lane: "$lane", playerId: "$player" },
                avg_kills: { $avg: "$kills" },
                avg_deaths: { $avg: "$deaths" },
                avg_assists: { $avg: "$assists" },
                avg_gold: { $avg: "$goldEarned" },
                avg_cs: { $avg: "$totalMinionsKilled" },
                avg_damage: { $avg: "$totalDamageDealtToChampions" },
                wins: {$sum: { $cond : [ "$win", 1, 0 ] } },
                total_games: { $sum: 1 }
            }
        }
    ]).then(games => {

        res.json(games);
    }, (err) => {
        res.status(404).json("Error: " + err);
    });
});

module.exports = router;