const Draft = require('../models/draft.model');

const uuid = require('uuid');
const socketIo = require('socket.io');

let gameGroups = {}

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
        blueBans: [],
        stage: 0 // Hasn't started yet
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
                        redPickTime: 0,
                        bluePickTime: 0,
                        draft: draft,
                        curTime: 0
                    };
                    setTimeout(() => {
                        // Kill draft after 1 hour to prevent memory hogging.
                        try {
                            endDraft(draft.gameLink);
                        } catch (error) { }
                    }, 1000 * 3600);
                }
                if (draft.stage >= 20) {
                    socket.emit("draftUpdate", draft);
                }
                else if(auth === draft.redAuth) {
                    gameGroups[game].redCap.push(socket);
                    handleGame(socket, gameGroups[game].draft, 1);
                }
                else if(auth === draft.blueAuth) {
                    gameGroups[game].blueCap.push(socket);
                    handleGame(socket, gameGroups[game].draft, 0);
                }
                else if (auth === undefined || auth === null) {
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

            // Should only be hit once per draft
            gameGroups[draft.gameLink].curTime = +draft.time;
            sendPick(draft);
            sendUpdate(draft);

            for (let socket of gameGroups[draft.gameLink].blueCap) {
                socket.emit('drafting', 2);
            }
            for (let socket of gameGroups[draft.gameLink].redCap) {
                socket.emit('drafting', 2);
            }
        }
        else {
            socket.emit('drafting', 1);
        }
    });

    socket.on('picked', (champ, round) => {
        if(round === +draft.stage + 1) {
            handleChampPicked(champ, draft);
        }
    });
    
    socket.on('hovered', (champ, round) => {
        if(round === +draft.stage + 1) {
            // Create copy so you can add the hovered champ, send the new draft and discard
            let draftCopy = JSON.parse(JSON.stringify(draft));

            // This is a hover so we don't actually want to progress a stage
            // So we just add one and subtract so we can reuse the addPick function
            draftCopy.stage += 1;
            addPick(champ, draftCopy);
            draftCopy.stage -= 1;
            sendUpdate(draftCopy);
        }
    });

    if (gameGroups[draft.gameLink].blueReady === true &&
        gameGroups[draft.gameLink].redReady === true) {
        // Draft in progress
        socket.emit('drafting', 2);
        sendPick(draft);
        sendUpdate(draft);
    }
}

function handleDisconnect() {

}

function handleChampPicked(champ, draft) {
    console.log("got pick: " + champ);
    draft.stage += 1;
    addPick(champ, draft);
    draft.save();
    gameGroups[draft.gameLink].curTime = +draft.time;

    let draftCopy = JSON.parse(JSON.stringify(draft));
    // draftCopy.stage += 1;
    sendUpdate(draftCopy);
    
    if(draft.stage < 20) {
        sendPick(draft);
    }
    else {
        endDraft(draft.gameLink);
    }
}

function endDraft(gameLink) {
    // Handle cleanup here
    try {
        clearTimeout(gameGroups[draft.gameLink].bluePickTime);
        clearTimeout(gameGroups[draft.gameLink].redPickTime);
    } catch (error) { }

    for (let s of gameGroups[gameLink].blueCap) {
        s.disconnect(true);
    }
    for (let s of gameGroups[gameLink].redCap) {
        s.disconnect(true);
    }
    for (let s of gameGroups[gameLink].spec) {
        s.disconnect(true);
    }
    delete gameGroups[gameLink];
}

function sendUpdate(draft) {
    for (let s of gameGroups[draft.gameLink].blueCap) {
        s.emit('draftUpdate', draft, gameGroups[draft.gameLink].curTime);
    }
    for (let s of gameGroups[draft.gameLink].redCap) {
        s.emit('draftUpdate', draft, gameGroups[draft.gameLink].curTime);
    }
    for (let s of gameGroups[draft.gameLink].spec) {
        s.emit('draftUpdate', draft, gameGroups[draft.gameLink].curTime);
    }
}

function sendPick(draft) {
    const side = getSide(+draft.stage + 1);
    let capSockets = side === 0 ? gameGroups[draft.gameLink].blueCap : gameGroups[draft.gameLink].redCap;
    for (let s of capSockets) {
        try {
            s.emit('pickStart', +draft.stage + 1, gameGroups[draft.gameLink].curTime);
        } catch (error) { console.log(error) }
    }

    handleCountDown(draft); // Just emulating rito's client hehe
}

function handleCountDown(draft) {
    
    const timeout = setTimeout(() => {
        // Due to syncronization issues, this still tries to run even after endDraft() is called
        // So either I can debug that, or I canthrow this in a try catch,
        //  and I'm not getting paid enough to debug my own garbage
        try {
            if (gameGroups[draft.gameLink].curTime === 0) {
                stopPick(draft);
                handleChampPicked("Risen", draft);
            }
            else {
                gameGroups[draft.gameLink].curTime -= 1;
                handleCountDown(draft);
            }
        } catch (error) {}
    }, 1000);

    try {
        clearTimeout(gameGroups[draft.gameLink].bluePickTime);
        clearTimeout(gameGroups[draft.gameLink].redPickTime);
    } catch (error) { }

    const side = getSide(+draft.stage + 1);
    
    if (side === 0) {
        gameGroups[draft.gameLink].bluePickTime = timeout
    }
    else {
        gameGroups[draft.gameLink].redPickTime = timeout
    }
}

function stopPick(draft) {
    const side = getSide(+draft.stage + 1);
    let capSockets = side === 1 ? gameGroups[draft.gameLink].blueCap : gameGroups[draft.gameLink].redCap;
    for (let s of capSockets) {
        try {
            s.emit('pickEnd');
        } catch (error) { console.log(error) }
    }
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