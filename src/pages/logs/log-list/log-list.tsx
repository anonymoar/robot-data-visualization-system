import React, { FC } from 'react';

import { ILogRecord } from '../types';
import { classname } from '../../../helpers/classnames';
import { LogRecord } from '../log-record';

import './log-list.css';

const b = classname('log-list');

interface IProps {
  list: ILogRecord[];
}

export const LogList: FC<IProps> = props => {
  return (
    <ul className={b()}>
      {props.list.reverse().map(log => (
        <LogRecord key={log.created} cls={b('log-record')} log={log} />
      ))}
    </ul>
  );
};
