import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import backgroundImage from "../images/backgroundimage2dark.png";

import RisenLogo from '../images/RE_TypeLogo_Shading.png'

export default class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: "#"
    };
    fetch(process.env.REACT_APP_BASE_URL + "/auth/redirect").then(data => {
      data.text().then(url => {
        this.setState({
          url: url
        })
      })
    });
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top risen-nav">
        <div className="container">
          <button className="navbar-toggler navbar-toggler-left collapsed" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link to="/" className="navbar-brand">
            <img src={RisenLogo} style={{height: '60px'}}></img>
            {/* Risen Esports */}
          </Link>
          <div className="navbar-collapse collapse" id="navbarResponsive">
            <ul className="navbar-nav mr-auto nav-fill w-100">
              {/* <li className="navbar-item ml-auto">
                <Link to="/" className="nav-link">Home</Link>
              </li> */}
              <li className="navbar-item ml-auto dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Info
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <Link to="/leagues" className="dropdown-item">League Info</Link>
                  <Link to="/contact" className="dropdown-item">Contact Us</Link>
                  {/* <Link to="/rosters" className="dropdown-item">Rosters</Link> */}
                </div>
              </li>
              {/* <li className="navbar-item ml-auto">
                <Link to="/stats" className="nav-link">Player Stats</Link>
              </li> */}
              <li className="navbar-item ml-auto dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Stats
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <Link to="/stats" className="dropdown-item">Player Stats</Link>
                  <Link to="/multi" className="dropdown-item">Multi Stats</Link>
                  <Link to="/leaguestats" className="dropdown-item">League Stats</Link>
                  {/* <Link to="#" className="dropdown-item">Team Stats(TBD)</Link> */}
                  <Link to="/champstats" className="dropdown-item">Champion Stats</Link>
                </div>
              </li>
              {/* <li className="navbar-item ml-auto">
                <Link to="/teams" className="nav-link">Team Stats</Link>
              </li> */}
              <li className="navbar-item ml-auto">
                <Link to="/pbdraft" className="nav-link">Drafting</Link>
              </li>
              <li className="navbar-item ml-auto">
                <Link to="/articles/list" className="nav-link">Articles</Link>
              </li>
              <li className="navbar-item ml-auto">
                <Link to="/watch" className="nav-link">Watch</Link>
              </li>
              {
                this.props.admin > 0 ? 
                <li className="navbar-item ml-auto dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Admin
                  </a>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    {this.props.admin <= 2 ? <Link to="/admin/basic" className="dropdown-item">Manage Misc</Link> : null }
                    {this.props.admin <= 2 ? <Link to="/admin/teams" className="dropdown-item">Manage Teams</Link> : null }
                    {/* {this.props.admin <= 2 ? <Link to="#" className="dropdown-item">Manage Players</Link> : null } */}
                    {this.props.admin <= 8 ? <Link to="/casters" className="dropdown-item">Caster Portal</Link> : null }
                    {/* <Link to="/admin/teams" className="dropdown-item">Manage Teams</Link>
                    <Link to="#" className="dropdown-item">Manage Players</Link> */}
                  </div>
                </li>: null
              }
              {
                this.props.admin === -1 ? 
                <li className="navbar-item ml-auto">
                  <a href={this.state.url} className="nav-link">Log In</a>
                </li> :
                <li className="navbar-item ml-auto">
                  <a onClick={this.props.logout} href="#" className="nav-link">Log Out</a>
                </li>
              }
            </ul>        
          </div>
        </div>
      </nav>

    );
  }
}
