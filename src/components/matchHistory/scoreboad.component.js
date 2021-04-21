// Apparently functional components are the future, so here I am
import React from 'react';
import Itemboard from './itemboard.component';
const champMap = require('../../data/champions_map.json')

export default function Scoreboard(props) {
  let bluePlayers = props.bluePlayers;
  let redPlayers = props.redPlayers;
  function getKDA(team) {
    let k = 0;
    let d = 0;
    let a = 0;
    for (let p of team) {
      k += p.kills;
      d += p.deaths;
      a += p.assists;
    }
    return `${k}/${d}/${a}`;
  }

  return (
    <div className="risen-stats-block">
      <div className="risen-stats-header row" style={{margin: 0}}>
        <div className="col">
          Victory
        </div>
        <div className="col">
          {getKDA(bluePlayers)}
        </div>
        <div className="col">
          
        </div>
        <div className="col">
          
        </div>
        <div className="col ralign">
          {getKDA(redPlayers)}
        </div>
        <div className="col ralign">
          Defeat
        </div>
      </div>
      <div className="risen-stats-body">
        {
          props.playerRows.map((v) => {
            let bp = bluePlayers[v];
            let rp = redPlayers[v];
            // console.log(bp);
            // console.log(bluePlayers);
            return (
              <div key={"pos-"+bp['championId']} className="row">
                <div className="col-1">
                  <img key={"img" + bp['championId']} id={"img-" + bp['championId']}
                    src={require(`../../images/champions/icons/` + champMap[bp['championId']] + `_0.png`)}
                    style={imgStyle}></img>
                </div>
                <div className="col" style={nameStyle}>
                  {bp.player.name}
                </div>
                <Itemboard></Itemboard>
                <div className="col">
                  
                </div>
                <div className="col">
                  
                </div>
                <Itemboard></Itemboard>
                <div className="col ralign" style={nameStyle}>
                  {rp.player.name}
                </div>
                <div className="col-1">
                  <img key={"img" + rp['championId']} id={"img-" + rp['championId']}
                    src={require(`../../images/champions/icons/` + champMap[rp['championId']] + `_0.png`)}
                    style={imgStyle}></img>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}


const imgStyle = {
  height: '48px'
}

const nameStyle = {
  // margin: '0',
  padding: 0,
  alignSelf: 'center',
}