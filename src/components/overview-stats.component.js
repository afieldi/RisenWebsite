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
        };
        this.sort = "_id.sortablePlayer+"
        this.lastLoadedPage = 0;
        this.loadingData = false;
        this.state = {
            statData: [],
            filteredData: []
        }
    }

    getData(page = 1, load=true, append=false) {
        if (this.loadingData) {
            return;
        }
        this.loadingData = true;
        this.lastLoadedPage = page;
        let url = process.env.REACT_APP_BASE_URL + `/stats/brief`;

        // Ok, funny bug time. I the size orignally at 20, however, I one day got a bigger monitor. My monitor was taller than the loaded page
        //  meaning that I couldn't scroll, and hence, couldn't load more images. So I've learned my lesson, and upped page size to 25.
        url += `?page=${page}&size=${25}`;
        if(this.filters.lane) {
            url += '&lane=' + this.filters.lane;
        }
        if (this.filters.name) {
            url += "&player=" + this.filters.name;
        }
        url += "&sort=" + this.sort;
        // url += "&sort=_id.sortablePlayer-"
        fetch(url).then((data) => {
            this.loadingData = false;
            data.json().then(data => {
                // data = this.sortData(data, "lane", "DESC");

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
        this.state.filteredData = this.state.filteredData.filter(item => item._id.player.startsWith(name));
    }

    filterData() {
        // We can set it here without using the setState function because we want this:
        //  1. To be sync
        //  2. Not to reload the page. That will be done later
        const name = document.getElementById("nameFilter").value ? document.getElementById("nameFilter").value : null;
        this.filters.name = name;
        this.getData(1, true, false);

        // Reload state as the above functions change it
        // this.setState({});
    }

    sortData(sortCol) {
        if(this.sort.startsWith(sortCol)) {
            if(this.sort.endsWith("+")) {
                this.sort = sortCol + "-";
            }
            else {
                this.sort = sortCol + "+";
            }
        }
        else {
            this.sort = sortCol + "-";
        }
        this.getData();
    }

    // sortData(data, attr, direction) {
    //     return data.sort((a, b) => {
    //         let res = 0;
    //         // Handle special cases where either the stats are a string or
    //         //   can't be accessed by a simple attr accessor
    //         if (attr === "wr") {
    //             res = a.wins/a.total_games - b.wins/b.total_games;
    //         }
    //         else if (attr === "lane" ) {
    //             res = a._id.lane.localeCompare(b._id.lane);
    //         }
    //         else if (attr === "name" ) {
    //             res = a._id.player.localeCompare(b._id.player);
    //         }
    //         else {
    //             res = a[attr] - b[attr];
    //         }
    //         return direction === "ASC" ? res : res * -1;
    //     })
    // }

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
        this.getData();
        document.addEventListener("scroll", this.scrollFunction.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this.scrollFunction.bind(this));
    }

    scrollFunction() {
        let max = document.documentElement.scrollHeight || document.body.scrollHeight;
        max -= document.documentElement.clientHeight || document.body.clientHeight;
        const scroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (scroll / max > .9) {
            this.getData(this.lastLoadedPage + 1, true, true);
        }
    }

    render() {
        return (
            <section>
                <div className="dark-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="btn-group risen-radio" style={{width: '90%'}} data-toggle="buttons">
                                    {/* TODO: Change these onClick functions */}
                                    <label className="btn btn-dark white-hover" style={spaceButtons}>
                                        <input type="radio" name="options" id="role1" onClick={(() => {this.filters.lane = "TOP"; this.filterData()}).bind(this)} />{this.getPositionalIcon("TOP")}
                                    </label>
                                    <label className="btn btn-dark white-hover" style={spaceButtons}>
                                        <input type="radio" name="options" id="role2" onClick={(() => {this.filters.lane = "JUNGLE"; this.filterData()}).bind(this)} />{this.getPositionalIcon("JUNGLE")}
                                    </label>
                                    <label className="btn btn-dark white-hover" style={spaceButtons}>
                                        <input type="radio" name="options" id="role3" onClick={(() => {this.filters.lane = "MIDDLE"; this.filterData()}).bind(this)} />{this.getPositionalIcon("MIDDLE")}
                                    </label>
                                    <label className="btn btn-dark white-hover" style={spaceButtons}>
                                        <input type="radio" name="options" id="role4" onClick={(() => {this.filters.lane = "BOTTOM"; this.filterData()}).bind(this)} />{this.getPositionalIcon("BOTTOM")}
                                    </label>
                                    <label className="btn btn-dark white-hover" style={spaceButtons}>
                                        <input type="radio" name="options" id="role5" onClick={(() => {this.filters.lane = "SUPPORT"; this.filterData()}).bind(this)} />{this.getPositionalIcon("SUPPORT")}
                                    </label>
                                    <label className="btn btn-dark white-hover" style={spaceButtons}>
                                        <input type="radio" name="options" id="role6" onClick={(() => {this.filters.lane = null; this.filterData()}).bind(this)} />All
                                    </label>
                                </div>
                            </div>
                            <div className="col-lg">
                                <form onSubmit={this.submitSearch.bind(this)}>
                                    <div className="input-group mb-3 text-light">
                                        <input type="text" className="form-control bg-dark text-light"
                                                placeholder="Summoner Name" aria-label="Summoner Name"
                                                aria-describedby="button-addon2" id="nameFilter" ></input>
                                        <div className="input-group-append text-light bg-secondary">
                                            <button className="btn btn-outline-dark text-light" type="submit" id="button-addon2">Search</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <table className="table table-responsive-lg risen-table sticky-top table-striped">
                            <thead>
                                <tr>
                                {/* <th scope="col" className="center">Rank</th> */}
                                <th scope="col" className="clickable" onClick={this.sortData.bind(this, "_id.sortablePlayer")}>Summoner Name</th>
                                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "_id.lane")}>Lane</th>
                                <th scope="col" className="center clickable">Win Rate</th>
                                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "avg_kills")}>Kills</th>
                                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "avg_deaths")}>Deaths</th>
                                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "avg_assists")}>Assists</th>
                                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "avg_goldEarned")}>Gold</th>
                                {/*<th scope="col" className="center clickable">CS</th>*/}
                                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "avg_totalDamageDealtToChampions")}>Damage</th>
                                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "total_games")}>Games</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.filteredData.map((item, index) => {
                                        return (
                                            <tr key={"overviewStats-" + index}>
                                                {/* <td scope="row" className="risen-datum center">{index + 1}</td> */}
                                                <td className="clickable" name="nameCol"><Link to={`/detailed/${item._id.player}`} style={whiteText}>{item._id.player}</Link></td>
                                                <td className="center" name="laneCol">{item._id.lane}</td>
                                                <td className="center" name="winCol">{customRound((item.wins * 100)/item.total_games)}%</td>
                                                <td className="center" name="killsCol">{customRound(item.avg_kills)}</td>
                                                <td className="center" name="deathsCol">{customRound(item.avg_deaths)}</td>
                                                <td className="center" name="assistsCol">{customRound(item.avg_assists)}</td>
                                                <td className="center" name="goldCol">{customRound(item.avg_goldEarned)}</td>
                                                {/*<td className="center" name="csCol">{customRound(item.avg_totalMinionsKilled)}</td>*/}
                                                <td className="center" name="dmgCol">{customRound(item.avg_totalDamageDealtToChampions)}</td>
                                                <td className="center" name="gamesCol">{customRound(item.total_games)}</td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        )
    }
}

const spaceButtons = {
    width: '20%',
    backgroundColor: '#111111'
}

const whiteText = {
    color: '#fff'
}