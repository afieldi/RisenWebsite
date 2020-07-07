import React, { Component } from "react";

import topLaneIcon from '../images/roles/Position_Gold-Top.png';
import jngLaneIcon from '../images/roles/Position_Gold-Jungle.png';
import midLaneIcon from '../images/roles/Position_Gold-Mid.png';
import botLaneIcon from '../images/roles/Position_Gold-Bot.png';
import supLaneIcon from '../images/roles/Position_Gold-Support.png';
import { customRound } from '../Helpers';
import { Button, Dropdown } from "react-bootstrap";
import $ from 'jquery'

let champMap = require('../data/champions_map.json')

export default class DetailedStats extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerName: this.props.match.params.player,
      statData: [],
      accumulatedStats: {},
      filteredData: [],
      compData: [],
      gameDataOptions: {
        "Game Duration": {shown: false, fnc: game => game["gameDuration"]},
        "Champion": {shown: true, fnc: game => champMap[game["championId"]]},
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
        "CSD@10": {shown: false, fnc: game => game["csDiff10"]},
        "CSD@20": {shown: false, fnc: game => game["csDiff10"] + game["csDiff20"]},
        "CSD@30": {shown: false, fnc: game => game["csDiff10"] + game["csDiff20"] + game["csDiff30"]},
        "Lane": {shown: false, fnc: game => game["lane"]},
        "Dmg/Gold": {shown: true, fnc: game => customRound(game["damagePerGold"])}
      }
    }
    this.loadPlayerData(this.props.match.params.player);
    this.loadCompareData(this.props.match.params.player);
    
    $(function() {

      $('.dropdown-toggle').on('click', function(event) {
        $('.dropdown-menu').slideToggle();
        event.stopPropagation();
      });
    
      $('.dropdown-menu').on('click', function(event) {
        // This is fairly jank. This whole jquery code block is to prevent the dropdown that allows
        //  you to select shown stats from closing whenever you flip any checkbox
        event.stopPropagation();
      });
    
      $(window).on('click', function() {
        $('.dropdown-menu').slideUp();
      });
    
    });

  }

  loadPlayerData(playerName) {
    let url = "http://localhost:5000/stats/player/name/" + playerName
    fetch(url).then((data) => {
      data.json().then(data => {
        let accStats = {
          "wr": 0,
          "games": 0,
          "kda": 0,
          "cs": 0
        }
        this.computeAccStats(accStats, data);
        this.setState({
          statData: data,
          accumulatedStats: accStats,
          filteredData: JSON.parse(JSON.stringify(data)) // make a copy, this will be filtered
        });
      });
    })
  }

  loadCompareData(playerName) {
    let url = "http://localhost:5000/stats/player/name/" + playerName + "/agg"
    fetch(url).then((data) => {
      if (data.status != 200) {
        alert("Could not find summoner!");
        return;
      }
      data.json().then(jsonData => {
        console.log("aa")
        const playerData = jsonData[0];
        const newData = {}

        newData["Name"] = playerData._id.player[0];
        newData["Kills"] = customRound(playerData["avg_kills"]);
        newData["Deaths"] = customRound(playerData["avg_deaths"]);
        newData["Assists"] = customRound(playerData["avg_assists"]);
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

  // THis is an intermediate function so that loadCompareData can be kept general
  loadCompareDataFromSearch() {
    
    this.loadCompareData(document.getElementById("playerName").value);
  }

  computeAccStats(accStats, data) {
    let wins = 0;
    let kills = 0, deaths = 0, assists = 0;
    let cs = 0, min = 0;
    for (let datum of data) {
      accStats["games"] += 1;
      if (datum["win"]) {
        wins += 1;
      }
      kills += datum["kills"];
      deaths += datum["deaths"];
      assists += datum["assists"];
      cs += datum["totalMinionsKilled"];
      min += datum["gameDuration"] / 60
    }
    accStats["wr"] = customRound(wins / accStats["games"] * 100, 2);
    accStats["kda"] = customRound((kills + assists) / deaths, 1);
    accStats["cs"] = customRound(cs / min, 1);
  }

  getPositonalIcon(position) {
    switch (position) {
      case "TOP":
        return (<img src={topLaneIcon}></img>)
      case "JUNGLE":
        return (<img src={jngLaneIcon}></img>)
      case "MIDDLE":
        return (<img src={midLaneIcon}></img>)
      case "BOTTOM":
        return (<img src={botLaneIcon}></img>)
      case "SUPPORT":
        return (<img src={supLaneIcon}></img>)
      default:
        return (<img src={midLaneIcon}></img>)
        break;
    }
  }

  handleGameCheck(option) {
    // let tempOptions = this.state.gameDataOptions;
    console.log("hello");
    this.state.gameDataOptions[option].shown = !this.state.gameDataOptions[option].shown;
    // this.setState({
    //   gameDataOptions: te
    // })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="risen-stats-header">
              <h1>{this.state.playerName}: Probably a bad player</h1>
            </div>
          </div>
        </div>
        
        {/* Basic Stats */}
        <div className="row">
          <div className="col">
            <div className="risen-stats-block">
              <div className="risen-stats-header"><h3>Basic Stats</h3></div>
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
              <div className="risen-stats-header"><h3>Game Stats</h3>
                  {/* <Dropdown className="dropdown">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Dropdown Button
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item><input type="checkbox" id="Tes1"></input></Dropdown.Item>
                      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown> */}
                  <Dropdown>
                    <Button href="#" className="dropdown-toggle" data-toggle="dropdown">MENU</Button>
                    <div className="dropdown-menu" style={gameDataDropDown}>
                      {
                        Object.keys(this.state.gameDataOptions).map((option, index) => {
                          return (
                            <div>{option}</div>
                          )
                        })
                      }
                    </div>
                  </Dropdown>
              </div>
              <div className="risen-stats-body">
                <table className="table risen-table">
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
              <div className="risen-stats-body">a</div>
            </div>
          </div>
        </div>

        {/* Detailed overall stats */}
        <div className="row">
          <div className="col">
            <div className="risen-stats-header">
              <h3>Compare Stats (I'm a god btw)</h3>
            </div>
            <div className="risen-stats-body">
              <div className="row">
                Add Player :<input id="playerName"></input>
                <Button onClick={this.loadCompareDataFromSearch.bind(this)}>Search For Player</Button>
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
      </div>
    );
  }
}

const gameDataDropDown = {
  maxHeight: '500px',
  overflow: 'auto'
}