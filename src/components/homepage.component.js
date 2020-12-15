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
                    <img style={{marginTop: '10vh', marginBottom: '5vh'}} src={ risenLogo } className="risenLogoClass"/>
                    {/* <Jumbotron style={ outerJumboStyle }>
                        <h1 style={{fontWeight: '700'}}>Welcome to Risen Esports</h1>
                    </Jumbotron> */}
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
                <div className="dark-section">
                    <Container>
                        <h1 className="center text-light">Who Are We?</h1>
                        <hr className="risen-light"></hr>
                        <p className="risen-body-text light center">
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
                <div className="dark-section">
                    <Container>
                        <h1 className="center text-light">Our Games</h1>
                        <hr className="risen-light"></hr>
                        <div className="row">
                            <div className="col-md">
                                <div style={gameImageContainerStyle}>
                                    <img src={require('../images/logos/TFT_Logo.png')} style={gameImageStyle}></img>
                                </div>
                            </div>
                            <div className="col-md">
                                <div style={gameImageContainerStyle}>
                                    <img src={require('../images/logos/League_of_Legends_Logo.png')} style={gameImageStyle}></img>
                                </div>
                            </div>
                            <div className="col-md">
                                <div style={gameImageContainerStyle}>
                                    <img src={require('../images/logos/Valorant_Logo.png')} style={gameImageStyle}></img>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
                <div className="light-section">
                    <Container>
                        <h1 className="center">Our Leagues</h1>
                        <hr className="risen-dark"></hr>
                        <h3 className="center">League of Legends</h3>
                        <hr className="risen-dark"></hr>
                        <div className="table-responsive" style={{boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)', marginBottom: '1rem'}}>
                            <table className="table table-striped center" style={{backgroundColor: 'aliceBlue', marginBottom: '0'}}>
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
                                    {
                                        Object.values(staticText.leagues).map(league => {
                                            return league.subLeagues.map(subLeague => {
                                                return (
                                                    <tr>
                                                        <td>{subLeague.prettyName}</td>
                                                        <td>{subLeague.size}</td>
                                                        <td>{subLeague.peak}</td>
                                                        <td>{subLeague.ranks}</td>
                                                        <td>{subLeague.cost}</td>
                                                    </tr>
                                                )
                                            })
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <Link to="/leagues"><Button className="risen-button btn-lg">Learn More</Button></Link>
                        </div>
                        <br></br>
                        <h3 className="center">Valorant and TFT</h3>
                        <hr className="risen-dark"></hr>
                        <p className="risen-body-text center">
                            {staticText.home.leagueData}
                        </p>
                        <div>
                            <a href="https://discord.com/invite/BwnnBsV"><Button className="risen-button">Join the Discord</Button></a>
                        </div>
                    </Container>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div className="dark-section">
                    <Container>
                        <h1 className="center text-light">Goodies</h1>
                        <hr className="risen-light"></hr>
                        <div>
                            <p className="risen-body-text light center">
                                {staticText.home.goodies}
                            </p>
                        </div>
                        <div>
                            <div className='row'>
                                <div className='col-md-8'>
                                    <div className='row' style={{paddingBottom: '15px'}}>
                                        <div className='col-sm-8'>
                                            <a href="https://discord.com/invite/BwnnBsV" className="clickable">
                                            <div style={{...imageStyle, ...{backgroundImage: `url(https://cybernews.com/wp-content/uploads/2020/07/Discord-privacy-tips-that-you-should-use-.jpg)`}}}></div>
                                                <div style={textOverlayStyle}>
                                                    <h3 style={textStyle}>Join the Discord</h3>
                                                </div>
                                            </a>
                                        </div>
                                        <div className='col-sm'>
                                            <a href="https://www.twitch.tv/risen_esports" className="clickable">
                                                <div style={{...imageStyle, ...{backgroundImage: `url(https://blog.twitch.tv/assets/uploads/2399c71d2a2bca32d6f39d60ac643a17.png)`}}}></div>
                                                <div style={textOverlayStyle}>
                                                    <h3 style={textStyle}>Twitch</h3>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Link to="#" className="clickable disabled">
                                                <div style={{...imageStyle, ...{backgroundImage: `url(https://wpforms.com/wp-content/uploads/2019/02/online-business-statistics.jpg)`, filter: 'grayscale(100%)'}}}></div>
                                                <div style={textOverlayStyle}>
                                                    <h3 style={textStyle}>Stats</h3>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className='col'>
                                    <Link to="#" className="clickable disabled">
                                        <div style={{...imageStyle, ...{backgroundImage: `url(https://cdn.editage.com/insights/editagecom/production/styles/detail_page_image/public/Using%20the%20active%20and%20passive%20voice%20in%20research%20writing%20%28resized%29_0_0.jpg?itok=eMctYpxm)`, filter: 'grayscale(100%)'}}}></div>
                                        <div style={textOverlayStyle}>
                                            <h3 style={textStyle}>Articles</h3>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </section>
        )
    }
};

// CSS

const imageStyle = {
    width: '100%',
    minHeight: '250px',
    height: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
}

const textOverlayStyle = {
    position: 'relative',
    bottom: '3.5em',
    backgroundColor: '#000000c9',
    height: '3.5em',
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
}

const textStyle = {
    color: 'white',
    margin: '10px'
}

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

const gameImageContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '15px 0'
}

const gameImageStyle = {height: '100px'};