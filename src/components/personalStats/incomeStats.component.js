import React, { Component } from 'react';
import { Container, Form } from 'react-bootstrap';
import { customRound } from '../../Helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

export default class IncomeStats extends Component {
  constructor(props) {
    super(props);
    this.statData = [];
    this.filteredData = [];
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
    this.filteredData = newProps.playerData;
    this.filterData();
    this.analyzeData();
    return true;
  }

  render() {
    return (
      <section>
        <Container>
          <div className="row">
            <div className="col-md">
              <div className="risen-stats-block text-light">
                <div className="risen-stats-header">
                  <h3>Consumption Stats</h3>
                  <Form.Group controlId="consumptionType">
                    <Form.Control as="select" defaultValue="AVG" onChange={this.aggregateConsumptionStats.bind(this)}>
                      <option value="TOTAL">Total</option>
                      <option value="AVG">Average</option>
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="risen-stats-body">
                  <table className="table-striped table risen-table">
                      <tbody>
                        {
                          Object.entries(this.state.consumptionStats).map((entry, index) => {
                            return (
                              <tr key={"consumptionStatsRow-" + index}>
                                <td><b>{entry[0]}</b></td>
                                <td>{entry[1]}</td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md">
              <div className="risen-stats-block text-light">
                <div className="risen-stats-header">
                  <h3>VS Stats</h3>
                  <Form.Group controlId="vsType">
                    <Form.Control as="select" defaultValue="AVG" onChange={this.aggregateVsStats.bind(this)}>
                      <option value="TOTAL">Total</option>
                      <option value="AVG">Average</option>
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="risen-stats-body">
                  <table className="table-striped table risen-table">
                    <tbody>
                      {
                        Object.entries(this.state.vsStats).map((entry, index) => {
                          return (
                            <tr key={"genStatsRow-" + index}>
                              <td><b>{entry[0]}</b></td>
                              <td>{entry[1]}</td>
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
          <div className="row">
            <div className="col">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>Gold Graph</h3>
                </div>
                <div className="risen-stats-body">
                  <div className="row">
                    <div className="col-8">
                      <LineChart width={600} height={300} data={this.filteredData.slice(0, this.state.graphSize)}>
                        <Line dataKey={this.state.graphStat}></Line>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis tick={false} label="Game" />
                        <YAxis />
                      </LineChart>
                    </div>
                    <div className="col-4">
                      <h4>Filters</h4>
                        <Form>
                            <Form.Group controlId="goldDataSelect">
                                <Form.Label>Stat</Form.Label>
                                <Form.Control as="select" defaultValue="goldEarned" onChange={this.updateGraph.bind(this)}>
                                    <option value="goldEarned">Total Gold</option>
                                    <option value="csDiff10">CSD@10</option>
                                    <option value="csDiff20">CSD@20</option>
                                    <option value="csDiff30">CSD@30</option>
                                    <option value="firstItemTime">First Back</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="dataSizeSelect" defaultValue="10" onChange={this.updateGraph.bind(this)}>
                                <Form.Label>Games Shown</Form.Label>
                                <Form.Control as="select">
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    )
  }
}