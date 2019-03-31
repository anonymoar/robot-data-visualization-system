import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import { color } from 'd3';

type Point = [number, number];

interface ILinePoints {
  [lineId: string]: Point[];
}

interface IProps {
  chartId: string;
  lines: Set<string>;
  linePoints: ILinePoints;
}

export class Chart extends Component<IProps> {
  readonly colors = [
    '#E51F26',
    '#054DA1',
    '#8BC43F',
    '#F9A618',
    '#FFDD02',
    '#A61ED6',
    '#5B7934',
    '#FA6BBD',
    '#00F5F5',
    '#52FF00',
    '#633B1E',
    '#0094FF',
    '#FF7D1F',
    '#FF00C7'
  ];

  readonly colorForLineId = {};

  // [
  //   {
  //     x,
  //     y,
  //     type: 'scatter',
  //     mode: 'lines+points',
  //     marker: { color: '#E51F26' }
  //   },
  //   {
  //     x,
  //     y: y.map(i => i + 1),
  //     type: 'scatter',
  //     mode: 'lines+points',
  //     marker: { color: 'blue' }
  //   }
  // ]

  private lines: string[] = [];

  private setColor(lineId: string) {
    const colorIndex = this.lines.indexOf(lineId);
    this.colorForLineId[lineId] = this.colors[colorIndex];
  }

  // TODO: сделать конфиг в котором можно будеьт определенным lineId забить железно цвета
  public render() {
    this.props.lines.forEach(lineId => {
      if (!this.lines.includes(lineId)) {
        this.lines.push(lineId);
        this.setColor(lineId);
      }
    });
    const data: Object[] = Object.keys(this.props.linePoints).map(lineId => {
      return {
        x: this.props.linePoints[lineId].map(point => point[0]),
        y: this.props.linePoints[lineId].map(point => point[1]),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: this.colorForLineId[lineId] }
      };
    });

    return (
      <div>
        <Plot data={data} layout={{ width: 1024, height: 768, title: this.props.chartId }} />
      </div>
    );
  }
} // <div>{this.props.chartId}{JSON.stringify(Array.from(this.props.lines))}{Object.keys(this.props.linePoints).map(line => JSON.stringify(Array.from(this.props.linePoints[line])))}</div>
