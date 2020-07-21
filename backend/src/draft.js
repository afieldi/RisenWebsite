const Draft = require('../models/draft.model');

const uuid = require('uuid');
const socketIo = require('socket.io');

let gameGroups = {}

function generateNewDraft(config, callback = (draft) => {}) {
    console.log(config);
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
        blueBans: [],
        stage: 0
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
    socket.on('game', (game, auth) => {
        Draft.findOne({gameLink: game}).then(draft => {
            if (draft != null) {
                if (gameGroups[game] === undefined) {
                    gameGroups[game] = {
                        redCap: [],
                        blueCap: [],
                        spec: [],
                        redReady: false,
                        blueReady: false,
                        draft: draft
                    };
                    
                }
                if(auth === draft.redAuth) {
                    gameGroups[game].redCap.push(socket);
                    handleGame(socket, gameGroups[game].draft, 1);
                }
                else if(auth === draft.blueAuth) {
                    gameGroups[game].blueCap.push(socket);
                    handleGame(socket, gameGroups[game].draft, 0);
                }
                else if (auth === undefined) {
                    gameGroups[game].spec.push(socket);
                    socket.emit("draftUpdate", draft);
                }
                else {
                    socket.emit("keyError")
                }
            }
            else {
                socket.emit("keyError")
            }
        });
    });
}

function handleGame(socket, draft, side) {
    // Side is 0 == blue, 1 == red
    const readyState = side === 0 ? gameGroups[draft.gameLink].blueReady : gameGroups[draft.gameLink].redReady;
    socket.emit('drafting', readyState);
    socket.emit('draftUpdate', draft);

    socket.on('draftReady', () => {
        if (side == 0) {
            gameGroups[draft.gameLink].blueReady = true
        }
        else if (side == 1) {
            gameGroups[draft.gameLink].redReady = true
        }

        if (gameGroups[draft.gameLink].redReady === true &&
            gameGroups[draft.gameLink].blueReady === true) {
            draft.save();
            sendPick(draft);
        }
        socket.emit('drafting', true);
    });

    socket.on('picked', (champ) => {
        console.log("got pick: " + champ);
        draft.stage += 1;
        addPick(champ, draft);
        draft.save();
        sendUpdate(draft);
        if(draft.stage < 20) {
            sendPick(draft);
        }
        else {
            endDraft(draft);
        }
    });
    
    socket.on('hovered', (champ) => {
        console.log("Pick: " + champ + " was hovered")
        // Create copy so you can add the hovered champ, send the new draft and discard
        let draftCopy = JSON.parse(JSON.stringify(draft));
        draftCopy.stage += 1;
        addPick(champ, draftCopy);
        sendUpdate(draftCopy);
    });

    if (gameGroups[draft.gameLink].blueReady === true &&
        gameGroups[draft.gameLink].redReady === true) {
        // Draft in progress
        sendPick(draft)
    }

}

function endDraft(draft) {
    for (let s of gameGroups[draft.gameLink].blueCap) {
        s.disconnect(true);
    }
    for (let s of gameGroups[draft.gameLink].redCap) {
        s.disconnect(true);
    }
    for (let s of gameGroups[draft.gameLink].spec) {
        s.disconnect(true);
    }
    delete gameGroups[draft.gameLink];
}

function sendUpdate(draft) {
    for (let s of gameGroups[draft.gameLink].blueCap) {
        s.emit('draftUpdate', draft);
    }
    for (let s of gameGroups[draft.gameLink].redCap) {
        console.log("sending update");
        s.emit('draftUpdate', draft);
    }
    for (let s of gameGroups[draft.gameLink].spec) {
        s.emit('draftUpdate', draft);
    }
}

function sendPick(draft) {
    const side = getSide(+draft.stage + 1);
    let capSockets = side === 0 ? gameGroups[draft.gameLink].blueCap : gameGroups[draft.gameLink].redCap;
    for (let s of capSockets) {
        try {
            // s.emit('keyError');
            console.log("Sending pick")
            // console.log(s);
            s.emit('pickStart', +draft.stage + 1, draft.time);
        } catch (error) { console.log(error) }
    }
    // socket.emit("draftUpdate", draft);
}

function addPick(pick, draft) {
    const blueBans = [1,3,5,14,16];
    const redBans = [2,4,6,13,15];
    const bluePicks = [7,10,11,18,19];
    const redPicks = [8,9,12,17,20];
    if (blueBans.includes(+draft.stage)) {
        draft.blueBans.push(pick);
    }
    else if (redBans.includes(+draft.stage)) {
        draft.redBans.push(pick);
    }
    else if (bluePicks.includes(+draft.stage)) {
        draft.bluePicks.push(pick);
    }
    else if (redPicks.includes(+draft.stage)) {
        draft.redPicks.push(pick);
    }
    else {
        console.log("failed to add champ as pick");
    }
}

function getSide(pick) {
    const blue = [1,3,5,14,16,7,10,11,18,19];
    if(blue.includes(pick)) {
        return 0;
    }
    return 1;
}

module.exports = {
    generateNewDraft: generateNewDraft,
    setupSocket: setupSocket
}