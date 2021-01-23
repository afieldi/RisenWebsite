import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import qs from 'qs';
import HorizontalMulti from './multi/horizontal-multi.component';

export default class MultiPlayer extends Component {
  constructor(props) {
    super(props);
    let query = qs.parse(this.props.location.search.replace("?", ""), { ignoreQueryPrefix: false });
    this.players = query["names"] ? query["names"] : "";
    this.state = {
      players: [],
      avgData: {}
    }
  }

  componentDidMount() {
    this.loadAvgData();
    this.getPlayerData();
    document.getElementById("searchText").value = this.players.toLowerCase().replace(/\s/g, '');
  }

  searchPlayers() {
    let searchNames = document.getElementById("searchText").value;
    searchNames = searchNames.replace(/\n/g, ',');
    searchNames = searchNames.toLowerCase().replace(/\s/g, '');
    searchNames = encodeURI(searchNames);
    this.props.history.push("/multi?names=" + searchNames);

    this.players = searchNames;
    this.getPlayerData();
  }

  loadAvgData() {
    let url = process.env.REACT_APP_BASE_URL + "/stats/avg";
    fetch(url).then((data) => {
    data.json().then(data => {
        this.setState({
            avgData: data[0]
        });
      })
    });
  }

  getPlayerData() {
    let url = process.env.REACT_APP_BASE_URL + '/stats/multi/name?names=' + this.players;
    fetch(url).then(data => {
      data.json().then(data => {
        this.setState({
          players: data
        });
      })
    })
  }

  render() {
    return (
      <section>
        <div className="dark-section text-light">
          <Container>
            <div>
              <h1>Multi Player Search</h1>
              <hr style={{backgroundColor: 'white'}}></hr>
            </div>
            <div className="row">
              <div className="col">
                <textarea id="searchText" style={fillStyle} placeholder="Summoner 1,Summoner 2"></textarea>
              </div>
              <div className="col-sm-2">
                <button style={fillStyle} onClick={this.searchPlayers.bind(this)}>Search</button>
              </div>
            </div>
            {
              this.state.players.length > 0 ? 
              // Lots of players, do horizontal
              <section>
                {
                this.state.players.map(player => {
                  return (
                    <div className="row" key={player._id[0]._id}>
                      <div className="col">
                        <HorizontalMulti avgData={this.state.avgData} player={player}></HorizontalMulti>
                      </div>
                    </div>
                  )
                })
                }
              </section> :
              // Few players, do vertical
              <div className="row">
                <div className="col">

                </div>
              </div>
            }
            
          </Container>
        </div>
      </section>
    )
  }
}

const fillStyle = {
  width: '100%',
  height: '75px'
}