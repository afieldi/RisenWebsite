import React, {Component} from 'react';
import { Container } from 'react-bootstrap';
import SetupCreate from './setup-create.component';
import SetupDisplay from './setup-display.component';

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
        const url = process.env.REACT_APP_BASE_URL + '/draft/create';
        console.log(configData);
        fetch(url, {
            method: 'POST',
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(configData)
        }).then(res => {
            res.json().then(data => {
                console.log(data);
                this.setState({
                    gameLinks: {
                        blue: `https://${window.location.hostname}/draft?game=${data.gameLink}&auth=${data.blueAuth}`,
                        red: `https://${window.location.hostname}/draft?game=${data.gameLink}&auth=${data.redAuth}`,
                        spec: `https://${window.location.hostname}/draft?game=${data.gameLink}`
                    },
                    showCreate: false
                });
            });
          });
        
    }
    
    render() {
        return (
            <section>
                <div style={mainDivStyle} className="dark-section text-light">
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

