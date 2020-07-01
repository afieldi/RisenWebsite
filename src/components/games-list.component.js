import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Game = props => (
  <tr>
    <td>{props.game.teamname}</td>
    <td>{props.game.duration}</td>
    <td>{props.game.date.substring(0,10)}</td>
    <td>
      {/*eslint-disable-next-line*/}
      <Link to={"/edit/"+props.game._id}>edit</Link> | <a href="#" onClick={() => { props.deleteGame(props.game._id) }}>delete</a>
    </td>
  </tr>
)

export default class GamesList extends Component {
  constructor(props) {
    super(props);

    this.deleteGame = this.deleteGame.bind(this)

    this.state = {games: []};
  }

  componentDidMount() {
    axios.get('http://localhost:5000/games/')
      .then(response => {
        this.setState({ games: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  deleteGame(id) {
    axios.delete('http://localhost:5000/games/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      games: this.state.games.filter(el => el._id !== id)
    })
  }

  gameList() {
    return this.state.games.map(currentgame => {
      return <Game game={currentgame} deleteGame={this.deleteGame} key={currentgame._id}/>;
    })
  }

  render() {
    return (
      <div>
        <h3>Logged Games</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Teamname</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { this.gameList() }
          </tbody>
        </table>
      </div>
    )
  }
}