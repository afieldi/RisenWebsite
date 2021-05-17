import React, { PureComponent } from 'react';
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, CartesianGrid, Customized } from 'recharts';
const champMap = require('../../data/champions_map.json');
const champions = require('../../data/champions.json').data;

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;
    console.log(champMap[payload.value])
    return (
      // <g transform={`translate(${x},${y})`}>
      //   <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
      //     {payload.value}
      //   </text>
      // </g>
      <g transform={`translate(${x},${y})`}>
        <image x={-15} y={0} width={30} href={require(`../../images/champions/icons/` + champMap[payload.value] + `_0.png`)}></image>
      </g>
      // <img src={require(`../../images/champions/icons/` + champMap[payload.value] + `_0.png`)} style={{width: '10px'}}></img>
    );
  }
}

export default function TeamDamage (props) {
  let redPlayers = props.redPlayers;
  let bluePlayers = props.bluePlayers;

  function createData() {
    let d = [];
    for (let rp of redPlayers) {
      d.push({
        "name": rp.championId,
        "damage": rp.totalDamageDealtToChampions,
        "damage2": 0
      })
    }
    for (let bp of bluePlayers) {
      d.push({
        "name": bp.championId,
        "damage": 0,
        "damage2": bp.totalDamageDealtToChampions
      })
    }
    return d;
  }

  function createLabel(value) {
    // console.log(champMap[props.payload.name]);
    // console.log(props);
    return champions[champMap[value]].name;
  }

  function createValue(value, label, props) {
    if (value == 0) {
      return [undefined, undefined];
    }
    return value;
  }

  return (
    <div className="risen-stats-block">
      <div className="risen-stats-header">
        Damage by Player
      </div>
      <div className="risen-stats-body">
        <ResponsiveContainer width="100%" height={300} id="barChart">
          <BarChart data={createData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} tick={<CustomizedAxisTick />} />
            <YAxis type="number" />
            <Tooltip labelFormatter={createLabel} formatter={createValue} labelStyle={{color: 'black'}} />
            <Bar name="Damage" stackId='1' dataKey="damage" fill="#6d83ff" />
            <Bar name="Damage" stackId="1" dataKey="damage2" fill="#e5b575" />
          </BarChart>
          {/* <BarChart data={createData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart> */}
        </ResponsiveContainer>
      </div>
    </div>
  )
}