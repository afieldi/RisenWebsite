import React, { Component } from 'react';
import { getBaseUrl } from '../../Helpers';

export default class GenerateCodes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      codes: ""
    }
  }

  getCodes() {
    let count = document.getElementById("tournament-teams").value;
    if ( !count ) {
      alert("Please fill out the number of codes requested");
      return;
    }
    const url = getBaseUrl() + "/codes/create/" + count
    fetch(url, {
      method: 'POST'
    }).then(res => {
      res.json().then(data => {
        console.log(data);
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
