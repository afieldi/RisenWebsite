  
import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class EditGame extends Component {
  constructor(props) {
    super(props);

    this.onChangeTeamname = this.onChangeTeamname.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      teamname: '',
      duration: 0,
      date: new Date(),
      teams: []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:5000/games/'+this.props.match.params.id)
      .then(response => {
        this.setState({
          teamname: response.data.teamname,
          duration: response.data.duration,
          date: new Date(response.data.date)
        })   
      })
      .catch(function (error) {
        console.log(error);
      })

    axios.get('http://localhost:5000/teams/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            teams: response.data.map(team => team.teamname),
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })

  }

  onChangeTeamname(e) {
    this.setState({
      teamname: e.target.value
    })
  }

  onChangeDuration(e) {
    this.setState({
      duration: e.target.value
    })
  }

  onChangeDate(date) {
    this.setState({
      date: date
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const game = {
      teamname: this.state.teamname,
      duration: this.state.duration,
      date: this.state.date
    }

    console.log(game);

    axios.post('http://localhost:5000/games/update/' + this.props.match.params.id, game)
      .then(res => console.log(res.data));

    window.location = '/';
  }

  render() {
    return (
    <div>
      <h3>Edit Game List</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group"> 
          <label>Teamname: </label>
          <select ref="teamInput"
              required
              className="form-control"
              value={this.state.teamname}
              onChange={this.onChangeTeamname}>
              {
                this.state.teams.map(function(team) {
                  return <option 
                    key={team}
                    value={team}>{team}
                    </option>;
                })
              }
          </select>
        </div>
        <div className="form-group">
          <label>Duration (in minutes): </label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.duration}
              onChange={this.onChangeDuration}
              />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker
              selected={this.state.date}
              onChange={this.onChangeDate}
            />
          </div>
        </div>

        <div className="form-group">
          <input type="submit" value="Edit Game Log" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}