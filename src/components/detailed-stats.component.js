import React, { Component } from "react";

import topLaneIcon from '../images/roles/Position_Gold-Top.png';
import jngLaneIcon from '../images/roles/Position_Gold-Jungle.png';
import midLaneIcon from '../images/roles/Position_Gold-Mid.png';
import botLaneIcon from '../images/roles/Position_Gold-Bot.png';
import supLaneIcon from '../images/roles/Position_Gold-Support.png';
import { customRound, urlOnChange, setDropDowns } from '../Helpers';
import { Button, Container, Form } from "react-bootstrap";
import BasicStats from './personalStats/basicStats.component';
import CombatStats from './personalStats/combatStats.component';
import IncomeStats from "./personalStats/incomeStats.component";
import VisionStats from "./personalStats/visionStats.component";
import ChampionStats from "./personalStats/championStats.component";

let champMap = require('../data/champions_map.json');
// let champions = require('../data/champions.json'); // oof. This is loading a lot of unneeded data

export default class DetailedStats extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerName: this.props.match.params.player,
      seasons: [],
      statData: [],
      accumulatedStats: {},
      filteredData: [],
      compData: [],
      avgData: {}
    }
  }

  componentDidMount() {
    //   Looks for lane dropdown value so needs to be after mount
    this.loadSeasons(() => {
      setDropDowns.bind(this)();
      this.performFilter();
    });
    this.loadPlayerData(this.props.match.params.player);
    this.loadAvgData();
  }

  loadSeasons(callback=(()=>{})) {
    const url = process.env.REACT_APP_BASE_URL + "/seasons";
    fetch(url).then(data => {
      data.json().then(data => {
        this.setState({
          seasons: data
        });
        callback();
      })
    })
  }

  computeAccStats(data, accStats = {}) {
    for (let game of data) {
        for (let key in game) {
            let t = typeof game[key];
            if (t !== 'boolean' && t !== 'number') {
                continue;
            }
            if (!accStats['avg_' + key]) {
                accStats['avg_' + key] = 0;
            }
            if (t === 'boolean')
                accStats['avg_' + key] += game[key] ? 1 : 0;
            else if (t === 'number')
                accStats['avg_' + key] += game[key] ? game[key] : 0 ;
        }
    }
    for (let key in accStats) {
        accStats[key] /= data.length;
    }
    accStats["total_games"] = data.length;
    return accStats;
  }

  loadAvgData() {
    let url = process.env.REACT_APP_BASE_URL + "/stats/avg";
    let laneFilter = document.getElementById("roleFilter").value;
    if (laneFilter !== "ANY") {
        url += "/role/" + laneFilter;
    }
    fetch(url).then((data) => {
    data.json().then(data => {
        this.setState({
            avgData: data[0]
        })
      })
    });
  }

  loadAvgDataCallback(callback) {
    let url = process.env.REACT_APP_BASE_URL + "/stats/avg";
    let laneFilter = document.getElementById("roleFilter").value;
    if (laneFilter !== "ANY") {
        url += "/role/" + laneFilter;
    }
    fetch(url).then((data) => {
    data.json().then(data => {
        callback(data[0]);
      })
    });
  }

  loadPlayerAggData() {
    let aggUrl = process.env.REACT_APP_BASE_URL + "/stats/player/name/" + this.state.playerName + "/agg";
    let laneFilter = document.getElementById("roleFilter").value;
    if (laneFilter !== "ANY") {
        aggUrl = process.env.REACT_APP_BASE_URL + "/stats/player/name/" + this.state.playerName + "/lane/" + laneFilter + "/agg";
    }
    fetch(aggUrl).then(aggData => {
        aggData.json().then(aggData => {    
            this.setState({
              accumulatedStats: aggData[0],
            });
        })
    });
  }

  loadPlayerData(playerName) {
    let url = process.env.REACT_APP_BASE_URL + "/stats/player/name/" + playerName;
    fetch(url).then((data) => {
      data.json().then(data => {
        // console.log();
        this.setState({
            statData: data,
            accumulatedStats: this.computeAccStats(data),
            filteredData: JSON.parse(JSON.stringify(data)) // make a copy, this will be filtered
        });
        // let aggUrl = process.env.REACT_APP_BASE_URL + "/stats/player/name/" + playerName + "/agg";
        // fetch(aggUrl).then(aggData => {
        //     aggData.json().then(aggData => {    
        //         this.setState({
        //           statData: data,
        //           accumulatedStats: aggData[0],
        //           filteredData: JSON.parse(JSON.stringify(data)) // make a copy, this will be filtered
        //         });
        //     })
        // })
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
    this.loadAvgDataCallback((data) => {
      // this.loadPlayerAggData();
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

        let seasonFilter = document.getElementById("seasonFilter").value;
        if (seasonFilter !== "ANY") {
          if (game.season !== seasonFilter) {
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
        avgData: data,
        filteredData: filteredData,
        accumulatedStats: this.computeAccStats(filteredData)
      });

    });
  }

  render() {
    return (
      <section>
        <div className="dark-section text-light">
          <div className="container">
            <div>
                <h1>{this.state.playerName}</h1>
                <hr style={{backgroundColor: 'white'}}></hr>
            </div>
              <Container>
                <div className="row">
                  <div className="col">
                    <div className="risen-stats-block">
                      <div className="risen-stats-header">
                        <h3>Filters</h3>
                      </div>
                      <div className="risen-stats-body">
                        <div className="row">
                          <div className="col-md">
                            <Form.Group controlId="championFilter">
                              <Form.Label>Champion</Form.Label>
                              <Form.Control as="input">
                              </Form.Control>
                            </Form.Group>
                          </div>
                          <div className="col-md">
                            <Form.Group controlId="roleFilter">
                              <Form.Label>Role</Form.Label>
                              <Form.Control as="select" defaultValue="ANY" onChange={urlOnChange.bind(this)}>
                                <option value="ANY">Any</option>
                                <option value="TOP">Top</option>
                                <option value="JUNGLE">Jungle</option>
                                <option value="MIDDLE">Mid</option>
                                <option value="BOTTOM">Bot</option>
                                <option value="SUPPORT">Support</option>
                              </Form.Control>
                            </Form.Group>
                          </div>
                          <div className="col-md">
                            <Form.Group controlId="durationFilter">
                              <Form.Label>Duration</Form.Label>
                              <Form.Control as="select" onChange={urlOnChange.bind(this)}>
                                <option value="ANY">Any</option>
                                <option value="0-20">20min</option>
                                <option value="20-30">20-30min</option>
                                <option value="30-120">30+min</option>
                              </Form.Control>
                            </Form.Group>
                          </div>
                          <div className="col-md">
                            <Form.Group controlId="seasonFilter" onChange={urlOnChange.bind(this)}>
                              <Form.Label>Season</Form.Label>
                              <Form.Control as="select">
                              <option value="ANY">Any</option>
                              {
                                this.state.seasons.map(s => {
                                  return (
                                    <option value={s._id}>{s.seasonName}</option>
                                  )
                                })
                              }
                              </Form.Control>
                            </Form.Group>
                          </div>
                          <div className="col-md">
                            <Form.Group controlId="resultFilter" onChange={urlOnChange.bind(this)}>
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
              {/* <div className="tab-pane fade show active" id="nav-basic" role="tabpanel" aria-labelledby="nav-basic-tab"> */}
                <BasicStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats} avgData={this.state.avgData}></BasicStats>
              {/* </div> */}
            {/* Basic Stats */}
            <nav>
              <ul className="nav nav-tabs" id="nav-tab" role="tablist" style={navStyle}>
                {/* <a className="nav-item nav-link active" id="nav-basic-tab" data-toggle="tab" href="#nav-basic" role="tab" aria-controls="nav-basic" aria-selected="true">Basic Stats</a> */}
                <li className="nav-item" role="presentation">
                    <a className="nav-link active" id="nav-combat-tab" data-toggle="tab" href="#nav-combat" role="tab" aria-controls="nav-combat" aria-selected="true">Combat</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="nav-income-tab" data-toggle="tab" href="#nav-income" role="tab" aria-controls="nav-income" aria-selected="false">Income</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="nav-vision-tab" data-toggle="tab" href="#nav-vision" role="tab" aria-controls="nav-vision" aria-selected="false">Vision</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="nav-champ-tab" data-toggle="tab" href="#nav-champ" role="tab" aria-controls="nav-champ" aria-selected="false">Champions</a>
                </li>
              </ul>
            </nav>
            <div className="tab-content" id="nav-tabContent" style={tabStyle}>
              <div className="tab-pane fade show active" id="nav-combat" role="tabpanel" aria-labelledby="nav-combat-tab">
                <CombatStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats} avgData={this.state.avgData}></CombatStats>
              </div>
              <div className="tab-pane fade" id="nav-income" role="tabpanel" aria-labelledby="nav-income-tab">
                <IncomeStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats} avgData={this.state.avgData}></IncomeStats>
              </div>
              <div className="tab-pane fade" id="nav-vision" role="tabpanel" aria-labelledby="nav-vision-tab">
                <VisionStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats} avgData={this.state.avgData}></VisionStats>
              </div>
              <div className="tab-pane fade" id="nav-champ" role="tabpanel" aria-labelledby="nav-champ-tab">
                <ChampionStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats} avgData={this.state.avgData}></ChampionStats>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }
}

const navStyle = {
//   alignItems: "flex-end",
//   justifyContent: "flex-end"
    border: 0,
}

const tabStyle = {
    // border: '1px solid white',
    // backgroundColor: "#ffffff0f"
    backgroundColor: "rgb(255 255 255 / 0.01)",
    border: '2px solid #565656',
    borderRadius: '15px',
    borderTopLeftRadius: '0'
}