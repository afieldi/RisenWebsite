import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getBaseUrl, getCookie } from '../Helpers';

export default class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: ""
    };
    fetch(getBaseUrl() + "/auth/redirect").then(data => {
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
          <Link to="/" className="navbar-brand">Risen Esports</Link>
          <div className="navbar-collapse collapse" id="navbarResponsive">
            <ul className="navbar-nav mr-auto nav-fill w-100">
              <li className="navbar-item ml-auto">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="navbar-item ml-auto">
                <Link to="/leagues" className="nav-link">Leagues</Link>
              </li>
              <li className="navbar-item ml-auto">
                <Link to="/stats" className="nav-link">Player Stats</Link>
              </li>
              {/* <li className="navbar-item ml-auto">
                <Link to="/teams" className="nav-link">Team Stats</Link>
              </li> */}
              <li className="navbar-item ml-auto">
                <Link to="/drafting" className="nav-link">Drafting</Link>
              </li>
              <li className="navbar-item ml-auto">
                <Link to="/contact" className="nav-link">Contact Us</Link>
              </li>
              {
                this.props.admin === 1 ? 
                <li className="navbar-item ml-auto">
                  <Link to="/admin" className="nav-link">Admin</Link>
                </li> : 
                null
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
