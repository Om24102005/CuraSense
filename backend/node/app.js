import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './src/routes/index.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/health', (_req, res) => {
  res.json({
    server: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'down',
    uri: process.env.MONGODB_URI ? 'set' : 'missing',
  });
});

app.use(routes);

export default app;
