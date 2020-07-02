import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import "react-datepicker/dist/react-datepicker.css";
import risenLogo from "../images/RE_TypeLogo_Shading.png";
import "../App.css";

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
                        <h1>Welcome to Risen Esports</h1>
                    </Jumbotron>
                </Container>
            </section>
        )
    }
};

// Outermost jumbotron style
var outerJumboStyle = {
    backgroundColor: `rgb(0, 25, 50)`,
    opacity: 0.95
};
