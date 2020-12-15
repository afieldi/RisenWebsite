import React, {Component} from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class SetupCreate extends Component {
    constructor(props) {
        super(props);
        this.submitCallback = props.submit;
    }

    createGame() {
        let data = {
            blueName: document.getElementById("blueInput").value,
            redName: document.getElementById("redInput").value,
            time: document.getElementById("timeInput").value,
            backtrack: document.getElementById("backtrackSwitch").checked,
            useRisen: document.getElementById("risenChampSwitch").checked,
        }
        this.submitCallback(data);
    }

    render() {
        return (
            <div style={vFlex}>
                <div style={hFlex}>
                    <div className="row" style={fillRow}>
                        <div className="col">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-primary text-light" style={spanStyle} id="blueName">Blue Team Name</span>
                                </div>
                                <input type="text" className="form-control" id="blueInput" aria-describedby="blueName" style={lightishBg}></input>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={fillRow}>
                        <div className="col">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-danger text-light" style={spanStyle} id="redName">Red Team Name</span>
                                </div>
                                <input type="text" className="form-control" id="redInput" aria-describedby="redName" style={lightishBg}></input>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={fillRow}>
                        <div className="col">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" style={spanStyle} id="timeLabel">Time (-1 unlimited)</span>
                                </div>
                                <input type="number" className="form-control" id="timeInput" aria-describedby="timeLabel" defaultValue="30" style={lightishBg}></input>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="custom-control custom-switch">
                                <input type="checkbox" className="custom-control-input" id="backtrackSwitch" disabled></input>
                                <label className="custom-control-label" htmlFor="backtrackSwitch">Allow Backtrack</label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="custom-control custom-switch">
                                <input type="checkbox" className="custom-control-input" id="risenChampSwitch" defaultChecked={false}></input>
                                <label className="custom-control-label" htmlFor="risenChampSwitch">Use Risen Champs</label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <Button onClick={this.createGame.bind(this)} disabled>Create Game</Button>
                    </div>
                    <br></br>
                    <div>
                        <Link to="/pbdraft"><Button onClick={this.createGame.bind(this)}>Interactive Draft</Button></Link>
                    </div>
                </div>
            </div>
        )
    }
}

const vFlex = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%'
}

const spanStyle = {
    minWidth: '160px',
    border: '0'
}

const fillRow = {
    width: "100%"
}

const hFlex = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
}

const lightishBg = {
    backgroundColor: '#dcdcdc'
}