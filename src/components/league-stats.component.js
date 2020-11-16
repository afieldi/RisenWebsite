import fetch from 'node-fetch';
import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import CombatLeagueStats from './leagueStats/combat-league-stats.component';
import GeneralLeagueStats from './leagueStats/general-league-stats.component';

export default class LeagueStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genData: [],
      leagueData: {}
    }
  }

  componentDidMount() {
    this.getGeneralData();
  }

  getGeneralData() {
    const url = process.env.REACT_APP_BASE_URL + "/stats/avg/byplayer";
    fetch(url).then(data => {
      data.json().then(data => {
        const leagueUrl = process.env.REACT_APP_BASE_URL + "/stats/general/league";
        fetch(leagueUrl).then(lData => {
          lData.json().then(lData => {
            this.setState({
              genData: data,
              leagueData: lData[0]
            });
          })
        })
      });
    });
  }
  render() {
    return (
      <section>
        <div className="dark-section text-light">
          <Container>

          <nav>
            <ul className="nav nav-tabs" id="nav-tab" role="tablist" style={navStyle}>
              {/* <a className="nav-item nav-link active" id="nav-basic-tab" data-toggle="tab" href="#nav-basic" role="tab" aria-controls="nav-basic" aria-selected="true">Basic Stats</a> */}
              <li className="nav-item" role="presentation">
                  <a className="nav-link active" id="nav-gen-tab" data-toggle="tab" href="#nav-gen" role="tab" aria-controls="nav-gen" aria-selected="true">Side</a>
              </li>
              <li className="nav-item" role="presentation">
                <a className="nav-link" id="nav-income-tab" data-toggle="tab" href="#nav-income" role="tab" aria-controls="nav-income" aria-selected="false">Combat</a>
              </li>
              {/* <li className="nav-item" role="presentation">
                <a className="nav-link" id="nav-vision-tab" data-toggle="tab" href="#nav-vision" role="tab" aria-controls="nav-vision" aria-selected="false">Vision</a>
              </li> */}
              {/* <li className="nav-item" role="presentation">
                <a className="nav-link" id="nav-champ-tab" data-toggle="tab" href="#nav-champ" role="tab" aria-controls="nav-champ" aria-selected="false">Champions</a>
              </li> */}
            </ul>
          </nav>
          <div className="tab-content" id="nav-tabContent" style={tabStyle}>
            <div className="tab-pane fade show active" id="nav-gen" role="tabpanel" aria-labelledby="nav-gen-tab">
              <GeneralLeagueStats genData={this.state.genData} leagueData={this.state.leagueData}></GeneralLeagueStats>
            </div>
            <div className="tab-pane fade" id="nav-income" role="tabpanel" aria-labelledby="nav-income-tab">
              <CombatLeagueStats genData={this.state.genData} leagueData={this.state.leagueData}></CombatLeagueStats>
            </div>
              {/* <div className="tab-pane fade" id="nav-vision" role="tabpanel" aria-labelledby="nav-vision-tab">
              <VisionStats player={this.state.playerName} playerData={this.state.filteredData} accStats={this.state.accumulatedStats} avgData={this.state.avgData}></VisionStats>
              </div> */}
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