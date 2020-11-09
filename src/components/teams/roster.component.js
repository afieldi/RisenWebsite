import React, { Component } from 'react';
import fetch from 'node-fetch';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../../context/UserContext';

export default class Roster extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.loadSeason(this.props.match.params.league);
    this.state = {
      seasonName: "",
      sheetUrl: "",
      teams: [],
      modalTeam: {
        playerObject: []
      }
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
  }

  saveTeam() {
    let url = process.env.REACT_APP_BASE_URL + "/teams";
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(this.state.modalTeam)
    }).then(data => {
      console.(data);
    })
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
              this.context === 1 ? 
              <Button>Add New Team</Button>
              : null
            }
            {
              Object.keys(this.state.teams).map(division => {
                return (
                  <div key={division}>
                    <div className="row" style={boxStyle}>
                      <div className="col">
                        <div style={{...nameStyle, ...{fontSize: '28px'}}}>Division {division}</div>
                      </div>
                    </div>
                    {
                      this.state.teams[division].map((team, i) => {
                        return (
                          <div className="row text-light" style={boxStyle} key={i}>
                            <div className="col-1" style={{display: 'flex', justifyContent: 'center', paddingTop: '5px', fontSize: '30px'}}><div style={{display: 'inline-block'}}>{+i + 1}</div></div>
                            <div className="col">
                              <div style={{fontSize: '1.2em'}}>
                                {team.teamname}: <a style={{...nameStyle, ...{fontSize: '.9em', padding: '0'}}}>0W-0L</a>
                                {
                                  this.context === 1 ? 
                                  <Button className="btn btn-primary" style={smallButtonStyle} data-toggle="modal" data-target="#exampleModal"
                                          onClick={(() => {this.setState({modalTeam: JSON.parse(JSON.stringify(team))})}).bind(this)}>
                                    Edit Team
                                  </Button> 
                                  : null
                                }
                              </div>
                              <div className="row">
                                {team.playerObject.map(p => {
                                  return (
                                    <div className="col-2" style={{...playerName}} key={p._id}>
                                      <Link style={{...playerName, ...{overflowWrap: 'break-word'}}} to={`/detailed/${p.name}`}>{p.name}</Link>
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

        {/* Edit team Modal */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Editing {this.state.modalTeam.teamname}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label for="edit-teamname">Team Name</label>
                    <input id="edit-teamname" type="text" value={this.state.modalTeam.teamname} 
                          onChange={((e)=>{this.state.modalTeam.teamname=e.target.value;this.setState({modalTeam:this.state.modalTeam})}).bind(this)}></input>
                  </div>
                  <div className="form-group">
                    <label for="edit-teamshort">Team Short</label>
                    <input id="edit-teamshort" type="text" value={this.state.modalTeam.teamshortname}
                      onChange={((e)=>{this.state.modalTeam.teamname=e.target.value;this.setState({modalTeam:this.state.modalTeam})}).bind(this)}></input>
                  </div>
                  <div className="form-group">
                    <label for="edit-teamdiv">Division</label>
                    <input id="edit-teamdiv" type="text" value={this.state.modalTeam.division}
                      onChange={((e)=>{this.state.modalTeam.teamname=e.target.value;this.setState({modalTeam:this.state.modalTeam})}).bind(this)}></input>
                  </div>
                  <div className="form-group">
                    <ul>
                      {
                        this.state.modalTeam.playerObject.map(player => {
                          return (
                            <li key={player._id}><Button style={smallButtonStyle}>X</Button> {player.name}</li>
                          )
                        })
                      }
                    </ul>
                  </div>
                  <div>
                    {
                      this.state.modalTeam.playerObject.length < 10 ?
                      <Button className="btn btn-success">Add Player</Button>
                      : null
                    }
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <Button type="button" className="btn btn-primary" onClick={this.saveTeam.bind(this)}>Save changes</Button>
              </div>
            </div>
          </div>
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

const smallButtonStyle = {
  fontSize: '.75em',
  padding: '0 10px',
  margin: '0 10px'
}