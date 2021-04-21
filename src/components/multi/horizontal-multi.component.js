import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { customRound } from '../../Helpers';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

let champMap = require('../../data/champions_map.json')

export default class HorizontalMulti extends Component {
  constructor(props) {
    super(props);
    this.champs = this.props.player.champions;
    this.champs.sort((a, b) => {
      if (a.total_games > b.total_games) {
        return -1;
      }
      if (a.championId > b.championId)
        return -1;
      return 1;
    })
  }

  getWR() {
    return customRound(this.props.player.total_wins / this.props.player.total_games, 2);
  }

  createRadarChartData() {
    console.log(this.props.player)
    // TODO: Your text values don't change when changing the targeted role in filter
    let radarElements = [
      () => {
          let v1 = customRound((this.props.player['avg_kills'] + this.props.player['avg_assists']) / this.props.player['avg_deaths'], 4);
          let v2 = customRound((this.props.avgData['avg_kills'] + this.props.avgData['avg_assists']) / this.props.avgData['avg_deaths'], 4);
          console.log(v2);
          v1 = v1 ? v1 : 0;
          v2 = v2 ? v2 : 0;
          let vm = v2 * 1.25;
          return {
            "subject": `KDA`,
            "A": v1/vm,
            "B": v2/vm,
          }
        },
        () => { 
          let v1 = customRound(((this.props.player['avg_totalMinionsKilled'] + this.props.player['avg_neutralMinionsKilled'])*60)/this.props.player['avg_gameDuration'], 4);
          let v2 = customRound(((this.props.avgData['avg_totalMinionsKilled'] + this.props.avgData['avg_neutralMinionsKilled'])*60)/this.props.avgData['avg_gameDuration'], 4);
          v1 = v1 ? v1 : 0;
          v2 = v2 ? v2 : 0;
          let vm = v2 * 1.25;
          return {
              "subject": `CSPM`,
              "A": v1/vm,
              "B": v2/vm,
          }
      },
      () => { 
          let v1 = customRound((this.props.player['avg_totalDamageDealtToChampions']*60)/this.props.player['avg_gameDuration'], 4);
          let v2 = customRound((this.props.avgData['avg_totalDamageDealtToChampions']*60)/this.props.avgData['avg_gameDuration'], 4);
          v1 = v1 ? v1 : 0;
          v2 = v2 ? v2 : 0;
          let vm = v2 * 1.25;
          return {
              "subject": `DPM`,
              "A": v1/vm,
              "B": v2/vm,
          }
      },
      () => {
          
          let v1 = customRound((this.props.player['avg_visionScore']*60)/this.props.player['avg_gameDuration'], 4);
          let v2 = customRound((this.props.avgData['avg_visionScore']*60)/this.props.avgData['avg_gameDuration'], 4);
          v1 = v1 ? v1 : 0;
          v2 = v2 ? v2 : 0;
          let vm = v2 * 1.25;
          return {
              "subject": `VSPM`,
              "A": v1/vm,
              "B": v2/vm,
          }
      },
      () => {
          
          let v1 = customRound((this.props.player['avg_goldEarned']*60)/this.props.player['avg_gameDuration'], 4);
          let v2 = customRound((this.props.avgData['avg_goldEarned']*60)/this.props.avgData['avg_gameDuration'], 4);
          v1 = v1 ? v1 : 0;
          v2 = v2 ? v2 : 0;
          let vm = v2 * 1.25;
          return {
              "subject": `GPM`,
              "A": v1/vm,
              "B": v2/vm,
          }
      },
      () => {
          
          let v1 = customRound((this.props.player['avg_wardsKilled']*60)/this.props.player['avg_gameDuration'], 4);
          let v2 = customRound((this.props.avgData['avg_wardsKilled']*60)/this.props.avgData['avg_gameDuration'], 4);
          v1 = v1 ? v1 : 0;
          v2 = v2 ? v2 : 0;
          let vm = v2 * 1.25;
          return {
              "subject": `WKPM`,
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

  getKDA(champ) {
    return `${customRound(champ.avg_kills, 1)}/${customRound(champ.avg_deaths, 1)}/${customRound(champ.avg_assists,1)}`
  }

  render() {
    return (
      <section>
        <div className="row">
          <div className="col">
            <div className="risen-stats-block">
              <div className="risen-stats-header">
                <h3>{this.props.player._id[0].name}</h3>
              </div>
              <div className="risen-stats-body">
                <div className="row">
                  <div className="col" style={{display: 'grid'}}>
                    <div className="center risen-sub-label">Win Rate</div>
                    <div style={progressStyle}>
                      <CircularProgressbar
                        styles={buildStyles({pathColor: '#e4a013', textColor: '#e4a013'})}
                        value={this.getWR()*100} text={`${this.getWR()*100}%`} />
                    </div>
                  </div>
                  <div className="col" style={{display: 'grid'}}>
                    <div className="center risen-sub-label">KDA</div>
    <div className="center" style={{fontSize: '24px'}}>{this.getKDA(this.props.player)}</div>
                  </div>
                  <div className="col-4 d-none d-md-block">
                    <div className="center risen-sub-label">Performance</div>
                    <div>
                      <ResponsiveContainer width="100%" height={150} id="radarChart">
                        <RadarChart data={this.createRadarChartData()} style={{fill: 'rgba(0, 0, 0, 0.87)'}}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" tick={{fill: 'white'}}/>
                          <PolarRadiusAxis domain={[0, 1]} axisLine={false} tick={false} />
                          <Radar name="Risen Average" dataKey="B" stroke="#e5b575" fill="#e5b575" fillOpacity={0.6} />
                          <Radar name="You" dataKey="A" stroke="#6d83ff" fill="#6d83ff" fillOpacity={0.6} />
                          {/* <Legend /> */}
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="col-sm-5">
                    <div className="row">
                      <div className="col">
                        <table className="table text-light table-responsive">
                          <thead>
                            <tr>
                              <th style={noTopStyle} className="risen-sub-label">Champion</th>
                              <th style={noTopStyle} className="risen-sub-label center">KDA</th>
                              <th style={noTopStyle} className="risen-sub-label center">Winrate</th>
                              <th style={noTopStyle} className="risen-sub-label center">Games</th>
                            </tr>
                          </thead>
                          <tbody style={{overflow: "scroll"}}>
                            {
                              this.champs.map((champ, i) => {
                                if (i >= 5)
                                  return null
                                return (
                                  <tr key={champ.championId}>
                                    <td style={thinRowStyle}>{champMap[champ.championId]}</td>
                                    <td style={thinRowStyle} className="center">{this.getKDA(champ)}</td>
                                    <td style={thinRowStyle} className="center">{customRound(champ.total_wins / champ.total_games, 2) * 100}%</td>
                                    <td style={thinRowStyle} className="center">{champ.total_games}</td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                      {/* <div className="col">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="risen-sub-label">Champion</th>
                              <th className="risen-sub-label">KDA</th>
                              <th className="risen-sub-label">Winrate</th>
                              <th className="risen-sub-label">Games</th>
                            </tr>
                          </thead>
                        </table>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

const progressStyle = {
  // maxWidth: '40%',
  // width: '40%',
  magin: 'auto'
}

const noTopStyle = {
  borderTop: 'none',
  borderBottom: 'none'
}

const thinRowStyle = {
  padding: "0 12px"
}