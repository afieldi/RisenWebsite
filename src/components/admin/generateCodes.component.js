import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { getBaseUrl } from '../../Helpers';

export default class GenerateCodes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      codes: ""
    }
  }

  getCodes() {
    console.log("zzzz");
    let count = document.getElementById("tournament-teams").value;
    if ( !count ) {
      alert("Please fill out the number of codes requested")
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
    });
  }

  render() {
    return (
      <section>
        <div className="light-section">
          <Container>
            <div className="row">
              <div className="col">
                <div>Tournament Codes</div>
                <textarea id="tourney-codes" value={this.state.codes} style={{width: '100%'}}></textarea>
              </div>
              <div className="col">
                <label htmlFor="tournament-teams">Number of Matches: </label>
                <input id="tournament-teams" name="tournament-teams" type="number" placeholder="10"></input>
                <button class="risen-button" onClick={this.getCodes.bind(this)}>Gesnerate Codes</button>
              </div>
            </div>
          </Container>
        </div>
      </section>
    )
  }
}