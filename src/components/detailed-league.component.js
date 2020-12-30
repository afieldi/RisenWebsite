import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

const staticText = require('../data/text.json'); 


export default class DetailedLeague extends Component {
    constructor(props) {
        super(props)
        this.league = props.match.params.league.toLowerCase()
        this.state = {
            leagueData: staticText.leagues[this.league]
        }
    }

    render() {
        return (
            <section>
                <div className="dark-section text-light">
                    <Container>
                        <h1 className="center" style={titleColor}>{this.state.leagueData.prettyName}</h1>
                        <hr className="risen-light"></hr>
                        <img src={require('../images/' + this.state.leagueData.img)} style={iconStyle}></img>
                        <p className="center">{this.state.leagueData.longBlurb}</p>
                        <hr></hr>
                        {
                            this.state.leagueData.subLeagues.map((league, index) => {
                                return (
                                    <div key={index}>
                                        <div className="row">
                                            <div className="col">
                                                <h3 className="center" style={titleColor}>{league.prettyName}</h3>
                                                <hr className="risen-light"></hr>
                                            </div>
                                        </div>
                                        <div className="row">
                                            {/* <div className="col-md-4">
                                                <img src={require('../images/' + this.state.leagueData.img)} style={iconStyle}></img>
                                            </div> */}
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
    // width: '150px',
    height: '150px',
    display: 'block',
    margin: 'auto'
}

const titleColor = {
    color: '#d6d6d6'
}