import React, { Component } from 'react';
import topLaneIcon from '../images/roles/Position_Gold-Top.png';
import jngLaneIcon from '../images/roles/Position_Gold-Jungle.png';
import midLaneIcon from '../images/roles/Position_Gold-Mid.png';
import botLaneIcon from '../images/roles/Position_Gold-Bot.png';
import supLaneIcon from '../images/roles/Position_Gold-Support.png';
import { Link } from 'react-router-dom'
import { customRound } from '../Helpers';


export default class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statData: []
        }
        this.getData();
    }

    getData(lane = null) {
        let url = "http://localhost:5000/stats/brief"
        if(lane) {
            url += '/lane/' + lane
        }
        console.log(lane);
        fetch(url).then((data) => {
            // console.log(data.json());
            data.json().then(data => {
                console.log(data[0]._id.player[0])
                data = this.sortData(data, "lane", "DESC");
                console.log(data[0]._id.player[0]);
                this.setState({
                    statData: data
                });
            });
        })
    }

    sortData(data, attr, direction) {
        return data.sort((a, b) => {
            let res = 0;
            // Handle special cases where either the stats are a string or 
            //   can't be accessed by a simple attr accessor
            if (attr === "wr") {
                res = a.wins/a.total_games - b.wins/b.total_games;
            }
            else if (attr === "lane" ) {
                res = a._id.lane.localeCompare(b._id.lane);
            }
            else if (attr === "name" ) {
                console.log("a" - "b");
                res = a._id.player[0].localeCompare(b._id.player[0]);
            }
            else {
                res = a[attr] - b[attr];
            }
            return direction === "ASC" ? res : res * -1;
        })
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
                <div className="btn-group risen-radio" data-toggle="buttons">
                    <label className="btn btn-dark">
                        <input type="radio" name="options" id="option1" onClick={this.getData.bind(this, "TOP")} />{this.getPositonalIcon("TOP")}
                    </label>
                    <label className="btn btn-dark">
                        <input type="radio" name="options" id="option2" onClick={this.getData.bind(this, "JUNGLE")} />{this.getPositonalIcon("JUNGLE")}
                    </label>
                    <label className="btn btn-dark">
                        <input type="radio" name="options" id="option3" onClick={this.getData.bind(this, "MIDDLE")} />{this.getPositonalIcon("MIDDLE")}
                    </label>
                    <label className="btn btn-dark">
                        <input type="radio" name="options" id="option4" onClick={this.getData.bind(this, "BOTTOM")} />{this.getPositonalIcon("BOTTOM")}
                    </label>
                    <label className="btn btn-dark">
                        <input type="radio" name="options" id="option5" onClick={this.getData.bind(this, "SUPPORT")} />{this.getPositonalIcon("SUPPORT")}
                    </label>
                    <label className="btn btn-dark">
                        <input type="radio" name="options" id="option5" onClick={this.getData.bind(this, null)} />All
                    </label>
                </div>
                <table className="table risen-table">
                    <thead>
                        <tr>
                        <th scope="col" className="center">Rank</th>
                        <th scope="col">Summoner</th>
                        <th scope="col" className="center">Lane</th>
                        <th scope="col" className="center">Win Rate</th>
                        <th scope="col" className="center">Kills</th>
                        <th scope="col" className="center">Deaths</th>
                        <th scope="col" className="center">Assists</th>
                        <th scope="col" className="center">Gold</th>
                        <th scope="col" className="center">CS</th>
                        <th scope="col" className="center">Damage</th>
                        <th scope="col" className="center">Games</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.statData.map((item, index) => {
                                return (
                                    <tr>
                                        <td scope="row" className="risen-datum center">{index + 1}</td>
                                        <td className="clickable" name="nameCol"><Link to={`/detailed/${item._id.player[0]}`} >{item._id.player[0]}</Link></td>
                                        <td className="center" name="laneCol">{item._id.lane}</td>
                                        <td className="center" name="winCol">{customRound((item.wins * 100)/item.total_games)}%</td>
                                        <td className="center" name="killsCol">{customRound(item.avg_kills)}</td>
                                        <td className="center" name="deathsCol">{customRound(item.avg_deaths)}</td>
                                        <td className="center" name="assistsCol">{customRound(item.avg_assists)}</td>
                                        <td className="center" name="goldCol">{customRound(item.avg_gold)}</td>
                                        <td className="center" name="csCol">{customRound(item.avg_cs)}</td>
                                        <td className="center" name="dmgCol">{customRound(item.avg_damage)}</td>
                                        <td className="center" name="gamesCol">{customRound(item.total_games)}</td>
                                    </tr>
                                )
                            })
                        }
                        
                    </tbody>
                </table>
            </div>
        )
    }
}