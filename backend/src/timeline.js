// Pulls detailed stats from the timeline for each player

const statInterface = {
    "kills15": "number",
    "killMap": [ ["x", "y", "time"] ],
    "soloKills": "number",
    "gankKills": "number", // Non-solo kills pre-15
    "deaths15": "number",
    "deathMap": [ ["x", "y", "time"] ],
    "soloDeaths": "number",
    "gankDeaths": "number", // Defined non-solo deaths pre-15
    "wardsPlaced15": "number",
    "wardsKilled15": "number",
    "firstItemTime": "number",
    "assists15": "number",
    "assistMap": [ ["x", "y", "time"] ],
    "CS10": "number",
    "CS20": "number",
    "CS30": "number",
    "CSD10": "number",
    "CSD20": "number",
    "CSD30": "number"
}

function getStats(timeline, playerRoles) {
    let stats = {}
    for (let i = 1; i <= 10; i ++) {
        stats[i] = {
            "kills15": 0,
            "killMap": [ ],
            "soloKills": 0,
            "gankKills": 0,
            "deaths15": 0,
            "deathMap": [ ],
            "soloDeaths": 0,
            "gankDeaths": 0,
            "wardsPlaced15": 0,
            "wardsKilled15": 0,
            "firstItemTime": 0,
            "assists15": 0,
            "assistMap": [ ],
            "CS10": 0,
            "CS20": 0,
            "CS30": 0,
            "CSD10": 0,
            "CSD20": 0,
            "CSD30": 0
        }
    }
    for (let frame of timeline.frames) {

        // Get CS
        for (let participant of Object.values(frame.participantFrames)) {
            if (frame.timestamp < 600000) {
                stats[participant.participantId].CS10 = participant.minionsKilled + participant.jungleMinionsKilled;
            }
            else if (frame.timestamp < 1200000) {
                stats[participant.participantId].CS20 = participant.minionsKilled + participant.jungleMinionsKilled;
            }
            else if (frame.timestamp < 1800000) {
                stats[participant.participantId].CS30 = participant.minionsKilled + participant.jungleMinionsKilled;
            }
        }

        // Get rest of stats -_-
        for (let event of frame.events) {
            switch (event.type) {
                case "WARD_PLACED":
                    // Watch out for shens moving their sword
                    if (event.wardType !== "UNDEFINED") {
                        if (event.timestamp < 900000) { // 15 min
                            stats[event.creatorId].wardsPlaced15 += 1;
                        }
                    }
                    break;
                case "WARD_KILL":
                    // No sneaky shens killing their sword here
                    if (event.timestamp < 900000) { // 15 min
                        stats[event.killerId].wardsKilled15 += 1;
                    }
                    break;
                case "CHAMPION_KILL":
                    if (event.timestamp < 900000) { // 15 min
                        // This is hilarious. I forgot people get exectued
                        // Sometimes the killer id is 0 which is obviously wrong. Participant ids are from 1-10
                        // So I'm assume killerId 0 means they got exectued. Happened surprisingly often in my test case games
                        if(event.killerId > 0) {
                            stats[event.killerId].kills15 += 1;
                        }
                        stats[event.victimId].deaths15 += 1;
                    }

                    if(event.killerId > 0) {
                        stats[event.killerId].killMap.push([event.position.x, event.position.y, event.timestamp]);
                    }

                    stats[event.victimId].deathMap.push([event.position.x, event.position.y, event.timestamp]);

                    if (event.assistingParticipantIds.length === 0) {
                        if(event.killerId > 0) {
                            stats[event.killerId].soloKills += 1;
                        }
                        stats[event.victimId].soloDeaths += 1;
                    }
                    else {
                        for(const id of event.assistingParticipantIds) {
                            stats[id].assistMap.push([event.position.x, event.position.y, event.timestamp]);
                            if (event.timestamp < 900000) { // 15 min
                                stats[id].assists15 += 1;

                                if(playerRoles[id] === "JUNGLE") {
                                    if(event.killerId > 0) {
                                        stats[event.killerId].gankKills += 1;
                                    }
                                    stats[event.victimId].gankDeaths += 1;
                                }
                            }
                        }
                    }
                    break;
                case "ITEM_PURCHASED":
                    if (event.timestamp > 180000) { // 3 min. Should be enought time to assume first item
                        if (stats[event.participantId].firstItemTime === 0) { // Hasn't been recorded yet
                            stats[event.participantId].firstItemTime = event.timestamp;
                        }
                    }
                default:
                    break;
            }
        }

    }
    for (let role of ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "SUPPORT"]) {
        const ids = getPlayerIdsOfRole(playerRoles, role);
        if (ids.length != 2) {
            continue;
        }
        stats[ids[0]].CSD10 = stats[ids[0]].CS10 - stats[ids[1]].CS10;
        stats[ids[1]].CSD10 = stats[ids[1]].CS10 - stats[ids[0]].CS10;

        stats[ids[0]].CSD20 = stats[ids[0]].CS20 - stats[ids[1]].CS20;
        stats[ids[1]].CSD20 = stats[ids[1]].CS20 - stats[ids[0]].CS20;

        stats[ids[0]].CSD30 = stats[ids[0]].CS30 - stats[ids[1]].CS30;
        stats[ids[1]].CSD30 = stats[ids[1]].CS30 - stats[ids[0]].CS30;
    }

    return stats;
}

function getPlayerIdsOfRole(playerRoles, role) {
    let ids = [];
    for (const key of Object.keys(playerRoles)) {
        if(playerRoles[key] === role) {
            ids.push(key);
        }
    }
    return ids;
}

// const fs = require('fs');
// const roles = require('./roles');
// let gameData = JSON.parse(fs.readFileSync('game.json'));
// let timeline = JSON.parse(fs.readFileSync('timeline.json'));
// console.log(getStats(timeline, roles.getRoles(gameData, timeline)));

module.exports = {
    getStats: getStats
}