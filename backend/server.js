//declare requirements
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const {argv} = require('yargs');

const draft = require('./src/draft');


//env variables from dotenv file

let envFile = ".env.development";
if (argv.prod) {
    envFile = ".env.production";
}
require('dotenv').config({path: envFile});

//creates express server and port
const app = express();
const port = process.env.PORT || 8080;

//middleware
app.use(cors());
//allows us to send/receive json
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose
    .connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
/*    .then(() => console.log( 'Database Connected' ))
    .catch(err => console.log( err ));*/
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

//declare require and use of every route
const teamsRouter = require('./routes/teams');
const statsRouter = require('./routes/stats');
const gamesRouter = require('./routes/games');
const codesRouter = require('./routes/codes');
const draftRouter = require('./routes/draft');
const authRouter = require('./routes/auth');

app.use('/games', gamesRouter);
app.use('/teams', teamsRouter);
app.use('/stats', statsRouter);
app.use('/codes', codesRouter);
app.use('/draft', draftRouter);
app.use('/auth', authRouter);

app.route("/").get((req, res) => {
    res.status(200).send("Hello World").end();
})

//starts server
let server = http.createServer(app);
draft.setupSocket(server);
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
