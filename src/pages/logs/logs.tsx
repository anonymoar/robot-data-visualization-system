import React, { Component } from 'react';
import io from 'socket.io-client';

import { ILogRecord } from './types';
import { classname, classnames } from '../../helpers/classnames';
import { LogRecord } from './log-record';
import { LogList } from './log-list';
import { config } from '../../config';

import './logs.css';

const b = classname('logs');

interface iState {
  logRecords: ILogRecord[];
}

export class Logs extends Component<{}, iState> {
  public readonly state: iState = { logRecords: [] };

  public componentDidMount() {
    const socket = io.connect(config.server.baseUrl);

    socket.on('connect', () => {
      console.log('WebSocket connection established');
    });
    socket.on('log record', (data: string) => {
      console.log(`Server sent "${data}" via WebSocket`);
      this.setState(oldState => {
        return { logRecords: oldState.logRecords.concat(JSON.parse(data))};
      });
    });
    socket.on('error', (error: string) => {
      console.error(`Error occured: "${error}"`);
    });
    socket.on('disconnect', () => {
      console.log('WebSocket connection closed');
    });
  }

  public render() {
    return <LogList list={this.state.logRecords} />;
  }
}
