// This entire file is dedicated to determining what role a player is playing based on timeline data
// it just uses timeline data and doesn't take into account the champion a player is playing. Not sure if it shoud

function getRoles(gameData, timeline) {
    const positions = loadXYPositons(timeline);
    const supportIds = getSupports(gameData);
    let roles = {}

    for (let id of supportIds) {
        roles[id] = "SUPPORT";
        delete positions[id];
    }

    for (let role of ["TOP", "BOTTOM", "MIDDLE", "JUNGLE"]) {
        for (let x = 0; x < 2; x ++) {
            const keys = Object.keys(positions);
            let largest = [0, -1]; // [id, count]
            for (let key of keys) {
                if (positions[key][role] > largest[1]) {
                    largest[0] = key;
                    largest[1] = positions[key][role];
                }
            }
            roles[largest[0]] = role;
            delete positions[largest[0]];
        }
    }

    return roles;
}

// Just find the lowest CS numbers on each team
function getSupports(gameData) {
    let t1Lowest = [-1, 9999], t2Lowest = [-1, 9999];
    for (let participant of gameData.participants) {
        let totalCS = participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled;
        if(participant.teamId === 100) {
            if(totalCS < t1Lowest[1]) {
                t1Lowest = [participant.participantId, totalCS];
            }
        }
        if(participant.teamId === 200) {
            if(totalCS < t2Lowest[1]) {
                t2Lowest = [participant.participantId, totalCS];
            }
        }
    }
    return [t1Lowest[0], t2Lowest[0]];
}


// Simple function that looks at x/y positions and makes inferences of your role
function loadXYPositons(timeline) {
    const sampleSize = 10
    let positions = {
        // Included as example of what it may look like
        1: {
            "TOP": 0,
            "JUNGLE": 0,
            "MIDDLE": 0,
            "BOTTOM": 0,
        }
    }

    function addToPos(posDict, participant, position) {
        if(!posDict[participant]) {
            posDict[participant] = {
                "TOP": 0,
                "JUNGLE": 0,
                "MIDDLE": 0,
                "BOTTOM": 0,
            };
        }
        if(!posDict[participant][position]) {
            posDict[participant][position] = 0;
        }
        posDict[participant][position] += 1;
    }

    // Start at 3
    // This removes time at 0, spawn
    //  time at 1, invade/5-point
    //  time at 2, late leash
    // Look for 10 data points, till 13 min
    for (let i = 3; i < 3 + sampleSize; i ++) {
        let frame = timeline.frames[i];
        for (let player of Object.values(frame.participantFrames)) {
            if (player.position.y > 10000) {
                addToPos(positions, player.participantId, "TOP");
            }
            else if (player.position.y < 3500) {
                addToPos(positions, player.participantId, "BOTTOM");
            }
            else if (Math.abs(player.position.x / player.position.y) - 1 < .1) {
                addToPos(positions, player.participantId, "MIDDLE");
            }
            else {
                addToPos(positions, player.participantId, "JUNGLE");
            }
        }
    }

    for (let participantId in positions) {
        for (let pos in positions[participantId]) {
            positions[participantId][pos] = positions[participantId][pos] / sampleSize;
        }
    }
    return positions;
}

// const fs = require('fs');
// let gameData = JSON.parse(fs.readFileSync('game.json'));
// let timeline = JSON.parse(fs.readFileSync('timeline.json'));
// console.log(getRoles(gameData, timeline));

module.exports = {
    getRoles: getRoles
};