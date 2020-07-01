import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import "react-datepicker/dist/react-datepicker.css";

export default class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <section style={ pageStyle }>
                <Container className="p-3">
                    <Jumbotron style={ outerJumboStyle }>
                        <h1 className="header">Welcome to Risen Esports</h1>
                    </Jumbotron>
                </Container>
            </section>
        )
    }
};

// Page style and background color.
// Just picking a random height for now.
var pageStyle = {
    width: '100%',
    height: 1200,
    backgroundColor: `rgb(0, 25, 50)`
};

// Outermost jumbotron style
var outerJumboStyle = {
    backgroundColor: `rgb(123, 131, 148)`
};
