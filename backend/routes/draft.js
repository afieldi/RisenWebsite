const router = require('express').Router();	

const { generateNewDraft } = require('../src/draft');

router.route("/create").post((req, res) => {
    console.log(req.body);
    generateNewDraft(req.body, (draft) => {
        res.json(draft);
    });
});

module.exports = router;