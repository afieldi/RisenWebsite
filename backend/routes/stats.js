const router = require('express').Router();
const PlayerModel = require('../models/player.model');
const GameModel = require('../models/game.model');
const TeamGameModel = require('../models/teamgame.model');
const mongoose = require('mongoose');
const { createPlayer } = require('../src/player');

const avgPipe = {
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
    avg_wardsPlaced: { $avg: "$wardsPlaced" },
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
    avg_xpDiff10: { $avg: "$xpDiff10" },
    avg_xpDiff20: { $avg: "$xpDiff20" },
    avg_xpDiff30: { $avg: "$xpDiff30" },
    avg_goldDiff10: { $avg: "$goldDiff10" },
    avg_goldDiff20: { $avg: "$goldDiff20" },
    avg_goldDiff30: { $avg: "$goldDiff30" },
    total_wins: { $sum: { $cond : [ "$win", 1, 0 ] } },
    total_games: { $sum: 1 }
}

// Get player info by id
router.route('/player/id/:id').get((req, res) => {
    GameModel.find({player: mongoose.Types.ObjectId(req.params.id)}).then(games => {
        res.json(games);
    }, (err) => {
        res.status(404).json("Error: " + err);
    });
});

// Get player info by name.
// To make things easier, if their name doesn't exist, but is valid, create the player object
// Yes, I am 100% aware this is bad practice. No, I really don't care
router.route('/player/name/:id').get((req, res) => {
    PlayerModel.findOne({searchName: req.params.id.toLowerCase().replace(/\s/g, '')}).then((player) => {
        if (player === null) {
            player = createPlayer(req.params.id);
            if (player === null) {
                res.status(404).json("Player not found");
            }
            else {
                res.json([]);
            }
            return;
        }
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
    PlayerModel.findOne({searchName: req.params.id.toLowerCase().replace(/\s/g, '')}).then((player) => {
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
                    ...avgPipe
                }
            }
        ]).then(games => {
            if (games.length) {
                for (let game of games) {
                    game["wr"] = game["total_games"] > 0 ? game["total_wins"] / game["total_games"] : 0;
                    game["avg_dpm"] = game["avg_totalDamageDealtToChampions"] / (game["avg_gameDuration"]/60);
                    game["avg_vspm"] = game["avg_visionScore"] / game["avg_gameDuration"];
                    game["avg_cspm"] = (game["avg_totalMinionsKilled"] + game["avg_neutralMinionsKilled"]) / (game["avg_gameDuration"]/60);
                }
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
    PlayerModel.findOne({searchName: req.params.id.toLowerCase().replace(/\s/g, '')}).then((player) => {
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
                    ...avgPipe
                }
            }
        ]).then(games => {
            if (games.length) {
                for (let game of games) {
                    game["wr"] = game["total_games"] > 0 ? game["total_wins"] / game["total_games"] : 0;
                    game["avg_dpm"] = game["avg_totalDamageDealtToChampions"] / (game["avg_gameDuration"]/60);
                    game["avg_vspm"] = game["avg_visionScore"] / game["avg_gameDuration"];
                    game["avg_cspm"] = (game["avg_totalMinionsKilled"] + game["avg_neutralMinionsKilled"]) / (game["avg_gameDuration"]/60);
                }
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
        res.status(500).json("Error: " + err);
    });
});

router.route('/multi/name').get((req, res) => {
    let names = req.query.names;
    names = names.split(",");
    if (names.length > 10) {
        res.status(400).json("Too many names passed");
        return;
    }
    for (let i in names) {
        names[i] = names[i].toLowerCase().replace(/\s/g, '');
    }

    let pipeline = [];
    
    PlayerModel.find({searchName: {$in: names}}).then((players) => {
        let ids = players.map(p => p._id);
        console.log(ids)
        pipeline = []
        pipeline.push({
            $match: {
                player: {$in: ids}
            }
        });
        pipeline.push({
            $lookup: {
                from: 'players',
                localField: 'player',
                foreignField: '_id',
                as: 'playername'
            }
        });
        pipeline.push({
            $group: {
                _id: {
                  player: "$playername",
                  champion: "$championId"
                },
                ...avgPipe
            }
        })
        let a = Object.assign({}, avgPipe);
        for (let k in a) {
            a[k] = "$" + k;
        }

        let b = Object.assign({}, avgPipe);
        for (let k in b) {
            if (k.startsWith("total")) {
                b[k] = {
                    $sum: "$" + k
                }
            }
            else {
                b[k] = {
                    $avg: "$" + k
                }
            }
        }
        pipeline.push({
            $group: {
                _id: "$_id.player",
                champions: {
                    $push: {
                        championId: "$_id.champion",
                        ...a
                    }
                },
                ...b
            }
        })
        GameModel.aggregate(pipeline).then(champstats => {
            for (let i in champstats) {
                champstats[i].champions.sort((a, b) => {
                    if (b.total_games > a.total_games) {
                        return -1;
                    }
                    return 1;
                })
            }
            res.json(champstats);
        }, (err) => {
            res.status(404).json("Error: " + err);
        });
    }, (err) => {
        res.status(404).json("Error: " + err);
    });
});

router.route('/multi/id').get((req, res) => {
    let ids = req.body.ids;
    if (ids.length > 10) {
        res.status(400).json("Too many names passed");
        return;
    }
    for (let i in ids) {
        ids[i] = mongoose.Types.ObjectId(ids[i]);
    }

    let pipeline = [];

    pipeline.push({
        $match: {
            player: {$in: ids}
        }
    });
    GameModel.aggregate(pipeline).then(games => {
        res.json(games);
    }, (err) => {
        res.status(404).json("Error: " + err);
    });

})

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
    const season = req.query.season;
    const sortObject = (() => {
        let dir = sort.substr(sort.length - 1);
        let tmp = {};
        tmp[sort.substr(0, sort.length - 1)] = dir === "-" ? -1 : 1
        return tmp;
    })();

    let pipe = [];
    if (season) {
        try {
            pipe.push({
                $match: {
                    season: mongoose.Types.ObjectId(season)
                }
            });
        } catch (error) { }
    }
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
            avg_duration: { $avg: "$gameDuration" },
            wins: {$sum: { $cond : [ "$win", 1, 0 ] } },
            total_games: { $sum: 1 }
        }
    });

    pipe.push({
        $project: {
            avg_kills: 1,
            avg_deaths: 1,
            avg_assists: 1,
            avg_goldEarned: 1,
            avg_totalMinionsKilled: 1,
            avg_totalDamageDealtToChampions: 1,
            avg_duration: 1,
            wins: 1,
            total_games: 1,
            dpm: { $divide: [ "$avg_totalDamageDealtToChampions", { $divide: ["$avg_duration", 60]}] },
            gpm: { $divide: [ "$avg_goldEarned", { $divide: ["$avg_duration", 60]}] },
        }
    })

    GameModel.aggregate(pipe).sort(sortObject).skip(page*size).limit(size).then(games => {
        if (games.length === 0 && playerName) {
            // Giga hack
            // If the player doesn't exist, show them anyway so someone has something to click on
            // This will bring them to the detailed stats page where they can update themselves
            res.json([
                {
                    "_id": {
                        "player": playerName,
                        "lane": "ANY",
                        "playerId": "",
                        "sortablePlayer": ""
                    },
                    "avg_kills": 0,
                    "avg_deaths": 0,
                    "avg_assists": 0,
                    "avg_goldEarned": 0,
                    "avg_totalMinionsKilled": 0,
                    "avg_totalDamageDealtToChampions": 0,
                    "avg_duration": 0,
                    "wins": 0,
                    "total_games": 0,
                    "dpm": 0,
                    "gpm": 0
                }
            ])
        }
        res.json(games)
    }, (err) => {
        // Im a lazy ass bad coder so returning an error here causing a bug in front end. So return empty array
        res.json([]);
        // res.status(404).json("Error: " + err);
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
                _id: "avg",
                ...avgPipe
            }
        }
    ]).then(data => {
        for (let game of data) {
            game["wr"] = game["total_games"] > 0 ? game["total_wins"] / game["total_games"] : 0;
            game["avg_dpm"] = game["avg_totalDamageDealtToChampions"] / (game["avg_gameDuration"]/60);
            game["avg_vspm"] = game["avg_visionScore"] / game["avg_gameDuration"];
            game["avg_cspm"] = (game["avg_totalMinionsKilled"] + game["avg_neutralMinionsKilled"]) / (game["avg_gameDuration"]/60);
        }
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
            ...avgPipe
        }
    })
    GameModel.aggregate(pipeline).then(data => {
        for (let game of data) {
            game["wr"] = game["total_games"] > 0 ? game["total_wins"] / game["total_games"] : 0;
            game["avg_dpm"] = game["avg_totalDamageDealtToChampions"] / (game["avg_gameDuration"]/60);
            game["avg_vspm"] = game["avg_visionScore"] / game["avg_gameDuration"];
            game["avg_cspm"] = (game["avg_totalMinionsKilled"] + game["avg_neutralMinionsKilled"]) / (game["avg_gameDuration"]/60);
        }
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
            ...avgPipe
        }
    })
    GameModel.aggregate(pipeline).then(data => {
        res.json(data);
    }, (err) => {
        res.status(400).json("Error: " + err);
    })
});

