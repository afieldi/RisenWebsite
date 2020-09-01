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
            if (games.length) {
                games["wr"] = games["total_games"] > 0 ? games["wins"] / games["total_games"] : 0;
                games["dpm"] = games["avg_damage"] / games["avg_duration"];
                games["vspm"] = games["avg_vision"] / games["avg_duration"];
                res.json(games);
            }
            else {
                res.json([{
                    _id: { player: player.name, playerId: player._id },
                    avg_kills: 0,
                    avg_deaths: 0,
                    avg_assists: 0,
                    avg_gold: 0,
                    avg_cs: 0,
                    avg_damage: 0,
                    avg_duration: 0,
                    avg_dpg: 0,
                    avg_vision:0,
                    avg_wards_killed: 0,
                    avg_damage_taken: 0,
                    wins: 0,
                    total_games: 0,
                    wr: 0,
                    dpm: 0,
                    vspm: 0
                }]);
            }
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
    const page = req.query.page ? req.query.page - 1 : 0;
    const size = req.query.size ? +req.query.size : 10;
    const playerName = req.query.player ? req.query.player : null;
    const lane = req.query.lane ? req.query.lane : null;
    const sort = req.query.sort ? req.query.sort : "_id.sortablePlayer+";
    const sortObject = (() => {
        let dir = sort.substr(sort.length - 1);
        let tmp = {};
        tmp[sort.substr(0, sort.length - 1)] = dir === "-" ? -1 : 1
        return tmp;
    })();
    // sort.split(",").map((sortStr) => {
    //     let dir = sortStr.substr(sortStr.length - 1);
    //     return [
    //         sortStr.substr(0, sortStr.length - 1),
    //         dir === "-" ? -1 : 1
    //     ];
    // });
    console.log(sortObject)

    let pipe = []
    pipe.push({
        $lookup: {
            from: 'players',
            localField: 'player',
            foreignField: '_id',
            as: 'playerObject'
        }
    });

    if(playerName != null) {
        pipe.push({
            $match: {
                "playerObject.name": { "$regex": playerName, "$options": "i" }
            }
        })
    }
    if (lane != null) {
        pipe.push({
            $match: {
                lane: lane
            }
        });
    }

    pipe.push({
        $group: {
            _id: { player: {"$arrayElemAt": ["$playerObject.name", 0]}, lane: "$lane", playerId: "$player", sortablePlayer: {"$toLower": {"$arrayElemAt": ["$playerObject.name", 0]}} },
            avg_kills: { $avg: "$kills" },
            avg_deaths: { $avg: "$deaths" },
            avg_assists: { $avg: "$assists" },
            avg_gold: { $avg: "$goldEarned" },
            avg_cs: { $avg: "$totalMinionsKilled" },
            avg_damage: { $avg: "$totalDamageDealtToChampions" },
            wins: {$sum: { $cond : [ "$win", 1, 0 ] } },
            total_games: { $sum: 1 }
        }
    });

    // TODO: SORT IS FUCKING BROKE. I have no idea why it doesn't work.
    // Stuff changes as I make changes, but for some reason items aren't in proper order
    // console.log(page*size)
    GameModel.aggregate(pipe).sort(sortObject).skip(page*size).limit(size).then(games => {
        res.json(games)
    }, (err) => {
        res.status(404).json("Error: " + err);
    });
});

router.route('/brief/lane/:lane').get((req, res) => {
    const page = req.query.page ? req.query.page - 1 : 0;
    const size = req.query.size ? +req.query.size : 10;
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
    ]).skip(page*size).limit(size).then(games => {

        res.json(games);
    }, (err) => {
        res.status(404).json("Error: " + err);
    });
});

module.exports = router;