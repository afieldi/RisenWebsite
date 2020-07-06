import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceOne } from '@fortawesome/free-solid-svg-icons';

// Images
import rampageImage from '../images/rampage.png'
import dominateImage from '../images/dominate.png'
import championsImage from '../images/champions.png'


const staticText = require('../data/text.json'); 


export default class DetailedLeague extends Component {
    constructor(props) {
        super(props)
        this.league = props.match.params.league.toLowerCase()
        this.state = {
            leagueData: staticText.leagues[this.league]
        }

        console.log(this.state.leagueData)
    }

    render() {
        return (
            <section>
                <br></br>
                <br></br>
                <br></br>
                <div className="light-section">
                    <Container>
                        <h1 className="center text-dark">{this.state.leagueData.prettyName}</h1>
                        <hr className="risen-dark"></hr>
                        <p className="center">{this.state.leagueData.longBlurb}</p>
                        {
                            this.state.leagueData.subLeagues.map((league, index) => {
                                return (
                                    <div key={index}>
                                        <div className="row">
                                            <div className="col">
                                                <h3 className="center text-dark">{league.prettyName}</h3>
                                                <hr className="risen-dark"></hr>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <img src={require('../images/' + this.state.leagueData.img)} style={iconStyle}></img>
                                            </div>
                                            <div className="col">
                                                <p>{league.blurb}</p>
                                                <p>{league.longBlurb}</p>
                                                <p><b>Ranks:</b> {league.ranks}</p>
                                                <p><b>Max Rank:</b> {league.peak}</p>
                                            </div>
                                        </div>
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
    // top: '10%',
    width: '60%',
    height: '100%',
    display: 'block',
    margin: 'auto',
    position: 'relative'
}
