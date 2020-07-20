import React, {Component} from 'react';
import { Container } from 'react-bootstrap';
import { getBaseUrl } from '../../Helpers';
import socketIOClient from "socket.io-client";

const qs = require('qs');

export default class Drafting extends Component {
    constructor(props) {
        super(props);
        this.query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        this.auth = this.query.auth;
        if (this.auth) {
            this.drafting = true;
        }
        else {
            this.drafting = false;
        }

        this.state = {
            styles: {
                
            }
        }
        console.log(this.auth);
    }

    componentDidMount() {
        const socket = socketIOClient(getBaseUrl(), {
            path: "/draft/connect"
        });
        socket.on('connect', () => {
            if (this.drafting) {
                socket.emit("auth", [this.auth]);
            }
        });
        socket.on("keyError", () => {
            alert("Bad URL!")
        })
    }

    render() {
        return (
            <section>
                <div style={mainDivStyle} className="light-section">
                    <Container>
                        <div className="row">
                            <div className="col-6">

                            </div>
                            <div className="col-6">

                            </div>
                        </div>
                    </Container>
                </div>
            </section>
        )
    }
}

const mainDivStyle = {
    minHeight: '100vh'
}