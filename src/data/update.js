
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
        })
    });
})