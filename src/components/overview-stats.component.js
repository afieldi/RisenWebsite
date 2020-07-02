import React, { Component } from 'react';

export default class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statData: []
        }
        this.getData();
    }

    getData() {
        fetch("http://localhost:5000/stats/brief").then((data) => {
            // console.log(data.json());
            data.json().then(data => {
                this.setState({
                    statData: data
                })
                console.log(this.data);
            });
        })
    }

    round(doubleN) {
        return Math.round(doubleN * 100) / 100;
    }
    render() {
        return (
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Summoner</th>
                    <th scope="col">Lane</th>
                    <th scope="col">Kills</th>
                    <th scope="col">Deaths</th>
                    <th scope="col">Assists</th>
                    <th scope="col">Gold</th>
                    <th scope="col">CS</th>
                    <th scope="col">Damage</th>
                    <th scope="col">Games</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.statData.map((item, index) => {
                            return (
                                <tr>
                                    <th scope="row">{index}</th>
                                    <td>{item._id.player[0]}</td>
                                    <td>{item._id.lane}</td>
                                    <td>{this.round(item.avg_kills)}</td>
                                    <td>{this.round(item.avg_deaths)}</td>
                                    <td>{this.round(item.avg_assists)}</td>
                                    <td>{this.round(item.avg_gold)}</td>
                                    <td>{this.round(item.avg_cs)}</td>
                                    <td>{this.round(item.avg_damage)}</td>
                                    <td>{this.round(item.total_games)}</td>
                                </tr>
                            )
                        })
                    }
                    
                </tbody>
            </table>
        )
    }
}