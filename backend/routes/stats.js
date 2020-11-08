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
                    avg_gameDuration: { $avg: "$gameDuration" },
                    avg_kills: { $avg: "$kills" },
                    avg_deaths: { $avg: "$deaths" },
                    avg_assists: { $avg: "$assists" },
                    avg_goldEarned: { $avg: "$goldEarned" },
                    avg_totalMinionsKilled: { $avg: "$totalMinionsKilled" },
                    avg_totalDamageDealtToChampions: { $avg: "$totalDamageDealtToChampions" },

                    avg_kills15: { $avg: "$kills15"},
                    avg_soloKills: { $avg: "$soloKills" },
                    avg_gankKills: { $avg: "$gankKills" },
                    avg_deaths15: { $avg: "$deaths15" },
                    avg_soloDeaths: { $avg: "$soloDeaths" },
                    avg_gankDeaths: { $avg: "$gankDeaths" },
                    avg_assists15: { $avg: "$assists15" },

                    // Income
                    avg_neutralMinionsKilled: { $avg: "$neutralMinionsKilled" },
                    avg_neutralMinionsKilledTeamJungle: { $avg: "$neutralMinionsKilledTeamJungle" },
                    avg_neutralMinionsKilledEnemyJungle: { $avg: "$neutralMinionsKilledEnemyJungle" },
                    avg_firstItemTime: { $avg: "$firstItemTime" },
                    avg_goldGen10: { $avg: "$goldGen10" },
                    avg_goldGen20: { $avg: "$goldGen20" },
                    avg_goldGen30: { $avg: "$goldGen30" },
                    avg_xpGen10: { $avg: "$xpGen10" },
                    avg_xpGen20: { $avg: "$xpGen20" },
                    avg_xpGen30: { $avg: "$xpGen30" },
                    avg_csGen10: { $avg: "$csGen10" },
                    avg_csGen20: { $avg: "$csGen20" },
                    avg_csGen30: { $avg: "$csGen30" },

                    // Damage
                    avg_physicalDamageDealtToChampions: { $avg: "$physicalDamageDealtToChampions" },
                    avg_magicDamageDealtToChampions: { $avg: "$magicDamageDealtToChampions" },
                    avg_trueDamageDealtToChampions: { $avg: "$trueDamageDealtToChampions" },
                    avg_physicalDamageTaken: { $avg: "$physicalDamageTaken" },
                    avg_magicalDamageTaken: { $avg: "$magicalDamageTaken" },
                    avg_trueDamageTaken: { $avg: "$trueDamageTaken" },
                    avg_totalDamageTaken: { $avg: "$totalDamageTaken" },
                    avg_damageDealtToObjectives: { $avg: "$damageDealtToObjectives" },
                    avg_damageSelfMitigated: { $avg: "$damageSelfMitigated" },

                    avg_totalHeal: { $avg: "$totalHeal" },

                    // Vision
                    avg_visionScore: { $avg: "$visionScore" },
                    avg_wardsPlaced15: { $avg: "$wardsPlaced15" },
                    avg_wardsKilled15: { $avg: "$wardsKilled15" },
                    avg_wardsKilled: { $avg: "$wardsKilled" },
                    avg_visionWardsBoughtInGame: { $avg: "$visionWardsBoughtInGame" },

                    // Fun
                    avg_firstBloodKill: { $avg: { $cond : [ "$firstBloodKill", 1, 0 ] } },
                    avg_firstBloodAssist: { $avg: { $cond : [ "$firstBloodAssist", 1, 0 ] } },
                    avg_firstTowerKill: { $avg: { $cond : [ "$firstTowerKill", 1, 0 ] } },
                    avg_firstTowerAssist: { $avg: { $cond : [ "$firstTowerAssist", 1, 0 ] } },
                    avg_turretKills: { $avg: "$turretKills" },
                    avg_doubleKills: { $avg: "$doubleKills" },
                    avg_tripleKills: { $avg: "$tripleKills" },
                    avg_quadraKills: { $avg: "$quadraKills" },
                    avg_pentaKills: { $avg: "$pentaKills" },

                    // Timeline
                    avg_csDiff10: { $avg: "$csDiff10" },
                    avg_csDiff20: { $avg: "$csDiff20" },
                    avg_csDiff30: { $avg: "$csDiff30" },
                    wins: {$sum: { $cond : [ "$win", 1, 0 ] } },
                    total_games: { $sum: 1 }
                }
            }
        ]).then(games => {
            if (games.length) {
                games["wr"] = games["total_games"] > 0 ? games["wins"] / games["total_games"] : 0;
                games["avg_dpm"] = games["avg_totalDamageDealtToChampions"] / games["avg_gameDuration"];
                games["avg_vspm"] = games["avg_visionScore"] / games["avg_gameDuration"];
                res.json(games);
            }
            else {
                res.json([{
                    _id: { player: player.name, playerId: player._id },
                    avg_kills: 0,
                    avg_deaths: 0,
                    avg_assists: 0,
                    avg_goldEarned: 0,
                    avg_totalMinionsKilled: 0,
                    avg_totalDamageDealtToChampions: 0,
                    avg_gameDuration: 0,
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

router.route('/player/name/:id/lane/:lane/agg').get((req, res) => {
    PlayerModel.findOne({name: req.params.id}).then((player) => {
        if (player == null) {
            res.status(404).json("Could not find player: " + player);
            return;
        }
        GameModel.aggregate([
            {
                $match: {
                    player: player._id,
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
                    _id: { player: "$playername.name", playerId: "$player" },
                    avg_gameDuration: { $avg: "$gameDuration" },
                    avg_kills: { $avg: "$kills" },
                    avg_deaths: { $avg: "$deaths" },
                    avg_assists: { $avg: "$assists" },
                    avg_goldEarned: { $avg: "$goldEarned" },
                    avg_totalMinionsKilled: { $avg: "$totalMinionsKilled" },
                    avg_totalDamageDealtToChampions: { $avg: "$totalDamageDealtToChampions" },

                    avg_kills15: { $avg: "$kills15"},
                    avg_soloKills: { $avg: "$soloKills" },
                    avg_gankKills: { $avg: "$gankKills" },
                    avg_deaths15: { $avg: "$deaths15" },
                    avg_soloDeaths: { $avg: "$soloDeaths" },
                    avg_gankDeaths: { $avg: "$gankDeaths" },
                    avg_assists15: { $avg: "$assists15" },

                    // Income
                    avg_neutralMinionsKilled: { $avg: "$neutralMinionsKilled" },
                    avg_neutralMinionsKilledTeamJungle: { $avg: "$neutralMinionsKilledTeamJungle" },
                    avg_neutralMinionsKilledEnemyJungle: { $avg: "$neutralMinionsKilledEnemyJungle" },
                    avg_firstItemTime: { $avg: "$firstItemTime" },
                    avg_goldGen10: { $avg: "$goldGen10" },
                    avg_goldGen20: { $avg: "$goldGen20" },
                    avg_goldGen30: { $avg: "$goldGen30" },
                    avg_xpGen10: { $avg: "$xpGen10" },
                    avg_xpGen20: { $avg: "$xpGen20" },
                    avg_xpGen30: { $avg: "$xpGen30" },
                    avg_csGen10: { $avg: "$csGen10" },
                    avg_csGen20: { $avg: "$csGen20" },
                    avg_csGen30: { $avg: "$csGen30" },

                    // Damage
                    avg_physicalDamageDealtToChampions: { $avg: "$physicalDamageDealtToChampions" },
                    avg_magicDamageDealtToChampions: { $avg: "$magicDamageDealtToChampions" },
                    avg_trueDamageDealtToChampions: { $avg: "$trueDamageDealtToChampions" },
                    avg_physicalDamageTaken: { $avg: "$physicalDamageTaken" },
                    avg_magicalDamageTaken: { $avg: "$magicalDamageTaken" },
                    avg_trueDamageTaken: { $avg: "$trueDamageTaken" },
                    avg_totalDamageTaken: { $avg: "$totalDamageTaken" },
                    avg_damageDealtToObjectives: { $avg: "$damageDealtToObjectives" },
                    avg_damageSelfMitigated: { $avg: "$damageSelfMitigated" },

                    avg_totalHeal: { $avg: "$totalHeal" },

                    // Vision
                    avg_visionScore: { $avg: "$visionScore" },
                    avg_wardsPlaced15: { $avg: "$wardsPlaced15" },
                    avg_wardsKilled15: { $avg: "$wardsKilled15" },
                    avg_wardsKilled: { $avg: "$wardsKilled" },
                    avg_visionWardsBoughtInGame: { $avg: "$visionWardsBoughtInGame" },

                    // Fun
                    avg_firstBloodKill: { $avg: { $cond : [ "$firstBloodKill", 1, 0 ] } },
                    avg_firstBloodAssist: { $avg: { $cond : [ "$firstBloodAssist", 1, 0 ] } },
                    avg_firstTowerKill: { $avg: { $cond : [ "$firstTowerKill", 1, 0 ] } },
                    avg_firstTowerAssist: { $avg: { $cond : [ "$firstTowerAssist", 1, 0 ] } },
                    avg_turretKills: { $avg: "$turretKills" },
                    avg_doubleKills: { $avg: "$doubleKills" },
                    avg_tripleKills: { $avg: "$tripleKills" },
                    avg_quadraKills: { $avg: "$quadraKills" },
                    avg_pentaKills: { $avg: "$pentaKills" },

                    // Timeline
                    avg_csDiff10: { $avg: "$csDiff10" },
                    avg_csDiff20: { $avg: "$csDiff20" },
                    avg_csDiff30: { $avg: "$csDiff30" },
                    wins: {$sum: { $cond : [ "$win", 1, 0 ] } },
                    total_games: { $sum: 1 }
                }
            }
        ]).then(games => {
            if (games.length) {
                games["wr"] = games["total_games"] > 0 ? games["wins"] / games["total_games"] : 0;
                games["avg_dpm"] = games["avg_totalDamageDealtToChampions"] / games["avg_gameDuration"];
                games["avg_vspm"] = games["avg_visionScore"] / games["avg_gameDuration"];
                res.json(games);
            }
            else {
                res.json([{
                    _id: { player: player.name, playerId: player._id },
                    avg_kills: 0,
                    avg_deaths: 0,
                    avg_assists: 0,
                    avg_goldEarned: 0,
                    avg_totalMinionsKilled: 0,
                    avg_totalDamageDealtToChampions: 0,
                    avg_gameDuration: 0,
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
            avg_goldEarned: { $avg: "$goldEarned" },
            avg_totalMinionsKilled: { $avg: "$totalMinionsKilled" },
            avg_totalDamageDealtToChampions: { $avg: "$totalDamageDealtToChampions" },
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
                avg_goldEarned: { $avg: "$goldEarned" },
                avg_totalMinionsKilled: { $avg: "$totalMinionsKilled" },
                avg_totalDamageDealtToChampions: { $avg: "$totalDamageDealtToChampions" },
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

router.route('/avg').get((req, res) => {
    GameModel.aggregate([
        {
            $group: {
                _id: 'avg',
                avg_gameDuration: { $avg: "$gameDuration" },
                avg_kills: { $avg: "$kills" },
                avg_deaths: { $avg: "$deaths" },
                avg_assists: { $avg: "$assists" },
                avg_goldEarned: { $avg: "$goldEarned" },
                avg_totalMinionsKilled: { $avg: "$totalMinionsKilled" },
                avg_totalDamageDealtToChampions: { $avg: "$totalDamageDealtToChampions" },

                avg_kills15: { $avg: "$kills15"},
                avg_soloKills: { $avg: "$soloKills" },
                avg_gankKills: { $avg: "$gankKills" },
                avg_deaths15: { $avg: "$deaths15" },
                avg_soloDeaths: { $avg: "$soloDeaths" },
                avg_gankDeaths: { $avg: "$gankDeaths" },
                avg_assists15: { $avg: "$assists15" },

                // Income
                avg_neutralMinionsKilled: { $avg: "$neutralMinionsKilled" },
                avg_neutralMinionsKilledTeamJungle: { $avg: "$neutralMinionsKilledTeamJungle" },
                avg_neutralMinionsKilledEnemyJungle: { $avg: "$neutralMinionsKilledEnemyJungle" },
                avg_firstItemTime: { $avg: "$firstItemTime" },
                avg_goldGen10: { $avg: "$goldGen10" },
                avg_goldGen20: { $avg: "$goldGen20" },
                avg_goldGen30: { $avg: "$goldGen30" },
                avg_xpGen10: { $avg: "$xpGen10" },
                avg_xpGen20: { $avg: "$xpGen20" },
                avg_xpGen30: { $avg: "$xpGen30" },
                avg_csGen10: { $avg: "$csGen10" },
                avg_csGen20: { $avg: "$csGen20" },
                avg_csGen30: { $avg: "$csGen30" },

                // Damage
                avg_physicalDamageDealtToChampions: { $avg: "$physicalDamageDealtToChampions" },
                avg_magicDamageDealtToChampions: { $avg: "$magicDamageDealtToChampions" },
                avg_trueDamageDealtToChampions: { $avg: "$trueDamageDealtToChampions" },
                avg_physicalDamageTaken: { $avg: "$physicalDamageTaken" },
                avg_magicalDamageTaken: { $avg: "$magicalDamageTaken" },
                avg_trueDamageTaken: { $avg: "$trueDamageTaken" },
                avg_totalDamageTaken: { $avg: "$totalDamageTaken" },
                avg_damageDealtToObjectives: { $avg: "$damageDealtToObjectives" },
                avg_damageSelfMitigated: { $avg: "$damageSelfMitigated" },

                avg_totalHeal: { $avg: "$totalHeal" },

                // Vision
                avg_visionScore: { $avg: "$visionScore" },
                avg_wardsPlaced15: { $avg: "$wardsPlaced15" },
                avg_wardsKilled15: { $avg: "$wardsKilled15" },
                avg_wardsKilled: { $avg: "$wardsKilled" },
                avg_visionWardsBoughtInGame: { $avg: "$visionWardsBoughtInGame" },

                // Fun
                avg_firstBloodKill: { $avg: { $cond : [ "$firstBloodKill", 1, 0 ] } },
                avg_firstBloodAssist: { $avg: { $cond : [ "$firstBloodAssist", 1, 0 ] } },
                avg_firstTowerKill: { $avg: { $cond : [ "$firstTowerKill", 1, 0 ] } },
                avg_firstTowerAssist: { $avg: { $cond : [ "$firstTowerAssist", 1, 0 ] } },
                avg_turretKills: { $avg: "$turretKills" },
                avg_doubleKills: { $avg: "$doubleKills" },
                avg_tripleKills: { $avg: "$tripleKills" },
                avg_quadraKills: { $avg: "$quadraKills" },
                avg_pentaKills: { $avg: "$pentaKills" },

                // Timeline
                avg_csDiff10: { $avg: "$csDiff10" },
                avg_csDiff20: { $avg: "$csDiff20" },
                avg_csDiff30: { $avg: "$csDiff30" },
                
                total_games: { $sum: 1 }
            }
        }
    ]).then(data => {
        res.json(data);
    }, (err) => {
        res.status(400).json("Error: " + err);
    })
});

router.route('/avg/champ/:champid?').get((req, res) => {
    let pipeline = [];
    if (req.params.champid) {
        pipeline.push({
            $match: {
                championId: Number(req.params.champid)
            }
        })
    }
    pipeline.push({
        $group: {
            _id: { champion: '$championId'},
            avg_gameDuration: { $avg: "$gameDuration" },
            avg_kills: { $avg: "$kills" },
            avg_deaths: { $avg: "$deaths" },
            avg_assists: { $avg: "$assists" },
            avg_goldEarned: { $avg: "$goldEarned" },
            avg_totalMinionsKilled: { $avg: "$totalMinionsKilled" },
            avg_totalDamageDealtToChampions: { $avg: "$totalDamageDealtToChampions" },

            avg_kills15: { $avg: "$kills15"},
            avg_soloKills: { $avg: "$soloKills" },
            avg_gankKills: { $avg: "$gankKills" },
            avg_deaths15: { $avg: "$deaths15" },
            avg_soloDeaths: { $avg: "$soloDeaths" },
            avg_gankDeaths: { $avg: "$gankDeaths" },
            avg_assists15: { $avg: "$assists15" },

            // Income
            avg_neutralMinionsKilled: { $avg: "$neutralMinionsKilled" },
            avg_neutralMinionsKilledTeamJungle: { $avg: "$neutralMinionsKilledTeamJungle" },
            avg_neutralMinionsKilledEnemyJungle: { $avg: "$neutralMinionsKilledEnemyJungle" },
            avg_firstItemTime: { $avg: "$firstItemTime" },
            avg_goldGen10: { $avg: "$goldGen10" },
            avg_goldGen20: { $avg: "$goldGen20" },
            avg_goldGen30: { $avg: "$goldGen30" },
            avg_xpGen10: { $avg: "$xpGen10" },
            avg_xpGen20: { $avg: "$xpGen20" },
            avg_xpGen30: { $avg: "$xpGen30" },
            avg_csGen10: { $avg: "$csGen10" },
            avg_csGen20: { $avg: "$csGen20" },
            avg_csGen30: { $avg: "$csGen30" },

            // Damage
            avg_physicalDamageDealtToChampions: { $avg: "$physicalDamageDealtToChampions" },
            avg_magicDamageDealtToChampions: { $avg: "$magicDamageDealtToChampions" },
            avg_trueDamageDealtToChampions: { $avg: "$trueDamageDealtToChampions" },
            avg_physicalDamageTaken: { $avg: "$physicalDamageTaken" },
            avg_magicalDamageTaken: { $avg: "$magicalDamageTaken" },
            avg_trueDamageTaken: { $avg: "$trueDamageTaken" },
            avg_totalDamageTaken: { $avg: "$totalDamageTaken" },
            avg_damageDealtToObjectives: { $avg: "$damageDealtToObjectives" },
            avg_damageSelfMitigated: { $avg: "$damageSelfMitigated" },

            avg_totalHeal: { $avg: "$totalHeal" },

            // Vision
            avg_visionScore: { $avg: "$visionScore" },
            avg_wardsPlaced15: { $avg: "$wardsPlaced15" },
            avg_wardsKilled15: { $avg: "$wardsKilled15" },
            avg_wardsKilled: { $avg: "$wardsKilled" },
            avg_visionWardsBoughtInGame: { $avg: "$visionWardsBoughtInGame" },

            // Fun
            avg_firstBloodKill: { $avg: { $cond : [ "$firstBloodKill", 1, 0 ] } },
            avg_firstBloodAssist: { $avg: { $cond : [ "$firstBloodAssist", 1, 0 ] } },
            avg_firstTowerKill: { $avg: { $cond : [ "$firstTowerKill", 1, 0 ] } },
            avg_firstTowerAssist: { $avg: { $cond : [ "$firstTowerAssist", 1, 0 ] } },
            avg_turretKills: { $avg: "$turretKills" },
            avg_doubleKills: { $avg: "$doubleKills" },
            avg_tripleKills: { $avg: "$tripleKills" },
            avg_quadraKills: { $avg: "$quadraKills" },
            avg_pentaKills: { $avg: "$pentaKills" },

            // Timeline
            avg_csDiff10: { $avg: "$csDiff10" },
            avg_csDiff20: { $avg: "$csDiff20" },
            avg_csDiff30: { $avg: "$csDiff30" },
            total_games: { $sum: 1 }
        }
    })
    GameModel.aggregate(pipeline).then(data => {
        res.json(data);
    }, (err) => {
        res.status(400).json("Error: " + err);
    })
});

router.route('/avg/role/:rolename?').get((req, res) => {
    let pipeline = [];
    if (req.params.rolename) {
        pipeline.push({
            $match: {
                lane: req.params.rolename
            }
        })
    }
    pipeline.push({
        $group: {
            _id: { lane: '$lane'},
            avg_gameDuration: { $avg: "$gameDuration" },
            avg_kills: { $avg: "$kills" },
            avg_deaths: { $avg: "$deaths" },
            avg_assists: { $avg: "$assists" },
            avg_goldEarned: { $avg: "$goldEarned" },
            avg_totalMinionsKilled: { $avg: "$totalMinionsKilled" },
            avg_totalDamageDealtToChampions: { $avg: "$totalDamageDealtToChampions" },

            avg_kills15: { $avg: "$kills15"},
            avg_soloKills: { $avg: "$soloKills" },
            avg_gankKills: { $avg: "$gankKills" },
            avg_deaths15: { $avg: "$deaths15" },
            avg_soloDeaths: { $avg: "$soloDeaths" },
            avg_gankDeaths: { $avg: "$gankDeaths" },
            avg_assists15: { $avg: "$assists15" },

            // Income
            avg_neutralMinionsKilled: { $avg: "$neutralMinionsKilled" },
            avg_neutralMinionsKilledTeamJungle: { $avg: "$neutralMinionsKilledTeamJungle" },
            avg_neutralMinionsKilledEnemyJungle: { $avg: "$neutralMinionsKilledEnemyJungle" },
            avg_firstItemTime: { $avg: "$firstItemTime" },
            avg_goldGen10: { $avg: "$goldGen10" },
            avg_goldGen20: { $avg: "$goldGen20" },
            avg_goldGen30: { $avg: "$goldGen30" },
            avg_xpGen10: { $avg: "$xpGen10" },
            avg_xpGen20: { $avg: "$xpGen20" },
            avg_xpGen30: { $avg: "$xpGen30" },
            avg_csGen10: { $avg: "$csGen10" },
            avg_csGen20: { $avg: "$csGen20" },
            avg_csGen30: { $avg: "$csGen30" },

            // Damage
            avg_physicalDamageDealtToChampions: { $avg: "$physicalDamageDealtToChampions" },
            avg_magicDamageDealtToChampions: { $avg: "$magicDamageDealtToChampions" },
            avg_trueDamageDealtToChampions: { $avg: "$trueDamageDealtToChampions" },
            avg_physicalDamageTaken: { $avg: "$physicalDamageTaken" },
            avg_magicalDamageTaken: { $avg: "$magicalDamageTaken" },
            avg_trueDamageTaken: { $avg: "$trueDamageTaken" },
            avg_totalDamageTaken: { $avg: "$totalDamageTaken" },
            avg_damageDealtToObjectives: { $avg: "$damageDealtToObjectives" },
            avg_damageSelfMitigated: { $avg: "$damageSelfMitigated" },

            avg_totalHeal: { $avg: "$totalHeal" },

            // Vision
            avg_visionScore: { $avg: "$visionScore" },
            avg_wardsPlaced15: { $avg: "$wardsPlaced15" },
            avg_wardsKilled15: { $avg: "$wardsKilled15" },
            avg_wardsKilled: { $avg: "$wardsKilled" },
            avg_visionWardsBoughtInGame: { $avg: "$visionWardsBoughtInGame" },

            // Fun
            avg_firstBloodKill: { $avg: { $cond : [ "$firstBloodKill", 1, 0 ] } },
            avg_firstBloodAssist: { $avg: { $cond : [ "$firstBloodAssist", 1, 0 ] } },
            avg_firstTowerKill: { $avg: { $cond : [ "$firstTowerKill", 1, 0 ] } },
            avg_firstTowerAssist: { $avg: { $cond : [ "$firstTowerAssist", 1, 0 ] } },
            avg_turretKills: { $avg: "$turretKills" },
            avg_doubleKills: { $avg: "$doubleKills" },
            avg_tripleKills: { $avg: "$tripleKills" },
            avg_quadraKills: { $avg: "$quadraKills" },
            avg_pentaKills: { $avg: "$pentaKills" },

            // Timeline
            avg_csDiff10: { $avg: "$csDiff10" },
            avg_csDiff20: { $avg: "$csDiff20" },
            avg_csDiff30: { $avg: "$csDiff30" },
            total_games: { $sum: 1 }
        }
    })
    GameModel.aggregate(pipeline).then(data => {
        res.json(data);
    }, (err) => {
        res.status(400).json("Error: " + err);
    })
});

module.exports = router;