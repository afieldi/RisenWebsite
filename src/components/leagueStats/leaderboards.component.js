import React, { useState, useEffect } from 'react';

import LeaderBoardTable from '../tables/leaderboard-table.component';

export default function Leaderboards(props) {
  const [kills, setKills] = useState([]);
  const [deaths, setDeaths] = useState([]);
  const [assists, setAssists] = useState([]);
  const [gold, setGold] = useState([]);
  const [cs, setCs] = useState([]);
  const [vs, setVs] = useState([]);

  let season = props.season;



  function getLeaderboardData(prop, callback) {
    
    let url = process.env.REACT_APP_BASE_URL + "/leaderboards?";
    let query = [
      `property=${prop}`,
      "type=single",
      "count=5",
      `season=${season}`
    ];
    url += query.join("&");
    fetch(url).then(res => {
      res.json().then(data => {
        callback(data);
      });
    });
  }

  useEffect(() => {
    getLeaderboardData("kills", (d) => {setKills(d.map(i => {
      i["Name"] = i["playername"][0]["name"];
      i["linkto"] = "history/" + i["gameId"];
      i["Kills"] = i["kills"]
      return i; 
    }))});
    getLeaderboardData("deaths", d => {setDeaths(d.map(i => {
      i["Name"] = i["playername"][0]["name"];
      i["linkto"] = "history/" + i["gameId"];
      i["Deaths"] = i["deaths"]
      return i; 
    }))});
    getLeaderboardData("assists", d => {setAssists(d.map(i => {
      i["Name"] = i["playername"][0]["name"];
      i["linkto"] = "history/" + i["gameId"];
      i["Assists"] = i["assists"]
      return i; 
    }))});
    getLeaderboardData("goldEarned", d => {setGold(d.map(i => {
      i["Name"] = i["playername"][0]["name"];
      i["linkto"] = "history/" + i["gameId"];
      i["Gold"] = i["goldEarned"]
      return i; 
    }))});
    getLeaderboardData("totalMinionsKilled", d => {setCs(d.map(i => {
      i["Name"] = i["playername"][0]["name"];
      i["linkto"] = "history/" + i["gameId"];
      i["Total CS"] = i["totalMinionsKilled"] + i["neutralMinionsKilled"]
      return i; 
    }))});
    getLeaderboardData("visionScore", d=> {setVs(d.map(i => {
      i["Name"] = i["playername"][0]["name"];
      i["linkto"] = "history/" + i["gameId"];
      i["Vision Score"] = i["visionScore"]
      return i; 
    }))});
  }, [season])

  return (
    <section>
      <div className="row">
        <div className="col-md">
          <div className="risen-stats-block">
            <div className="risen-stats-header">
              <h3>Most Kills</h3>
            </div>
            <div className="risen-stats-body">
              <LeaderBoardTable data={kills} headers={["Name", "Kills"]}></LeaderBoardTable>
            </div>
          </div>
        </div>
        <div className="col-md">
          <div className="risen-stats-block">
            <div className="risen-stats-header">
              <h3>Most Deaths</h3>
            </div>
            <div className="risen-stats-body">
              <LeaderBoardTable data={deaths} headers={["Name", "Deaths"]}></LeaderBoardTable>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md">
          <div className="risen-stats-block">
            <div className="risen-stats-header">
              <h3>Most Assists</h3>
            </div>
            <div className="risen-stats-body">
              <LeaderBoardTable data={assists} headers={["Name", "Assists"]}></LeaderBoardTable>
            </div>
          </div>
        </div>
        <div className="col-md">
          <div className="risen-stats-block">
            <div className="risen-stats-header">
              <h3>Most Gold</h3>
            </div>
            <div className="risen-stats-body">
              <LeaderBoardTable data={gold} headers={["Name", "Gold"]}></LeaderBoardTable>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md">
          <div className="risen-stats-block">
            <div className="risen-stats-header">
              <h3>Most CS</h3>
            </div>
            <div className="risen-stats-body">
              <LeaderBoardTable data={cs} headers={["Name", "Total CS"]}></LeaderBoardTable>
            </div>
          </div>
        </div>
        <div className="col-md">
          <div className="risen-stats-block">
            <div className="risen-stats-header">
              <h3>Most Vision</h3>
            </div>
            <div className="risen-stats-body">
              <LeaderBoardTable data={vs} headers={["Name", "Vision Score"]}></LeaderBoardTable>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}