import path from 'path';

import express, { Express } from 'express';

const buildPath = path.join(__dirname, '..', '..', 'build');

export function setupStatic(app: Express) {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(buildPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  }
}
