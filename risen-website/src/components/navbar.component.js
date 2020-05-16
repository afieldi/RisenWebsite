import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">RisenEsports</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/" className="nav-link">Games</Link>
          </li>
          <li className="navbar-item">
          <Link to="/creategame" className="nav-link">Create Game</Link>
          </li>
          <li className="navbar-item">
          <Link to="/team" className="nav-link">Create Team</Link>
          </li>
          <li className="navbar-item">
          <Link to="/test" className="nav-link">Test Page</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}