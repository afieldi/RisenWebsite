import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component";
import GamesList from "./components/games-list.component";
import EditGame from "./components/edit-game.component";
import CreateGame from "./components/create-game.component";
import CreateTeam from "./components/create-team.component";
import Test from "./components/test.component";

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br/>
        <Route path="/" exact component={GamesList} />
        <Route path="/edit/:id" component={EditGame} />
        <Route path="/creategame" component={CreateGame} />
        <Route path="/team" component={CreateTeam} />
        <Route path="/test" component={Test} />
      </div>
    </Router>
  );
}

export default App;