router.route('/avg/role/:rolename?/byplayer').get((req, res) => {
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
            _id: { player: '$player'},
            ...avgPipe
        }
    })
    GameModel.aggregate(pipeline).then(data => {
        res.json(data);
    }, (err) => {
        res.status(400).json("Error: " + err);
    })
});

router.route('/avg/byplayer').get((req, res) => {
    let season = req.query.season;
    let pipeline = [];
    if (season) {
        try {
            pipeline.push({
                $match: {
                    season: mongoose.Types.ObjectId(season)
                }
            })
        } catch (error) {}
    }
    pipeline.push({
        $lookup: {
            from: 'players',
            localField: 'player',
            foreignField: '_id',
            as: 'playername'
        }
    });
    pipeline.push({
        $group: {
            _id: { player: "$playername.name", playerId: "$player" },
            ...avgPipe
        }
    })
    GameModel.aggregate(pipeline).then(data => {
        res.json(data);
    }, (err) => {
        res.status(400).json("Error: " + err);
    })
});

router.route('/general/league').get((req, res) => {
    let season = req.query.season;
    console.log(season);
    let pipeline = []
    if (season) {
        try {
            pipeline.push({
                $match: {
                    season: mongoose.Types.ObjectId(season)
                }
            })
        } catch (error) {}
    }
    pipeline.push({ 
        $group: {
            _id: "$side",
            wins: { $sum: { $cond : [ "$win", 1, 0 ] } },
            firstBlood: { $sum: { $cond : [ "$firstBlood", 1, 0 ] } },
            avg_towerKills: { $avg: "$towerKills" },
            avg_riftHeraldKills: { $avg: "$riftHeraldKills" },
            avg_inhibitorKills: { $avg: "$inhibitorKills" },
            avg_dragonKills: { $avg: "$dragonKills" },
            avg_baronKills: { $avg: "$baronKills" },
            total_games: { $sum: 1 }
        }
    })
    
    TeamGameModel.aggregate(pipeline).then(data => {
        res.json(data);
    }, (err) => {
        res.status(400).json("Error: " + err);
    });
});

