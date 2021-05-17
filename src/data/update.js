
const fetch = require('node-fetch');
const fs = require('fs');

fetch("https://ddragon.leagueoflegends.com/api/versions.json").then(response => {
    response.json().then(data => {
        const version = data[0];
        const champ_url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
        console.log("Version: " + version);
        fetch(champ_url).then(response2 => {
            response2.json().then(champData => {
                fs.writeFileSync("src/data/champions.json", JSON.stringify(champData, undefined, 2));
                let newData = {};
                for (let key in champData["data"]) {
                    newData[champData["data"][key]["key"]] = key

                    if(!fs.existsSync(`src/images/champions/icons/${key}_0.png`)) {
                        fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${key}.png`).then(res => {
                            const dest = fs.createWriteStream(`src/images/champions/icons/${key}_0.png`);
                            res.body.pipe(dest);
                        });
                    }
                    if(!fs.existsSync(`src/images/champions/profile/${key}_0.jpg`)) {
                        fetch(`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${key}_0.jpg`).then(res => {
                            const dest = fs.createWriteStream(`src/images/champions/profile/${key}_0.jpg`);
                            res.body.pipe(dest);
                        });
                    }
                    if(!fs.existsSync(`src/images/champions/splash/${key}_0.jpg`)) {
                        fetch(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${key}_0.jpg`).then(res => {
                            const dest = fs.createWriteStream(`src/images/champions/splash/${key}_0.jpg`);
                            res.body.pipe(dest);
                        });
                    }
                }
                fs.writeFileSync("src/data/champions_map.json", JSON.stringify(newData, undefined, 2));
            });
        });

        const item_url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`;
        fetch(item_url).then(response3 => {
            response3.json().then(itemData => {
                fs.writeFileSync("src/data/items.json", JSON.stringify(itemData, undefined, 2));

                for (let key in itemData["data"]) {
                    if(!fs.existsSync(`src/images/items/${key}.png`)) {
                        fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${key}.png`).then(res => {
                            const dest = fs.createWriteStream(`src/images/items/${key}.png`);
                            res.body.pipe(dest);
                        });
                    }
                }
            })
        });

        const summoner_url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/summoner.json`;
        fetch(summoner_url).then(response4 => {
            response4.json().then(summonerData => {
                fs.writeFileSync("src/data/summoner.json", JSON.stringify(summonerData, undefined, 2));

                for (let key in summonerData["data"]) {
                    if(!fs.existsSync(`src/images/summoner/${key}.png`)) {
                        fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${key}.png`).then(res => {
                            const dest = fs.createWriteStream(`src/images/summoner/${summonerData["data"][key].key}.png`);
                            res.body.pipe(dest);
                        });
                    }
                }
            })
        })

        const runes_url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/runesReforged.json`;
        fetch(runes_url).then(response5 => {
            response5.json().then(runeData => {
                fs.writeFileSync("src/data/runes.json", JSON.stringify(runeData, undefined, 2));

                for (let style of runeData) {
                    for (let slot of style.slots) {
                        for (let rune of slot.runes) {
                            if(!fs.existsSync(`src/images/runes/${rune.id}.png`)) {
                                fetch(` https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`).then(res => {
                                    const dest = fs.createWriteStream(`src/images/runes/${rune.id}.png`);
                                    res.body.pipe(dest);
                                });
                            }
                        }
                    }
                }
            })
        })
    });
})