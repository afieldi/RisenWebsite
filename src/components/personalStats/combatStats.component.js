import React, { Component, useState } from "react";

import { Container, Form } from "react-bootstrap";
import { customRound, matchDict } from '../../Helpers';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip, Legend, ReferenceLine, ResponsiveContainer} from 'recharts';

import DotMap from '../dotmap.component';

let champMap = require('../../data/champions_map.json')

export default class CombatStats extends Component {
    
    constructor(props) {
        super(props);

        this.playerName = this.props.player;
        this.avgData = {};
        this.statData = [];
        this.filteredData = [];
        this.accStats = {};
        this.state = {
            dotLocations: [],
        }
    }

    generateDots() {
        // This is kinda expensive
        let side = document.getElementById("mapSideSelect");
        let type = document.getElementById("mapType");
        let time = document.getElementById("timeSelect");

        if (type === null || side === null) {
            return;
        }
        type = type.value;
        side = side.value;
        time = time.value;

        function addToDots(map, type="?", color="red") {
            let dots = [];
            for (const event of map) {
                // Event is of form [x, y, timestamp]
                if (time != 0) {
                    if (Math.abs(event[2] - (time * 2 * 60000)) > 60000) {
                        continue;
                    }
                }

                dots.push([
                    customRound((event[0]/15000) * 100, 0).toString() + "%",
                    customRound((event[1]/15000) * 100, 0).toString() + "%",
                    type,
                    event[2],
                    color
                ]);
            }
            return dots;
        }

        let allDots = [];
        for (const game of this.filteredData) {
            if ((game.teamId !== 100 && side === "BLUE") ||
                (game.teamId !== 200 && side === "RED")) {
                continue;
            }

            if (type === "KILLS") {
                allDots = allDots.concat(addToDots(game.killMap, "Kill", "blue"));
            }
            else if (type === "DEATHS") {
                allDots = allDots.concat(addToDots(game.deathMap, "Death", "red"));
            }
            // Kills and assists
            else if (type === "KA") {
                allDots = allDots.concat(addToDots(game.killMap, "Kill", "blue"));
                allDots = allDots.concat(addToDots(game.assistMap, "Assist", "green"));
            }
            // All
            else {
                allDots = allDots.concat(addToDots(game.killMap, "Kill", "blue"));
                allDots = allDots.concat(addToDots(game.assistMap, "Assist", "green"));
                allDots = allDots.concat(addToDots(game.deathMap, "Death", "red"));
            }
        }
        this.setState({
            dotLocations: allDots
        })
    }

    componentDidMount() {
        // this.generateDots();
    }

    shouldComponentUpdate(newProps, newState) {
        // TODO: maybe look for a better way to do this
        // As generating the dots stores the data in the state, it requires updating state
        if (this.filteredData === newProps.playerData &&
            this.accStats === newProps.accStats &&
            JSON.stringify(this.state) === JSON.stringify(newState)) {
            return false;
        }
        this.filteredData = newProps.playerData;
        this.accStats = newProps.accStats;
        this.avgData = newProps.avgData;
        this.generateDots();
        return true;
    }

