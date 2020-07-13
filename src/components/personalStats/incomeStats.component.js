import React, { Component } from 'react';
import { Container, Form } from 'react-bootstrap';
import { customRound } from '../../Helpers';

export default class IncomeStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statData: [],
      filteredData: [],
      earlyStats: {},
      generalStats: {}
    }
  }

  aggregateEarlyStats() {
    let type = document.getElementById("earlyType");
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
    this.state.filteredData.map(game => {
        totals["Gold Earned"] += game.goldEarned;
        totals["Minions Killed"] += game.totalMinionsKilled;
        totals["Jungle Creeps"] += game.neutralMinionsKilled;
        totals["Counter Jungled"] += game.neutralMinionsKilledEnemyJungle;
    });
    if (type === "AVG"){
        for (const key of Object.keys(totals)) {
            totals[key] = customRound(totals[key] / this.state.filteredData.length);
        }
    }
    this.setState({
        earlyStats: totals
    });
  }

  toTime(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  aggregateCompStats() {
    let type = document.getElementById("generalType");
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
    this.state.filteredData.map(game => {
      totals["CSD@10"] += customRound(game.csDiff10);
      totals["CSD@20"] += customRound(game.csDiff20);
      totals["CSD@30"] += customRound(game.csDiff30);
      totals["First Back(min)"] += customRound(game.firstItemTime / 60000, 2);
    });
    if (type === "AVG") {
      for (const key of Object.keys(totals)) {
        totals[key] = customRound(totals[key] / this.state.filteredData.length);
      }
    }
    this.setState({
      generalStats: totals
    });
  }

  filterData() {

  }

  analyzeData() {
    this.aggregateEarlyStats();
    this.aggregateCompStats();
  }

  componentDidUpdate() {
    // Handle Async update to playerdata stuff
    if (this.state.statData.length === 0 && this.props.playerData.length !== 0) {
        this.setState({
            statData: this.props.playerData,
            filteredData: JSON.parse(JSON.stringify(this.props.playerData))
        }, () => {
            this.filterData();
            this.analyzeData();
        });
    }
  }

  render() {
    return (
      <section>
        <Container>
          <div className="row">
            <div className="col-md">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>Consumption Stats</h3>
                  <Form.Group controlId="earlyType">
                    <Form.Control as="select" defaultValue="TOTAL" onChange={this.aggregateEarlyStats.bind(this)}>
                      <option value="TOTAL">Total</option>
                      <option value="AVG">Average</option>
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="risen-stats-body">
                  <table className="table-striped table risen-table">
                      <tbody>
                        {
                          Object.entries(this.state.earlyStats).map((entry, index) => {
                            return (
                              <tr key={"earlyStatsRow-" + index}>
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
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>VS Stats</h3>
                  <Form.Group controlId="generalType">
                    <Form.Control as="select" defaultValue="TOTAL" onChange={this.aggregateCompStats.bind(this)}>
                      <option value="TOTAL">Total</option>
                      <option value="AVG">Average</option>
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="risen-stats-body">
                  <table className="table-striped table risen-table">
                    <tbody>
                      {
                        Object.entries(this.state.generalStats).map((entry, index) => {
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
                  
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    )
  }
}