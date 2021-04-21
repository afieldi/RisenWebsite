import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

const staticText = require('../data/text.json');

export default class Watch extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        let embed;
        const script = document.createElement('script');
        script.setAttribute(
          'src',
          "https://embed.twitch.tv/embed/v1.js"
        );
        let w = window.innerWidth;
        let h = window.innerHeight - 86;
        const url = process.env.REACT_APP_BASE_URL + "/stream/avail";
        let channel = ""
        fetch(url).then((data) => {
            data.json().then(data => {
                if (data == 2) {
                    channel = "risen_esports2";
                }
                else {
                    channel = "risen_esports";
                }
                let p = {
                    width: w,
                    height: h,
                    channel: this.props.channel
                }
                script.addEventListener('load', () => {
                  embed = new window.Twitch.Embed(this.props.targetID, p);
                });
                document.body.appendChild(script);
            });
        });
    }

    render() {
        return (
            <section>
                <div className="dark-section" style={noMargins}>
                    <div id={this.props.targetID}></div>
                </div>
            </section>
        )
    }
}

Watch.defaultProps = {
    targetID: 'twitch-embed',
    width: '100%',
    height: '100vh',
    channel: 'risen_esports',
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
    borderRadius: '.3rem',
    boxShadow: '-8px 12px 18px 0 rgba(25,42,70,.13)',
    backgroundColor: 'rgba(25,42,70,.13)'
}

const noMargins = {
    marginTop: '-19px',
    height: '890px'
}