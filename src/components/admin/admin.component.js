import React, {Component} from 'react';
import GenerateCodes from './generateCodes.component';
import { Container } from 'react-bootstrap';
import ManageDraft from './manageDraft.component';

export default class Admin extends Component {
    render() {
        return (
            <section>
                <div className='light-section'>
                    <Container>
                        <div className="row">
                            <div className="col">
                                <GenerateCodes></GenerateCodes>
                            </div>
                            {/* <div className="col">
                                <ManageDraft></ManageDraft>
                            </div> */}
                        </div>
                    </Container>
                </div>
            </section>
        );
    }
}