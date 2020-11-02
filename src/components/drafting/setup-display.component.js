import React, {Component} from 'react';
import { Container, Button } from 'react-bootstrap';
import $ from 'jquery'

export default class SetupDisplay extends Component {
    constructor(props) {
        super(props);        
    }


    render() {
        return (
            <div style={vFlex}>
                <div style={hFlex}>
                    <div className="row" style={fillRow}>
                        <div className="col">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-primary text-light" style={textWidth} id="blueLink">Blue Captain</span>
                                </div>
                                <input type="text" className="form-control" id="basic-url" aria-describedby="blueLink" defaultValue={this.props.links.blue} disabled></input>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={fillRow}>
                        <div className="col">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-danger text-light" style={textWidth} id="redLink">Red Captain</span>
                                </div>
                                <input type="text" className="form-control" id="basic-url" aria-describedby="redLink" defaultValue={this.props.links.red} disabled></input>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={fillRow}>
                        <div className="col">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" style={textWidth} id="specLink">Spectator</span>
                                </div>
                                <input type="text" className="form-control" id="basic-url" aria-describedby="specLink" defaultValue={this.props.links.spec} disabled></input>
                            </div>
                        </div>
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

const textWidth = {
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