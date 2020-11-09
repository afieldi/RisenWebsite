const router = require('express').Router();	
const Ban = require('../models/bans.model');

const { generateNewDraft } = require('../src/draft');

router.route("/create").post((req, res) => {
    generateNewDraft(req.body, (draft) => {
        res.json(draft);
    });
});

router.route("/champban").get((req, res) => {
    Ban.find({
        expiryDate: {
            $gte: new Date()
        }
    }).then(bans => {res.json(bans)});
});

router.route("/champban").post((req, res) => {
    Ban.create({
        champion: req.body.champion,
        expiryDate: new Date(req.body.expiryDate)
    }).then(ban => {res.json(ban)});
});

router.route("/champban").delete((req, res) => {
    Ban.deleteOne({
        _id: req.query.id,
    }).then(ban => {res.json(ban)});
});

module.exports = router;