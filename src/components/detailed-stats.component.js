import React, { Component } from "react";

import topLaneIcon from '../images/roles/Position_Gold-Top.png';
import jngLaneIcon from '../images/roles/Position_Gold-Jungle.png';
import midLaneIcon from '../images/roles/Position_Gold-Mid.png';
import botLaneIcon from '../images/roles/Position_Gold-Bot.png';
import supLaneIcon from '../images/roles/Position_Gold-Support.png';
import { customRound } from '../Helpers';
import { Button, Dropdown } from "react-bootstrap";
import BasicStats from './personalStats/basicStats.component';
import CombatStats from './personalStats/combatStats.component';

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
      min += datum["gameDuration"] / 60
    }
    accStats["wr"] = customRound(wins / accStats["games"] * 100, 2);
    accStats["kda"] = customRound((kills + assists) / deaths, 1);
    accStats["cs"] = customRound(cs / min, 1);
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

  render() {
    return (
      <section>
        {/* <br></br>
        <br></br>
        <br></br> */}
        <div className="light-section">
          <div className="container">
            {/* <div className="row">
              <div className="col">
                <div className="risen-stats-header">
                  <h1>{this.state.playerName}</h1>
                </div>
              </div>
            </div> */}
            
            {/* Basic Stats */}
            <nav>
              <div>
                <h1>{this.state.playerName}</h1>
              </div>
              <div className="nav nav-tabs" id="nav-tab" role="tablist" style={navStyle}>
                <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Basic Stats</a>
                <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Combat</a>
                <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Income</a>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <BasicStats player={this.state.playerName} playerData={this.state.statData} accStats={this.state.accumulatedStats}></BasicStats>
              </div>
              <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <CombatStats player={this.state.playerName} playerData={this.state.statData} accStats={this.state.accumulatedStats}></CombatStats>
              </div>
              <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">...</div>
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