import React, {Component} from 'react';
import { Container } from 'react-bootstrap';

export default class DraftSpectator extends Component {
    constructor(props) {
        super(props);
        this.submitCallback = props.submit;
        
    }

    render() {
        return (
            <section>
                <div style={mainDivStyle} className="light-section">
                    <Container>
                    
                    </Container>
                </div>
            </section>
        )
    }
}

const mainDivStyle = {
    minHeight: '100vh'
}