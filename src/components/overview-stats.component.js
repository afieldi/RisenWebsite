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
        this.filters = {
            "lane": "",
            "name": ""
        }
        this.lastLoadedPage = 0;
        this.loadingData = false;
        this.state = {
            statData: [],
            filteredData: []
        }
        this.getData();
    }

    getData(lane = null, player = null, page = 1, load=true, append=false) {
        if (this.loadingData) {
            return;
        }
        this.loadingData = true;
        this.lastLoadedPage = page;
        let url = process.env.REACT_APP_BASE_URL + `/stats/brief`;
        url += `?page=${page}&size=${20}`;
        if(lane) {
            url += '&lane=' + lane;
        }
        if (player) {
            url += "&player=" + player;
        }
        fetch(url).then((data) => {
            this.loadingData = false;
            data.json().then(data => {
                console.log(data);
                data = this.sortData(data, "lane", "DESC");

                if (append) {
                    this.state.statData = this.state.statData.concat(data)
                }
                else {
                    this.state.statData = data;
                }
                this.state.filteredData = JSON.parse(JSON.stringify(this.state.statData));
                if(load) {
                    this.setState({});
                }
            });
        })
    }

    submitSearch(event) {
        event.preventDefault();
        this.filterData();
    }

    filterLane() {
        if(this.filters.lane) {
            this.state.filteredData = this.state.filteredData.filter(item => item._id.lane === this.filters.lane)
        }
        else {
            this.state.filteredData = this.state.filteredData;
        }
    }

    filterName() {
        let name = document.getElementById("nameFilter").value;
        this.state.filteredData = this.state.filteredData.filter(item => item._id.player[0].startsWith(name));
    }

    filterData() {
        // We can set it here without using the setState function because we want this:
        //  1. To be sync
        //  2. Not to reload the page. That will be done later
        const name = document.getElementById("nameFilter").value ? document.getElementById("nameFilter").value : null;
        this.getData(this.filters.lane, name, 1, true, false);

        // Reload state as the above functions change it
        // this.setState({});
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
                res = a._id.player[0].localeCompare(b._id.player[0]);
            }
            else {
                res = a[attr] - b[attr];
            }
            return direction === "ASC" ? res : res * -1;
        })
    }

    getPositionalIcon(position) {
        switch (position) {
            case "TOP":
                return (<img src={topLaneIcon} alt="Top Lane"></img>)
            case "JUNGLE":
                return (<img src={jngLaneIcon} alt="Jungle"></img>)
            case "MIDDLE":
                return (<img src={midLaneIcon} alt="Mid Lane"></img>)
            case "BOTTOM":
                return (<img src={botLaneIcon} alt="Bot Lane"></img>)
            case "SUPPORT":
                return (<img src={supLaneIcon} alt="Utility"></img>)
            default:
                return (<img src={midLaneIcon} alt="Role"></img>)
                break;
        }
    }

    componentDidMount() {
        document.addEventListener("scroll", () => {
            let max = document.documentElement.scrollHeight || document.body.scrollHeight;
            max -= document.documentElement.clientHeight || document.body.clientHeight;
            const scroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (scroll / max > .9) {
                // console.log(this.lastLoadedPage);
                this.getData(null, null, this.lastLoadedPage + 1, true, true);
            }
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="btn-group risen-radio" style={{width: '90%'}} data-toggle="buttons">
                            {/* TODO: Change these onClick functions */}
                            <label className="btn btn-light" style={spaceButtons}>
                                <input type="radio" name="options" id="role1" onClick={(() => {this.filters.lane = "TOP"; this.filterData()}).bind(this)} />{this.getPositionalIcon("TOP")}
                            </label>
                            <label className="btn btn-light" style={spaceButtons}>
                                <input type="radio" name="options" id="role2" onClick={(() => {this.filters.lane = "JUNGLE"; this.filterData()}).bind(this)} />{this.getPositionalIcon("JUNGLE")}
                            </label>
                            <label className="btn btn-light" style={spaceButtons}>
                                <input type="radio" name="options" id="role3" onClick={(() => {this.filters.lane = "MIDDLE"; this.filterData()}).bind(this)} />{this.getPositionalIcon("MIDDLE")}
                            </label>
                            <label className="btn btn-light" style={spaceButtons}>
                                <input type="radio" name="options" id="role4" onClick={(() => {this.filters.lane = "BOTTOM"; this.filterData()}).bind(this)} />{this.getPositionalIcon("BOTTOM")}
                            </label>
                            <label className="btn btn-light" style={spaceButtons}>
                                <input type="radio" name="options" id="role5" onClick={(() => {this.filters.lane = "SUPPORT"; this.filterData()}).bind(this)} />{this.getPositionalIcon("SUPPORT")}
                            </label>
                            <label className="btn btn-light" style={spaceButtons}>
                                <input type="radio" name="options" id="role6" onClick={(() => {this.filters.lane = null; this.filterData()}).bind(this)} />All
                            </label>
                        </div>
                    </div>
                    <div className="col-lg">
                        <form onSubmit={this.submitSearch.bind(this)}>
                            <div class="input-group mb-3 bg-light">
                                <input type="text" class="form-control"
                                        placeholder="Summoner Name" aria-label="Summoner Name"
                                        aria-describedby="button-addon2" id="nameFilter" ></input>
                                <div class="input-group-append text-dark">
                                    <button class="btn btn-outline-secondary" type="submit" id="button-addon2">Search</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <table className="table table-responsive-lg risen-table sticky-top table-light table-striped">
                    <thead>
                        <tr>
                        {/* <th scope="col" className="center">Rank</th> */}
                        <th scope="col">Summoner Name</th>
                        <th scope="col" className="center">Lane</th>
                        <th scope="col" className="center">Win Rate</th>
                        <th scope="col" className="center">Kills</th>
                        <th scope="col" className="center">Deaths</th>
                        <th scope="col" className="center">Assists</th>
                        {/*<th scope="col" className="center">Gold</th>*/}
                        {/*<th scope="col" className="center">CS</th>*/}
                        {/*<th scope="col" className="center">Damage</th>*/}
                        <th scope="col" className="center">Games</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.filteredData.map((item, index) => {
                                return (
                                    <tr key={"overviewStats-" + index}>
                                        {/* <td scope="row" className="risen-datum center">{index + 1}</td> */}
                                        <td className="clickable" name="nameCol"><Link to={`/detailed/${item._id.player[0]}`} >{item._id.player[0]}</Link></td>
                                        <td className="center" name="laneCol">{item._id.lane}</td>
                                        <td className="center" name="winCol">{customRound((item.wins * 100)/item.total_games)}%</td>
                                        <td className="center" name="killsCol">{customRound(item.avg_kills)}</td>
                                        <td className="center" name="deathsCol">{customRound(item.avg_deaths)}</td>
                                        <td className="center" name="assistsCol">{customRound(item.avg_assists)}</td>
                                        {/*<td className="center" name="goldCol">{customRound(item.avg_gold)}</td>*/}
                                        {/*<td className="center" name="csCol">{customRound(item.avg_cs)}</td>*/}
                                        {/*<td className="center" name="dmgCol">{customRound(item.avg_damage)}</td>*/}
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

const spaceButtons = {
    width: '20%'
}
