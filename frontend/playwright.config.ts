import { defineConfig, devices } from '@playwright/test';

/* Isolated stack so tests never touch dev data or spend AI credits:
   own ports (dev uses 5001/8000/5173), own database, fake AI gateway. */
const NODE_PORT = 5101, AI_PORT = 8101, WEB_PORT = 5273;
export const E2E = {
  web: `http://localhost:${WEB_PORT}`,
  api: `http://localhost:${NODE_PORT}`,
  mongo: 'mongodb://localhost:27017/curasense_e2e',
};
const backendEnv = {
  PORT: String(NODE_PORT), MONGODB_URI: E2E.mongo, JWT_SECRET: 'e2e-jwt-secret', GATEWAY_SECRET: 'e2e-gateway-secret',
  PYTHON_AI_URL: `http://localhost:${AI_PORT}`, FAKE_AI_PORT: String(AI_PORT),
};

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,                       // one shared DB and one shared admin-promoted user
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: './e2e/global-setup.ts',
  use: { baseURL: E2E.web, trace: 'retain-on-failure', screenshot: 'only-on-failure', reducedMotion: 'reduce' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    { command: 'node e2e/fake-ai.mjs', url: `http://localhost:${AI_PORT}/health`, env: backendEnv, reuseExistingServer: false },
    { command: 'node server.js', cwd: '../backend/node', url: `${E2E.api}/health`, env: backendEnv, reuseExistingServer: false },
    { command: `npx vite --port ${WEB_PORT} --strictPort`, url: E2E.web, env: { VITE_NODE_BASE_URL: E2E.api }, reuseExistingServer: false },
  ],
});
