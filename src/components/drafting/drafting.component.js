import React, {Component} from 'react';
import { Container, Button } from 'react-bootstrap';
import socketIOClient from "socket.io-client";
import risenLogo from '../../images/RE_TypeLogo_Shading.png';


const qs = require('qs');
const champions = require('../../data/champions.json')
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
];

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
            ready: 0, // 0 no on ready, 1 I am ready, 2 Both are ready
            blueCount: -1,
            redCount: -1
        }
    }

    componentDidMount() {
        this.socket = socketIOClient(process.env.REACT_APP_BASE_URL, {
            path: "/draft/connect"
        });
        this.setupSocket();
    }

    handleRisenRules() {
        fetch(process.env.REACT_APP_BASE_URL + "/draft/champban").then(data => {
            data.json().then(bans => {
                for (let ban of bans) {
                    if (this.allChamps.includes(ban.champion)) {
                        console.log(this.allChamps.indexOf(ban.champion));
                        this.allChamps.splice(0, 1);
                        console.log(this.allChamps);
                    }
                }
                this.filterChampions();
            })
        });
    }

    
    setupSocket() {
        this.socket.on('connect', () => {
            this.socket.emit("game", this.game, this.auth);
        });

        this.socket.on("initalDraft", (draft) => {
            if (draft.ruleset === "RISEN") {
                this.handleRisenRules();   
            }
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
            let nState = {
                picking: true,
                round: round,
            }
            if(this.getSide(round) === 0) {
                nState["blueCount"] = time;
                nState["redCount"] = -1;
            }
            else {
                nState["redCount"] = time;
                nState["blueCount"] = -1;
            }
            this.setState(nState, () => {
                this.setBorder();
            });
        });

        this.socket.on("pickEnd", () => {
            this.setState({
                picking: false
            });
        });

        this.socket.on("timeUpdate", (time) => {
            let nState = {};
            if(this.getSide(+this.state.draft.stage + 1) === 0) {
                nState["blueCount"] = time;
                nState["redCount"] = 0;
            }
            else {
                nState["redCount"] = time;
                nState["blueCount"] = 0;
            }

            if(time === 0 && this.state.picking) {
                this.submitPick();
            }
            this.setState(nState);
        });

        this.socket.on("draftUpdate", (draft, time) => {
            let nState = {
                draft: draft,
                round: this.state.ready === 2 ? +draft.stage + 1 : +draft.stage
            }
            if(this.getSide(+draft.stage + 1) === 0) {
                nState["blueCount"] = time;
                nState["redCount"] = 0;
            }
            else {
                nState["redCount"] = time;
                nState["blueCount"] = 0;
            }
            this.setState(nState, () => {
                this.setBorder();
            });
            
        });
    }

    getSide(pick) {
        const blue = [1,3,5,14,16,7,10,11,18,19];
        if(blue.includes(pick)) {
            return 0;
        }
        return 1;
    }
    

    readyUp() {
        this.socket.emit("draftReady");
    }

    setBorder() {
        for (let i in map) {
            const ele = document.getElementById(map[i]);
            if(ele) {
                if(this.state.round == i) {
                    // ele.style["borderTop"] = "10px solid red";
                    ele.classList.add("selected");
                }
                else {
                    // ele.style["borderTop"] = "1px solid black";
                    ele.classList.remove("selected");
                }
            }
        }
    }

    submitPick() {
        if(this.state.selectedChamp.length < 3) {
            return;
        }
        this.socket.emit('picked', this.state.selectedChamp, this.state.round);
        this.setState({
            picking: false,
            selectedChamp: ""
        });
    }

    filterChampions() {
        const name = document.getElementById("champInput") ? document.getElementById("champInput").value : "";
        this.setState({
            availChamps: this.allChamps.filter(champ => champ.toUpperCase().includes(name.toUpperCase()))
        });
    }

    getCurBlock() {
        
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
        this.socket.emit('hovered', champ, this.state.round);
    }

    champIsSelected(champ) {
        if (this.state.draft.blueBans.includes(champ) || 
            this.state.draft.redBans.includes(champ) ||
            this.state.draft.bluePicks.includes(champ) || 
            this.state.draft.redPicks.includes(champ)) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <section>
                <div style={mainDivStyle} className="light-section">
                    <Container>
                        <div className="row">
                            <div className="col" style={rowFlexStyle}>
                                <div className="row" style={fullRow}>
                                    <div className="col">
                                        <h2>{this.state.draft.blueName}</h2>
                                    </div>
                                    <div className="col-2">
                                        <h2>{this.state.blueCount > 0 ? this.state.blueCount : null}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-2">
                                <img src={risenLogo} style={{width: '100%'}} alt="Risen Logo"></img>
                            </div>
                            <div className="col" style={rowFlexStyle}>
                                <div className="row" style={fullRow}>
                                    <div className="col-2">
                                        <h2>{this.state.redCount > 0 ? this.state.redCount: null}</h2>
                                    </div>
                                    <div className="col" style={{textAlign: 'right'}}>
                                        <h2>{this.state.draft.redName}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6" style={rowFlexStyle}>
                                <div className="row" style={minorRowStyle}>
                                    {
                                        this.fiveSize.map(i => {
                                            let boxStyle = window.screen.width > 1200 ? champBoxTall : champBoxShort;
                                            if(this.state.draft.bluePicks && this.state.draft.bluePicks[+i]) {
                                                let champ = this.state.draft.bluePicks[+i];
                                                let imgSrc = window.screen.width > 1200 ? 'profile' : 'splash';
                                                return (
                                                    <div className="col-lg" style={boxStyle} id={"bluePick-" + i}>
                                                        <img key={"bluePick-" + i} style={champImg}
                                                            src={require(`../../images/champions/${imgSrc}/${this.state.draft.bluePicks[+i]}_0.jpg`)}>
                                                        </img>
                                                        <div style={champImgOverlay} className="d-lg-none"></div>
                                                        <div style={champNameStyle} className="d-lg-none">{champions.data[champ].name}</div>
                                                    </div>
                                                )
                                            }
                                            else {
                                                return (
                                                    <div className="col-lg" style={{...blueBox, ...boxStyle}} id={"bluePick-" + i}>
                                                        <img key={"bluePick-" + i} >
                                                        </img>
                                                    </div>
                                                )
                                            }
                                        })
                                    }

                                </div>
                            </div>
                            <div className="col-6" style={rowFlexStyle}>
                                <div className="row" style={minorRowStyle}>
                                    {
                                        this.fiveSize.map(i => {
                                            let boxStyle = window.screen.width > 1200 ? champBoxTall : champBoxShort;
                                            if(this.state.draft.redPicks && this.state.draft.redPicks[+i]) {
                                                let champ = this.state.draft.redPicks[+i];
                                                let imgSrc = window.screen.width > 1200 ? 'profile' : 'splash';
                                                return (
                                                    <div className="col-lg" style={boxStyle} id={"redPick-" + i}>
                                                        <img key={"redPick-" + i} style={champImg}
                                                            src={require(`../../images/champions/${imgSrc}/${this.state.draft.redPicks[+i]}_0.jpg`)}>
                                                            </img>
                                                        <div style={{...champImgOverlay, ...champOverlayRed}} className="d-lg-none"></div>
                                                        <div style={{...champNameStyle, ...champNameRed}} className="d-lg-none">{champions.data[champ] ? champions.data[champ].name : "You idiot"}</div>
                                                    </div>
                                                )
                                            }
                                            else {
                                                return (
                                                    <div className="col-lg" style={{...redBox, ...boxStyle}} id={"redPick-" + i}>
                                                        <img key={"redPick-" + i}>
                                                        </img>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <div className="row">
                            <div className="col-6" style={rowFlexStyle}>
                                <div className="row" style={minorRowStyle}>
                                    {
                                        this.fiveSize.map(i => {
                                            let boxStyle = window.screen.width > 1200 ? champBoxTall : champBoxShort;
                                            if(this.state.draft.blueBans && this.state.draft.blueBans[+i]) {
                                                return (
                                                    <div className="col" style={boxStyle} id={"blueBan-" + i}>
                                                        <img key={"blueBan-" + i} style={champImg}
                                                            src={require('../../images/champions/profile/' + this.state.draft.blueBans[+i] + "_0.jpg")}>
                                                        </img>
                                                    </div>
                                                )
                                            }
                                            else {
                                                return (
                                                    <div className="col" style={{...blueBox, ...boxStyle}} id={"blueBan-" + i} >
                                                        <img key={"blueBan-" + i}>
                                                        </img>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>
                            <div className="col-6" style={rowFlexStyle}>
                                <div className="row" style={minorRowStyle}>
                                    {
                                        this.fiveSize.map(i => {
                                            let boxStyle = window.screen.width > 1200 ? champBoxTall : champBoxShort;

                                            if(this.state.draft.redBans && this.state.draft.redBans[+i]) {
                                                return (
                                                    <div className="col" style={boxStyle} id={"redBan-" + i}>
                                                        <img key={"redBan-" + i} style={champImg}
                                                            src={require('../../images/champions/profile/' + this.state.draft.redBans[+i] + "_0.jpg")}>
                                                        </img>
                                                    </div>
                                                )
                                            }
                                            else {
                                                return (
                                                    <div className="col" style={{...redBox, ...boxStyle}} id={"redBan-" + i}>
                                                        <img key={"redBan-" + i}>
                                                        </img>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    
                        {
                            this.drafting ? 
                            <div>
                                {
                                    this.state.round > 0 && this.state.ready === 2 ?
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
                                                {
                                                    this.state.picking ? 
                                                    <Button onClick={this.submitPick.bind(this)}>Submit</Button> : null
                                                }
                                            </div>
                                            <div className="col"></div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div style={iconGridStyle}>
                                                    {
                                                        this.state.availChamps.map(champ => {
                                                            let style = iconStyle;
                                                            let onClickFnc = this.selectChamp.bind(this);
                                                            if (this.champIsSelected(champ)) {
                                                                style = Object.assign({}, iconStyle, {"filter": "brightness(0.6)"});
                                                                onClickFnc = null;
                                                            }
                                                            return (
                                                                <div>
                                                                    <img key={"img" + champ} id={"img-" + champ}
                                                                    src={require(`../../images/champions/icons/` + champ + `_0.png`)}
                                                                    style={style} onClick={onClickFnc}></img>
                                                                    <h6>{champions.data[champ].name}</h6>
                                                                </div>
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
                                                    this.state.ready === 1 ? 
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

const champBoxTall = {
    // height: "100%",
    border: '1px solid black',
    padding: '0',
    height: '200px',
}

const champBoxShort = {
    // height: "100%",
    border: '1px solid black',
    padding: '0',
    height: '100px',
}

const champImg = {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    objectPosition: '0% 20%',
}

const champImgOverlay = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: '0',
    background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 59%, rgba(0,0,0,0.75) 100%)'
}

const champOverlayRed = {
    transform: 'rotate(180deg)'
}

const champNameStyle = {
    position: 'absolute',
    width: '95%',
    left: '2.5%',
    bottom: '5px',
    fontFamily: 'fantasy',
    color: 'white',
    fontSize: '24px',
    textAlign: 'right'
}

const champNameRed = {
    textAlign: 'left'
}

// const champImg = {
//     height: '100%',
//     width: '100%',
//     height: '200px',
// }

const redBox = {
    backgroundColor: 'rgb(79, 15, 23)',
}

const blueBox = {
    backgroundColor: 'rgb(18, 80, 113)',
}

const mainDivStyle = {
    // minHeight: '100vh'
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

const fullRow = {
    width: "100%"
}

const iconStyle = {
    width: '75px'
}

const minorRowStyle = {
    width: '100%',
    margin: '0'
}

const iconGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 75px)',
    columnGap: '5px',
    rowGap: '5px'
}