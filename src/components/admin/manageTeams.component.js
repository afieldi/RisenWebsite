import React, {Component} from 'react';
import { Container, Button } from 'react-bootstrap';
import fetch from 'node-fetch';

export default class ManageTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSeasons: [],
            season: {}
        }
    }

    componentDidMount() {
        this.getActiveSeasons();
    }

    getActiveSeasons() {
        const url = process.env.REACT_APP_BASE_URL + "/seasons/active";
        fetch(url).then(data => {
            data.json().then(activeSeasons => {
                this.setState({
                    activeSeasons: activeSeasons
                });
            });
        });
    }

    loadSeason() {
        const ele = document.getElementById('seasonName');
        const url = process.env.REACT_APP_BASE_URL + '/seasons/' + ele.value;
        fetch(url).then(data => {
            data.json().then(season => {
                this.setState({
                    season: season
                });
            })
        })
    }

    removePlayer(player, id) {
        const r = window.confirm('Are you sure you want to remove ' + player + ' from their team?');
        if (r === false) {
            return;
        }
    }

    removeTeam(teamName, id) {
        const r = window.confirm('Are you sure you want to remove ' + teamName + ' from the league?');
        if (r === false) {
            return;
        }
    }

    addPlayer() {

    }

    addTeam() {

    }

    render() {
        return (
            <section>
                <div className="dark-section text-light">
                    <Container>
                        <div>
                            <h2>Load Team From Spreadsheet</h2>
                            <hr style={{backgroundColor: 'white'}}></hr>
                        </div>
                        <form action="http://localhost:5000/teams/load" method="POST" encType="multipart/form-data">
                            <div className='row'>
                                <div className='col-8'>
                                    <input type="text" name="seasonName" placeholder="Season Name Here"></input>
                                    <input type="file" name="teamSheet"></input>
                                </div>
                                <div className="col-md">
                                    <button type="submit">Load Team</button>
                                </div>
                            </div>
                        </form>
                        <br></br>
                        <div>
                            <h2>Edit Teams</h2>
                            <hr style={{backgroundColor: 'white'}}></hr>
                        </div>
                        {/* <div className="row">
                            <div className="col">
                                
                            </div>
                        </div> */}
                        <div>
                            <select id="seasonName" onChange={this.loadSeason.bind(this)}>
                                <option>Select Active League</option>
                                {
                                    this.state.activeSeasons.map(season => {
                                        return (
                                            <option key={season.stringid} value={season.stringid}>{season.seasonName}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <hr style={{backgroundColor: 'white'}}></hr>
                        <div>
                            {
                                this.state.season.season ? 
                                <div>
                                    <h1>{this.state.season.season.seasonName}</h1>
                                    <div style={teamHolderStyle}>
                                        {this.state.season.teams.map(team => {
                                            return (
                                                <div>
                                                    <Button style={{padding: '0 10px', height: '1.5em'}} className='btn btn-success' onClick={this.addTeam.bind(this, team.teamname, team._id)}>+</Button>
                                                    <Button style={{padding: '0 10px', height: '1.5em'}} className='btn btn-danger' onClick={this.removeTeam.bind(this, team.teamname, team._id)}>X</Button>
                                                    <div style={nameBoxStyle}>
                                                        <b>{team.teamname}</b>
                                                    </div>
                                                    {
                                                        team.playerObject.map(p => {
                                                            return (
                                                                <div style={nameBoxStyle}>
                                                                    <Button style={buttonStyle} className='btn btn-warning' onClick={this.removePlayer.bind(this, p.name, p._id)}>X</Button>
                                                                    {p.name}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        <Button className='btn btn-success'>Add New Team</Button>
                                    </div>
                                </div> : null
                            }
                        </div>
                        <hr style={{backgroundColor: 'white'}}></hr>
                        <div>
                            <Button>Something</Button>
                        </div>
                    </Container>
                </div>
            </section>
        );
    }
}

const teamHolderStyle = {
    whiteSpace: 'nowrap',
    overflow: 'auto'
}

const buttonStyle = {
    float: 'left',
    padding: '0 10px',
    margin: '0 10px',
    height: '1.5em'
}

const nameBoxStyle = {
    width: '175px',
    margin: '0 10px',
    display: 'inline-block',
    overflow: 'hidden'
}