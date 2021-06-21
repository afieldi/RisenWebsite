import React from 'react';
let champMap = require('../../data/champions_map.json')

export default function GeneralChampionStats(props) {
  
  
  function getKDA() {
    
  }
  const stats = {
    "picks": () => props.champData.length,
    "bans": () => props.champData.length,
  }

  return (
    <section>
      <div className="row">
        <div className="col">
          <div className="risen-stats-block">
            <div className="risen-stats-header">
              Champion Stats
            </div>
            <div className="risen-stats-body">
              <table className="table text-light">
                <thead></thead>
                <tbody>
                  <tr>
                    <td>Picks</td>
                    <td>{stats["picks"]()}</td>
                  </tr>
                  <tr>
                    <td>Bans</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Wins</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>KDA</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>CSPM</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>DPM</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="risen-stats-block">
            <div className="risen-stats-header">
              Roles
            </div>
            <div className="risen-stats-body">

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}