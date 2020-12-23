import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class GenerateCodes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      codes: "",
      seasons: []
    }
    this.loadSeasons();
  }

  loadSeasons() {
    const url = process.env.REACT_APP_BASE_URL + "/seasons/codeable";
    fetch(url, {
      credentials: 'include',
    }).then(data => {
      data.json().then(data => {
        this.setState({
          seasons: data
        });
      });
    })
  }

  createNewSeason() {
    const newSeasonString = document.getElementById('new-season-name').value;
    if (newSeasonString.length < 5) {
      alert("Make Season Name Longer (>5)");
      return;
    }
    const url = process.env.REACT_APP_BASE_URL + "/seasons/new";
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        'name': newSeasonString
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status !== 200) {
        alert(res.statusText);
        return;
      }
      this.loadSeasons();
      alert("Season Created");
    })
  }
  

  getCodes() {
    let count = document.getElementById("tournament-teams").value;
    let season = document.getElementById("season-select").value;
    if ( !count ) {
      alert("Please fill out the number of codes requested");
      return;
    }
    const url = process.env.REACT_APP_BASE_URL + "/codes/create";
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        count: count,
        season: season
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status !== 200) {
        alert(res.statusText);
        return;
      }
      res.json().then(data => {
        this.setState({
          codes: data.join("\n")
        });
      });
    }, (err) => {
      alert("Failed requesting codes: \n" + err);
    });
  }

  render() {
    return (
      <section>
        <div className="row">
          <div className="col">
            <h2>Generate Codes</h2>
          </div>
        </div>
        <div className="row">
          <div className="col">
            Season: 
            <select id="season-select">
              {
                this.state.seasons.map(season => {
                  return (
                    <option value={season._id}>{season.seasonName}</option>
                  )
                })
              }
            </select>
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col">
              <input id="new-season-name" placeholder="New Season Name"></input>
          </div>
          <div className="col">
              <Button onClick={this.createNewSeason.bind(this)}>Create New Season</Button>
          </div>
        </div>
        <div className="row">
          <div className="col" style={verticalCenter}>
            <div>
              <label htmlFor="tournament-teams">Number of Matches: </label>
              <input id="tournament-teams" name="tournament-teams" type="number" placeholder="10"></input>
            </div>
          </div>
          <div className="col">
            <button className="risen-button" onClick={this.getCodes.bind(this)}>Generate Codes</button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div>Codes</div>
            <textarea id="tourney-codes" value={this.state.codes} style={{width: '100%'}} readOnly={true}></textarea>
          </div>
        </div>
      </section>
    )
  }
}

const verticalCenter = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}
