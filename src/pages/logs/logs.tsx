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

  public componentDidMount() {
    const socket = io.connect(`${config.server.baseUrl}/logs`);

    socket.on('connect', () => {
      console.log('WebSocket connection established');
    });
    socket.on('log record', (data: string) => {
      console.log(`Server sent "${data}" via WebSocket`);
      this.addLogRecord(data);
    });
    socket.on('error', (error: string) => {
      console.error(`Error occured: "${error}"`);
    });
    socket.on('disconnect', () => {
      console.log('WebSocket connection closed');
    });

    //setInterval(this.clearOldLogs.bind(this), 10000);
  }

  public render() {
    if (!this.state.logRecords.length) {
      return 'Аркадий, подключи робота!';
    }

    return <LogList list={this.state.logRecords} />;
  }

  // TODO: Описать тип LogRecord вместо any
  private addLogRecord(data: any) {
    this.setState(oldState => {
      if (oldState.logRecords.length > 500) {
        return {
          logRecords: oldState.logRecords.slice(450).concat(JSON.parse(data))
        };
      }

      return { logRecords: oldState.logRecords.concat(JSON.parse(data)) };
    });
  }

  // private clearOldLogs() {
  //   if (this.state.logRecords.length > 500) {
  //     this.setState(oldState => {
  //       return { logRecords: oldState.logRecords.slice(oldState.logRecords.length - 500) };
  //     });
  //   }
  // }
}
