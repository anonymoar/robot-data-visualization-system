import React, { FC } from 'react';

import { ILogRecord } from '../types';
import { classname, classnames } from '../../../helpers/classnames';

import './log-record.css';

const b = classname('log-record');

interface IProps {
  cls?: string;
  log: ILogRecord;
}

// TODO: отрисовать exception
// TODO: вынести цвета из всех файлов глобально
// TODO: порядок модификаторов в css
export const LogRecord: FC<IProps> = props => {
  const { log, cls } = props;
  const { tag, created, level, message, exception } = log;
  const time = new Date(created * 1000);

  return (
    <li className={classnames(cls, b({ level: level.toLowerCase() }))}>
      <div className={b('tag')}>{tag}</div>
      <div className={b('created')}>
        <time className={b('created-time')} dateTime={time.toISOString()}>
          {time.toLocaleTimeString()}
        </time>
      </div>
      <div className={b('message')}>
        <p className={b('message-text')}>{message}</p>
      </div>
    </li>
  );
};
