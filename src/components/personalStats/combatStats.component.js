import React, { Component, useState } from "react";

import { Container, Form } from "react-bootstrap";
import { customRound } from '../../Helpers';

import DotMap from '../dotmap.component';

let champMap = require('../../data/champions_map.json')

export default class CombatStats extends Component {
    
    constructor(props) {
        super(props);

        this.playerName = this.props.player;
        this.state = {
            statData: [],
            filteredData: [],
            dotLocations: [],
            offensiveStats: {},
            defensiveStats: {}
        }
    }

    filterData() {

    }

    aggregateOffensiveStats() {
        let type = document.getElementById("offensiveType");
        if (type == null) {
            return;
        }
        type = type.value;
        const totals = {
            "Kills": 0,
            "Kills@15": 0,
            "Assists": 0,
            "Assists@15": 0,
            "Damage To Champs": 0,
            "Solo Kills": 0,
            "Gank Kills": 0,
        }
        this.state.filteredData.map(game => {
            totals.Kills += game.kills;
            totals["Kills@15"] += game.kills15;
            totals["Assists"] += game.assists;
            totals["Assists@15"] += game.assists15;
            totals["Damage To Champs"] += game.totalDamageDealtToChampions;
            totals["Solo Kills"] += game.soloKills;
            totals["Gank Kills"] += game.gankKills;
        });
        if (type === "AVG"){
            for (const key of Object.keys(totals)) {
                totals[key] = customRound(totals[key] / this.state.filteredData.length);
            }
        }
        this.setState({
            offensiveStats: totals
        });
    }

    aggregateDefensiveStats() {
        let type = document.getElementById("defensiveType");
        if (type == null) {
            return;
        }
        type = type.value;
        const totals = {
            "Deaths": 0,
            "Deaths@15": 0,
            // "Assists": 0,
            // "Assists@15": 0,
            "Damage Taken": 0,
            "Solo Deaths": 0,
            "Gank Deaths": 0,
        }
        this.state.filteredData.map(game => {
            totals["Deaths"] += game.deaths;
            totals["Deaths@15"] += game.deaths15;
            totals["Damage Taken"] += game.totalDamageTaken;
            totals["Solo Deaths"] += game.soloDeaths;
            totals["Gank Deaths"] += game.gankDeaths;
        });
        if (type === "AVG"){
            for (const key of Object.keys(totals)) {
                totals[key] = customRound(totals[key] / this.state.filteredData.length);
            }
        }
        this.setState({
            defensiveStats: totals
        });
    }

    generateDots() {
        // This is kinda expensive

        function addToDots(map, type="?", color="red") {
            let dots = [];
            for (const event of map) {

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

        let side = document.getElementById("mapSideSelect");
        let type = document.getElementById("mapType");

        if (type === null || side === null) {
            return;
        }
        type = type.value;
        side = side.value;

        let allDots = [];
        for (const game of this.state.filteredData) {
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

    analyzeData() {
        this.aggregateOffensiveStats();
        this.aggregateDefensiveStats();
        this.generateDots();
    }

    componentDidUpdate() {
        // Handle Async update to playerdata stuff
        if (this.state.statData.length === 0 && this.props.playerData.length !== 0) {
            this.setState({
                statData: this.props.playerData,
                filteredData: JSON.parse(JSON.stringify(this.props.playerData))
            }, () => {
                this.filterData();
                this.analyzeData();
            });
        }
    }

    render() {
        return (
            <section>
                <Container>
                    <div className="row">
                        <div className="col">
                            <div className="risen-stats-block">
                                <div className="risen-stats-header">
                                    <h3>Filters</h3>
                                </div>
                                <div className="risen-stats-body">
                                    <div className="row">
                                        <div className="col">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="risen-stats-block">
                                <div className="risen-stats-header">
                                    <div className="row">
                                        <div className="col-8">
                                            <h3>Offensive Stats</h3>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group controlId="offensiveType">
                                                <Form.Label>Type</Form.Label>
                                                <Form.Control as="select" defaultValue="TOTAL" onChange={this.aggregateOffensiveStats.bind(this)} >
                                                    <option value="TOTAL">Total</option>
                                                    <option value="AVG">Average</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </div>
                                </div>
                                <div className="risen-stats-body">
                                    <table className="table-striped table risen-table">
                                        <tbody>
                                            {
                                                Object.entries(this.state.offensiveStats).map((entry, index) => {
                                                    return (
                                                        <tr key={"offStatsRow-" + index}>
                                                            <td><b>{entry[0]}</b></td>
                                                            <td>{entry[1]}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="risen-stats-block">
                                <div className="risen-stats-header">
                                    <div className="row">
                                        <div className="col-8">
                                            <h3>Defensive Stats</h3>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group controlId="defensiveType">
                                                <Form.Label>Type</Form.Label>
                                                <Form.Control as="select" defaultValue="TOTAL" onChange={this.aggregateDefensiveStats.bind(this)}>
                                                    <option value="TOTAL">Total</option>
                                                    <option value="AVG">Average</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </div>
                                </div>
                                <div className="risen-stats-body">
                                    <table className="table-striped table risen-table">
                                        <tbody>
                                            {
                                                Object.entries(this.state.defensiveStats).map((entry, index) => {
                                                    return (
                                                        <tr key={"defStatsRow-" + index}>
                                                            <td><b>{entry[0]}</b></td>
                                                            <td>{entry[1]}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
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
                                                <Form.Group controlId="formBasicRangeCustom">
                                                    <Form.Label>Time (0 shows all)</Form.Label>
                                                    <Form.Control type="range" defaultValue="0" max="100" custom />
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