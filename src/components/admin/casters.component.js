import React, { Component } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
let champMap = require('../../data/champions_map.json')

export default class Casters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seasons: [],
      downloadLoading: false
    }

    this.links = [
      {
        "description": 'All Champion Data With Bans',
        "link": '/champs/withbans'
      },
      {
        "description": 'All Champion Data Without Bans',
        "link": '/champs'
      },
      {
        "description": 'All Champion Data For TOP /w no bans',
        "link": '/champs?role=TOP'
      },
      {
        "description": 'All Champion Data For JUNGLE /w no bans',
        "link": '/champs?role=JUNGLE'
      },
      {
        "description": 'All Champion Data For MIDDLE /w no bans',
        "link": '/champs?role=MIDDLE'
      },
      {
        "description": 'All Champion Data For BOTTOM /w no bans',
        "link": '/champs?role=BOTTOM'
      },
      {
        "description": 'All Champion Data For SUPPORT /w no bans',
        "link": '/champs?role=SUPPORT'
      }
    ]
  }

  subChampNames(json) {
    for (let i in json) {
      json[i]["champName"] = champMap[json[i]["_id"]]
    }
  }

  convertToCsv(json) {
    var fields = Object.keys(json[0])
    var replacer = function(key, value) { return value === null ? '' : value } 
    var csv = json.map(function(row){
      return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName], replacer)
      }).join(',')
    });
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');
    return csv
  }
  
  download(data, filename) {
    var file = new Blob([data]);
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
  }

  componentDidMount() {
    this.loadSeasons();
  }

  downloadData(link) {
    let url = process.env.REACT_APP_BASE_URL + "/stats" + link;
    if (document.getElementById("seasonFilter").value !== "ANY") {
      if (url.includes("?") === false) {
        url += "?season=" + document.getElementById("seasonFilter").value;
      }
      else {
        url += "&season=" + document.getElementById("seasonFilter").value;
      }
    }
    fetch(url).then(data => {
      data.json().then(data => {
        this.subChampNames(data);
        let csv = this.convertToCsv(data);
        this.download(csv, "data.csv")
      })
    })
  }

  loadSeasons(callback=(()=>{})) {
    const url = process.env.REACT_APP_BASE_URL + "/seasons";
    fetch(url).then(data => {
      data.json().then(data => {
        this.setState({
          seasons: data
        });
        callback();
      })
    })
  }

  render() {
    return (
      <section>
        <div className="dark-section text-light">
          <Container>
            <h1 className="center text-light">Caster Portal</h1>
            <hr className="risen-light"></hr>
            <div className="row">
              <div className="col">
                <h3 className="center text-light">Download Stats</h3>
                <hr className="risen-light"></hr>
                <div>
                  <Form.Group controlId="seasonFilter">
                    <Form.Label>Season</Form.Label>
                    <Form.Control as="select">
                    <option value="ANY">Any</option>
                    {
                        this.state.seasons.map(s => {
                        return (
                            <option value={s._id}>{s.seasonName}</option>
                        )
                        })
                    }
                    </Form.Control>
                  </Form.Group>
                </div>
                <table className="table table-responsive-lg risen-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.links.map(l => {
                        return (
                          <tr>
                            <td>{l.description}</td>
                            <td><Button onClick={this.downloadData.bind(this, l.link)} disabled={this.state.downloadLoading}>Download Data</Button></td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </div>
      </section>
    )
  }
}