import React, {Component} from 'react';
import { Container } from 'react-bootstrap';
import SetupCreate from './setup-create.component';
import SetupDisplay from './setup-display.component';
import { getBaseUrl } from '../../Helpers';

export default class Setup extends Component {
    constructor(props) {
        super(props);
        this.submitCallback = props.submit;
        this.state = {
            showCreate: true,
            gameLinks: {
                blue: "",
                red: "",
                spec: ""
            }
        }
        
    }
    
    createGame(configData) {
        const url = getBaseUrl() + '/draft/create';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(configData)
        }).then(res => {
            res.json().then(data => {
                console.log(data);
                this.setState({
                    gameLinks: {
                        blue: `http://${window.location.hostname}/draft?game=${data.gameLink}&auth=${data.blueAuth}`,
                        red: `http://${window.location.hostname}/draft?game=${data.gameLink}&auth=${data.redAuth}`,
                        spec: `http://${window.location.hostname}/draft?game=${data.gameLink}`
                    },
                    showCreate: false
                });
            });
          });
        
    }
    
    render() {
        return (
            <section>
                <div style={mainDivStyle} className="light-section">
                    <Container style={fillContainer}>
                    {this.state.showCreate ? <SetupCreate submit={this.createGame.bind(this)}></SetupCreate> : <SetupDisplay links={this.state.gameLinks}></SetupDisplay> }
                    </Container>
                </div>
            </section>
        )
    }
}

const mainDivStyle = {
    minHeight: '90vh'
}


const fillContainer = {
    height: '80vh'
}

