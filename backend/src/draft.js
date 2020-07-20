const Draft = require('../models/draft.model');

const uuid = require('uuid');
const socketIo = require('socket.io');

function generateNewDraft(config, callback = (draft) => {}) {
    Draft.create({
        gameLink: uuid.v4(),
        blueName: config.blueName,
        blueAuth: uuid.v4(),
        redName: config.redName,
        redAuth: uuid.v4(),
        time: config.time,
        backtrack: config.backtrack,
        ruleset: config.useRisen ? "RISEN" : "NORMAL",
        redPicks: [],
        redBans: [],
        bluePicks: [],
        blueBans: []
    }).then(draft => {
        callback(draft);
    });
}

function setupSocket(server) {
    let io = socketIo(server, { path: "/draft/connect", origins: "*:*" });
    io.on('connection', (socket) => {
        handleSocketConnection(socket);
        console.log("connected");
    });
}

function handleSocketConnection(socket) {
    socket.on('auth', (args) => {
        if(args.length !== 1) {
            socket.emit("keyError");
            return;
        }
        let auth = args[0];
        console.log(auth);
    })
}

module.exports = {
    generateNewDraft: generateNewDraft,
    setupSocket: setupSocket
}