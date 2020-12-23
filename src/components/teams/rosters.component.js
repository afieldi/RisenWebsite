import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class Rosters extends Component {

  constructor(props) {
    super(props);
    this.state = {
      seasons: []
    }
  }

  componentDidMount() {
    this.loadSeasons();
  }

  loadSeasons() {
    const url = process.env.REACT_APP_BASE_URL + "/seasons/active";
    fetch(url).then(data => {
      data.json().then(seasons => {
        this.setState({
          seasons: seasons
        });
      });
    })
  }

  goTo(dest) {
    this.props.history.push(dest);
  }

  render() {
    return (
      <section>
        <div className="dark-section">
          <Container>
            <h1 style={nameStyle}>
              League Rosters
            </h1>
            <hr style={lightRuleStyle}></hr>
            <div>
              <div style={filterSectionStyle}>
                <label for="seasonState" style={nameStyle}>Status</label>
                <select id="seasonState" style={inputStyle}>
                  <option value="ACTIVE">Active</option>
                  <option value="ALL">All</option>
                </select>
              </div>
              <div style={filterSectionStyle}>
                <label for="nameFilter" style={nameStyle}>Name</label>
                <input id="nameFilter" style={inputStyle}></input>
              </div>
            </div>
            {
              this.state.seasons.map(season => {
                return (
                  <div>
                    <hr style={lightRuleStyle}></hr>
                    <div style={blockStyle} className="clickable" onClick={this.goTo.bind(this, `/roster/${season.stringid}`)}>
                      <div style={nameStyle}>{season.seasonName}</div>
                    </div>
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

const inputStyle = {
  backgroundColor: '#5a5a5a',
  color: "#bebebe",
  border: '0'
}

const lightRuleStyle = {
  backgroundColor: 'white'
}

const blockStyle = {
  backgroundColor: 'inhierit',
  backgroundColor: '#222222',
  padding: '10px 20px',
  fontSize: '30px'
}

const nameStyle = {
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: '700',
  color: '#bebebe',
  padding: '0 10px'
}

const filterSectionStyle = {
  display: 'inline-block',
  margin: '5px 10px'
}