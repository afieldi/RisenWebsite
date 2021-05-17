const User = require('./models/user.model');

function blockAll(req, res, next, level) {
  if (req.cookies.auth) {
    User.findOne({
      auth: req.cookies.auth,
      expiry: { $gt: new Date() }
    }).then(user => {
      if (user) {
        if (user.level <= level) {
          next();
        }
        else {
          res.status(403).json("Denied");
        }
      }
      else {
        res.status(403).json("Denied");
      }
    }).catch(err => {
      res.status(500).json("Something went wrong");
    })
  }
  else {
    res.status(403).json("Denied");
  }
}

function blockNotGet(req, res, next, level) {
  if (req.method === "GET") {
    next();
  }
  else {
    blockAll(req, res, next, level);
  }
}

function blockNone(req, res, next, level) {
  next();
}

module.exports = {
  blockAll: blockAll,
  blockNotGet: blockNotGet,
  blockNone: blockNone
}