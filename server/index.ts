import cors from 'cors';
import http from 'http';
import express from 'express';
import io from 'socket.io';

import { config } from './config';
import { setupApiRouter } from './routers/api';
import { setupSocketServers } from './routers/socket';
import { setupStatic } from './routers/static';

function setupApp() {
  const app = express();
  app.disable('x-powered-by').enable('trust proxy');

  if (config.env === 'development') {
    app.use(cors());
  }

  const httpServer = app.listen(config.server.port);
  const browserSocketServer = io(httpServer);
  const robotServer = http.createServer();
  robotServer.listen(config.robot.port, '0.0.0.0');
  const robotSocketServer = io(robotServer);

  setupSocketServers(browserSocketServer, robotSocketServer);
  setupApiRouter(app);
  setupStatic(app);

  console.log(`HTTP and WebSocket server started at http://localhost:${config.server.port}`);
  console.log(`WebSocket server started at http://localhost:${config.robot.port}`);
}

setupApp();
