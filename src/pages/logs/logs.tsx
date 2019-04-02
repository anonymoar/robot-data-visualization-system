import React, { Component } from 'react';
import io from 'socket.io-client';

import { ILogRecord } from './types';
import { classname, classnames } from '../../helpers/classnames';
import { LogRecord } from './log-record';
import { LogList } from './log-list';
import { config } from '../../config';

import './logs.css';

const b = classname('logs');

interface IState {
  logRecords: ILogRecord[];
}

export class Logs extends Component<{}, IState> {
  public readonly state: IState = { logRecords: [] };
  private tempLogRecords: ILogRecord[] = [];

  public componentDidMount() {
    const socket = io.connect(`${config.server.baseUrl}/logs`);

    socket.on('connect', () => {
      console.log('WebSocket connection established');
    });
    socket.on('log record', (data: string) => {
      console.log(`Server sent "${data}" via WebSocket`);
      this.tempLogRecords.push(JSON.parse(data));
    });
    socket.on('error', (error: string) => {
      console.error(`Error occured: "${error}"`);
    });
    socket.on('disconnect', () => {
      console.log('WebSocket connection closed');
    });

    setInterval(this.addLogRecord.bind(this), 500);
  }

  public render() {
    if (!this.state.logRecords.length) {
      return 'Аркадий, подключи робота!';
    }

    return <LogList list={this.state.logRecords} />;
  }

  // TODO: Описать тип LogRecord вместо any
  private addLogRecord() {
    this.setState(oldState => {
      if (oldState.logRecords.length > 500) {
        const returnObject = {
          logRecords: oldState.logRecords.slice(450).concat(this.tempLogRecords)
        };
        this.tempLogRecords = [];
        return returnObject;
      }
      const returnObject = { logRecords: oldState.logRecords.concat(this.tempLogRecords) };
      this.tempLogRecords = [];
      return returnObject;
    });
  }
}
