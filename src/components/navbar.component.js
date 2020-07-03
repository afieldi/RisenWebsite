import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top risen-nav">
        <div className="container">
          <Link to="/" className="navbar-brand">Risen Esports</Link>
          <button className="navbar-toggler navbar-toggler-right collapsed" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collpase navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto nav-fill w-100">
              <li className="navbar-item ml-auto">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="navbar-item ml-auto">
                <Link to="/games" className="nav-link">Games</Link>
              </li>
              <li className="navbar-item ml-auto">
                <Link to="/creategame" className="nav-link">Create Game</Link>
              </li>
              <li className="navbar-item ml-auto">
                <Link to="/team" className="nav-link">Create Team</Link>
              </li>
              <li className="navbar-item ml-auto">
                <Link to="/test" className="nav-link">Test Page</Link>
              </li>
              <li className="navbar-item ml-auto">
                <Link to="/stats" className="nav-link">Stats Page</Link>
              </li>
            </ul>        
          </div>
        </div>
      </nav>

    );
  }
}
