import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { urlOnChange, customRound } from '../Helpers';
import topLaneIcon from '../images/roles/Position_Gold-Top.png';
import jngLaneIcon from '../images/roles/Position_Gold-Jungle.png';
import midLaneIcon from '../images/roles/Position_Gold-Mid.png';
import botLaneIcon from '../images/roles/Position_Gold-Bot.png';
import supLaneIcon from '../images/roles/Position_Gold-Support.png';

let champMap = require('../data/champions_map.json')
let champData = require('../data/champions.json').data;

export default class AllChampions extends Component {
  constructor(props) {
    super(props);
    this.sort = 'name+';
    this.filters = {
      lane: 'ANY',
      name: ''
    }
    this.state = {
      statData: [],
      filteredData: [],
      seasons: []
    }
  }

  componentDidMount() {
    this.loadSeasons(() => {
      this.getData();
    });
  }

  loadSeasons(callback=(()=>{})) {
    const url = process.env.REACT_APP_BASE_URL + "/seasons";
    fetch(url).then(data => {
      data.json().then(data => {
        this.setState({
          seasons: data
        });
        callback();
      })
    })
  }

  getChampName(id) {
    return champData[champMap[id]].name;
  }

  getPositionalIcon(position) {
    switch (position) {
        case "TOP":
            return (<img className="risen-icon" src={topLaneIcon} alt="Top Lane"></img>)
        case "JUNGLE":
            return (<img className="risen-icon" src={jngLaneIcon} alt="Jungle"></img>)
        case "MIDDLE":
            return (<img className="risen-icon" src={midLaneIcon} alt="Mid Lane"></img>)
        case "BOTTOM":
            return (<img className="risen-icon" src={botLaneIcon} alt="Bot Lane"></img>)
        case "SUPPORT":
            return (<img className="risen-icon" src={supLaneIcon} alt="Utility"></img>)
        default:
            return (<img className="risen-icon" src={midLaneIcon} alt="Role"></img>)
            break;
    }
  }

  submitSearch() {

  }

  filterData() {

  }

  getData(page = 1, load=true, append=false) {
    if (this.loadingData) {
        return;
    }
    this.loadingData = true;
    this.lastLoadedPage = page;
    let url = process.env.REACT_APP_BASE_URL + '/stats/champs/byrole';

    // Ok, funny bug time. I the size orignally at 20, however, I one day got a bigger monitor. My monitor was taller than the loaded page
    //  meaning that I couldn't scroll, and hence, couldn't load more images. So I've learned my lesson, and upped page size to 25.
    url += `?page=${page}&size=${25}`;
    if(this.filters.lane) {
        url += '&lane=' + this.filters.lane;
    }
    if (this.filters.name) {
        url += "&player=" + this.filters.name;
    }

    if (document.getElementById("seasonFilter").value !== "ANY") {
        url += "&season=" + document.getElementById("seasonFilter").value;
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

  render() {
    return (
      <section>
        <div className="dark-section text-light">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="risen-stats-block">
                  <div className="risen-stats-header">
                    <h3>
                        <a data-toggle="collapse" href="#filterCollapse" role="button" aria-expanded="false" aria-controls="filterCollapse" style={{color: 'white'}}>
                            Filters (click to expand)
                        </a>
                    </h3>
                  </div>
                  <div className="risen-stats-body collapse" id="filterCollapse">
                    <div className="row">
                      <div className="col-md">
                          <Form.Group controlId="seasonFilter" onChange={urlOnChange.bind(this)}>
                          <Form.Label>Season</Form.Label>
                          <Form.Control as="select">
                          <option value="ANY">Any</option>
                          {
                              this.state.seasons.map(s => {
                              return (
                                  <option value={s._id}>{s.seasonName}</option>
                              )
                              })
                          }
                          </Form.Control>
                          </Form.Group>
                      </div>
                      <div className="col-md-4">
                          <Button className="btn filter-button" onClick={this.getData.bind(this)}>Filter</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                <th scope="col" className="center">Rank</th>
                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "_id.lane")}>Lane</th>
                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "_id.sortablePlayer")}>Champion</th>
                <th scope="col" className="center clickable">Win Rate</th>
                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "avg_kills")}>Kills</th>
                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "avg_deaths")}>Deaths</th>
                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "avg_assists")}>Assists</th>
                {/* <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "avg_goldEarned")}>Gold</th> */}
                {/*<th scope="col" className="center clickable">CS</th>*/}
                {/* <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "avg_totalDamageDealtToChampions")}>Damage</th> */}
                <th scope="col" className="center clickable" onClick={this.sortData.bind(this, "total_games")}>Games</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.filteredData.map((item, index) => {
                  return (
                    <tr key={"overviewStats-" + index}>
                      <td scope="row" className="risen-datum center" style={{verticalAlign: 'middle'}}>{index + 1}</td>
                      <td className="center" name="laneCol" style={{verticalAlign: 'middle'}}>
                        <div style={{width: '28px', height: '28px', margin: 'auto'}}>{this.getPositionalIcon(item._id.role)}</div>
                      </td>
                      <td className="clickable" name="nameCol">
                        <Link to={`/championstats/${item._id.championId}`} style={whiteText}>
                          <img key={"img" + index} id={"img-" + index}
                            src={require(`../images/champions/icons/` + champMap[item._id.championId] + `_0.png`)}
                            style={{height: 'auto', width: '40px', paddingRight: '10px'}}></img>
                          {this.getChampName(item._id.championId)}
                        </Link>
                      </td>
                      <td className="center" name="winCol" style={{verticalAlign: 'middle'}}>{customRound((item.total_wins * 100)/item.total_games)}%</td>
                      <td className="center" name="killsCol" style={{verticalAlign: 'middle'}}>{customRound(item.avg_kills)}</td>
                      <td className="center" name="deathsCol" style={{verticalAlign: 'middle'}}>{customRound(item.avg_deaths)}</td>
                      <td className="center" name="assistsCol" style={{verticalAlign: 'middle'}}>{customRound(item.avg_assists)}</td>
                      {/* <td className="center" name="goldCol">{customRound(item.avg_goldEarned)}</td> */}
                      {/*<td className="center" name="csCol">{customRound(item.avg_totalMinionsKilled)}</td>*/}
                      {/* <td className="center" name="dmgCol">{customRound(item.avg_totalDamageDealtToChampions)}</td> */}
                      <td className="center" name="gamesCol" style={{verticalAlign: 'middle'}}>{customRound(item.total_games)}</td>
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