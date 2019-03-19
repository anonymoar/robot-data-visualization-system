import React, { Component } from 'react';
import io from 'socket.io-client';

import { config } from '../config';
import { classname } from '../helpers/classnames';
import { Logs } from '../pages/logs';

import './app.css';

const b = classname('app');

export class App extends Component {


  public render() {
    return (
      <div className={b()}>
        <Logs/>
      </div>
    );
  }
}