router.route('/team/:team').get((req, res) => {
    let team = req.params.team;
    TeamGameModel.find({}).then(team => {

    });
});

router.route('/champs').get((req, res) => {
    let season = req.query.season;
    let role = req.query.role;

    let pipeline = [];

    if (season) {
        try {
            pipeline.push({
                $match: {season: mongoose.Types.ObjectId(season)}
            })
        } catch (error) { }
    }

    if (role) {
        try {
            pipeline.push({
                $match: {lane: role}
            });
        } catch (error) { }
    }

    pipeline.push({
        $group: {
            _id: "$championId",
            ...avgPipe
        }
    });

    GameModel.aggregate(pipeline).then(data => {
        let tg = 0;
        for (let d of data) {
            tg += d["total_games"];
        }
        tg /= 10;
        for (let i in data) {
            data[i]["presence"] = data[i]["total_games"] / tg;
            data[i]["wr"] = data[i]["total_wins"]/data[i]["total_games"]
        }
        res.json(data);
    })
})

router.route('/champs/byrole').get((req, res) => {
    let season = req.query.season;
    let role = req.query.role;

    let pipeline = [];

    if (season) {
        try {
            pipeline.push({
                $match: {season: mongoose.Types.ObjectId(season)}
            })
        } catch (error) { }
    }

    if (role) {
        try {
            pipeline.push({
                $match: {lane: role}
            });
        } catch (error) { }
    }

    pipeline.push({
        $group: {
            _id: {
                championId: "$championId",
                role: "$lane"
            },
            ...avgPipe
        }
    });

    GameModel.aggregate(pipeline).then(data => {
        let tg = 0;
        for (let d of data) {
            tg += d["total_games"];
        }
        tg /= 10;
        for (let i in data) {
            data[i]["presence"] = data[i]["total_games"] / tg;
            data[i]["wr"] = data[i]["total_wins"]/data[i]["total_games"]
        }
        res.json(data);
    })
})

