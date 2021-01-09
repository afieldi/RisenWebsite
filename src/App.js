import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import RisenNavbar from "./components/navbar.component";
import HomePage from "./components/homepage.component";
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
import { getCookie, deleteCookie } from './Helpers';
import OfflineDraft from './components/drafting/offline.component';
import ManageTeams from './components/admin/manageTeams.component';
import Rosters from './components/teams/rosters.component';
import Roster from './components/teams/roster.component';
import LeagueStats from './components/league-stats.component';
import UserContext from './context/UserContext';
import Rules from './components/rules/rules.component';
import Display from './components/brackets/display.component';
import Watch from "./components/watch.component";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: -1
    }

    // Add callback that does nothing. This callback is used in the auth component to let it know
    //  the check for logged in has finished and the redirect back to home page should occur
  }

  componentDidMount() {
    this.checkLoggedIn(() => {});
  }

  checkLoggedIn(callback) {
    // let code = getCookie("auth");
    // if(process.env.NODE_ENV !== 'production') {
    //   console.warn("In dev mode. Automatically logging in as admin");
    //   this.setState({
    //     level: 1
    //   });
    // }
    // if(code) {
    fetch(process.env.REACT_APP_BASE_URL + "/auth/verify", {
      credentials: "include"
    }).then((res) => {
      if(res.status === 200 || res.status === 304) {
        res.json().then(user => {
          if(user.level) {
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
        this.setState({
          level: -1
        });
      }
      callback();
    }).catch(err => {
      console.log(err)
      this.setState({
        level: -1
      });
    })
  }

  // }

  
  logOut() {
    fetch(process.env.REACT_APP_BASE_URL + "/auth/logout", {
      method: "POST",
      credentials: "include"
    }).then(res => {
      window.location.reload();
    })
    // fetch(process.env.REACT_APP_BASE_URL + "/auth/verify?code=" + getCookie("auth"), {
    //   method: "DELETE"
    // }).then(data => {
    //   this.checkLoggedIn(() => { this.props.history.push("/"); });
    // });
  }

  authRender(props) {
    return (
      <Login authCheck={this.checkLoggedIn.bind(this)} {...props}></Login>
    );
  }

  render() {
    return (
        <div>
          <div className="dark-section" style={ backgroundImageStyle }></div>
          <Router>
            <UserContext.Provider value={this.state.level}>
              <div className="risen-main-background">
                <RisenNavbar admin={this.state.level} logout={this.logOut.bind(this)} />
                {/* <br/> */}
                <Route path="/" exact component={HomePage} />
                <Route path="/stats" component={Overview} />
                <Route path="/leaguestats" component={LeagueStats}></Route>
                <Route path="/detailed/:player" component={DetailedStats}></Route>
                <Route path="/leagues" component={AboutLeagues}></Route>
                <Route path="/league/:league" component={DetailedLeague}></Route>
                <Route path="/rosters" component={Rosters}></Route>
                <Route path="/roster/:league" component={Roster}></Route>
                <Route path="/contact" component={Contact}></Route>
                <Route path="/drafting" component={Setup}></Route>
                <Route path="/draft" component={Drafting}></Route>
                <Route path="/pbdraft" component={OfflineDraft}></Route>
                <Route path="/watch" component={Watch} ></Route>
                <Route path="/auth" render={this.authRender.bind(this)} ></Route>
                <Route path="/rules" component={Rules}></Route>
                <Route path="/bracket" component={Display}></Route>
                {
                  // Only create route if it is an admin
                  this.state.level === 1 ? <div>
                    <Route path="/admin/basic" component={Admin}></Route>
                    <Route path="/admin/teams" component={ManageTeams}></Route>
                  </div> : null
                }
              </div>
            </UserContext.Provider>
          </Router>
        </div>
    );
  }
}

var backgroundImageStyle = {
  width: '100%',
  minHeight: '100vh',
  // backgroundImage: "url(" + backgroundImage + ")",
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  position: 'fixed',
  zIndex: -10
};
