import React, {Component} from 'react';
import { customRound } from '../../Helpers';
import { Button, Dropdown, Container } from "react-bootstrap";
import $ from 'jquery';

let champMap = require('../../data/champions_map.json')

export default class BasicStats extends Component {

    constructor(props) {
        super(props);
        this.filteredData = [];
        this.accumulatedStats = {};
        this.state = {
            playerName: this.props.player,
            statData: this.props.playerData,
            accumulatedStats: this.props.accStats,
            filteredData: [],
            compData: [],
            gameDataOptions: {
              "Champion": {shown: true, fnc: game => champMap[game["championId"]]},
              "Game Duration": {shown: false, fnc: game => game["gameDuration"]},
              "Win": {shown: true, fnc: game => game["win"] ? "WIN" : "LOSS"},
              "Team": {shown: false, fnc: game => game["teamId"] == 100 ? "BLUE" : "RED"},
              "Kills": {shown: true, fnc: game => game["kills"]},
              "Deaths": {shown: true, fnc: game => game["deaths"]},
              "Assists": {shown: true, fnc: game => game["assists"]},
              "Level": {shown: false, fnc: game => game["champLevel"]},
              "Gold": {shown: false, fnc: game => game["goldEarned"]},
              "Minions": {shown: false, fnc: game => game["totalMinionsKilled"]},
              "Jungle Creeps": {shown: false, fnc: game => game["neutralMinionsKilled"]},
              "Team Jungle": {shown: false, fnc: game => game["neutralMinionsKilledTeamJungle"]},
              "Enemy Jungle": {shown: false, fnc: game => game["neutralMinionsKilledEnemyJungle"]},
              "Physical Damage": {shown: false, fnc: game => game["physicalDamageDealtToChampions"]},
              "Magic Damage": {shown: false, fnc: game => game["magicDamageDealtToChampions"]},
              "True Damage": {shown: false, fnc: game => game["trueDamageDealtToChampions"]},
              "Damage": {shown: false, fnc: game => game["totalDamageDealtToChampions"]},
              "Physical Taken": {shown: false, fnc: game => game["physicalDamageTaken"]},
              "Magic Taken": {shown: false, fnc: game => game["magicalDamageTaken"]},
              "True Taken": {shown: false, fnc: game => game["trueDamageTaken"]},
              "Damage Taken": {shown: false, fnc: game => game["totalDamageTaken"]},
              "Dmg to Objs": {shown: false, fnc: game => game["damageDealtToObjectives"]},
              "Dmg Mitigated": {shown: false, fnc: game => game["damageSelfMitigated"]},
              "Healing": {shown: false, fnc: game => game["totalHeal"]},
              "Vision": {shown: false, fnc: game => game["visionScore"]},
              "Wards Killed": {shown: false, fnc: game => game["wardsKilled"]},
              "Pinks Bought": {shown: false, fnc: game => game["visionWardsBoughtInGame"]},
              "First Blood": {shown: false, fnc: game => game["firstBloodKill"] ? "TRUE" : "FALSE"},
              "FB Assist": {shown: false, fnc: game => game["firstBloodAssist"] ? "TRUE" : "FALSE"},
              "First Tower": {shown: false, fnc: game => game["firstTowerKill"] ? "TRUE" : "FALSE"},
              "FT Assist": {shown: false, fnc: game => game["firstTowerAssist"] ? "TRUE" : "FALSE"},
              "Turrets": {shown: false, fnc: game => game["turretKills"]},
              "Double Kills": {shown: false, fnc: game => game["doubleKills"]},
              "Triple Kills": {shown: false, fnc: game => game["tripleKills"]},
              "Quadra Kills": {shown: false, fnc: game => game["quadraKills"]},
              "Penta Kills": {shown: false, fnc: game => game["pentaKills"]},
              "CSD@10": {shown: false, fnc: game => customRound(game["csDiff10"], 0)},
              "CSD@20": {shown: false, fnc: game => customRound(game["csDiff10"] + game["csDiff20"], 0)},
              "CSD@30": {shown: false, fnc: game => customRound(game["csDiff10"] + game["csDiff20"] + game["csDiff30"], 0)},
              "Lane": {shown: false, fnc: game => game["lane"]},
              "Dmg/Gold": {shown: true, fnc: game => customRound(game["damagePerGold"])}
            }
        }
        this.loadCompareData(this.props.player);
    }

    shouldComponentUpdate(newProps, newState) {
        this.filteredData = newProps.playerData;
        this.computeAccStats();
        return true;
    }

