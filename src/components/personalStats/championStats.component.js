import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { customRound, matchDict } from '../../Helpers';
import { Sankey, Tooltip, Rectangle, ResponsiveContainer } from 'recharts';

let champMap = require('../../data/champions_map.json');
let champions = require('../../data/champions.json')["data"];


export default class ChampionStats extends Component {
  constructor(props) {
    super(props);
    this.filteredData = [];
    this.accStats = {};
    this.avgData = {};
    this.state = {

    }
  }

  shouldComponentUpdate(newProps, newState) {
    if (this.filteredData === newProps.playerData &&
        JSON.stringify(this.state) === JSON.stringify(newState)) {
        return false;
    }
    this.filteredData = newProps.playerData;
    this.accStats = newProps.accStats;
    this.generateSankey();
    return true;
  }

  generateSankey() {
    let map = {
        role: {},
        champ: {}
    };
    let data = {
      nodes: [
          {name: "Played", count: this.filteredData.length}
      ],
      links: []
    }

    for (let d of this.filteredData) {
        let champ = champions[champMap[d.championId]];
        let role = champ.tags;
        role = role[0] === "Support" ? role[1] : role[0];
        if (!map.role[role]) {
          map.role[role] = {index: data.nodes.length, count: 0};
          data.nodes.push({name: role, count: 0});
        }
        data.nodes[map.role[role].index].count += 1;
        map.role[role].count += 1;

        let name = champ.name;
        if (!map.champ[name]) {
          map.champ[name] = {index: data.nodes.length, count: 0, role: role};
          data.nodes.push({name: name, count: 0});
        }
        data.nodes[map.champ[name].index].count += 1;
        map.champ[name].count += 1;

      //   data.links.push(role);
    }
    for (let r of Object.values(map.role)) {
      data.links.push({
          source: 0,
          target: r.index,
          value: r.count
      })
    }
    for (let r of Object.values(map.champ)) {
      data.links.push({
          source: map.role[r.role].index,
          target: r.index,
          value: r.count
      })
    }
    return data;
  }

  generateTableData() {
    let data = {};
    for (let game of this.filteredData) {
      let champ = champions[champMap[game.championId]].name;
      if (!data[champ]) {
        data[champ] = {
          games: 0,
          kills: 0,
          assists: 0,
          deaths: 0,
          cs: 0,
          winrate: 0
        }
      }
      data[champ].games += 1;
      data[champ].kills += game.kills;
      data[champ].assists += game.assists;
      data[champ].deaths += game.deaths;
      data[champ].cs += game.totalMinionsKilled + game.neutralMinionsKilled;
      if (game.win) {data[champ].winrate += 100}
    }
    
    for (let c in data) {
      for (let k in data[c]) {
        if(k === "games")
          continue;
        data[c][k] = customRound(data[c][k]/data[c].games, 2)
      }
    }
    return data;
  }

  genNode(a) {
      return (
        <svg x={a.x} y={a.y} width={a.width + 130} height={a.height + 10}>
            <rect width={a.width} height={a.height} style={{fill:"#7688e2",strokeWidth:'0',stroke:"rgb(0,0,0)"}} />
            <text x={a.width + 10} y={a.height/2 + 5} fill="white">{a.payload.name} ({a.payload.count})</text>
        </svg>
      )
  }

  render() {
    return (
      <section>
        <Container>
          <div className="row">
            <div className="col-md">
              <div className="risen-stats-block">
                  <div className="risen-stats-header">
                      <h3>Player Champions</h3>
                  </div>
                  <div className="risen-stats-body">
                      <div style={{width: '120%', position: 'relative', left: '-15%'}}>
                          <ResponsiveContainer width="100%" height={500}>
                              <Sankey
                                  labelKey="name"
                                  data={this.generateSankey()}
                                  // node={<SankeyNode />}
                                  node={this.genNode}
                                  nodePading={50}
                                  margin={{
                                  left: 200,
                                      right: 200,
                                      top: 100,
                                      bottom: 100,
                                  }}
                                  link={{ stroke: '#77c878' }}
                                  >
                                  <Tooltip />
                              </Sankey>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md">
              <div className="risen-stats-block">
                  <div className="risen-stats-header">
                      <h3>Champion Table</h3>
                  </div>
                  <div className="risen-stats-body">
                    <table className="table risen-table">
                      <thead>
                        <tr className="center">
                          <td>Champion</td>
                          <td>Kills</td>
                          <td>Deaths</td>
                          <td>Assists</td>
                          <td>CS</td>
                          <td>WR</td>
                          <td>Games</td>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          Object.entries(this.generateTableData()).map(([champ, value]) => {
                            return (
                              <tr key={champ} className="center">
                                <td>{champ}</td>
                                <td>{value.kills}</td>
                                <td>{value.deaths}</td>
                                <td>{value.assists}</td>
                                <td>{value.cs}</td>
                                <td>{value.winrate}%</td>
                                <td>{value.games}</td>
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
        </Container>
      </section>
    )
  }
}