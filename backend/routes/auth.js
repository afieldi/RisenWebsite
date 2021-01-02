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
        if (req.get('origin')) {
          let d = new Date();
          d.setDate(new Date().getDate() + 7);
          res.cookie('auth', userDoc.auth, { maxAge: 7* 24 * 60 * 60 * 1000});
          res.redirect(302, `${req.get('origin')}`);
          // res.redirect(`${req.get('origin')}/auth?code=${userDoc.auth}`)
        }
        else {
          let d = new Date();
          d.setDate(new Date().getDate() + 7);
          res.cookie('auth', userDoc.auth, { maxAge: 7* 24 * 60 * 60 * 1000});
          res.redirect(302, `${process.env.WEBSITE_BASE.split(',')[0]}`);
          // res.redirect(`${process.env.WEBSITE_BASE.split(',')[0]}/auth?code=${userDoc.auth}`);
        }
      });
    }, () => {
      // Something went wrong
      if (req.get('origin')) {
        res.redirect(`${req.get('origin')}/auth`)
      }
      else {
        res.redirect(`${process.env.WEBSITE_BASE.split(',')[0]}/auth`)
      }
    })
});

router.route("/redirect").get((req, res) => {
  const client_id = process.env.DISCORD_CLIENT_ID;

  let redirect = req.headers.host + "/auth/callback";
  if(process.env.NODE_ENV === "production") {
    redirect = "https%3A%2F%2F" + redirect;
  }
  else {
    redirect = "http%3A%2F%2F" + redirect;
    redirect = `http://localhost:${process.env.PORT}/auth/testLogin`;
    res.send(redirect);
    return;
  }
  // TODO: Use Host instead once this migrates to an actual server
  // const redirect = "http%3A%2F%2F" + "99.246.224.136:5000" + "/auth/callback";

  // TODO add in the state query param
  res.send(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${client_id}&scope=identify&redirect_uri=${redirect}&prompt=consent`);
});

router.route("/testLogin").get((req, res) => {
  if (process.env.NODE_ENV !== "production") {
    User.findOne({
      name: "TestUser",
      expiry: { $gt: new Date() }
    }).then(user => {
      if(user) {
        let d = new Date();
        d.setDate(new Date().getDate() + 7);
        res.cookie('auth', user.auth, { maxAge: 7* 24 * 60 * 60 * 1000});
        res.redirect(302, `${process.env.WEBSITE_BASE.split(',')[0]}`);
      }
      else {
        res.status(404).send("Code not found!");
      }
    });
  }
  else {
    res.status(404).send("Page not found");
  }
});

router.route("/verify").get((req, res) => {
  let code = req.query.code;

  User.findOne({
    auth: code,
    expiry: { $gt: new Date().toUTCString() }
  }).then(user => {
    if(user) {
      // res.cookie('auth', user.auth, { expires: user.expiry});
      res.json(user);
    }
    else {
      res.status(404).send("Code not found!");
    }
  }).catch(err => {
    res.json({});
  });
});

// router.route("/verify").delete((req, res) => {
//   res.cookie('auth', {expires: new Date(0)}).send();
//   console.log("here");
//   // if (req.get('origin')) {
//   //   res.json(`${req.get('origin')}`);
//   // }
//   // else {
//   //   res.redirect(302, `${process.env.WEBSITE_BASE.split(',')[0]}`);
//   // }
//   // User.deleteOne({
//   //   auth: code
//   // }).then(d => {
//   //   if (d.deletedCount > 0) {
//   //     res.json({});
//   //   }
//   //   else {
//   //     res.status(404).send("No code found");
//   //   }
//   // });
// })

module.exports = router; 