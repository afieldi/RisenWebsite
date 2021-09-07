import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const staticText = require('../data/text.json'); 

export default class AboutLeagues extends Component {

    render() {
        return (
            <section>
                <div className="dark-section text-light">
                    <Container>
                        <h1 className="center text-light">Our Leagues</h1>
                        <hr className="risen-light"></hr>
                        <div className="row">
                            <div className="col" style={blockStyle}>
                                <h2>{staticText.leagues.champions.prettyName}</h2>
                                <img src={require('../images/RE_TypeLogo_Shading.png')} style={iconStyle}></img>
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
                        {/* <hr style={{backgroundColor: 'white'}}></hr> */}
                        <br></br>
                        {
                            Object.keys(staticText.leagues).map(leagueName => {
                                let t = staticText.leagues[leagueName];
                                if (leagueName === "champions") {
                                    // This is front and center
                                    return null;
                                }
                                return (
                                    <div>
                                        <Link to={`/league/${leagueName}`}>
                                            <div className="row clickable text-light" style={rowStyle}>
                                                <div className="col-2">
                                                    <img src={require('../images/' + t.img)} style={iconStyle}></img>
                                                </div>
                                                <div classname="col">
                                                    <div><h2>{t.prettyName}</h2></div>
                                                    <div><p>{t.blurb}</p></div>
                                                    <div>Ranks: {staticText.leagues.champions.ranks}</div>
                                                    <div>Max: {staticText.leagues.champions.peak} </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <br></br>
                                    </div>
                                )
                            })
                        }
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
    // padding: '20px',
    // border: '1px solid #696969',
    // backgroundColor: '#191919',
    // borderRadius: '.267rem',
    // boxShadow: '-8px 12px 18px 0 rgba(25,42,70,.13)'
    padding: '5px',
    border: '1px solid #dfe3e7',
    borderRadius: '.3rem',
    boxShadow: '-8px 12px 18px 0 rgba(25,42,70,.13)',
    backgroundColor: 'rgba(25,42,70,.47)'
}

const rowStyle = {
    background: 'rgb(25,42,70)',
    background: 'linear-gradient(90deg, rgba(25,42,70,.53) 69%, rgba(0,0,0,0) 100%)',
    padding: '10px'
}