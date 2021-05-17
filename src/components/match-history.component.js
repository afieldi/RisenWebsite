import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import Scoreboard from './matchHistory/scoreboad.component';
import TeamGold from './matchHistory/teamgold.component';
import TeamDamage from './matchHistory/teamdamage.component';
import PlayerStats from './matchHistory/playerstats.component';
const champMap = require('../data/champions_map.json')

export default class MatchHistory extends Component {
  constructor(props) {
    super(props);
    this.gameId = this.props.match.params.gameId;
    this.state = {
      bluePlayers: [],
      redPlayers: []
    }

    // Just an array to map so that we can loop through the players easily
    this.playerRows = [];
  }

  componentDidMount() {
    this.getGameData();
  }

  getGameData(callback=(()=>{})) {
    const url = process.env.REACT_APP_BASE_URL + "/games/" + this.gameId;
    fetch(url).then(data => {
      data.json().then(data => {
        let b = data.slice(0, 5);
        let r = data.slice(5);
        this.playerRows = [0,1,2,3,4];
        console.log(data);
        this.setState({
          bluePlayers: b,
          redPlayers: r
        });
        
        callback();
      })
    })
  }

  render() {
    return (
       <section>
         <div className="dark-section text-light">
           <Container>
             {/* <div className="row text-light">
              <div className="col">
                
              </div>
             </div> */}
             {/* <hr style={{backgroundColor: 'white'}}></hr> */}
             <div className="row">
               <div className="col">
                  <Scoreboard redPlayers={this.state.redPlayers} bluePlayers={this.state.bluePlayers} playerRows={this.playerRows}></Scoreboard>
               </div>
             </div>
             <div className="row">
              <div className="col-md">
                <TeamGold redPlayers={this.state.redPlayers} bluePlayers={this.state.bluePlayers}></TeamGold>
              </div>
              <div className="col-md">
                <TeamDamage redPlayers={this.state.redPlayers} bluePlayers={this.state.bluePlayers}></TeamDamage>
              </div>
             </div>
             <div className="row">
               <div className="col">
                <PlayerStats redPlayers={this.state.redPlayers} bluePlayers={this.state.bluePlayers}></PlayerStats>
               </div>
             </div>
           </Container>
         </div>
       </section>
    );
  }
}

const imgStyle = {
  height: '48px'
}

const nameStyle = {
  // margin: '0',
  padding: 0,
  alignSelf: 'center',
}