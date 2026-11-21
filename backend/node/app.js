import path from 'path';
import fs from 'fs';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './src/routes/index.js';
import { pythonIsUp } from './src/services/pythonAiClient.js';

const app = express();

// Behind a reverse proxy (Railway, a tunnel) the client's address is in X-Forwarded-For. TRUST_PROXY=1 makes the rate limits count the real client
// instead of the proxy, so one noisy visitor cannot lock everyone out. Leave it unset when clients connect directly.
if (process.env.TRUST_PROXY) app.set('trust proxy', /^\d+$/.test(process.env.TRUST_PROXY) ? Number(process.env.TRUST_PROXY) : process.env.TRUST_PROXY);

// CORS allow-list. The Capacitor apps always; localhost, loopback, .local names and private-LAN addresses outside production (dev server, a phone on the same Wi-Fi);
// any other site, such as the live website, must be listed in CORS_ORIGINS (comma separated). No Origin header (curl, server to server) is not a browser CORS case and passes.
const APP_ORIGINS = ['capacitor://localhost', 'https://localhost'];
const DEV_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|[\w-]+\.local|10(\.\d{1,3}){3}|192\.168(\.\d{1,3}){2}|172\.(1[6-9]|2\d|3[01])(\.\d{1,3}){2})(:\d+)?$/;
const LISTED = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
const IS_PROD = process.env.NODE_ENV === 'production';
const originAllowed = (o) => !o || APP_ORIGINS.includes(o) || LISTED.includes(o) || (!IS_PROD && DEV_ORIGIN.test(o));
app.use(cors({ origin: (o, cb) => cb(null, originAllowed(o)) }));

// Basic hardening headers; this API only returns JSON, so helmet's full set is not needed. HSTS is sent in production over HTTPS only
// (behind a proxy that needs TRUST_PROXY so req.secure sees the original scheme).
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer' });
  if (IS_PROD && req.secure) res.set('Strict-Transport-Security', 'max-age=15552000');
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

// The built website. With STATIC_DIR set, this server also serves it, so one address (one origin, no CORS) is the whole product. It comes after the
// API routes, so an API path always wins. A page address the site draws itself (/platform, /approach, /access) gets index.html; a missing file does not.
const STATIC_DIR = process.env.STATIC_DIR && path.resolve(process.env.STATIC_DIR);
if (STATIC_DIR && !fs.existsSync(path.join(STATIC_DIR, 'index.html'))) {
  console.error(`[web] STATIC_DIR has no index.html (${STATIC_DIR}); the website is not served. Build it first.`);
} else if (STATIC_DIR) {
  const immutable = `${path.sep}assets${path.sep}`;   // Vite names these by content hash, so they never change under the same name
  app.use(compression());
  app.use(express.static(STATIC_DIR, { index: false, setHeaders: (res, file) => res.set('Cache-Control', file.includes(immutable) ? 'public, max-age=31536000, immutable' : 'no-cache') }));
  app.get('*', (req, res, next) => (path.extname(req.path) || !req.accepts('html') ? next() : res.set('Cache-Control', 'no-cache').sendFile(path.join(STATIC_DIR, 'index.html'))));
}

export default app;
