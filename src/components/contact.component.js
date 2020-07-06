import React, {Component} from 'react';
import { Container } from 'react-bootstrap';

const staticText = require('../data/text.json'); 

export default class Contact extends Component {

    render() {
        return (
            <section>
                <br></br>
                <br></br>
                <br></br>
                <div className="light-section">
                    <Container>
                        <h1 className="center text-dark">Need to Contact Us?</h1>
                        <hr className="risen-dark"></hr>
                        <p>{staticText.contact.blurb}</p>
                        {
                            staticText.contact.people.map((person) => {
                                return (
                                    <div>
                                        <h3>{person.title}</h3>
                                        <h5>{person.name}</h5>
                                        <p>Contact for: {person.responsibilities}</p>
                                        <p>Discord: {person.discord}</p>
                                        <hr></hr>
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