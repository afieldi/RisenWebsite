const router = require('express').Router();	
const process = require('process');
const auth = require('../src/auth');
const User = require('../models/user.model');
const uuid = require('uuid');
// This is cheating, but path is the host name of the website
// This is so that the calling url can be passed from the /redirect endpoint into this function
//  via the callback url
router.route("/callback").get((req, res) => {
  auth.getUser(req, req.query.code,
    (user, level) => {
      // Is an admin, success
      let weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      User.create({
        user: user.id,
        auth: uuid.v4(),
        level: level,
        name: user.username,
        expiry: weekFromNow
      }).then(userDoc => {
        console.log("Redirecting with success");
        res.redirect(`${process.env.WEBSITE_BASE}/auth?code=${userDoc.auth}`)
      });
    }, () => {
      // Something went wrong
      console.log("Redirecting with failure");
      res.redirect(`${process.env.WEBSITE_BASE}/auth`)
    })
});

router.route("/redirect").get((req, res) => {
  const client_id = process.env.DISCORD_CLIENT_ID;

  let redirect = req.headers.host + "/auth/callback";
  if(req.connection.encrypted) {
    redirect = "https%3A%2F%2F" + redirect;
  }
  else {
    redirect = "http%3A%2F%2F" + redirect;
  }
  // TODO: Use Host instead once this migrates to an actual server
  // const redirect = "http%3A%2F%2F" + "99.246.224.136:5000" + "/auth/callback";

  //  console.log(req.get("url"));
  // TODO add in the state query param
  res.send(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${client_id}&scope=identify&redirect_uri=${redirect}&prompt=consent`);
});

router.route("/verify").get((req, res) => {
  let code = req.query.code;
  User.findOne({
    auth: code
  }).then(user => {
    if(user) {
      res.json(user);
    }
    else {
      res.status(404).send("Code not found!");
    }
  }).catch(err => {
    res.json({});
  });
});

router.route("/verify").delete((req, res) => {
  let code = req.query.code;
  User.deleteOne({
    auth: code
  }).then(d => {
    if (d.deletedCount > 0) {
      res.json({});
    }
    else {
      res.status(404).send("No code found");
    }
  });
})

module.exports = router; 