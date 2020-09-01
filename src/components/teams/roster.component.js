import React, { Component } from 'react';
import fetch from 'node-fetch';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class Roster extends Component {
  constructor(props) {
    super(props);
    this.loadSeason(this.props.match.params.league);
    this.state = {
      seasonName: "",
      sheetUrl: "",
      teams: []
    }
  }

  loadSeason(seasonName) {
    let url = process.env.REACT_APP_BASE_URL + "/teams?season=" + seasonName;
    fetch(url).then((data) => {
      data.json().then(seasonInfo => {
        if(seasonInfo.season === undefined) {
          alert("Season not found!")
          this.props.history.push("/");
          return;
        }

        let teams = seasonInfo.teams;
        let dTeams = {}
        teams.map(v => {
          if(!dTeams[v.division]) {
            dTeams[v.division] = [];
          }
          dTeams[v.division].push(v);
        });
        this.setState({
          seasonName: seasonInfo.season.seasonName,
          sheetUrl: seasonInfo.season.spreadsheet,
          teams: dTeams
        });
      }, err => {console.log(err)})
    })
    console.log(seasonName);
  }

  render() {
    return (
      <section>
        <div className="dark-section">
          <Container>
            <div className="row" style={{borderBottom: '1px solid grey'}}>
              <div className="col">
                <div style={{...nameStyle, ...titleStyle}}>{this.state.seasonName}
                {
                  this.state.sheetUrl ? <Button className="btn risen-button-small" style={{display: 'inline-block', marginLeft: '20px'}}>
                    <a href={this.state.sheetUrl} style={{...nameStyle, ...{fontSize: '14px'}}}>SPREADSHEET</a>
                  </Button> : null
                }
                </div>
              </div>
            </div>
            {
              Object.keys(this.state.teams).map(division => {
                return (
                  <div>
                    <div className="row" style={boxStyle}>
                      <div className="col">
                        <div style={{...nameStyle, ...{fontSize: '28px'}}}>Division {division}</div>
                      </div>
                    </div>
                    {
                      this.state.teams[division].map((team, i) => {
                        return (
                          <div className="row text-light" style={boxStyle}>
                            <div className="col-1" style={{display: 'flex', justifyContent: 'center', paddingTop: '5px', fontSize: '30px'}}><div style={{display: 'inline-block'}}>{+i + 1}</div></div>
                            <div className="col">
                              <div style={{fontSize: '1.2em'}}>{team.teamname}: <a style={{...nameStyle, ...{fontSize: '.9em', padding: '0'}}}>0W-0L</a></div>
                              <div className="row">
                                {team.playerObject.map(p => {
                                  return (
                                    <div className="col-2" style={{...playerName}}>
                                      <Link style={playerName} to={`/detailed/${p.name}`}>{p.name}</Link>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
            }
          </Container>
        </div>
      </section>
    )
  }
}

const boxStyle = {
  borderTop: '1px solid grey',
  borderBottom: '1px solid grey',
  padding: '10px 0'
}

const nameStyle = {
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: '700',
  color: '#bebebe',
  padding: '0 10px'
}

const titleStyle = {
  fontSize: '32px',
  paddingBottom: '10px'
}

const playerName = {
  display: 'inline-block',
  color: '#bebebe',
  margin: '5px 10px'
}