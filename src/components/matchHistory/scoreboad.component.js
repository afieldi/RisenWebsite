// Apparently functional components are the future, so here I am
import React from 'react';
import { customRound } from '../../Helpers';
import Itemboard from './itemboard.component';
const champMap = require('../../data/champions_map.json')

export default function Scoreboard(props) {
  let bluePlayers = props.bluePlayers;
  let redPlayers = props.redPlayers;

  const rowStyle = {
    marginBottom: '15px'
  }

  const subTextStyle = {
    fontSize: '12px',
    fontStyle: 'italic',
    lineHeight: '110%'
  }

  function getTeamKDA(team) {
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

  function getKDA(p) {
    return `${p.kills}/${p.deaths}/${p.assists}`;
  }

  function getWin(side) {
    if (bluePlayers.length > 0) {
      if (side == "blue") {
        return bluePlayers[0].win == true ? "Victory" : "Defeat"
      }
      return redPlayers[0].win == true ? "Victory" : "Defeat"
    }
    return "";
  }

  function getPm(value, time) {
    return customRound(value/(time/60), 1);
  }

  function getTime(duration) {
    var date = new Date(0);
    date.setSeconds((duration ? duration : 0)); // specify value for SECONDS here
    return date.toISOString().substr(14, 5);
  }
  

  function getSubText(player) {
    console.log(player.player.name + ":" +  getPm(player.totalDamageDealtToChampions, player.gameDuration));
    return getPm(player.totalMinionsKilled + player.neutralMinionsKilled, player.gameDuration) + " cspm <br />" + 
    getPm(player.totalDamageDealtToChampions, player.gameDuration) + " dpm";
  }

  return (
    <div className="risen-stats-block">
      <div className="risen-stats-header row" style={{margin: 0}}>
        <div className="col">
          {
            getWin("blue")
          }
        </div>
        <div className="col">
          {getTeamKDA(bluePlayers)}
        </div>
        <div className="col center">
          {getTime((bluePlayers[0] ? bluePlayers[0] : {}).gameDuration)}
        </div>
        <div className="col ralign">
          {getTeamKDA(redPlayers)}
        </div>
        <div className="col ralign">
          {
            getWin("red")
          }
        </div>
      </div>
      <div className="risen-stats-body">
        {
          props.playerRows.map((v) => {
            let bp = bluePlayers[v];
            let rp = redPlayers[v];
            return (
              <div key={"pos-"+bp['championId']} className="row" style={rowStyle}>
                <div className="col-1">
                  <img key={"img" + bp['championId']} id={"img-" + bp['championId']}
                    src={require(`../../images/champions/icons/` + champMap[bp['championId']] + `_0.png`)}
                    style={imgStyle}></img>
                </div>
                <div className="col" style={nameStyle}>
                  {bp.player.name}
                  <div>
                    <img src={require(`../../images/summoner/` + bp.summoners[0] + `.png`)}
                      style={{height: '24px'}}></img>
                    <img src={require(`../../images/summoner/` + bp.summoners[1] + `.png`)}
                      style={{height: '24px'}}></img>
                    <img src={require(`../../images/runes/` + bp.primaryRunes[0] + `.png`)}
                      style={{height: '24px'}}></img>
                  </div>
                </div>
                <div className="col center" style={nameStyle}>
                  {getKDA(bp)}
                  <div style={subTextStyle} dangerouslySetInnerHTML={{__html: getSubText(bp)}}></div>
                </div>
                <div className="col">
                  <Itemboard items={bp.items} side='blue' trinket={bp.trinket}></Itemboard>
                </div>
                {/* <div className="col-1"></div> */}
                <div className="col">
                  <Itemboard items={rp.items} side='red' trinket={rp.trinket}></Itemboard>
                </div>
                <div className="col center" style={nameStyle}>
                  {getKDA(rp)}<br></br>
                  <div style={subTextStyle} dangerouslySetInnerHTML={{__html: getSubText(rp)}}></div>
                </div>
                <div className="col ralign" style={nameStyle}>
                  {rp.player.name}
                  <div>
                    <img src={require(`../../images/runes/` + rp.primaryRunes[0] + `.png`)}
                      style={{height: '24px'}}></img>
                    <img src={require(`../../images/summoner/` + rp.summoners[0] + `.png`)}
                      style={{height: '24px'}}></img>
                    <img src={require(`../../images/summoner/` + rp.summoners[1] + `.png`)}
                      style={{height: '24px'}}></img>
                  </div>
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