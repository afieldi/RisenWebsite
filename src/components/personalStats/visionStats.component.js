import React, { Component } from 'react';
import { Container, Form } from 'react-bootstrap';
import { customRound, matchDict } from '../../Helpers';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip, Legend, ReferenceLine, ResponsiveContainer} from 'recharts';

export default class VisionStats extends Component {
  constructor(props) {
    super(props);
    this.playerName = this.props.player;
    this.statData = [];
    this.filteredData = [];
    this.accStats = {};
    this.avgData = {};
  }

  aggregateGeneralStats() {
    let type = document.getElementById("generalType");
    if (type == null) {
      return;
    }
    type = type.value;
    const totals = {
      "Vision Score": 0,
      "Wards Killed": 0,
      "VS/Min": 0,
      "Pinks Bought": 0,
      "Wards Placed@15": 0,
      "Wards Killed@15": 0,
    }
    this.filteredData.map(game => {
      totals["Wards Placed@15"] += game.wardsPlaced15;
      totals["Wards Killed@15"] += game.wardsKilled15;
      totals["Vision Score"] += game.visionScore;
      totals["Wards Killed"] += game.wardsKilled ? game.wardsKilled : 0;
      totals["VS/Min"] += customRound(game.visionScore / (game.gameDuration / 60), 1);
      totals["Pinks Bought"] += game.visionWardsBoughtInGame;
    });
    for (const key of Object.keys(totals)) {
      totals[key] = customRound(totals[key] / this.filteredData.length);
    }

    return totals;
  }

  getGeneralData() {
    let barElements = [
        () => {
          let v1 = customRound(this.accStats['avg_wardsPlaced15'], 2);
          let v2 = customRound(this.avgData['avg_wardsPlaced15'], 2);
            v1 = v1 ? v1 : 0;
            v2 = v2 ? v2 : 0;
            let vm = Math.max(v1, v2);
            return {
              name: `Wards Placed@15`,
              player: (v1*.9/vm),
              risen: v2*.9/vm,
              playerAct: v1,
              risenAct: v2
            }
        },
        () => {
            let v1 = customRound(this.accStats['avg_wardsKilled15'], 2);
            let v2 = customRound(this.avgData['avg_wardsKilled15'], 2);
            v1 = v1 ? v1 : 0;
            v2 = v2 ? v2 : 0;
            let vm = Math.max(v1, v2);
            return {
              name: `Wards Killed@15`,
              player: (v1*.9/vm),
              risen: v2*.9/vm,
              playerAct: v1,
              risenAct: v2
            }
        },
        () => {
            let v1 = customRound(this.accStats['avg_wardsPlaced']*60/this.accStats['avg_gameDuration'], 2);
            let v2 = customRound(this.avgData['avg_wardsPlaced']*60/this.avgData['avg_gameDuration'], 2);
            v1 = v1 ? v1 : 0;
            v2 = v2 ? v2 : 0;
            let vm = Math.max(v1, v2);
            return {
              name: `Wards Placed/Min`,
              player: (v1/vm),
              risen: v2/vm,
              playerAct: v1,
              risenAct: v2
            }
        },
        () => {
          let v1 = customRound(this.accStats['avg_wardsKilled']*60/this.accStats['avg_gameDuration'], 2);
          let v2 = customRound(this.avgData['avg_wardsKilled']*60/this.avgData['avg_gameDuration'], 2);
          v1 = v1 ? v1 : 0;
          v2 = v2 ? v2 : 0;
          let vm = Math.max(v1, v2);
          return {
            name: `Wards Killed/min`,
            player: (v1/vm),
            risen: v2/vm,
            playerAct: v1,
            risenAct: v2
          }
        },
        () => {
          let v1 = customRound(this.accStats['avg_visionWardsBoughtInGame'], 2);
          let v2 = customRound(this.avgData['avg_visionWardsBoughtInGame'], 2);
            v1 = v1 ? v1 : 0;
            v2 = v2 ? v2 : 0;
            let vm = Math.max(v1, v2);
            return {
              name: `Pinks Bought`,
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

  shouldComponentUpdate(newProps, newState) {
    if (this.filteredData === newProps.playerData &&
        JSON.stringify(this.state) === JSON.stringify(newState)) {
        return false;
    }
    this.filteredData = newProps.playerData;
    this.accStats = newProps.accStats;
    this.avgData = newProps.avgData;
    return true;
  }

  formatLabels(value, name, props) {
    return props.payload[props.dataKey + 'Act'];
  }

  render() {
    return (
      <section>
        <Container>
          <div className="row">
            <div className="col-md">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={this.getGeneralData()}
                    // layout="vertical"
                    // barGap='-30'
                    // barSize={30}
                    margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid vertical horizontal={false} strokeDasharray="1 1" />
                    <XAxis type="category" dataKey="name" tick={{ fill: 'white' }}/>
                    <YAxis type="number" />
                    <Tooltip labelStyle={{color: 'black'}} formatter={this.formatLabels} />
                    {/* <ReferenceLine y={0} stroke="#000" /> */}
                    <Bar name={this.playerName} dataKey="player" fill="#8884d8" />
                    <Bar name="Risen" dataKey="risen" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Container>
      </section>
    )
  }
}