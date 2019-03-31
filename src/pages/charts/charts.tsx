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

// TODO: Вынести интерфейсы в отдельный файл
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
      this.setState(oldState => {
        if (!oldState.chartLines[chartPoint.chart_id]) {
          oldState.chartLines[chartPoint.chart_id] = new Set();
        }
        if (!oldState.linePoints[chartPoint.line_id]) {
          oldState.linePoints[chartPoint.line_id] = [];
        }
        oldState.chartLines[chartPoint.chart_id].add(chartPoint.line_id);
        oldState.linePoints[chartPoint.line_id].push([chartPoint.timestamp, chartPoint.value]);

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
            const newLinePoints: ILinePoints = {};
            this.state.chartLines[chartId].forEach(lineId => {
              newLinePoints[lineId] = [];
              const j = this.state.linePoints[lineId];
              if (this.state.linePoints[lineId]) {
                const y = this.state.linePoints[lineId];
                newLinePoints[lineId] = newLinePoints[lineId].concat(this.state.linePoints[lineId]);
              }
            });

            return (
              <Route
                key={chartId}
                path={`/charts/${chartId}`}
                render={() => (
                  <Chart
                    chartId={chartId}
                    lines={this.state.chartLines[chartId]}
                    linePoints={newLinePoints}
                  />
                )}
              />
            );
          })}
          <Route path="/charts/*" render={() => '404'} />
        </Switch>
      </div>
    );
  }
}
