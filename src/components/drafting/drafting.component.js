import React, {Component} from 'react';
import { Container, Button } from 'react-bootstrap';
import { getBaseUrl } from '../../Helpers';
import socketIOClient from "socket.io-client";
import risenLogo from '../../images/RE_TypeLogo_Shading.png'

const qs = require('qs');
const champions = require('../../data/champions.json')

export default class Drafting extends Component {
    constructor(props) {
        super(props);
        this.query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        this.auth = this.query.auth;
        this.game = this.query.game;

        // Used so that we can use .map in the render function for a size of 5
        this.fiveSize = [0, 1, 2, 3, 4];
        if (this.auth) {
            this.drafting = true;
        }
        else {
            this.drafting = false;
        }

        this.allChamps = Object.keys(champions.data);

        this.state = {
            styles: {

            },
            availChamps: Object.keys(champions.data),
            draft: {},
            round: 0,
            selectedChamp: "",
            picking: false,
            ready: false
        }
    }

    componentDidMount() {
        this.socket = socketIOClient(getBaseUrl(), {
            path: "/draft/connect"
        });
        this.setupSocket();
    }
    
    setupSocket() {
        this.socket.on('connect', () => {
            this.socket.emit("game", this.game, this.auth);
        });
        this.socket.on("drafting", (ready) => {
            this.drafting = true;
            this.setState({
                ready: ready
            });
        });
        this.socket.on("keyError", () => {
            alert("Bad URL!")
        });

        this.socket.on("pickStart", (round, time) => {
            console.log("Doing pick");
            this.setState({
                picking: true,
                round: round
            });
            if(this.getCurBlock()) {
                console.log("ahhh");
                this.getCurBlock().style["border"] = "1px solid red";
            }
        });

        this.socket.on("draftUpdate", (draft) => {
            console.log("got new draft");
            console.log(draft);
            this.setState({
                draft: draft,
                round: draft.stage
            });
            if(this.getCurBlock()) {
                console.log("ahhh");
                this.getCurBlock().style["border"] = "1px solid red";
            }
        });
    }

    readyUp() {
        this.socket.emit("draftReady");
    }

    submitPick(event) {
        this.socket.emit('picked', this.state.selectedChamp);
        this.setState({
            picking: false
        });
    }

    filterChampions() {
        const name = document.getElementById("champInput").value;
        this.setState({
            availChamps: this.allChamps.filter(champ => champ.toUpperCase().includes(name.toUpperCase()))
        })
    }

    getCurBlock() {
        const map = [
            "",
            "blueBan-0",
            "redBan-0",
            "blueBan-1",
            "redBan-1",
            "blueBan-2",
            "redBan-2",
            "bluePick-0",
            "redPick-0",
            "redPick-1",
            "bluePick-1",
            "bluePick-2",
            "redPick-2",
            "redBan-3",
            "blueBan-3",
            "redBan-4",
            "blueBan-4",
            "redPick-3",
            "bluePick-3",
            "bluePick-4",
            "redPick-4",
        ]
        return document.getElementById(map[this.state.round]);
    }

    selectChamp(event) {
        if (this.state.picking === false) {
            return;
        }
        let champ = event.target.id.split("-")[1];
        this.setState({
            selectedChamp: champ
        });
        this.socket.emit('hovered', champ);
        // this.getCurBlock().src = require('../../images/champions/profile/' + champ + "_0.jpg");
    }

