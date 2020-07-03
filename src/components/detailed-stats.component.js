import React, { Component } from "react";

import topLaneIcon from '../images/roles/Position_Gold-Top.png';
import jngLaneIcon from '../images/roles/Position_Gold-Jungle.png';
import midLaneIcon from '../images/roles/Position_Gold-Mid.png';
import botLaneIcon from '../images/roles/Position_Gold-Bot.png';
import supLaneIcon from '../images/roles/Position_Gold-Support.png';
import { customRound } from '../Helpers';


export default class DetailedStats extends Component {

    constructor(props) {
        super(props);
        this.loadPlayerData(this.props.match.params.player);
        this.state = {
            statData: [],
            accumulatedStats: {},
            filteredData: []
        }
    }

    loadPlayerData(playerName) {
        let url = "http://localhost:5000/stats/player/" + playerName
        fetch(url).then((data) => {
            // console.log(data.json());
            data.json().then(data => {
                // console.log(data);
                let accStats = {
                    "wr": 0,
                    "games": 0,
                    "kda": 0,
                    "cs": 0
                }
                this.computeAccStats(accStats, data);
                this.setState({
                    statData: data,
                    accumulatedStats: accStats,
                    filteredData: JSON.parse(JSON.stringify(data)) // make a copy, this will be filtered
                });
                console.log(JSON.parse(JSON.stringify(data)));
                console.log(this.state.filteredData);
            });
        })
    }

    filterData(role) {

    }

    computeAccStats (accStats, data) {
        let wins = 0;
        let kills = 0, deaths = 0, assists = 0;
        let cs = 0, min = 0;
        for ( let datum of data ) {
            accStats["games"] += 1;
            if (datum["win"]) {
                wins += 1;
            }
            kills += datum["kills"];
            deaths += datum["deaths"];
            assists += datum["assists"];
            cs += datum["totalMinionsKilled"];
            min += datum["gameDuration"] / 60
        }
        accStats["wr"] = customRound(wins/accStats["games"] * 100, 2);
        accStats["kda"] = customRound((kills + assists) / deaths, 1);
        accStats["cs"] = customRound(cs / min, 1);
    }

    getPositonalIcon(position) {
        switch (position) {
            case "TOP":
                return (<img src={topLaneIcon}></img>)
            case "JUNGLE":
                return (<img src={jngLaneIcon}></img>)
            case "MIDDLE":
                return (<img src={midLaneIcon}></img>)
            case "BOTTOM":
                return (<img src={botLaneIcon}></img>)
            case "SUPPORT":
                return (<img src={supLaneIcon}></img>)
            default:
                return (<img src={midLaneIcon}></img>)
                break;
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="risen-stats-block">
                            <div className="risen-stats-header">
                                <div className="btn-group risen-radio" data-toggle="buttons">
                                    <label className="btn btn-dark">
                                        <input type="radio" name="options" id="option1" onClick={this.filterData.bind(this, "TOP")} />{this.getPositonalIcon("TOP")}
                                    </label>
                                    <label className="btn btn-dark">
                                        <input type="radio" name="options" id="option2" onClick={this.filterData.bind(this, "JUNGLE")} />{this.getPositonalIcon("JUNGLE")}
                                    </label>
                                    <label className="btn btn-dark">
                                        <input type="radio" name="options" id="option3" onClick={this.filterData.bind(this, "MIDDLE")} />{this.getPositonalIcon("MIDDLE")}
                                    </label>
                                    <label className="btn btn-dark">
                                        <input type="radio" name="options" id="option4" onClick={this.filterData.bind(this, "BOTTOM")} />{this.getPositonalIcon("BOTTOM")}
                                    </label>
                                    <label className="btn btn-dark">
                                        <input type="radio" name="options" id="option5" onClick={this.filterData.bind(this, "SUPPORT")} />{this.getPositonalIcon("SUPPORT")}
                                    </label>
                                    <label className="btn btn-dark">
                                        <input type="radio" name="options" id="option5" onClick={this.filterData.bind(this, null)} />All
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Basic Stats */}
                <div className="row">
                    <div className="col">
                        <div className="risen-stats-block">
                            <div className="risen-stats-header">Basic Stats</div>
                            <div className="risen-stats-body">
                                <div className="row">
                                    <div className="col-sm">
                                    <div className="center">{this.state.accumulatedStats["wr"]}%</div>
                                        <div className="center risen-sub-label">Winrate</div>
                                    </div>
                                    <div className="col-sm">
                                        <div className="center">{this.state.accumulatedStats["kda"]}</div>
                                        <div className="center risen-sub-label">KDA</div>
                                    </div>
                                    <div className="col-sm">
                                        <div className="center">{this.state.accumulatedStats["cs"]}</div>
                                        <div className="center risen-sub-label">CS/Min</div>
                                    </div>
                                    <div className="col-sm">
                                        <div className="center">{this.state.accumulatedStats["games"]}</div>
                                        <div className="center risen-sub-label">Games</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="risen-stats-block">
                            <div className="risen-stats-header">Game Stats</div>
                            <div className="risen-stats-body">
                                <table className="table risen-table">
                                    <thead>
                                        <tr>
                                            <th>Champion</th>
                                            <th>Win</th>
                                            <th>Kills</th>
                                            <th>Deaths</th>
                                            <th>Assists</th>
                                            <th>Dmg/Gold</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.filteredData.map((datum) => {
                                                return (
                                                    <tr>
                                                        <td>{datum["championId"]}</td>
                                                        <td>{datum["win"] ? "WIN" : "LOSS"}</td>
                                                        <td>{datum["kills"]}</td>
                                                        <td>{datum["deaths"]}</td>
                                                        <td>{datum["assists"]}</td>
                                                        <td>{customRound(datum["damagePerGold"])}</td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="risen-stats-block">
                            <div className="risen-stats-header">Best Champs</div>
                            <div className="risen-stats-body">a</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
