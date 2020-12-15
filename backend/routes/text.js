const router = require('express').Router();
const Textual = require("../models/textual.model");

router.route('/rules/:rulename').get((req, res) => {
  res.json("WHEEEE")
}).post((req, res) => {
  // console.log(req.);
  // res.json("WHEEE");
});

module.exports = router;