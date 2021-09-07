import React from 'react';
import { Link } from 'react-router-dom';

export default function GeneralTable(props) {
  let data = props.data;
  
  let headers = props.headers;
  if (!headers) {
    headers = data.length > 0 ? Object.keys(data[0]) : [];
  }

  const whiteText = {
    color: '#fff'
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
            </tr>
          </thead>
          <tbody>
            {
              data.map(d => {
                if (d["linkto"]) {
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
                    </tr>
                  )
                }
                return (
                  <tr>
                    {
                      headers.map(h => {
                        return (
                          <td>{d[h]}</td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
    </div>
  )
}