import React, { Component } from 'react';
import axios from 'axios';

export default class CreateTeam extends Component {
  constructor(props) {
    super(props);

    this.onChangeTeamname = this.onChangeTeamname.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      teamname: ''
    }
  }

  onChangeTeamname(e) {
    this.setState({
      teamname: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const team = {
      teamname: this.state.teamname
    }

    console.log(team);

    axios.post('http://localhost:5000/teams/add', team)
      .then(res => console.log(res.data));

    this.setState({
      teamname: ''
    })
  }

  render() {
    return (
      <div>
        <h3>Create New Team</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group"> 
            <label>Team Name: </label>
            <input  type="text"
                required
                className="form-control"
                value={this.state.teamname}
                onChange={this.onChangeTeamname}
                />
          </div>
          <div className="form-group">
            <input type="submit" value="Create Team" className="btn btn-primary" />
          </div>
        </form>
      </div>
    )
  }
}