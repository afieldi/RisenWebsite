import React, { useEffect, useState } from 'react';
import { Area, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, AreaChart } from 'recharts';
import { customRound } from '../../Helpers';
import DotMap from '../dotmap.component';

const champMap = require('../../data/champions_map.json');

export default function PlayerStats(props) {
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

  const navIconStyle = {
    width: '50px'
  }

  let bluePlayers = props.bluePlayers;
  let redPlayers = props.redPlayers;
  let players = [...props.bluePlayers, ...props.redPlayers];

  const [avgData, setAvgData] = useState({});

  function generateGoldData(player) {
    let data = [];
    let risenAvg = 0;
    for (let i in player.goldMap) {
      if (i < 10) {
        risenAvg += avgData[player.lane] ? avgData[player.lane].avg_goldGen10 : 0;
      }
      else if (i < 20) {
        risenAvg += avgData[player.lane] ? avgData[player.lane].avg_goldGen20 : 0;
      }
      else {
        risenAvg += avgData[player.lane] ? avgData[player.lane].avg_goldGen30 : 0;
      }

      data.push({
        "time": i,
        player: player.goldMap[i],
        risen: risenAvg
      });
    }
    return data;
  }

  function generateEXPData(player) {
    let data = [];
    let risenAvg = 0;
    for (let i in player.xpMap) {
      if (i < 10) {
        risenAvg += avgData[player.lane] ? avgData[player.lane].avg_xpGen10 : 0;
      }
      else if (i < 20) {
        risenAvg += avgData[player.lane] ? avgData[player.lane].avg_xpGen20 : 0;
      }
      else {
        risenAvg += avgData[player.lane] ? avgData[player.lane].avg_xpGen30 : 0;
      }

      data.push({
        "time": i,
        player: player.xpMap[i],
        risen: risenAvg
      });
    }
    return data;
  }

  useEffect(() => {
    loadAvgData();
  }, []);

  function loadAvgData() {
    let url = process.env.REACT_APP_BASE_URL + "/stats/avg/role";
    fetch(url).then((data) => {
      data.json().then(data => {
        let newState = {}
        for(let v of data) {
          newState[v["_id"]["lane"]] = v;
        }
        setAvgData(newState);
      })
    });
  }

  function generateDots(player) {
    function addToDots(map, type="?", color="red") {
      let dots = [];
      for (const event of map) {
        // Event is of form [x, y, timestamp]
        dots.push([
          customRound((event[0]/15000) * 100, 0).toString() + "%",
          customRound((event[1]/15000) * 100, 0).toString() + "%",
          type,
          event[2],
          color
        ]);
      }
      return dots;
    }

    let allDots = [];
    allDots = allDots.concat(addToDots(player.killMap, "Kill", "blue"));
    allDots = allDots.concat(addToDots(player.assistMap, "Assist", "green"));
    allDots = allDots.concat(addToDots(player.deathMap, "Death", "red"));
    console.log(allDots);
    return allDots;
}

  return (
    <div>
      <nav>
        <ul className="nav nav-tabs" id="nav-tab" role="tablist" style={navStyle}>

          {
            players.map((v, i) => {
              let n = "nav-link";
              if (i == 0) {
                n += " active";
              }
              return (
                <li className="nav-item" role="presentation">
                  <a className={n} id={`nav-player${i}-tab`} data-toggle="tab" href={`#nav-player-${i}`} role="tab" aria-controls={`#nav-player-${i}`} aria-selected="false">
                    <img src={require(`../../images/champions/icons/${champMap[v.championId]}_0.png`)} style={navIconStyle}></img>
                  </a>
                </li>
              )
            })
          }
        </ul>
      </nav>
      <div className="tab-content" id="nav-tabContent" style={tabStyle}>
        {
          players.map((v, i) => {
            let n = "tab-pane fade";
              if (i == 0) {
                n += " show active";
              }
            return (
              <div className={n} id={`nav-player-${i}`} role="tabpanel" aria-labelledby={`nav-player${i}-tab`}>
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <div className="risen-stats-block">
                        <div className="risen-stats-header">
                          {v.player.name}
                        </div>
                        <div className="risen-stats-body">
                          <table className="table table-responsive-md table-striped text-light">
                            <tbody>
                              <tr className="clickable">
                                <td>Solo Kills</td>
                                <td>{v.soloKills}</td>
                              </tr>
                              <tr className="clickable">
                                <td>Solo Deaths</td>
                                <td>{v.soloDeaths}</td>
                              </tr>
                              <tr className="clickable">
                                <td>Gank Kills</td>
                                <td>{v.gankKills}</td>
                              </tr>
                              <tr className="clickable">
                                <td>Gank Deaths</td>
                                <td>{v.gankDeaths}</td>
                              </tr>
                              <tr className="clickable">
                                <td>Turret Kills</td>
                                <td>{v.turretKills}</td>
                              </tr>
                              <tr className="clickable">
                                <td>Wards Placed</td>
                                <td>{v.wardsPlaced}</td>
                              </tr>
                              <tr className="clickable">
                                <td>Wards Killed</td>
                                <td>{v.wardsKilled}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {/* <div style={{padding: '10px'}}>
                        <DotMap dots={generateDots(v)}></DotMap>
                      </div> */}
                      <div className="risen-stats-block">
                        <div className="risen-stats-header">
                          Kill Map
                        </div>
                        <div className="risen-stats-body">
                          <DotMap dots={generateDots(v)}></DotMap>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="risen-stats-block">
                        <div className="risen-stats-header">
                          Gold Generation
                        </div>
                        <div className="risen-stats-body">
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={generateGoldData(v)}>
                              {/* <Line dataKey={this.state.graphStat}></Line> */}
                              <CartesianGrid stroke="#ccc" />
                              <XAxis tick={{fill: 'white'}} />
                              <YAxis tick={{fill: 'white'}} />
                              <Area name="Risen Average" dataKey="risen" stroke="#e5b575" fill="#e5b575" fillOpacity={0.6}></Area>
                              <Area name="You" dataKey="player" stroke="#6d83ff" fill="#6d83ff" fillOpacity={0.6}></Area>
                              <Legend />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="risen-stats-block">
                        <div className="risen-stats-header">
                          Exp Generation
                        </div>
                        <div className="risen-stats-body">
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={generateEXPData(v)}>
                              {/* <Line dataKey={this.state.graphStat}></Line> */}
                              <CartesianGrid stroke="#ccc" />
                              <XAxis tick={{fill: 'white'}} />
                              <YAxis tick={{fill: 'white'}} />
                              <Area name="Risen Average" dataKey="risen" stroke="#e5b575" fill="#e5b575" fillOpacity={0.6}></Area>
                              <Area name="You" dataKey="player" stroke="#6d83ff" fill="#6d83ff" fillOpacity={0.6}></Area>
                              <Legend />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}