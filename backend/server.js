//declare requirements
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const process = require('process');
const {argv} = require('yargs');
const compression = require('compression');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const draft = require('./src/draft');

//env variables from dotenv file


let envFile = ".env.development";
if (argv.prod) {
    process.env.NODE_ENV = 'production';
    envFile = ".env.production";
}
else if (argv.stg) {
    process.env.NODE_ENV = 'development';
    envFile = ".env.staging";
}
else {
    process.env.NODE_ENV = 'development';
}
require('dotenv').config({path: envFile});

//creates express server and port
const app = express();
const port = process.env.PORT || 8080;

//middleware

app.use(cors({
    origin: (origin, callback) => {
        if (process.env.WEBSITE_BASE.includes(origin))
            callback(null, origin)
        else {
            callback(null, "")
        }
    },
    credentials: true,
    // allowedHeaders: 'Content-Type,Authorization,auth',
}));
// app.use(cors({
//     origin: process.env.WEBSITE_BASE
// }));
//allows us to send/receive json
// app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());


app.use(compression())

// const uri = process.env.ATLAS_URI;
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

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
const seasonRouter = require('./routes/seasons');
const textualRouter = require('./routes/text');

app.use('/games', gamesRouter);
app.use('/teams', teamsRouter);
app.use('/stats', statsRouter);
app.use('/codes', codesRouter);
app.use('/draft', draftRouter);
app.use('/auth', authRouter);
app.use('/seasons', seasonRouter);
app.use('/textual', textualRouter);

app.route("/").get((req, res) => {
    res.status(200).send("Hello World").end();
})

//starts server
let server = http.createServer(app);
draft.setupSocket(server);
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
