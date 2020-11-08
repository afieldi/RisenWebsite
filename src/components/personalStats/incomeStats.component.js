import React, { Component } from 'react';
import { Container, Form } from 'react-bootstrap';
import { customRound } from '../../Helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default class IncomeStats extends Component {
  constructor(props) {
    super(props);
    this.statData = [];
    this.filteredData = [];
    this.accStats = [];
    this.avgData = [];
    this.state = {
      consumptionStats: {},
      vsStats: {},
      graphStat: "goldEarned",
      graphSize: 10
    }
  }

  aggregateConsumptionStats() {
    let type = document.getElementById("consumptionType");
    if (type == null) {
        return;
    }
    type = type.value;
    const totals = {
      "Gold Earned": 0,
      "Minions Killed": 0,
      "Jungle Creeps": 0,
      "Counter Jungled": 0
    }
    this.filteredData.map(game => {
        totals["Gold Earned"] += game.goldEarned;
        totals["Minions Killed"] += game.totalMinionsKilled;
        totals["Jungle Creeps"] += game.neutralMinionsKilled;
        totals["Counter Jungled"] += game.neutralMinionsKilledEnemyJungle;
    });
    if (type === "AVG"){
        for (const key of Object.keys(totals)) {
            totals[key] = customRound(totals[key] / this.filteredData.length);
        }
    }

    // For explanation, look at same code in combatStats.component.js
    if (Object.keys(this.state.consumptionStats) === 0) {
      this.state.consumptionStats = totals;
    }
    this.setState({
        consumptionStats: totals
    });
  }

  toTime(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  aggregateVsStats() {
    let type = document.getElementById("vsType");
    if (type == null) {
      return;
    }
    type = type.value;
    const totals = {
      "CSD@10": 0,
      "CSD@20": 0,
      "CSD@30": 0,
      "First Back(min)": 0,
    }
    this.filteredData.map(game => {
      totals["CSD@10"] += customRound(game.csDiff10);
      totals["CSD@20"] += customRound(game.csDiff20);
      totals["CSD@30"] += customRound(game.csDiff30);
      totals["First Back(min)"] += customRound(game.firstItemTime / 60000, 2);
    });
    if (type === "AVG") {
      for (const key of Object.keys(totals)) {
        totals[key] = customRound(totals[key] / this.filteredData.length);
      }
    }

    // For explanation, look at same code in combatStats.component.js
    if (Object.keys(this.state.vsStats) === 0) {
      this.state.vsStats = totals;
    }
    this.setState({
      vsStats: totals
    });
  }

  updateGraph() {
    this.setState({
      graphStat: document.getElementById("goldDataSelect").value,
      graphSize: document.getElementById("dataSizeSelect").value
    })
  }

  filterData() {

  }

  analyzeData() {
    this.aggregateConsumptionStats();
    this.aggregateVsStats();
  }

  shouldComponentUpdate(newProps, newState) {
    // TODO: maybe look for a better way to do this
    if (this.filteredData === newProps.playerData &&
        JSON.stringify(this.state) === JSON.stringify(newState)) {
        return false;
    }
    this.accStats = newProps.accStats;
    this.avgData = newProps.avgData;
    this.filteredData = newProps.playerData;
    this.filterData();
    this.analyzeData();
    return true;
  }

  createTimeData(type="avg_goldGen") {
    let data = [];
    let playerGold = 0;
    let risenGold = 0;
    for (let i=0; i<10;i++) {
      data.push({
        "time": i,
        player: playerGold,
        risen: risenGold
      });
      playerGold += this.accStats[type+'10'];
      risenGold += this.avgData[type+'10'];
    }
    for (let i=10; i<20;i++) {
      data.push({
        "time": i,
        player: playerGold,
        risen: risenGold
      });
      playerGold += this.accStats[type+'20'];
      risenGold += this.avgData[type+'20'];
    }
    for (let i=20; i<=30;i++) {
      data.push({
        "time": i,
        player: playerGold,
        risen: risenGold
      });
      playerGold += this.accStats[type+'30'];
      risenGold += this.avgData[type+'30'];
    }
    console.log(data);
    return data;
  }

  getCspm() {
    return customRound((this.accStats['avg_totalMinionsKilled']*60)/this.accStats['avg_gameDuration'], 1);
  }
  getGPM() {
    return customRound((this.accStats['avg_goldEarned']*60)/this.accStats['avg_gameDuration'], 1);
  }
  getXPM() {
    // This one sucks lol
    let xpavg = this.accStats['avg_xpGen10'] + this.accStats['avg_xpGen20'] + this.accStats['avg_xpGen30'];
    xpavg /= 3;
    return customRound(xpavg, 0);
  }
  FIT() {
    let time = customRound(this.accStats['avg_firstItemTime']/1000, 0);
    let min = Math.floor(time / 60);
    let sec = time % 60;
    if (sec<10)
      sec = '0'+sec;
    return [time, `${min}:${sec}`];
  }
  

  render() {
    return (
      <section>
        <Container>
          <div className="row">
            <div className="col-md cramped">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                <h3>Gold Earned</h3>
                </div>
                <div className="risen-stats-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={this.createTimeData("avg_goldGen")}>
                      {/* <Line dataKey={this.state.graphStat}></Line> */}
                      <CartesianGrid stroke="#ccc" />
                      <XAxis tick={{fill: 'white'}} />
                      <YAxis tick={{fill: 'white'}} />
                      <Area name="Risen Average" dataKey="risen" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6}></Area>
                      <Area name="You" dataKey="player" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}></Area>
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-md cramped">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>XP Earned</h3>
                </div>
                <div className="risen-stats-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={this.createTimeData("avg_xpGen")}>
                      {/* <Line dataKey={this.state.graphStat}></Line> */}
                      <CartesianGrid stroke="#ccc" />
                      <XAxis tick={{fill: 'white'}} />
                      <YAxis tick={{fill: 'white'}} />
                      <Area name="Risen Average" dataKey="risen" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6}></Area>
                      <Area name="You" dataKey="player" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}></Area>
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md cramped">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>CS/min</h3>
                </div>
                <div className="risen-stats-body">
                  <CircularProgressbar value={(this.getCspm()/10)*100} text={`${this.getCspm()}`}/>
                </div>
              </div>
            </div>
            <div className="col-md cramped">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>Gold/min</h3>
                </div>
                <div className="risen-stats-body">
                  <CircularProgressbar
                    styles={buildStyles({pathColor: '#e4a013', textColor: '#e4a013'})}
                    value={(this.getGPM()/500)*100} text={`${this.getGPM()}`} />
                </div>
              </div>
            </div>
            <div className="col-md cramped">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>First Back</h3>
                </div>
                <div className="risen-stats-body">
                  <CircularProgressbar
                    styles={buildStyles({pathColor: '#189018', textColor: '#189018'})} 
                    value={(1-(this.FIT()[0]/600))*100} text={`${this.FIT()[1]}`} />
                </div>
              </div>
            </div>
            <div className="col-md cramped">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>EXP/min</h3>
                </div>
                <div className="risen-stats-body">
                  <CircularProgressbar
                    styles={buildStyles({pathColor: '#d82f2f', textColor: '#d82f2f'})} 
                    value={(this.getXPM()/500)*100} text={`${this.getXPM()}`} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    )
  }
}