    computeAccStats() {
        let wins = 0;
        let kills = 0, deaths = 0, assists = 0;
        let cs = 0, min = 0;
        this.accumulatedStats = {
            "wr": 0,
            "games": 0,
            "kda": 0,
            "cs": 0
        };
        for (let datum of this.filteredData) {
          this.accumulatedStats["games"] += 1;
          if (datum["win"]) {
            wins += 1;
          }
          kills += datum["kills"];
          deaths += datum["deaths"];
          assists += datum["assists"];
          cs += datum["totalMinionsKilled"];
          min += datum["gameDuration"] / 60
        }

        this.accumulatedStats["wr"] = customRound((wins / this.accumulatedStats["games"]) * 100, 2);
        this.accumulatedStats["kda"] = customRound((kills + assists) / deaths, 1);
        this.accumulatedStats["cs"] = customRound(cs / min, 1);
    }

    loadCompareData(playerName) {
        let url = process.env.REACT_APP_BASE_URL + "/stats/player/name/" + playerName + "/agg"
        fetch(url).then((data) => {
          if (data.status != 200) {
            alert("Could not find summoner!");
            return;
          }
          data.json().then(jsonData => {
            const playerData = jsonData[0];
            const newData = {}

            newData["Name"] = playerData._id.player;
            newData["Kills"] = customRound(playerData["avg_kills"]);
            newData["Deaths"] = customRound(playerData["avg_deaths"]);
            newData["Assists"] = customRound(playerData["avg_assists"]);
            newData["KDA"] = customRound((newData["Kills"] + newData["Assists"]) / newData["Deaths"])
            newData["Gold"] = customRound(playerData["avg_gold"]);
            newData["CS"] = customRound(playerData["avg_cs"]);
            newData["Damage Dealt"] = customRound(playerData["avg_damage"]);
            newData["Damage Taken"] = customRound(playerData["avg_damage_taken"]);
            newData["Game Time"] = customRound(playerData["avg_duration"] / 60) + " min";
            newData["Damage/Gold"] = customRound(playerData["avg_dpg"]);
            newData["Vision"] = customRound(playerData["avg_vision"]);
            newData["Wards killed"] = customRound(playerData["avg_wards_killed"]);
            newData["Win Rate"] = customRound((playerData["wins"] / playerData["total_games"]) * 100) + "%";


            this.setState({
              compData: this.state.compData.concat(newData)
            });
          });
        }, (error) => {
          alert("Could not find summoner!");
        })
      }

      // This is an intermediate function so that loadCompareData can be kept general
      loadCompareDataFromSearch() {
        this.loadCompareData(document.getElementById("playerName").value);
      }

    componentDidMount() {
        const where = this;
        $('#optionsDropDownLink').on('click', function(event) {
          $('#optionsDropDownMenu').slideToggle();
          event.stopPropagation();
        });

        $('#optionsDropDownMenu').on('click', function(event) {
          event.stopPropagation();
        });

        $('.dropdown-option').on('click', function(event) {
          where.handleGameCheck(event.target.getAttribute("name"));
        })

        $(window).on('click', function() {
          $('#optionsDropDownMenu').slideUp();
        });

        // $('[data-toggle="tooltip"]').tooltip()
    }

    removePlayerCompare(i) {
        this.state.compData.splice(i, 1);
        this.setState({
            compData: this.state.compData
        });
    }

    handleGameCheck(option) {
        // let tempOptions = this.state.gameDataOptions;
        this.state.gameDataOptions[option].shown = !this.state.gameDataOptions[option].shown;

        // Just reload the state
        this.setState({})
    }

