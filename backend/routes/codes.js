const router = require('express').Router();	

const { generateCodes } = require('../src/codes');

// TODO AUTH
router.route("/create/:count").post((req, res) => {
  const count = req.params.count;
  generateCodes(count, (codes) => {
    res.json(codes);
  });
});

// Maybe add in future?
// router.route("/callback").post((req, res) => {

// });

module.exports = router;