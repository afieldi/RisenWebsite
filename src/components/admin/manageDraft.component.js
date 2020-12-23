import React, {Component} from 'react';

const champions = require('../../data/champions_map.json')


export default class ManageDraft extends Component {
    constructor(props) {
        super(props);
        this.champs = Object.keys(champions);
        this.champs = this.champs.sort((a, b) => champions[a] > champions[b] ? 1 : -1);

        this.state = {
            bannedChamps: []
        }
        this.getBannedChamps();
    }

    sendBan() {
        fetch(process.env.REACT_APP_BASE_URL + "/draft/champban", {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                champion: document.getElementById("banChamp").value,
                expiryDate: document.getElementById("expiry").value
            })
        }).then(res => {
            this.getBannedChamps();
        });
    }

    removeBan(id) {
        fetch(process.env.REACT_APP_BASE_URL + "/draft/champban?id=" + id, {
            method: "DELETE"
        }).then(data => {
            this.getBannedChamps();
            alert("Element deleted");
        });
    }

    getBannedChamps() {
        fetch(process.env.REACT_APP_BASE_URL + "/draft/champban").then(data => {
            data.json().then(bans => {
                this.setState({
                    bannedChamps: bans
                });
            })
        });
    }

    getDefaultDate() {
        const x = new Date();
        x.setDate(x.getDate() + 14);
        return `${x.getFullYear()}-${(x.getUTCMonth() + 1).toString().padStart(2, "0")}-${x.getDate().toString().padStart(2, "0")}`;
    }

    render() {
        return (
            <section>
                <div className="row">
                    <div className="col">
                        <h2>Ban Champions From Draft</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text bg-light" id="blueName">Champion Name</span>
                            </div>
                            <select name="champs" id="banChamp">
                                {
                                    this.champs.map(key => {
                                        return (
                                            <option value={champions[key]} key={key}>{champions[key]}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <input type="date" id="expiry" name="expiry" defaultValue={this.getDefaultDate()}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button className="risen-button" onClick={this.sendBan.bind(this)}>Ban Champion</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <td>Champion</td>
                                        <td>Expiry Date</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.bannedChamps.map(ban => {
                                            return (
                                                <tr>
                                                    <td>{ban.champion}</td>
                                                    <td>{ban.expiryDate}</td>
                                                    <td><button onClick={(() => {this.removeBan(ban._id)}).bind(this)}>Delete</button></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}