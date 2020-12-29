import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { ScatterChart, Scatter, ResponsiveContainer, XAxis, YAxis, ZAxis, CartesianGrid, Legend, Label, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { customRound } from '../../Helpers';

export default class CombatLeagueStats extends Component {
  constructor(props) {
    super(props);
    this.genData = [];
    // this.leagueData = {};
    this.blueData = {};
    this.redData = {};
  }
  shouldComponentUpdate(nextProps, nextState) {
    this.genData = nextProps.genData;
    // this.leagueData = nextProps.leagueData;
    for(let p of nextProps.leagueData) {
      if (p._id === "blue") {
        this.blueData = p;
      }
      else {
        this.redData = p;
      }
    }
    return true;
  }

  generateKillsAssistsVsDeaths() {
    return this.genData.map(p => {
      return {
        name: p._id.player[0],
        nameVal: 1, // This will be the z axis so that we can render the name in the tooltip
        kp: customRound(p.avg_kills + p.avg_assists, 2),
        deaths: customRound(p.avg_deaths, 2)
      }
    })
  }

  generateWardsPlacedVsKilled() {
    return this.genData.map(p => {
      return {
        name: p._id.player[0],
        nameVal: 1, // This will be the z axis so that we can render the name in the tooltip
        wp: customRound(p.avg_wardsPlaced, 2),
        wk: customRound(p.avg_wardsKilled, 2)
      }
    })
  }

  generateSidePieData() {
    return [
      {
        "name": "Blue",
        "value": this.blueData.wins,
        "pvalue": customRound(this.blueData.wins / this.blueData.total_games, 2),
        "fill": "#777BD1"
      },
      {
        "name": "Red",
        "value": this.redData.wins,
        "pvalue": customRound(this.redData.wins / this.redData.total_games, 2),
        "fill": "#F57979"
      }
    ]
  }

  generateHeraldPieData() {
    return [
      {
        "name": "Blue",
        "value": this.blueData.avg_riftHeraldKills,
        "gvalue": customRound(this.blueData.avg_riftHeraldKills, 2),
        "fill": "#777BD1"
      },
      {
        "name": "Red",
        "value": this.redData.avg_riftHeraldKills,
        "gvalue": customRound(this.redData.avg_riftHeraldKills, 2),
        "fill": "#F57979"
      }
    ]
  }

  generateDragonPieData() {
    return [
      {
        "name": "Blue",
        "value": this.blueData.avg_dragonKills,
        "gvalue": customRound(this.blueData.avg_dragonKills, 2),
        "fill": "#777BD1"
      },
      {
        "name": "Red",
        "value": this.redData.avg_dragonKills,
        "gvalue": customRound(this.redData.avg_dragonKills, 2),
        "fill": "#F57979"
      }
    ]
  }

  tooltipScatterFormat(value, name, props) {
    if (name == "Player") {
      return props.payload.name;
    }
    return value;
  }

  tooltipPercentFormat(value, name, props) {
    return (props.payload.pvalue * 100) + "%";
  }

  tooltipByGameFormat(value, name, props) {
    return props.payload.gvalue + "/game";
  }

  render() {
    return (
      <section>
        <Container>
          <div className="row">
            <div className="col">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>Kills + Assists vs Deaths</h3>
                </div>
                <div className="risen-stats-body" style={{paddingBottom: '15px'}}>
                  <ResponsiveContainer width="100%" height={250}>
                    <ScatterChart 
                      margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <ZAxis dataKey="nameVal" name="Player"></ZAxis>
                      <XAxis type="number" dataKey="deaths" name="Deaths" tick={{fill: "white"}} >
                        <Label value="Deaths" position="insideBottom" offset={-8} style={{fill: 'white'}} />
                      </XAxis>
                      <YAxis dataKey="kp" name="KP" tick={{fill: "white"}} >
                        <Label value="KP" angle={-90} position="insideLeft" style={{textAnchor: 'middle', fill: 'white'}} />
                      </YAxis>
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={this.tooltipScatterFormat}/>
                      <Scatter data={this.generateKillsAssistsVsDeaths()} fill="#e5b575" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>Wards Placed Vs Wards Killed</h3>
                </div>
                <div className="risen-stats-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <ScatterChart 
                      margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <ZAxis dataKey="nameVal" name="Player"></ZAxis>
                      <XAxis type="number" dataKey="wp" name="Placed" tick={{fill: "white"}} >
                        <Label value="Wards Placed" position="insideBottom" offset={-8} style={{fill: 'white'}} />
                      </XAxis>
                      <YAxis dataKey="wk" name="Killed" tick={{fill: "white"}} >
                        <Label value="Wards Killed" angle={-90} position="insideLeft" style={{textAnchor: 'middle', fill: 'white'}} />
                      </YAxis>
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={this.tooltipScatterFormat}/>
                      <Scatter data={this.generateWardsPlacedVsKilled()} fill="#6d83ff" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>Side Winrate</h3>
                </div>
                <div className="risen-stats-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Tooltip formatter={this.tooltipPercentFormat}></Tooltip>
                      <Pie data={this.generateSidePieData()} nameKey="name" dataKey="value" >
                        {
                          this.generateSidePieData().map(datum => {
                            return (
                              <Cell fill={datum.fill}></Cell>
                            )
                          })
                        }
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-md">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>Heralds Taken</h3>
                </div>
                <div className="risen-stats-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Tooltip formatter={this.tooltipByGameFormat}></Tooltip>
                      <Pie data={this.generateHeraldPieData()} nameKey="name" dataKey="value" >
                        {
                          this.generateHeraldPieData().map(datum => {
                            return (
                              <Cell fill={datum.fill}></Cell>
                            )
                          })
                        }
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-md">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>Dragons Taken</h3>
                </div>
                <div className="risen-stats-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Tooltip formatter={this.tooltipByGameFormat}></Tooltip>
                      <Pie data={this.generateDragonPieData()} nameKey="name" dataKey="value" >
                        {
                          this.generateDragonPieData().map(datum => {
                            return (
                              <Cell fill={datum.fill}></Cell>
                            )
                          })
                        }
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    )
  }
}