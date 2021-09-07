import React, { Component } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { setDropDowns, urlOnChange } from './../Helpers';
import CombatLeagueStats from './leagueStats/combat-league-stats.component';
import GeneralLeagueStats from './leagueStats/general-league-stats.component';
import Leaderboards from './leagueStats/leaderboards.component';

export default class LeagueStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genData: [],
      leagueData: [],
      seasons: [],
      season: ""
    }
  }

  componentDidMount() {
    // this.getGeneralData();
    this.loadSeasons(() => {
      setDropDowns.bind(this)();
      this.performFilter();
    });
  }

  performFilter() {
    let s = document.getElementById("seasonFilter").value;
    this.setState({
      season: s
    })
    this.getGeneralData(s)
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

  getGeneralData(season=null) {
    let q = ""
    if (season && season !== "ANY") {
      q = "?season=" + season
    }
    const leagueUrl = process.env.REACT_APP_BASE_URL + "/stats/general/league" + q;
    fetch(leagueUrl).then(lData => {
      lData.json().then(lData => {
        this.setState({
          leagueData: lData
        });
      })
    })
  }

  getTotalGames() {
    let g = 0;
    for (let s of this.state.leagueData) {
      g += s["total_games"];
      break;
    }
    return g;
  }

  getTotalPlayers() {
    return this.state.genData.length;
  }

  render() {
    return (
      <section>
        <div className="dark-section text-light">
          <Container>
            <div>
              <h1>League Stats</h1>
              <hr style={{backgroundColor: 'white'}}></hr>
            </div>

            <div className="row">
              <div className="col">
                <div className="risen-stats-block">
                  <div className="risen-stats-header">
                    <h3>Filters</h3>
                  </div>
                  <div className="risen-stats-body">
                    <div className="row">
                      <div className="col-md">
                        <Form.Group controlId="seasonFilter" onChange={urlOnChange.bind(this)}>
                          <Form.Label>Season</Form.Label>
                          <Form.Control as="select" defaultValue="ANY">
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
                      {/* <div className="col-md">
                        <Form.Group controlId="durationFilter">
                          <Form.Label>Duration</Form.Label>
                          <Form.Control as="select">
                            <option value="ANY">Any</option>
                            <option value="0-20">20min</option>
                            <option value="20-30">20-30min</option>
                            <option value="30-120">30+min</option>
                          </Form.Control>
                        </Form.Group>
                      </div> */}
                      {/* <div className="col-md">
                        <Form.Group controlId="resultFilter">
                          <Form.Label>Result</Form.Label>
                          <Form.Control as="select">
                            <option value="ANY">Any</option>
                            <option value="WIN">Win</option>
                            <option value="LOSS">Loss</option>
                          </Form.Control>
                        </Form.Group>
                      </div> */}
                      <div className="col-md-4">
                        <Button className="btn filter-button" onClick={this.performFilter.bind(this)}>Filter</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            

            <div className="row">
              <div className="col">
                <div className="risen-stats-block">
                  <div className="risen-stats-header">
                    <h3>General Stats</h3>
                  </div>
                  <div className="risen-stats-body">
                    <div className="row">
                      <div className="col-sm">
                        <div className="center">{this.getTotalGames()}</div>
                        <div className="center risen-sub-label">Games</div>
                      </div>
                      {/* <div className="col-sm">
                        <div className="center">{this.getTotalPlayers()}</div>
                        <div className="center risen-sub-label">Players</div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <nav>
              <ul className="nav nav-tabs" id="nav-tab" role="tablist" style={navStyle}>
                {/* <a className="nav-item nav-link active" id="nav-basic-tab" data-toggle="tab" href="#nav-basic" role="tab" aria-controls="nav-basic" aria-selected="true">Basic Stats</a> */}
                <li className="nav-item" role="presentation">
                    <a className="nav-link active" id="nav-gen-tab" data-toggle="tab" href="#nav-gen" role="tab" aria-controls="nav-gen" aria-selected="true">Side</a>
                </li>
                {/* <li className="nav-item" role="presentation">
                  <a className="nav-link" id="nav-income-tab" data-toggle="tab" href="#nav-income" role="tab" aria-controls="nav-income" aria-selected="false">Combat</a>
                </li> */}
                <li className="nav-item" role="presentation">
                  <a className="nav-link" id="nav-leaderboards-tab" data-toggle="tab" href="#nav-leaderboards" role="tab" aria-controls="nav-leaderboards" aria-selected="false">Leaderboards</a>
                </li>
                {/* <li className="nav-item" role="presentation">
                  <a className="nav-link" id="nav-champ-tab" data-toggle="tab" href="#nav-champ" role="tab" aria-controls="nav-champ" aria-selected="false">Champions</a>
                </li> */}
              </ul>
            </nav>
            <div className="tab-content" id="nav-tabContent" style={tabStyle}>
              <div className="tab-pane fade show active" id="nav-gen" role="tabpanel" aria-labelledby="nav-gen-tab">
                <GeneralLeagueStats genData={this.state.genData} leagueData={this.state.leagueData}></GeneralLeagueStats>
              </div>
              {/* <div className="tab-pane fade" id="nav-income" role="tabpanel" aria-labelledby="nav-income-tab">
                <CombatLeagueStats genData={this.state.genData} leagueData={this.state.leagueData}></CombatLeagueStats>
              </div> */}
                <div className="tab-pane fade" id="nav-leaderboards" role="tabpanel" aria-labelledby="nav-leaderboards-tab">
                <Leaderboards player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats} avgData={this.state.avgData} season={this.state.season}></Leaderboards>
                </div>
                {/* <div className="tab-pane fade" id="nav-champ" role="tabpanel" aria-labelledby="nav-champ-tab">
                <ChampionStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats} avgData={this.state.avgData}></ChampionStats>
              </div> */}
            </div>
          </Container>
        </div>
      </section>
    )
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