    render() {
        return (
            <section>
                <div style={mainDivStyle} className="light-section">
                    <Container>
                        <div className="row">
                            <div className="col" style={rowFlexStyle}>
                                <div>
                                    <h2>{this.state.draft.blueName}</h2>
                                </div>
                            </div>
                            <div className="col-2">
                                <img src={risenLogo} style={{width: '100%'}} alt="Risen Logo"></img>
                            </div>
                            <div className="col" style={rowFlexStyle}>
                                <div style={{width: '100%', textAlign: 'right'}}>
                                    <h2>{this.state.draft.redName}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6" style={rowFlexStyle}>
                                {
                                    this.fiveSize.map(i => {
                                        if(this.state.draft.bluePicks && this.state.draft.bluePicks[+i]) {
                                            return (
                                                <img key={"bluePick-" + i} id={"bluePick-" + i} style={champBox}
                                                    src={require('../../images/champions/profile/' + this.state.draft.bluePicks[+i] + "_0.jpg")}>
    
                                                </img>
                                            )
                                        }
                                        else {
                                            return (
                                                <img key={"bluePick-" + i} id={"bluePick-" + i} style={champBox}>
    
                                                </img>
                                            )
                                        }
                                    })
                                }
                            </div>
                            <div className="col-6" style={rowFlexStyle}>
                                {
                                    this.fiveSize.map(i => {
                                        if(this.state.draft.redPicks && this.state.draft.redPicks[+i]) {
                                            return (
                                                <img key={"redPick-" + i} id={"redPick-" + i} style={champBox}
                                                    src={require('../../images/champions/profile/' + this.state.draft.redPicks[+i] + "_0.jpg")}>
    
                                                </img>
                                            )
                                        }
                                        else {
                                            return (
                                                <img key={"redPick-" + i} id={"redPick-" + i} style={champBox}>
    
                                                </img>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <div className="row">
                            <div className="col-6" style={rowFlexStyle}>
                                {
                                    this.fiveSize.map(i => {
                                        if(this.state.draft.blueBans) {
                                            console.log(this.state.draft.blueBans);
                                        }
                                        if(this.state.draft.blueBans && this.state.draft.blueBans[+i]) {
                                            return (
                                                <img key={"blueBan-" + i} id={"blueBan-" + i} style={champBox}
                                                    src={require('../../images/champions/profile/' + this.state.draft.blueBans[+i] + "_0.jpg")}>
    
                                                </img>
                                            )
                                        }
                                        else {
                                            return (
                                                <img key={"blueBan-" + i} id={"blueBan-" + i} style={champBox}>
    
                                                </img>
                                            )
                                        }
                                    })
                                }
                            </div>
                            <div className="col-6" style={rowFlexStyle}>
                                {
                                    this.fiveSize.map(i => {
                                        if(this.state.draft.redBans && this.state.draft.redBans[+i]) {
                                            return (
                                                <img key={"redBan-" + i} id={"redBan-" + i} style={champBox}
                                                    src={require('../../images/champions/profile/' + this.state.draft.redBans[+i] + "_0.jpg")}>
    
                                                </img>
                                            )
                                        }
                                        else {
                                            return (
                                                <img key={"redBan-" + i} id={"redBan-" + i} style={champBox}>
    
                                                </img>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                    
                        {
                            this.drafting ? 
                            <div>
                                {
                                    this.state.round > 0 ?
                                    <div>
                                        <br></br>
                                        <div className="row">
                                            <div className="col"></div>
                                            <div className="col-6">
                                                <div className="input-group mb-3">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text bg-secondary text-light" id="redName">Search</span>
                                                    </div>
                                                    <input type="text" className="form-control" id="champInput" aria-describedby="redName" onChange={this.filterChampions.bind(this)}></input>
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <Button onClick={this.submitPick.bind(this)}>Submit</Button>
                                            </div>
                                            <div className="col"></div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div style={iconGridStyle}>
                                                    {
                                                        this.state.availChamps.map(champ => {
                                                            return (
                                                                <img key={"img" + champ} id={"img-" + champ}
                                                                    src={require(`../../images/champions/icons/` + champ + `_0.jpg`)}
                                                                    style={iconStyle} onClick={this.selectChamp.bind(this)}></img>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div> :
                                    <div>
                                        <br></br>
                                        <div className="row">
                                            <div className="col" style={colFlexStyle}>
                                                {
                                                    this.state.ready ? 
                                                    <div>Waiting for opponent</div>
                                                    :
                                                    <Button onClick={this.readyUp.bind(this)}>Ready!</Button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div> : null
                        }
                    </Container>
                </div>
            </section>
        )
    }
}

const champBox = {
    width: '20%',
    height: "200px",
    border: '1px solid black'
}

const mainDivStyle = {
    minHeight: '100vh'
}

const rowFlexStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
}

const colFlexStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}

const iconStyle = {
    width: '75px'
}

const iconGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 75px)',
    columnGap: '5px',
    rowGap: '5px'
}