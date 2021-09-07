import React from 'react';
import { Link } from 'react-router-dom';

const champMap = require('../../data/champions_map.json')

export default function LeaderBoardTable(props) {
  let data = props.data;
  
  let headers = props.headers;
  if (!headers) {
    headers = data.length > 0 ? Object.keys(data[0]) : [];
  }

  const whiteText = {
    color: '#fff'
  }

  function getKDA(p) {
    return `${p.kills}/${p.deaths}/${p.assists}`;
  }

  return (
    <div>
        <table className="table text-light">
          <thead>
            <tr>
              {
                headers.map(h => {
                  return (
                    <th>{h}</th>
                  )
                })
              }
              <th>Match</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map(d => {
                return (
                  <tr>
                    {
                      headers.map(h => {
                        return (
                          <td>
                            <Link to={d["linkto"]} style={whiteText} className="clickable">{d[h]}</Link>
                          </td>
                        )
                      }) 
                    }
                    <td>
                      <Link to={d["linkto"]} style={whiteText} className="clickable">
                        <img key={"img" + d['championId']} id={"img-" + d['championId']}
                        src={require(`../../images/champions/icons/` + champMap[d['championId']] + `_0.png`)}
                        style={imgStyle}></img>
                        {getKDA(d)}
                      </Link>
                    </td>
                      
                  </tr>
                )
              })
            }
          </tbody>
        </table>
    </div>
  )
}

const imgStyle = {
  height: '36px',
  marginRight: '10px'
}
