import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import RisenNavbar from "./components/navbar.component";
import HomePage from "./components/homepage.component";
import GamesList from "./components/games-list.component";
import EditGame from "./components/edit-game.component";
import CreateGame from "./components/create-game.component";
import CreateTeam from "./components/create-team.component";
import Test from "./components/test.component";
import Overview from "./components/overview-stats.component";
import DetailedStats from "./components/detailed-stats.component";
import backgroundImage from "./images/backgroundimage2.jpg";

function App() {
  return (
      <div style={ backgroundImageStyle }>
        <Router>
          <div className="container risen-main-background">
            <RisenNavbar />
            <br/>
            <Route path="/" exact component={HomePage} />
            <Route path="/gameslist" exact component={GamesList} />
            <Route path="/edit/:id" component={EditGame} />
            <Route path="/creategame" component={CreateGame} />
            <Route path="/team" component={CreateTeam} />
            <Route path="/test" component={Test} />
            <Route path="/stats" component={Overview} />
            <Route path="/detailed/:player" component={DetailedStats}></Route>
          </div>
        </Router>
      </div>
  );
}

var backgroundImageStyle = {
  width: '100%',
  minHeight: '100vh',
  backgroundImage: "url(" + backgroundImage + ")",
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  position: 'absolute'
};

export default App;