    getOffensiveData() {
        let barElements = [
            () => {
                let v1 = customRound(((this.accStats['avg_kills']+this.accStats['avg_assists'])*60)/this.accStats["avg_gameDuration"], 2);
                let v2 = customRound(((this.avgData['avg_kills']+this.avgData['avg_assists'])*60)/this.avgData["avg_gameDuration"], 2);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                  name: `KP/min`,
                  player: (v1*.9/vm)*-1,
                  risen: v2*.9/vm,
                  playerAct: v1,
                  risenAct: v2
                }
            },
            () => {
                let v1 = customRound(this.accStats['avg_soloKills'], 2);
                let v2 = customRound(this.avgData['avg_soloKills'], 2);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                  name: `Solo Kills`,
                  player: (v1*.9/vm)*-1,
                  risen: v2*.9/vm,
                  playerAct: v1,
                  risenAct: v2
                }
            },
            () => {
                let v1 = customRound(this.accStats['avg_gankKills'], 2);
                let v2 = customRound(this.avgData['avg_gankKills'], 2);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                  name: `Gank Kills`,
                  player: (v1/vm)*-1,
                  risen: v2/vm,
                  playerAct: v1,
                  risenAct: v2
                }
            },
            () => {
                let v1 = customRound(this.accStats['avg_kills15'] + this.accStats['avg_assists15'], 2);
                let v2 = customRound(this.avgData['avg_kills15'] + this.avgData['avg_assists15'], 2);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                  name: `KP@15`,
                  player: (v1/vm)*-1,
                  risen: v2/vm,
                  playerAct: v1,
                  risenAct: v2
                }
            },
            () => {
                let v1 = customRound(this.accStats['avg_firstBloodKill'] + this.accStats['avg_firstBloodAssist'], 2);
                let v2 = customRound(this.avgData['avg_firstBloodKill'] + this.avgData['avg_firstBloodAssist'], 2);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                  name: `First Blood KP%`,
                  player: (v1/vm)*-1,
                  risen: v2/vm,
                  playerAct: v1,
                  risenAct: v2
                }
            },
            
        ]
        let data = [];
        for (let f of barElements) {
            data.push(f());
        }
        return data;
    }

    getDefensiveData() {
        let barElements = [
            () => {
                let v1 = customRound(((this.accStats['avg_deaths'])*60)/this.accStats["avg_gameDuration"], 2);
                let v2 = customRound(((this.avgData['avg_deaths'])*60)/this.avgData["avg_gameDuration"], 2);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                  name: `Deaths /min`,
                  player: (v1*.9/vm),
                  risen: v2*.9/vm,
                  playerAct: v1,
                  risenAct: v2
                }
            },
            () => {
                let v1 = customRound(this.accStats['avg_soloDeaths'], 2);
                let v2 = customRound(this.avgData['avg_soloDeaths'], 2);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                  name: `Solo Deaths`,
                  player: (v1*.9/vm),
                  risen: v2*.9/vm,
                  playerAct: v1,
                  risenAct: v2
                }
            },
            () => {
                let v1 = customRound(this.accStats['avg_gankDeaths'], 2);
                let v2 = customRound(this.avgData['avg_gankDeaths'], 2);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                  name: `Gank Deaths`,
                  player: (v1/vm),
                  risen: v2/vm,
                  playerAct: v1,
                  risenAct: v2
                }
            },
            () => {
                let v1 = customRound(this.accStats['avg_totalDamageTaken']*60/this.accStats['avg_gameDuration'], 2);
                let v2 = customRound(this.avgData['avg_totalDamageTaken']*60/this.avgData['avg_gameDuration'], 2);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                  name: `DMG Taken/min`,
                  player: (v1/vm),
                  risen: v2/vm,
                  playerAct: v1,
                  risenAct: v2
                }
            },
            () => {
                let v1 = customRound(this.accStats['avg_damageDealtToObjectives']*60/this.accStats['avg_gameDuration'], 2);
                let v2 = customRound(this.avgData['avg_damageDealtToObjectives']*60/this.avgData['avg_gameDuration'], 2);
                v1 = v1 ? v1 : 0;
                v2 = v2 ? v2 : 0;
                let vm = Math.max(v1, v2);
                return {
                  name: `Objective DPM`,
                  player: (v1/vm),
                  risen: v2/vm,
                  playerAct: v1,
                  risenAct: v2
                }
            },
            
        ]
        let data = [];
        for (let f of barElements) {
            data.push(f());
        }
        return data;
    }

    format(value, name, props) {
        return props.payload[props.dataKey + 'Act'];
    }

    render() {
        return (
            <section>
                <Container>
                    <div className="row">
                        <div className="col">
                            <div className="risen-stats-block">
                                <div className="risen-stats-header">
                                    <h3>Offensive Stats</h3>
                                </div>
                                <div className="risen-stats-body">
                                    <div style={{display:'grid', gridTemplateColumns: 'auto auto'}}>
                                        <div style={{textAlign: "Center"}}>{this.playerName}</div>
                                        <div style={{textAlign: "Center"}}>Risen Average</div>
                                    </div>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart
                                            data={this.getOffensiveData()}
                                            layout="vertical"
                                            barGap='-30'
                                            barSize={30}
                                            margin={{
                                            top: 5, right: 30, left: 20, bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid vertical horizontal={false} strokeDasharray="1 1" />
                                            <XAxis type="number" hide="true" />
                                            <YAxis type="category" dataKey="name" tick={{ fill: 'white' }}/>
                                            <Tooltip labelStyle={{color: 'black'}} formatter={this.format} />
                                            {/* <Legend /> */}
                                            {/* <ReferenceLine y={0} stroke="#000" /> */}
                                            <Bar name={this.playerName} dataKey="player" fill="#8884d8" />
                                            <Bar name="Risen" dataKey="risen" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="risen-stats-block">
                                <div className="risen-stats-header">
                                    <h3>Defensive Stats</h3>
                                </div>
                                <div className="risen-stats-body">
                                    {/* <div style={{display:'grid', gridTemplateColumns: 'auto auto'}}>
                                        <div style={{textAlign: "Center"}}>{this.playerName}</div>
                                        <div style={{textAlign: "Center"}}>Risen Average</div>
                                    </div> */}
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart
                                            data={this.getDefensiveData()}
                                            // layout="vertical"
                                            // barGap='-30'
                                            // barSize={30}
                                            margin={{
                                            top: 5, right: 30, left: 20, bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} horizontal={false} opacity={1} strokeDasharray="1 1" />
                                            <YAxis type="number" hide="false" />
                                            <XAxis type="category" dataKey="name" tick={{ fill: 'white' }}/>
                                            <Tooltip labelStyle={{color: 'black'}} formatter={this.format} />
                                            <Legend />
                                            {/* <ReferenceLine y={0} stroke="#000" /> */}
                                            <Bar name={this.playerName} dataKey="player" fill="#8884d8" />
                                            <Bar name="Risen Avg" dataKey="risen" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="risen-stats-block">
                                <div className="risen-stats-header">
                                    <h3>Kill Map</h3>
                                </div>
                                <div className="risen-stats-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <DotMap dots={this.state.dotLocations}></DotMap>
                                        </div>
                                        <div className="col-md-4">
                                            <h4>Filters</h4>
                                            <Form>
                                                <Form.Group controlId="mapType" onChange={this.generateDots.bind(this)}>
                                                    <Form.Label>Map Type</Form.Label>
                                                    <Form.Control as="select">
                                                        <option value="KILLS">Kills</option>
                                                        <option value="DEATHS">Deaths</option>
                                                        <option value="KA">Kills + Assists</option>
                                                        <option value="ALL">All</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group controlId="mapSideSelect" onChange={this.generateDots.bind(this)}>
                                                    <Form.Label>Side</Form.Label>
                                                    <Form.Control as="select" defaultValue="BOTH">
                                                        <option value="BLUE">Blue</option>
                                                        <option value="RED">Red</option>
                                                        <option value="BOTH">Both</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group controlId="timeSelect" onChange={this.generateDots.bind(this)}>
                                                    <Form.Label>Time (0 shows all): Don't use if you have a bad comp</Form.Label>
                                                    <Form.Control type="range" defaultValue="0" max="21" custom />
                                                </Form.Group>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        )
    }
}

const centerTitleStyle = {
    display: 'flex',
    alignItems: 'center'
}