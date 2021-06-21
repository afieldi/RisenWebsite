const mongoose = require('mongoose');
const GamesModel = require('./models/game.model');
const PlayerModel = require('./models/player.model');
const TeamGameModel = require('./models/teamgame.model');

const uri = "mongodb+srv://admin:letmeinplease@cluster0.bwvsn.mongodb.net/prod?retryWrites=true&w=majority";
// const uri = "mongodb+srv://admin:letmeinplease@cluster0.bwvsn.mongodb.net/newdb?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
  doStuff();
});

const names = [
  "4000 IQ",
  "Boblaz",
  "Earleking",
  "Eliyss",
  "Grªnt",
  "HolySpartan",
  "Koality Player",
  "LeeSinners",
  "PerkyTheParrot",
  'rgrou2',
  "ShadyGecko",
  'SushiMunster',
  'Usman899',
  'Vexrax'
]

async function doStuff() {
  // let pId = [];
  // for (let name of names) {
  //   pId.push((await PlayerModel.findOne({name: name}))._id.toString());
  // }
  // GamesModel.find().then(async games => {
  //   let gids = {};
  //   for (let game of games) {
  //     if (pId.includes(game.player.toString())) {
  //       // game.season = mongoose.Types.ObjectId('5ff262fecf12b2000af44840');
  //       // game.save()
  //       gids[String(game.gameId)] = game.gameId;
  //     }
  //     else {
  //       // game.season = mongoose.Types.ObjectId('5ff39c25f7bcaa000ad83f3a');
  //       // game.save();
  //     }
  //   }
  //   let gida = Object.values(gids);
  //   TeamGameModel.find().then(tgs => {
  //     for (let tg of tgs) {
  //       if (gida.includes(tg.gameId)) {
  //         tg.season = mongoose.Types.ObjectId('5ff262fecf12b2000af44840');
  //         tg.save();
  //       }
  //       else {
  //         tg.season = mongoose.Types.ObjectId('5ff39c25f7bcaa000ad83f3a');
  //         tg.save();
  //       }
  //     }
  //   })
  //   console.log("done");
  // });
  PlayerModel.find().then(async players => {
    for (let p of players) {
      p.searchName = p.name.toLowerCase().replace(/\s/g, '');
      p.save();
    }
  })
}