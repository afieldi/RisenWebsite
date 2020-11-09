import React, {Component} from 'react';
import fetch from 'node-fetch';

import {setCookie} from '../Helpers';
import { Container } from 'react-bootstrap';

const qs = require('qs');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
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

  render() {
    return (
      <section>
      </section>
    )
  }
}