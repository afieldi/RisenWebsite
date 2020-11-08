// Just used to fill in data so I don't have to regather it
const mongoose = require('mongoose');
const GameModel = require('./models/game.model');

let envFile = ".env.development";
require('dotenv').config({path: envFile});

const uri = process.env.ATLAS_URI;
mongoose
    .connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
/*    .then(() => console.log( 'Database Connected' ))
    .catch(err => console.log( err ));*/
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
  GameModel.find().then(games => {
      fillGolds(games);
  })
});

function fillWards(games) {
    for (let game of games) {
        game.wardsPlaced = Math.round(Math.random() * 15)
        game.save().then(() => {console.log("saved")});
    }
    console.log("Done");
}

function fillGolds(games) {
    for (let game of games) {
        // game.goldGen10 = (Math.round(Math.random() * 200) - 100) + 400;
        // game.goldGen20 = (Math.round(Math.random() * 200) - 100) + 400;
        // game.goldGen30 = (Math.round(Math.random() * 200) - 100) + 400;
        // game.xpGen10 = (Math.round(Math.random() * 200) - 100) + 400;
        // game.xpGen20 = (Math.round(Math.random() * 200) - 100) + 400;
        // game.xpGen30 = (Math.round(Math.random() * 200) - 100) + 400;
        // game.csGen10 = (Math.round(Math.random() * 3) - 1.5) + 6;
        game.csGen20 = (Math.round(Math.random() * 3) - 1.5) + 6;
        game.csGen30 = (Math.round(Math.random() * 3) - 1.5) + 6;
        game.save().then(() => {console.log("saved")});
    }
}

function checkWards(games) {
    for (let game of games) {
        console.log(game.wardsPlaced);
    }
}