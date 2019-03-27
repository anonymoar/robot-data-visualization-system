import React, { Component } from 'react';
import io from 'socket.io-client';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import { config } from '../config';
import { classname } from '../helpers/classnames';
import { Logs } from '../pages/logs';
import { Charts } from '../pages/charts';

import './app.css';

const b = classname('app');

export class App extends Component {
  public render() {
    return (
      <div className={b()}>
        <header className={b('header')}>
          <nav>
            <Link to="/">Logo</Link>
            <ul>
              <li>
                <Link to="/logs">Логи</Link>
              </li>
              <li>
                <Link to="/charts">Чарты</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className={b('main')}>
          <Switch>
            <Route path="/logs" component={Logs} exact />
            <Route path="/charts" component={Charts} />
            <Route path="*" render={() => '404'} />
          </Switch>
        </main>
      </div>
    );
  }
}
