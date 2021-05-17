import React from 'react';
import { AreaChart, ResponsiveContainer, Area, Tooltip, XAxis, YAxis, CartesianGrid, linearGradient } from 'recharts';

export default function TeamGold(props) {
  let redPlayers = props.redPlayers;
  let bluePlayers = props.bluePlayers;

  function getGoldDiff1(i) {
    let rG = redPlayers.reduce((total, v) => {
      return total + v.goldMap[i];
    }, 0);

    let bG = bluePlayers.reduce((total, v) => {
      return total + v.goldMap[i];
    }, 0);

    if (bG > rG) {
      return bG - rG;
    }
    return 0;
  }

  function getGoldDiff2(i) {
    let rG = redPlayers.reduce((total, v) => {
      return total + v.goldMap[i];
    }, 0);

    let bG = bluePlayers.reduce((total, v) => {
      return total + v.goldMap[i];
    }, 0);

    if (rG >= bG) {
      return bG - rG;
    }
    return 0;
  }

  function createData() {
    let d = [];
    if (redPlayers.length > 0) {
      for (let i=0; i<redPlayers[0].goldMap.length; i++) {
        d.push({
          "name": i+"",
          "GoldBlue": getGoldDiff1(i),
          "GoldRed": getGoldDiff2(i)
        })
      }
    }
    return d;
  }

  function createLabel(value) {
    return value + " min"
  }

  function createValues(value, name, props) {
    if (props.payload.GoldBlue === 0) {
      if (name == "GoldBlue") {
        return [undefined, undefined];
      }
      return [Math.abs(props.payload.GoldRed), "Red"]
    }
    else {
      if (name == "GoldRed") {
        return [undefined, undefined];
      }
      return [Math.abs(props.payload.GoldBlue), "Blue"]
    }
  }

  return (
    <div className="risen-stats-block">
      <div className="risen-stats-header">
        Team Gold Differential
      </div>
      <div className="risen-stats-body">
        <ResponsiveContainer width="100%" height={300} id="areaChart">
          <AreaChart data={createData()}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6d83ff" stopOpacity={1}/>
                <stop offset="95%" stopColor="#6d83ff" stopOpacity={1}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip labelFormatter={createLabel} formatter={createValues} key="name" labelStyle={{color: 'black'}}/>
            <Area type="monotone" dataKey="GoldBlue" stroke="#6d83ff" fillOpacity={1} fill="url(#colorUv)" />
            <Area type="monotone" dataKey="GoldRed" stroke="#e5b575" fillOpacity={1} fill="#e5b575" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}