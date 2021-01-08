import React, {Component} from 'react';
import { customRound } from '../../Helpers';
import { Button, Dropdown, Container, ProgressBar } from "react-bootstrap";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import $ from 'jquery';
import { max } from 'date-fns';

let champMap = require('../../data/champions_map.json')

export default class BasicStats extends Component {

    constructor(props) {
        super(props);
        this.filteredData = [];
        this.accStats = {};
        this.avgData = {};
        this.state = {
            playerName: this.props.player,
            statData: this.props.playerData,
            accStats: this.props.accStats,
            filteredData: [],
            compData: []
        }
    }


    // Used to be shouldComponentUpdate. Change back if shit breaks
    shouldComponentUpdate(newProps, newState) {
        this.filteredData = newProps.playerData;
        this.avgData = newProps.avgData;
        this.accStats = newProps.accStats;
        // this.computeAccStats();
        return true;
    }

    computeAccStats() {
        let wins = 0;
        let kills = 0, deaths = 0, assists = 0;
        let cs = 0, min = 0;
        this.accStats = {
            "wr": 0,
            "games": 0,
            "kda": 0,
            "cs": 0
        };
        for (let datum of this.filteredData) {
          this.accStats["games"] += 1;
          if (datum["win"]) {
            wins += 1;
          }
          kills += datum["kills"];
          deaths += datum["deaths"];
          assists += datum["assists"];
          cs += datum["totalMinionsKilled"];
          min += datum["gameDuration"] / 60
        }

        this.accStats["wr"] = customRound((wins / this.accStats["games"]) * 100, 2);
        this.accStats["kda"] = customRound((kills + assists) / deaths, 1);
        this.accStats["cs"] = customRound(cs / min, 1);
    }

    createRadarChartData() {
        // TODO: Your text values don't change when changing the targeted role in filter
        let radarElements = [
            () => {
                let v1 = customRound((this.accStats['avg_kills'] + this.accStats['avg_assists']) / this.accStats['avg_deaths'], 4);
                let v2 = customRound((this.avgData['avg_kills'] + this.avgData['avg_assists']) / this.avgData['avg_deaths'], 4);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                  "subject": `KDA (${customRound(v1, 1)})`,
                  "A": v1/vm,
                  "B": v2/vm,
                }
              },
              () => { 
                let v1 = customRound(((this.accStats['avg_totalMinionsKilled'] + this.accStats['avg_neutralMinionsKilled'])*60)/this.accStats['avg_gameDuration'], 4);
                let v2 = customRound(((this.avgData['avg_totalMinionsKilled'] + this.avgData['avg_neutralMinionsKilled'])*60)/this.avgData['avg_gameDuration'], 4);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                    "subject": `CS/min (${customRound(v1, 1)})`,
                    "A": v1/vm,
                    "B": v2/vm,
                }
            },
            () => { 
                let v1 = customRound((this.accStats['avg_totalDamageDealtToChampions']*60)/this.accStats['avg_gameDuration'], 4);
                let v2 = customRound((this.avgData['avg_totalDamageDealtToChampions']*60)/this.avgData['avg_gameDuration'], 4);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                    "subject": `DPM (${customRound(v1, 1)})`,
                    "A": v1/vm,
                    "B": v2/vm,
                }
            },
            () => {
                
                let v1 = customRound((this.accStats['avg_visionScore']*60)/this.accStats['avg_gameDuration'], 4);
                let v2 = customRound((this.avgData['avg_visionScore']*60)/this.avgData['avg_gameDuration'], 4);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                    "subject": `VS/min (${customRound(v1, 1)})`,
                    "A": v1/vm,
                    "B": v2/vm,
                }
            },
            () => {
                
                let v1 = customRound((this.accStats['avg_goldEarned']*60)/this.accStats['avg_gameDuration'], 4);
                let v2 = customRound((this.avgData['avg_goldEarned']*60)/this.avgData['avg_gameDuration'], 4);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                    "subject": `Gold/min (${customRound(v1, 1)})`,
                    "A": v1/vm,
                    "B": v2/vm,
                }
            },
            () => {
                
                let v1 = customRound((this.accStats['avg_wardsKilled']*60)/this.accStats['avg_gameDuration'], 4);
                let v2 = customRound((this.avgData['avg_wardsKilled']*60)/this.avgData['avg_gameDuration'], 4);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                    "subject": `Wards Killed/min (${customRound(v1, 1)})`,
                    "A": v1/vm,
                    "B": v2/vm,
                }
            }
        ];
        let data = [];
        for (let f of radarElements) {
            data.push(f());
        }
        return data;
    }

    removePlayerCompare(i) {
      this.state.compData.splice(i, 1);
      this.setState({
        compData: this.state.compData
      });
    }

    getWr() {
      return customRound(this.props.accStats['avg_win'] * 100, 2);
    }
    getKDA() {
      let d = 1;
      if (this.props.accStats['avg_deaths']) {
        d = this.props.accStats['avg_deaths'];
      }
      return customRound((this.props.accStats['avg_kills'] + this.props.accStats['avg_assists'])/d, 2);
    }
    getCspm() {
      return customRound(((this.accStats['avg_totalMinionsKilled'] + this.accStats['avg_neutralMinionsKilled'])*60)/this.props.accStats['avg_gameDuration']);
    }
    getKDAP() {
        // return
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
                          <div className="center">{this.getWr()}%</div>
                          <div className="center risen-sub-label">Winrate</div>
                        </div>
                        <div className="col-sm">
                          <div className="center">{this.getKDA()}</div>
                          <div className="center risen-sub-label">KDA</div>
                        </div>
                        <div className="col-sm">
                          <div className="center">{this.getCspm()}</div>
                          <div className="center risen-sub-label">CS/Min</div>
                        </div>
                        <div className="col-sm">
                          <div className="center">{this.props.accStats["total_games"]}</div>
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
                    <h3>Stat Summary</h3>
                  </div>
                  <div className="risen-stats-body">
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart outerRadius={90} data={this.createRadarChartData()} style={{fill: 'rgba(0, 0, 0, 0.87)'}}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{fill: 'white'}}/>
                        {/* <PolarRadiusAxis angle={30} domain={[0, 1]} /> */}
                        <Radar name="Risen Average" dataKey="B" stroke="#e5b575" fill="#e5b575" fillOpacity={0.6} />
                        <Radar name="You" dataKey="A" stroke="#6d83ff" fill="#6d83ff" fillOpacity={0.6} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
            </div>
            <div className="col-md">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <div className="row">
                    <div className="col" style={verticalCenter}>
                      <h3>Game Stats</h3>
                    </div>
                  </div>
                </div>
                <div className="risen-stats-body">
                  <div className='row' style={{overflow: 'scroll', maxHeight: '300px'}}>
                    <div className='col'>
                      <table className="table risen-table center">
                        {/* <thead>
                          <tr>
                            <td>Champion</td>
                            <td>Score</td>
                          </tr>
                        </thead> */}
                        <tbody>
                          {
                            Object.values(this.filteredData).map(datum => {
                              return (
                                <tr key={datum._id}>
                                  <td>{champMap[datum["championId"]]}</td>
                                  <td>{datum["kills"]}/{datum["deaths"]}/{datum["assists"]}</td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                    </div>
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

const gameStatsInfoBox = {
    display: 'grid',
    gridTemplateColumns: "auto auto"
}

const centerPBar = {
  position: 'relative',
  top: '20%'
}