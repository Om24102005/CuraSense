import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './src/routes/index.js';
import { pythonIsUp } from './src/services/pythonAiClient.js';

const app = express();

// CORS allow-list. The Capacitor apps always; localhost, loopback, .local names and private-LAN addresses outside production (dev server, a phone on the same Wi-Fi);
// any other site, such as the live website, must be listed in CORS_ORIGINS (comma separated). No Origin header (curl, server to server) is not a browser CORS case and passes.
const APP_ORIGINS = ['capacitor://localhost', 'https://localhost'];
const DEV_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|[\w-]+\.local|10(\.\d{1,3}){3}|192\.168(\.\d{1,3}){2}|172\.(1[6-9]|2\d|3[01])(\.\d{1,3}){2})(:\d+)?$/;
const LISTED = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
const IS_PROD = process.env.NODE_ENV === 'production';
const originAllowed = (o) => !o || APP_ORIGINS.includes(o) || LISTED.includes(o) || (!IS_PROD && DEV_ORIGIN.test(o));
app.use(cors({ origin: (o, cb) => cb(null, originAllowed(o)) }));

// Basic hardening headers; this API only returns JSON, so helmet's full set is not needed. HSTS belongs with the HTTPS setup at go-live.
app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer' });
  next();
});

// File uploads go through multer, not here. The biggest JSON body is a 60,000-character pasted report (a few hundred KB).
app.use(express.json({ limit: '2mb' }));

app.get('/health', async (_req, res) => {
  res.json({
    python: (await pythonIsUp()) ? 'ok' : 'down',
    server: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'down',
    uri: process.env.MONGODB_URI ? 'set' : 'missing',
  });
});

app.use(routes);

export default app;
