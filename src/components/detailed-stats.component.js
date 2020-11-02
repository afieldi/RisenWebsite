import React, { Component } from "react";

import topLaneIcon from '../images/roles/Position_Gold-Top.png';
import jngLaneIcon from '../images/roles/Position_Gold-Jungle.png';
import midLaneIcon from '../images/roles/Position_Gold-Mid.png';
import botLaneIcon from '../images/roles/Position_Gold-Bot.png';
import supLaneIcon from '../images/roles/Position_Gold-Support.png';
import { customRound } from '../Helpers';
import { Button, Container, Form } from "react-bootstrap";
import BasicStats from './personalStats/basicStats.component';
import CombatStats from './personalStats/combatStats.component';
import IncomeStats from "./personalStats/incomeStats.component";
import VisionStats from "./personalStats/visionStats.component";

let champMap = require('../data/champions_map.json');
// let champions = require('../data/champions.json'); // oof. This is loading a lot of unneeded data

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
    this.loadPlayerData(this.props.match.params.player);
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
      min += datum["gameDuration"] / 60;
    }
    accStats["wr"] = customRound(wins / accStats["games"] * 100, 2);
    accStats["kda"] = customRound((kills + assists) / deaths, 1);
    accStats["cs"] = customRound(cs / min, 1);
  }

  loadPlayerData(playerName) {
    let url = process.env.REACT_APP_BASE_URL + "/stats/player/name/" + playerName;
    fetch(url).then((data) => {
      data.json().then(data => {
        console.log(data)
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

  performFilter() {
    let filteredData = this.state.statData.filter(game => {
      let championFilter = document.getElementById("championFilter").value;
      if (championFilter.length > 0) {
        if(!champMap[game.championId].startsWith(championFilter)) {
          return false;
        }
      }

      let laneFilter = document.getElementById("roleFilter").value;
      if (laneFilter !== "ANY") {
        if (game.lane !== laneFilter) {
          return false;
        }
      }

      let timeFilter = document.getElementById("durationFilter").value;
      if (timeFilter !== "ANY") {
        let t1 = timeFilter.split("-")[0];
        let t2 = timeFilter.split("-")[1];
        if (game.gameDuration < t1 * 60 || game.gameDuration > t2 * 60) {
          return false;
        }
      }

      let winFilter = document.getElementById("resultFilter").value;
      if (winFilter !== "ANY") {
        if (winFilter === "WIN" && game.win !== true) {
          return false;
        }
        else if (winFilter === "LOSS" && game.win === true) {
          return false;
        }
      }
      return true;
    });

    this.setState({
      filteredData: filteredData
    });
  }

  render() {
    return (
      <section>
        <div className="dark-section text-light">
          <div className="container">

            {/* Basic Stats */}
            <nav>
              <div>
                <h1>{this.state.playerName}</h1>
              </div>
              <div className="nav nav-tabs" id="nav-tab" role="tablist" style={navStyle}>
                <a className="nav-item nav-link active" id="nav-basic-tab" data-toggle="tab" href="#nav-basic" role="tab" aria-controls="nav-basic" aria-selected="true">Basic Stats</a>
                <a className="nav-item nav-link" id="nav-combat-tab" data-toggle="tab" href="#nav-combat" role="tab" aria-controls="nav-combat" aria-selected="false">Combat</a>
                <a className="nav-item nav-link" id="nav-income-tab" data-toggle="tab" href="#nav-income" role="tab" aria-controls="nav-income" aria-selected="false">Income</a>
                <a className="nav-item nav-link" id="nav-vision-tab" data-toggle="tab" href="#nav-vision" role="tab" aria-controls="nav-vision" aria-selected="false">Vision</a>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <Container>
                <div className="row">
                    <div className="col">
                        <div className="risen-stats-block">
                            <div className="risen-stats-header">
                                <h3>Filters</h3>
                            </div>
                            <div className="risen-stats-body">
                                <div className="row">
                                    <div className="col">
                                      <Form.Group controlId="championFilter">
                                        <Form.Label>Champion</Form.Label>
                                        <Form.Control as="input">
                                        </Form.Control>
                                      </Form.Group>
                                    </div>
                                    <div className="col">
                                      <Form.Group controlId="roleFilter">
                                        <Form.Label>Role</Form.Label>
                                        <Form.Control as="select" defaultValue="ANY">
                                          <option value="ANY">Any</option>
                                          <option value="TOP">Top</option>
                                          <option value="JUNGLE">Jungle</option>
                                          <option value="MIDDLE">Mid</option>
                                          <option value="BOTTOM">Bot</option>
                                          <option value="SUPPORT">Support</option>
                                        </Form.Control>
                                      </Form.Group>
                                    </div>
                                    <div className="col">
                                      <Form.Group controlId="durationFilter">
                                        <Form.Label>Duration</Form.Label>
                                        <Form.Control as="select">
                                          <option value="ANY">Any</option>
                                          <option value="0-20">20min</option>
                                          <option value="20-30">20-30min</option>
                                          <option value="30-120">30+min</option>
                                        </Form.Control>
                                      </Form.Group>
                                    </div>
                                    <div className="col">
                                      <Form.Group controlId="resultFilter">
                                        <Form.Label>Result</Form.Label>
                                        <Form.Control as="select">
                                          <option value="ANY">Any</option>
                                          <option value="WIN">Win</option>
                                          <option value="LOSS">Loss</option>
                                        </Form.Control>
                                      </Form.Group>
                                    </div>
                                    <div className="col-md">
                                      <Button className="btn filter-button" onClick={this.performFilter.bind(this)}>Filter</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </Container>
              <div className="tab-pane fade show active" id="nav-basic" role="tabpanel" aria-labelledby="nav-basic-tab">
                <BasicStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats}></BasicStats>
              </div>
              <div className="tab-pane fade" id="nav-combat" role="tabpanel" aria-labelledby="nav-combat-tab">
                <CombatStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats}></CombatStats>
              </div>
              <div className="tab-pane fade" id="nav-income" role="tabpanel" aria-labelledby="nav-income-tab">
                <IncomeStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats}></IncomeStats>
              </div>
              <div className="tab-pane fade" id="nav-vision" role="tabpanel" aria-labelledby="nav-vision-tab">
                <VisionStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats}></VisionStats>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }
}

const navStyle = {
  alignItems: "flex-end",
  justifyContent: "flex-end"
}