    render() {
        return (
            <section>
                <Container>
                    <div className="row">
                        <div className="col">
                            <div className="risen-stats-block">
                                <div className="risen-stats-header"><h3>General Stats</h3></div>
                                {/* <hr></hr> */}
                                <div className="risen-stats-body">
                                    <div className="row">
                                        <div className="col-sm">
                                            <div className="center">{this.accumulatedStats["wr"]}%</div>
                                            <div className="center risen-sub-label">Winrate</div>
                                        </div>
                                        <div className="col-sm">
                                            <div className="center">{this.accumulatedStats["kda"]}</div>
                                            <div className="center risen-sub-label">KDA</div>
                                        </div>
                                        <div className="col-sm">
                                            <div className="center">{this.accumulatedStats["cs"]}</div>
                                            <div className="center risen-sub-label">CS/Min</div>
                                        </div>
                                        <div className="col-sm">
                                            <div className="center">{this.accumulatedStats["games"]}</div>
                                            <div className="center risen-sub-label">Games</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>

                        {/* Advanced game by game */}
                    <div className="row">
                        <div className="col-md">
                            <div className="risen-stats-block">
                                <div className="risen-stats-header">
                                    <div className="row">
                                        <div className="col" style={verticalCenter}>
                                            <h3>Game Stats</h3>
                                        </div>
                                        <div className="col-4">
                                            <div className="btn-group" style={{float: 'right'}}>
                                                <Dropdown>
                                                    <Button className="dropdown-toggle select-cols-dropdown-btn" id="optionsDropDownLink" data-toggle="dropdown">Select Columns</Button>
                                                    <div className="dropdown-menu" id="optionsDropDownMenu" style={gameDataDropDown} aria-labelledby="optionsDropDownLink">
                                                        {
                                                            Object.keys(this.state.gameDataOptions).map((option, index) => {
                                                            return (
                                                                <div key={"gameOption" + index}
                                                                className={"dropdown-option clickable " + (this.state.gameDataOptions[option].shown ? "bg-dark text-light" : "bg-light text-dark")} name={option}>{option}</div>
                                                            )
                                                            })
                                                        }
                                                    </div>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="risen-stats-body" style={{overflow: 'scroll', maxHeight: '500px'}}>
                                    <table className="table risen-table table-striped">
                                    <thead>
                                        <tr>
                                        {
                                            Object.keys(this.state.gameDataOptions).map((key, index) => {
                                            if (this.state.gameDataOptions[key].shown) {
                                                return (
                                                <th key={index}>{key}</th>
                                                )
                                            }
                                            else {
                                                return;
                                            }
                                            })
                                        }

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        this.filteredData.map((datum, index) => {
                                            return (
                                            <tr key={"gameStatRow" + index}>
                                                {
                                                Object.keys(this.state.gameDataOptions).map((key, index2) => {
                                                    if (this.state.gameDataOptions[key].shown) {
                                                    return (
                                                        <td key={"gameStatData" + index2}>{this.state.gameDataOptions[key].fnc(datum)}</td>
                                                    )
                                                    }
                                                    else {
                                                    return;
                                                    }
                                                })
                                                }

                                            </tr>
                                            );
                                        })
                                        }
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-md-4">
                            <div className="risen-stats-block">
                                <div className="risen-stats-header"><h3>Best Champs</h3></div>
                                <div className="risen-stats-body">Coming Soon</div>
                            </div>
                        </div> */}
                    </div>

                    {/* Detailed overall stats */}
                    <div className="row">
                        <div className="col">
                            <div className="risen-stats-block">
                                <div className="risen-stats-header">
                                    <h3>Compare Stats</h3>
                                </div>
                                <div className="risen-stats-body" style={{paddingTop: '0'}}>
                                    <div className="row">
                                        <div className="col-lg-4" style={verticalCenter}>
                                            <input id="playerName" placeholder="Summoner Name"></input>
                                        </div>
                                        <div className="col-lg-8">
                                            <Button onClick={this.loadCompareDataFromSearch.bind(this)} className="btn search-for-player-button">Search For Player</Button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <table className="table table-responsive-md table-sm risen-table table-striped ">
                                            <tbody>
                                                {
                                                    // Check to ensure comp data has length. It will once data for the player loads in
                                                    //   as the #0 spot will be the players.
                                                    this.state.compData.length ?
                                                    Object.keys(this.state.compData[0]).map((key, index) => {
                                                        return (
                                                            <tr key={"CompDataRow" + index}>
                                                            <td><b>{key}</b></td>
                                                            {
                                                                this.state.compData.map((player, index2) => {
                                                                    // I really should just make this a new component
                                                                    if (index2 > 0 && key === "Name") {
                                                                        return (
                                                                            <td key={index2 + "compData"}>{player[key]} <Button onClick={(()=> {this.removePlayerCompare(index2)}).bind(this)}>X</Button></td>
                                                                        )
                                                                    }
                                                                    else {
                                                                        return (
                                                                            <td key={index2 + "compData"}>{player[key]}</td>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                            </tr>
                                                        )
                                                    }) : (<tr></tr>)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        );
    }
}

const gameDataDropDown = {
    maxHeight: '500px',
    overflow: 'auto'
}

const verticalCenter = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
}
