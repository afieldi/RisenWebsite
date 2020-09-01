import React, {Component} from 'react';
import { Container } from 'react-bootstrap';

export default class ManageTeams extends Component {
    render() {
        return (
            <section>
                <div className="light-section">
                    <Container>
                        <div className='row'>
                            <div className='col'>
                                <form action="http://localhost:5000/teams/load" method="POST" enctype="multipart/form-data">
                                    <input type="file" name="teamSheet"></input>
                                    <button type="submit">Submit</button>
                                    <input type="text" name="seasonName"></input>
                                </form>
                            </div>
                        </div>
                    </Container>
                </div>
            </section>
        );
    }
}