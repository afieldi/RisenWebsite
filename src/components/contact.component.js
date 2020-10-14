import React, {Component} from 'react';
import { Container } from 'react-bootstrap';

const staticText = require('../data/text.json'); 

export default class Contact extends Component {

    render() {
        return (
            <section>
                <br></br>
                <div className="dark-section text-light">
                    <Container>
                        <h1 className="center">Need to Contact Us?</h1>
                        <hr className="risen-dark"></hr>
                        <p>{staticText.contact.blurb}</p>
                        <hr></hr>
                        {
                            staticText.contact.people.map((person) => {
                                return (
                                    <div>
                                        <h3>{person.title}</h3>
                                        <h5>{person.name}</h5>
                                        <p className="light">Contact for: {person.responsibilities}</p>
                                        <p className="light">Discord: {person.discord}</p>
                                        <hr style={{backgroundColor: 'white'}}></hr>
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