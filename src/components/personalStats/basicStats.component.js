import React, {Component} from 'react';
import { customRound } from '../../Helpers';
import { Button, Dropdown } from "react-bootstrap";
import $ from 'jquery';

let champMap = require('../../data/champions_map.json')

export default class BasicStats extends Component {

    constructor(props) {
        super(props);
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
    
    
    componentDidUpdate() {

        if (this.state.statData.length === 0 && this.props.playerData.length !== 0) {
            this.setState({
                statData: this.props.playerData,
                filteredData: JSON.parse(JSON.stringify(this.props.playerData))
            });
        }
        if (Object.keys(this.state.accumulatedStats).length === 0 && Object.keys(this.props.accStats).length !== 0) {
            this.setState({
                accumulatedStats: this.props.accStats,
            });
        }
    }

    loadCompareData(playerName) {
        let url = "http://localhost:5000/stats/player/name/" + playerName + "/agg"
        fetch(url).then((data) => {
          if (data.status != 200) {
            // alert("Could not find summoner!");
            return;
          }
          data.json().then(jsonData => {
            const playerData = jsonData[0];
            const newData = {}
    
            newData["Name"] = playerData._id.player[0];
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
        $('.dropdown-toggle').on('click', function(event) {
          $('.dropdown-menu').slideToggle();
          event.stopPropagation();
        });
      
        $('.dropdown-menu').on('click', function(event) {
          event.stopPropagation();
        });
    
        $('.dropdown-option').on('click', function(event) {
          where.handleGameCheck(event.target.getAttribute("name"));
        })
      
        $(window).on('click', function() {
          $('.dropdown-menu').slideUp();
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
                <div className="row">
                    <div className="col">
                        <div className="risen-stats-block">
                        <div className="risen-stats-header"><h1>{this.state.playerName}</h1></div>
                        <div className="risen-stats-body">
                            <div className="row">
                            <div className="col-sm">
                                <div className="center">{this.state.accumulatedStats["wr"]}%</div>
                                <div className="center risen-sub-label">Winrate</div>
                            </div>
                            <div className="col-sm">
                                <div className="center">{this.state.accumulatedStats["kda"]}</div>
                                <div className="center risen-sub-label">KDA</div>
                            </div>
                            <div className="col-sm">
                                <div className="center">{this.state.accumulatedStats["cs"]}</div>
                                <div className="center risen-sub-label">CS/Min</div>
                            </div>
                            <div className="col-sm">
                                <div className="center">{this.state.accumulatedStats["games"]}</div>
                                <div className="center risen-sub-label">Games</div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* Advanced game by game */}
                    <div className="row">
                        <div className="col-md-8">
                            <div className="risen-stats-block">
                            <div className="risen-stats-header">
                                <div className="row">
                                    <div className="col">
                                    <h3>Game Stats</h3>
                                    </div>
                                    <div className="col-3">
                                    <Dropdown>
                                        <Button className="dropdown-toggle risen-button" data-toggle="dropdown">STATS</Button>
                                        <div className="dropdown-menu" style={gameDataDropDown}>
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
                            <div className="risen-stats-body" style={{overflow: 'scroll'}}>
                                <table className="table risen-table .table-responsive .table-striped">
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
                                    this.state.filteredData.map((datum, index) => {
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
                        <div className="col-md-4">
                            <div className="risen-stats-block">
                            <div className="risen-stats-header"><h3>Best Champs</h3></div>
                            <div className="risen-stats-body">Coming Soon</div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed overall stats */}
                    <div className="row">
                        <div className="col">
                            <div className="risen-stats-header">
                                <h3>Compare Stats</h3>
                            </div>
                            <div className="risen-stats-body">
                            <div className="row">
                                Add Player :<input id="playerName"></input>
                                <Button onClick={this.loadCompareDataFromSearch.bind(this)} className="btn risen-button">Search For Player</Button>
                            </div>
                            <div className="row">
                                <table className="table-light table table-responsive-md table-sm table-striped">
                                    <tbody>
                                        {
                                            // Check to ensure comp data has length. It will once data for the player loads in
                                            //   as the #0 spot will be the players.
                                            this.state.compData.length ? 
                                            Object.keys(this.state.compData[0]).map((key, index) => {
                                            return (
                                                <tr key={"CompDataRow" + index}>
                                                <th>{key}</th>
                                                {
                                                    this.state.compData.map((player, index2) => {
                                                    // I really should just make this a new component
                                                    return (
                                                        <td key={index2 + "compData"}>{player[key]}</td>
                                                    )
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
            </section>
        );
    }
}

const gameDataDropDown = {
    maxHeight: '500px',
    overflow: 'auto'
  }
  