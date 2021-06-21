import React, { Component } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import qs from 'qs';
import { customRound, urlOnChange, setDropDowns } from '../Helpers';
import GeneralChampionStats from './championStats/general-champion-stats.component';

let champMap = require('../data/champions_map.json')

export default class SingleChampionStats extends Component {
  constructor(props) {
    super(props);
    this.champ = this.props.match.params.champId;
    this.state = {
      seasons: [],
      allChampData: [],
      champStats: {},
      champData: []
    }
  }

  componentDidMount() {
    this.loadSeasons(() => {
      setDropDowns.bind(this)();
      this.getData((data) => {this.performFilter(data)});
    });
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

  performFilter(data) {
    let wins = 0;
    let kills = 0;
    let deaths = 0;
    let assists = 0;
    let cspm = 0;
    let dpm = 0;

    let filteredData = this.state.allChampData.filter(game => {
      let laneFilter = document.getElementById("roleFilter").value;
      if (laneFilter !== "ANY") {
        if (game.lane !== laneFilter) {
          return false;
        }
      }

      // let timeFilter = document.getElementById("durationFilter").value;
      // if (timeFilter !== "ANY") {
      //   let t1 = timeFilter.split("-")[0];
      //   let t2 = timeFilter.split("-")[1];
      //   if (game.gameDuration < t1 * 60 || game.gameDuration > t2 * 60) {
      //     return false;
      //   }
      // }

      let seasonFilter = document.getElementById("seasonFilter").value;
      if (seasonFilter !== "ANY") {
        if (game.season !== seasonFilter) {
          return false;
        }
      }

      // Accumulate stats here so we can get averages without needing another loop
      wins += +game.win;
      kills += game.kills;
      deaths += game.deaths;
      assists += game.assists;
      cspm += (game.totalMinionsKilled + game.neutralMinionsKilled) / (game.gameDuration/60);
      dpm += game.totalDamageDealtToChampions / (game.gameDuration/60);
      return true;
    });

    this.setState({
      champStats: {
        "total_wins": wins,
        "total_games": filteredData.length,
        "avg_kills": kills/filteredData.length,
        "avg_deaths": deaths/filteredData.length,
        "avg_assists": assists/filteredData.length,
        "avg_cspm": cspm/filteredData.length,
        "avg_dpm": dpm/filteredData.length
      },
      champData: filteredData
    });
  }

  getData(callback) {
    const url = process.env.REACT_APP_BASE_URL + "/stats/champ/" + this.champ;
    fetch(url).then(data => {
      data.json().then(data => {
        // console.log(data)
        this.setState({
          allChampData: data
        });

        if (callback) {
          callback(data);
        }
        else {
        }
      })
    })
  }

  getWr() {
    return customRound((this.state.champStats["total_wins"]/this.state.champStats["total_games"])*100,2);
  }

  getKDA() {
    console.log(this.state.champStats);
    return `${customRound(this.state.champStats["avg_kills"], 1)}/${customRound(this.state.champStats["avg_deaths"], 1)}/${customRound(this.state.champStats["avg_assists"], 1)}`;
  }

  getCspm() {
    return 10
  }

  render() {
    return (
      <section>
        <div className="dark-section text-light">
          <Container>
            <div>
            <h1>
              <img id="champ-img"
                src={require(`../images/champions/icons/` + champMap[this.champ] + `_0.png`)}
                style={{height: 'auto', width: '60px', paddingRight: '10px'}}></img>
              {champMap[this.champ]}</h1>
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
                          <div className="center">{this.state.champStats["total_games"]}</div>
                          <div className="center risen-sub-label">Games</div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            <nav>
              <ul className="nav nav-tabs" id="nav-tab" role="tablist" style={navStyle}>
                {/* <a className="nav-item nav-link active" id="nav-basic-tab" data-toggle="tab" href="#nav-basic" role="tab" aria-controls="nav-basic" aria-selected="true">Basic Stats</a> */}
                <li className="nav-item" role="presentation">
                    <a className="nav-link active" id="nav-general-tab" data-toggle="tab" href="#nav-general" role="tab" aria-controls="nav-general" aria-selected="true">General</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="nav-income-tab" data-toggle="tab" href="#nav-income" role="tab" aria-controls="nav-income" aria-selected="false">Matchup</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="nav-vision-tab" data-toggle="tab" href="#nav-vision" role="tab" aria-controls="nav-vision" aria-selected="false">Items</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="nav-champ-tab" data-toggle="tab" href="#nav-champ" role="tab" aria-controls="nav-champ" aria-selected="false">Runes</a>
                </li>
              </ul>
            </nav>
            <div className="tab-content" id="nav-tabContent" style={tabStyle}>
              <div className="tab-pane fade show active" id="nav-general" role="tabpanel" aria-labelledby="nav-general-tab">
                <GeneralChampionStats champData={this.state.champData} champStats={this.state.champStats}></GeneralChampionStats>
              </div>
              {/* <div className="tab-pane fade" id="nav-income" role="tabpanel" aria-labelledby="nav-income-tab">
                <IncomeStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats} avgData={this.state.avgData}></IncomeStats>
              </div>
              <div className="tab-pane fade" id="nav-vision" role="tabpanel" aria-labelledby="nav-vision-tab">
                <VisionStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats} avgData={this.state.avgData}></VisionStats>
              </div>
              <div className="tab-pane fade" id="nav-champ" role="tabpanel" aria-labelledby="nav-champ-tab">
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