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
                            {
                                Object.keys(staticText.leagues).map((leagueString, index) => {
                                    return (
                                        <div className="col-md center" key={index}>
                                            
                                            <img src={require('../images/' + staticText.leagues[leagueString].img)} style={iconStyle}></img>
                                            <br></br>
                                            <div>
                                                <h2>{staticText.leagues[leagueString].prettyName}</h2>
                                                <p>{staticText.leagues[leagueString].blurb}</p>
                                                <p><b>Ranks:</b> {staticText.leagues[leagueString].ranks}</p>
                                                <p><b>Max Rank:</b> {staticText.leagues[leagueString].peak}</p>
                                            </div>
                                            <Link to={"/league/" + leagueString}><Button className="risen-button">Learn More</Button></Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Container>
                </div>
            </section>
            
        )
    }
}

const iconStyle = {
    width: '150px',
    height: '150px',
    display: 'block',
    margin: 'auto'
}