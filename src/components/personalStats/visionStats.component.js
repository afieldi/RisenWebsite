import React, { Component } from 'react';
import { Container, Form } from 'react-bootstrap';
import { customRound } from '../../Helpers';

export default class VisionStats extends Component {
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
      "Wards Placed@15": 0,
      "Wards Killed@15": 0,
      "Gank Kills": 0,
      "Gank Deaths": 0
    }
    this.state.filteredData.map(game => {
        totals["Wards Placed@15"] += game.wardsPlaced15;
        totals["Wards Killed@15"] += game.wardsKilled15;
        totals["Gank Kills"] += game.gankKills;
        totals["Gank Deaths"] += game.gankDeaths;
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

  aggregateGeneralStats() {
    let type = document.getElementById("generalType");
    if (type == null) {
      return;
    }
    type = type.value;
    const totals = {
      "Vision Score": 0,
      "Wards Killed": 0,
      "VS/Min": 0,
      "Pinks Bought": 0,
    }
    this.state.filteredData.map(game => {
      totals["Vision Score"] += game.visionScore;
      totals["Wards Killed"] += game.wardsKilled ? game.wardsKilled : 0;
      totals["VS/Min"] += customRound(game.visionScore / (game.gameDuration / 60), 1);
      totals["Pinks Bought"] += game.visionWardsBoughtInGame;
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
    this.aggregateGeneralStats();
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
            <div className="col">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>Filters</h3>
                </div>
                <div className="risen-stats-body">
                  
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md">
              <div className="risen-stats-block">
                <div className="risen-stats-header">
                  <h3>Early Stats</h3>
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
                  <h3>General Stats</h3>
                  <Form.Group controlId="generalType">
                    <Form.Control as="select" defaultValue="TOTAL" onChange={this.aggregateGeneralStats.bind(this)}>
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
        </Container>
      </section>
    )
  }
}