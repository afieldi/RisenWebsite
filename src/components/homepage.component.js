import React, { Component } from 'react';
import {Container, Jumbotron, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons'

import "react-datepicker/dist/react-datepicker.css";
import risenLogo from "../images/RE_TypeLogo_Shading.png";
import "../App.css";

let staticText = require('../data/text.json')


export default class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <section>
                <Container className="p-3">
                    <img src={ risenLogo } className="risenLogoClass"/>
                    <Jumbotron style={ outerJumboStyle }>
                        <h1 style={{fontWeight: '700'}}>Welcome to Risen Esports</h1>
                    </Jumbotron>
                    <div className="row">
                        <div className="col-lg">
                            <div className="row">
                                <div className="col-sm">
                                    <a href="https://discord.com/invite/BwnnBsV"><Button className="risen-button btn-lg">Join the Discord</Button></a>
                                </div>
                                <div className="col-sm">
                                    <a href="https://www.twitch.tv/risen_esports"><Button className="risen-button btn-lg">Go to Twitch</Button></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg">
                            <div className="row">
                                <div className="col-sm">
                                    <Link to="/leagues"><Button className="risen-button btn-lg">Our Leagues</Button></Link>
                                </div>
                                <div className="col-sm">
                                    <Link to="/contact"><Button className="risen-button btn-lg">Contact</Button></Link>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                </Container>
                <div className="deep-section">
                    <Container>
                        <h1 className="center text-light">Who Are We?</h1>
                        <hr className="risen-light"></hr>
                        <p className="risen-body-text light">
                            {staticText.home.whoAreWe}
                        </p>
                    </Container>
                </div>
                <div className="light-section">
                    <Container>
                        <h1 className="center text-dark">Why Us?</h1>
                        <hr className="risen-dark"></hr>
                        <div className="row">
                            <div className="col-md center">
                                <FontAwesomeIcon icon={faThumbsUp} style={iconStyle}></FontAwesomeIcon>
                                <br></br>
                                <div>
                                    <h2>Great Community</h2>
                                    <p>We are passionate and friendly! You dont have to worry about fitting in.</p>
                                </div>
                            </div>
                            <div className="col-md center">
                                <FontAwesomeIcon icon={faUsers} style={iconStyle}></FontAwesomeIcon>
                                <br></br>
                                <div>
                                    <h2>Play Together</h2>
                                    <p>Team up with your friends, and take down the competition!</p>
                                </div>
                            </div>
                            <div className="col-md center">
                                <FontAwesomeIcon icon={faChartLine} style={iconStyle}></FontAwesomeIcon>
                                <br></br>
                                <div>
                                    <h2>Improve your Skill</h2>
                                    <p>The best way to improve your skill level is by playing competitively!</p>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div className="deep-section">
                    <Container>
                        <h1 className="center text-light">Our Leagues</h1>
                        <hr className="risen-light"></hr>
                        <h3 className="center text-light">Find a League for You</h3>
                        <hr className="risen-light"></hr>
                        <div className="table-responsive">
                            <table className="table table-striped center" style={{backgroundColor: 'aliceBlue'}}>
                                <thead>
                                    <tr style={leaguesTablePrimary}>
                                        <th>League Name</th>
                                        <th>Signup Size</th>
                                        <th>Max Rank</th>
                                        <th>Rank Range</th>
                                        <th>Paid Entry</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Rampage Open</td>
                                        <td>1-2 Players</td>
                                        <td>Gold 1</td>
                                        <td>Silver-Gold</td>
                                        <td>Free</td>
                                    </tr>
                                    <tr>
                                        <td>Rampage Premade</td>
                                        <td>5-10 Players</td>
                                        <td>Gold 1</td>
                                        <td>Silver-Gold</td>
                                        <td>Free</td>
                                    </tr>
                                    <tr>
                                        <td>Unstoppable Premade</td>
                                        <td>5-10 Players</td>
                                        <td>Platinum 1</td>
                                        <td>Gold-Platinum</td>
                                        <td>Free</td>
                                    </tr>
                                    <tr>
                                        <td>Dominate Open</td>
                                        <td>1-2 Players</td>
                                        <td>Diamond 4</td>
                                        <td>Platinum-D4</td>
                                        <td>Free</td>
                                    </tr>
                                    <tr>
                                        <td>Dominate Premade</td>
                                        <td>5-10 Players</td>
                                        <td>Diamond 2</td>
                                        <td>Platinum-Diamond</td>
                                        <td>Free</td>
                                    </tr>
                                    <tr>
                                        <td>Divine League</td>
                                        <td>5-10 Players</td>
                                        <td>Diamond 1</td>
                                        <td>Diamond</td>
                                        <td>Paid</td>
                                    </tr>
                                    <tr>
                                        <td>Champions League</td>
                                        <td>5-10 Players</td>
                                        <td>Challenger</td>
                                        <td>Any</td>
                                        <td>Paid</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <Link to="/leagues"><Button className="risen-button btn-lg">Learn More</Button></Link>
                        </div>
                    </Container>
                </div>
            </section>
        )
    }
};

// CSS

// Outermost jumbotron style
var outerJumboStyle = {
    backgroundColor: `rgb(0, 25, 50, 0)`,
    opacity: 0.95,
    textAlign: 'center',
    fontFamily: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
    color: 'white'
    // textTransform: 'uppercase',
};

var leaguesTablePrimary = {
    backgroundColor: '#E4692B'
}

var iconStyle = {
    width: '60px',
    height: '60px',
    display: 'block',
    margin: 'auto'
}