import express, { Express, Router } from 'express';

import { ping } from '../controllers/ping';

export function setupApiRouter(app: Express) {
  const apiRouter = Router();

  apiRouter.use(express.json());
  apiRouter.route('/ping').get(ping);

  app.use('/api', apiRouter);
}
