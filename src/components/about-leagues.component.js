import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { faDiceOne } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const staticText = require('../data/text.json'); 
const test = require('../images/rampage.png')

export default class AboutLeagues extends Component {

    render() {
        return (
            <section>
                <br></br>
                <br></br>
                <br></br>
                <div className="light-section">
                    <Container>
                        <h1 className="center text-dark">Our Leagues</h1>
                        <hr className="risen-dark"></hr>
                        <div className="row">
                            <div className="col" style={blockStyle}>
                                <h2>{staticText.leagues.rampage.prettyName}</h2>
                                <img src={require('../images/' + staticText.leagues.rampage.img)} style={iconStyle}></img>
                                <p>{staticText.leagues.rampage.blurb}</p>
                                <div>
                                    <div><b>Ranks</b></div>
                                    <p> {staticText.leagues.rampage.ranks}</p>
                                </div>
                                <div>
                                    <div><b>Max Rank</b></div>
                                    <p> {staticText.leagues.rampage.peak}</p>
                                </div>
                                <Link to={"/league/rampage"}><Button className="risen-button">Learn More</Button></Link>
                            </div>
                            <div className="col" style={blockStyle}>
                                <h2>{staticText.leagues.unstoppable.prettyName}</h2>
                                <img src={require('../images/' + staticText.leagues.unstoppable.img)} style={iconStyle}></img>
                                <p>{staticText.leagues.unstoppable.blurb}</p>
                                <div>
                                    <div><b>Ranks</b></div>
                                    <p> {staticText.leagues.unstoppable.ranks}</p>
                                </div>
                                <div>
                                    <div><b>Max Rank</b></div>
                                    <p> {staticText.leagues.unstoppable.peak}</p>
                                </div>
                                <Link to={"/league/unstoppable"}><Button className="risen-button">Learn More</Button></Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col" style={blockStyle}>
                                <h2>{staticText.leagues.dominate.prettyName}</h2>
                                <img src={require('../images/' + staticText.leagues.dominate.img)} style={iconStyle}></img>
                                <p>{staticText.leagues.dominate.blurb}</p>
                                <div>
                                    <div><b>Ranks</b></div>
                                    <p> {staticText.leagues.dominate.ranks}</p>
                                </div>
                                <div>
                                    <div><b>Max Rank</b></div>
                                    <p> {staticText.leagues.dominate.peak}</p>
                                </div>
                                <Link to={"/league/dominate"}><Button className="risen-button">Learn More</Button></Link>
                            </div>
                            <div className="col" style={blockStyle}>
                                <h2>{staticText.leagues.divine.prettyName}</h2>
                                <img src={require('../images/' + staticText.leagues.divine.img)} style={iconStyle}></img>
                                <p>{staticText.leagues.divine.blurb}</p>
                                <div>
                                    <div><b>Ranks</b></div>
                                    <p> {staticText.leagues.divine.ranks}</p>
                                </div>
                                <div>
                                    <div><b>Max Rank</b></div>
                                    <p> {staticText.leagues.divine.peak}</p>
                                </div>
                                <Link to={"/league/divine"}><Button className="risen-button">Learn More</Button></Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col" style={blockStyle}>
                                <h2>{staticText.leagues.champions.prettyName}</h2>
                                <img src={require('../images/' + staticText.leagues.champions.img)} style={iconStyle}></img>
                                <p>{staticText.leagues.champions.blurb}</p>
                                <div>
                                    <div><b>Ranks</b></div>
                                    <p> {staticText.leagues.champions.ranks}</p>
                                </div>
                                <div>
                                    <div><b>Max Rank</b></div>
                                    <p> {staticText.leagues.champions.peak}</p>
                                </div>
                                <Link to={"/league/champions"}><Button className="risen-button">Learn More</Button></Link>
                            </div>
                        </div>
                    </Container>
                </div>
            </section>
            
        )
    }
}

const iconStyle = {
    // width: '150px',
    height: '150px',
    display: 'block',
    margin: 'auto'
}

const blockStyle = {
    textAlign: 'center',
    margin: '10px',
    padding: '5px',
    border: '1px solid #dfe3e7',
    borderRadius: '.267rem',
    boxShadow: '-8px 12px 18px 0 rgba(25,42,70,.13)'
}