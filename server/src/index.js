import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import express from 'express';
import dotenv from 'dotenv';
import { openDb } from './db.js';
import { createApi } from './routes/api.js';
import { seed } from './seed/seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'app.db');

export function createApp(db) {
  const app = express();
  app.use(express.json());

  const api = createApi(db);
  app.use('/api', api);

  const distDir = path.join(__dirname, '..', '..', 'app', 'dist');
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get(/^\/(?!api\/).*/, (req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  return app;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const db = openDb(DB_PATH);
  seed(db);
  const app = createApp(db);
  app.listen(PORT, () => {
    console.log(`English learning server listening on http://localhost:${PORT}`);
  });
}