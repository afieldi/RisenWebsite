//declare requirements
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//env variables from dotenv file
require('dotenv').config();

//creates express server and port
const app = express();
const port = process.env.PORT || 5000;

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

app.use('/games', gamesRouter);	
app.use('/teams', teamsRouter);
app.use('/stats', statsRouter);

//starts server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
