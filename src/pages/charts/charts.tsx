import React, { Component } from 'react';

import { config } from '../../config';
import { Switch, Route } from 'react-router-dom';
import io from 'socket.io-client';

import { Chart } from './chart';

type Point = [number, number];

interface IChartLines {
  [chartId: string]: Set<string>;
}

interface ILinePoints {
  [lineId: string]: Point[];
}

interface IState {
  chartLines: IChartLines;
  linePoints: ILinePoints;
}

export class Charts extends Component<{}, IState> {
  public readonly state: IState = {
    chartLines: {},
    linePoints: {}
  };

  public componentDidMount() {
    const socket = io.connect(`${config.server.baseUrl}/charts`);

    socket.on('connect', () => {
      console.log('WebSocket connection established');
    });
    // TODO: Изменить any на интерфейс описывающий точку
    socket.on('chart point', (chartPoint: any) => {
      console.log(`Server sent "${chartPoint}" via WebSocket`);
      this.setState(oldState => {
        if (!oldState.chartLines[chartPoint.chartId]){
          oldState.chartLines[chartPoint.chartId] = new Set();
        }
        if(!oldState.linePoints[chartPoint.lineId]){
          oldState.linePoints[chartPoint.lineId] = [];
        }
        oldState.chartLines[chartPoint.chartId].add(chartPoint.lineId);
        oldState.linePoints[chartPoint.lineId].push([chartPoint.timeStamp, chartPoint.value]);

        return { ...oldState };
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
    return (
      <div>
        <nav>
          <ul>
            {Object.keys(this.state.chartLines).map(chartId => {
              return <li key={chartId}>{chartId}</li>;
            })}
          </ul>
        </nav>

        <Switch>
          {Object.keys(this.state.chartLines).map(chartId => {
            return <Route key={chartId} path={`/charts/${chartId}`} render={() => <Chart chartId={chartId} />} />;
          })}
          <Route path="/charts/*" render={() => '404'} />
        </Switch>
      </div>
    );
  }
}