router.route('/champs/withbans').get((req, res) => {
    let season = req.query.season;
    let role = req.query.role;

    let pipeline = [];
    let teamPipeline = [];
    if (season) {
        try {
            pipeline.push({
                $match: {season: mongoose.Types.ObjectId(season)}
            });
            teamPipeline.push({
                $match: {season: mongoose.Types.ObjectId(season)}
            });
        } catch (error) { }
    }

    if (role) {
        try {
            pipeline.push({
                $match: {lane: role}
            });
        } catch (error) { }
    }

    pipeline.push({
        $group: {
            _id: "$championId",
            ...avgPipe
        }
    });

    teamPipeline.push({
        $unwind: {
            path: "$bans",
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: true
        }
    });
    teamPipeline.push({
        $group: {
            _id: "$bans",
            count: {
              $sum: 1
            }
        }
    })

    GameModel.aggregate(pipeline).then(data => {
        
        TeamGameModel.aggregate(teamPipeline).then(d2 => {
            let tg = 0;
            let ban_data = {}
            for (let d of d2) {
                ban_data[d._id] = d;
                tg += d["count"];
            }
            tg /= 5;
            tg = Math.round(tg);
            console.log(tg);
            for (let i in data) {
                if (!ban_data[data[i]["_id"]]) {
                    ban_data[data[i]["_id"]] = {
                        "count": 0,
                        "ban_rate": 0
                    };
                }
                data[i]["bans"] = ban_data[data[i]["_id"]]["count"];
                data[i]["br"] = ban_data[data[i]["_id"]]["count"] / tg;
                data[i]["pr"] = data[i]["total_games"] / tg;
                data[i]["presence"] = (data[i]["total_games"] + data[i]["bans"]) / tg;
                data[i]["wr"] = data[i]["total_wins"]/data[i]["total_games"]
            }
            res.json(data);
        }, (err) => {
            console.log(err);
            res.status(500).json(err);
        })
    }, (err) => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.route('/champs/all').get((req, res) => {
    let season = req.query.season;
    let role = req.query.role;

    let pipeline = [];
    let teamPipeline = [];
    if (season) {
        try {
            pipeline.push({
                $match: {season: mongoose.Types.ObjectId(season)}
            });
            teamPipeline.push({
                $match: {season: mongoose.Types.ObjectId(season)}
            });
        } catch (error) { }
    }

    if (role) {
        try {
            pipeline.push({
                $match: {lane: role}
            });
        } catch (error) { }
    }

    pipeline.push({
        $group: {
            _id: {
                championId: "$championId",
                role: "$lane"
            },
            ...avgPipe
        }
    });

    teamPipeline.push({
        $unwind: {
            path: "$bans",
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: true
        }
    });
    teamPipeline.push({
        $group: {
            _id: "$bans",
            count: {
              $sum: 1
            }
        }
    })

    GameModel.aggregate(pipeline).then(data => {
        
        TeamGameModel.aggregate(teamPipeline).then(d2 => {
            let tg = 0;
            let ban_data = {}
            for (let d of d2) {
                ban_data[d._id] = d;
                tg += d["count"];
            }
            tg /= 5;
            tg = Math.round(tg);
            console.log(tg);
            for (let i in data) {
                let champId = data[i]["_id"]["championId"];
                if (!ban_data[champId]) {
                    ban_data[champId] = {
                        "count": 0,
                        "ban_rate": 0
                    };
                }
                data[i]["bans"] = ban_data[champId]["count"];
                data[i]["br"] = ban_data[champId]["count"] / tg;
                data[i]["pr"] = data[i]["total_games"] / tg;
                data[i]["presence"] = (data[i]["total_games"] + data[i]["bans"]) / tg;
                data[i]["wr"] = data[i]["total_wins"]/data[i]["total_games"]
            }
            res.json(data);
        }, (err) => {
            console.log(err);
            res.status(500).json(err);
        })
    }, (err) => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.route('/champ/:id/agg').get((req, res) => {
    let season = req.query.season;
    let role = req.query.role;
    let champ = req.params.id;

    let pipeline = [];

    pipeline.push({
        $match: {
            championId: Number(champ)
        }
    })

    if (season) {
        try {
            pipeline.push({
                $match: {season: mongoose.Types.ObjectId(season)}
            })
        } catch (error) { }
    }

    if (role) {
        try {
            pipeline.push({
                $match: {lane: role}
            });
        } catch (error) { }
    }

    pipeline.push({
        $group: {
            _id: "$championId",
            ...avgPipe
        }
    });

    GameModel.aggregate(pipeline).then(data => {
        let tg = 0;
        for (let d of data) {
            tg += d["total_games"];
        }
        tg /= 10;
        for (let i in data) {
            data[i]["presence"] = data[i]["total_games"] / tg;
            data[i]["wr"] = data[i]["total_wins"]/data[i]["total_games"]
        }
        res.json(data);
    })
});

router.route('/champ/:id').get((req, res) => {
    let season = req.query.season;
    let role = req.query.role;
    let champ = req.params.id;

    let filter = {
        championId: Number(champ)
    }
    if (season) {
        filter["season"] = mongoose.Types.ObjectId(season);
    }
    if (role) {
        filter["lane"] = role;
    }
    GameModel.find(filter).then(data => {
        res.json(data);
    })
});
module.exports = router;