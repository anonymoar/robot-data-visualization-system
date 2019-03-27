import React, { Component} from 'react';

interface IProps {
  chartId: string;
}

export class Chart extends Component <IProps> {

  public render () {
    return <div>{this.props.chartId}</div>
  }
}
