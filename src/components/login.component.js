import React, {Component} from 'react';
import fetch from 'node-fetch';

import {getBaseUrl, setCookie} from '../Helpers';
import { Container } from 'react-bootstrap';

const qs = require('qs');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    console.log(this.props)
    if(this.query.code) {
      setCookie("auth", this.query.code, 7);
      this.props.authCheck(() => {
        this.props.history.push("/");
      });
    }
    else {
      this.props.history.push("/");
    }
  }

  getLoginUrl () {
    fetch(getBaseUrl() + "/auth/redirect").then(data => {
      data.text().then(url => {
        console.log(url);
      })
    });
  }

  render() {
    return (
      <section>
        {/* <div className="light-section">
          <Container>
            <div className="row">
              <div className="col">
                {
                  this.props.admin ? 
                  <h2>You are already logged in as an admin</h2>
                  :
                  <button className="risen-button">Log in</button>
                }
              </div>
            </div>
          </Container>
        </div> */}
      </section>
    )
  }
}