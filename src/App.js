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
import DetailedLeague from './components/detailed-league.component';
import AboutLeagues from "./components/about-leagues.component";
import backgroundImage from "./images/backgroundimage2dark.png";
import Contact from './components/contact.component';
import GenerateCodes from './components/admin/generateCodes.component';
import Setup from './components/drafting/setup.component';
import Drafting from './components/drafting/drafting.component';

function App() {
  return (
      <div>
        <div style={ backgroundImageStyle }></div>
        <Router>
          <div className="risen-main-background">
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
            <Route path="/leagues" component={AboutLeagues}></Route>
            <Route path="/league/:league" component={DetailedLeague}></Route>
            <Route path="/contact" component={Contact}></Route>
            <Route path="/admin/codes" component={GenerateCodes}></Route>
            <Route path="/drafting" component={Setup}></Route>
            <Route path="/draft" component={Drafting}></Route>
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
  position: 'fixed',
  zIndex: -10
};

export default App;
