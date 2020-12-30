import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

const staticText = require('../data/text.json');


export default class Watch extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <section>
                <div className="dark-section" style={noMargins}>

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
    borderRadius: '.3rem',
    boxShadow: '-8px 12px 18px 0 rgba(25,42,70,.13)',
    backgroundColor: 'rgba(25,42,70,.13)'
}

const noMargins = {
    margin: '-19px',
    height: '890px'
}