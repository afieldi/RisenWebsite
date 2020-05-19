import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teamname: '',
            duration: 0,
            date: new Date(),
            teams: []
        };
    }

    render() {
        return (
            <div>
                <h3>Welcome to Risen Esports!</h3>
            </div>
        )
    }
}
