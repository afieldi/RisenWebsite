import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import RisenNavbar from "./components/navbar.component";
import HomePage from "./components/homepage.component";
import GamesList from "./components/games-list.component";
import EditGame from "./components/edit-game.component";
import CreateGame from "./components/create-game.component";
import CreateTeam from "./components/create-team.component";
import Overview from "./components/overview-stats.component";
import DetailedStats from "./components/detailed-stats.component";
import DetailedLeague from './components/detailed-league.component';
import AboutLeagues from "./components/about-leagues.component";
import backgroundImage from "./images/backgroundimage2dark.png";
import Contact from './components/contact.component';
import Setup from './components/drafting/setup.component';
import Drafting from './components/drafting/drafting.component';
import Admin from './components/admin/admin.component';
import Login from './components/login.component';
import { getCookie } from './Helpers';
import fetch from 'node-fetch';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: -1
    }

    // Add callback that does nothing. This callback is used in the auth component to let it know
    //  the check for logged in has finished and the redirect back to home page should occur
    this.checkLoggedIn(() => {});
  }

  checkLoggedIn(callback) {
    let code = getCookie("auth");
    if(code) {
      fetch(process.env.REACT_APP_BASE_URL + "/auth/verify?code=" + code).then((res) => {
        if(res.status === 200) {
          res.json().then(user => {
            console.log(user);
            if(user.level === 2) {
              this.setState({
                level: user.level
              });
            }
            else {
              this.setState({
                level: -1
              });
            }
          });
        }
        else {
          console.log("aaaa");
          this.setState({
            level: -1
          });
        }
        callback();
      }).catch(err => {
        this.setState({
          level: -1
        });
      })
    }
  }

  
  logOut() {
    fetch(process.env.REACT_APP_BASE_URL + "/auth/verify?code=" + getCookie("auth"), {
      method: "DELETE"
    }).then(data => {
      this.checkLoggedIn(() => { this.props.history.push("/"); });
    });
  }

  authRender(props) {
    return (
      <Login authCheck={this.checkLoggedIn.bind(this)} {...props}></Login>
    );
  }
  

  render() {
    return (
        <div>
          <div style={ backgroundImageStyle }></div>
          <Router>
            <div className="risen-main-background">
              <RisenNavbar admin={this.state.level} logout={this.logOut.bind(this)} />
              {/* <br/> */}
              <Route path="/" exact component={HomePage} />
              <Route path="/gameslist" exact component={GamesList} />
              <Route path="/edit/:id" component={EditGame} />
              <Route path="/creategame" component={CreateGame} />
              <Route path="/team" component={CreateTeam} />
              <Route path="/stats" component={Overview} />
              <Route path="/detailed/:player" component={DetailedStats}></Route>
              <Route path="/leagues" component={AboutLeagues}></Route>
              <Route path="/league/:league" component={DetailedLeague}></Route>
              <Route path="/contact" component={Contact}></Route>
              <Route path="/drafting" component={Setup}></Route>
              <Route path="/draft" component={Drafting}></Route>
              <Route path="/auth" render={this.authRender.bind(this)} ></Route>
              {
                // Only create route if it is an admin
                this.state.level === 1 ? <Route path="/admin" component={Admin}></Route> : null
              }
            </div>
          </Router>
        </div>
    );
  }
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
