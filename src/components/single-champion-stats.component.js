import React, { Component } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import qs from 'qs';
import { customRound, urlOnChange } from '../Helpers';

let champMap = require('../data/champions_map.json')

export default class SingleChampionStats extends Component {
  constructor(props) {
    super(props);
    this.champ = this.props.match.params.champId;
    this.state = {
      seasons: [],
      champStats: {}
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

  performFilter() {

  }

  getData() {
    const url = process.env.REACT_APP_BASE_URL + "/stats/champ/" + this.champ;
    fetch(url).then(data => {
      data.json().then(data => {
        console.log(data)
        if (data[0]) {
          this.setState({
            champStats: data[0]
          });
        }
      })
    })
  }

  getWr() {
    return customRound((this.state.champStats["total_wins"]/this.state.champStats["total_games"])*100,2);
  }

  getKDA() {
    console.log(this.state.champStats);
    return `${customRound(this.state.champStats["avg_kills"], 1)}/${customRound(this.state.champStats["avg_deaths"], 1)}/${customRound(this.state.champStats["avg_assists"], 1)}`;
  }

  getCspm() {
    return 10
  }

  render() {
    return (
      <section>
        <div className="dark-section text-light">
          <Container>
            <div>
            <h1>
              <img id="champ-img"
                src={require(`../images/champions/icons/` + champMap[this.champ] + `_0.png`)}
                style={{height: 'auto', width: '60px', paddingRight: '10px'}}></img>
              {champMap[this.champ]}</h1>
              <hr style={{backgroundColor: 'white'}}></hr>
            </div>
            <div className="row">
              <div className="col">
                <div className="risen-stats-block">
                  <div className="risen-stats-header">
                    <h3>Filters</h3>
                  </div>
                  <div className="risen-stats-body">
                    <div className="row">
                      <div className="col-md">
                        <Form.Group controlId="roleFilter">
                          <Form.Label>Role</Form.Label>
                          <Form.Control as="select" defaultValue="ANY" onChange={urlOnChange.bind(this)}>
                            <option value="ANY">Any</option>
                            <option value="TOP">Top</option>
                            <option value="JUNGLE">Jungle</option>
                            <option value="MIDDLE">Mid</option>
                            <option value="BOTTOM">Bot</option>
                            <option value="SUPPORT">Support</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
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
                      <div className="col-md">
                        <Button className="btn filter-button" onClick={this.performFilter.bind(this)}>Filter</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">   
              <div className="col">
                <div className="risen-stats-block">
                  <div className="risen-stats-header"><h3>General Stats</h3></div>
                    {/* <hr></hr> */}
                    <div className="risen-stats-body">
                      <div className="row">
                        <div className="col-sm">
                          <div className="center">{this.getWr()}%</div>
                          <div className="center risen-sub-label">Winrate</div>
                        </div>
                        <div className="col-sm">
                          <div className="center">{this.getKDA()}</div>
                          <div className="center risen-sub-label">KDA</div>
                        </div>
                        <div className="col-sm">
                          <div className="center">{this.getCspm()}</div>
                          <div className="center risen-sub-label">CS/Min</div>
                        </div>
                        <div className="col-sm">
                          <div className="center">{this.state.champStats["total_games"]}</div>
                          <div className="center risen-sub-label">Games</div>
                        </div>
                      </div>
                    </div>
                  </div>

              </div>
            </div>
          </Container>
        </div>
      </section>
    )
  }
}