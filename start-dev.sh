#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# CuraSense local dev launcher (macOS).
# Starts: Python AI gateway (8000), Node backend (5001), Vite frontend (5173).
# MongoDB is expected to run as a brew service:
#     brew services start mongodb-community@8.0
# Press Ctrl-C to stop all three.
# ─────────────────────────────────────────────────────────────
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "▶ Python AI gateway  → http://localhost:8000"
( cd "$ROOT/backend/python" && exec .venv/bin/python main.py ) &
PY_PID=$!

echo "▶ Node backend       → http://localhost:5001"
( exec node "$ROOT/backend/node/server.js" ) &
NODE_PID=$!

echo "▶ Frontend (Vite)    → http://localhost:5173"
( cd "$ROOT/frontend" && exec pnpm dev ) &
FE_PID=$!

trap 'echo; echo "Stopping..."; kill $PY_PID $NODE_PID $FE_PID 2>/dev/null || true' EXIT INT TERM
wait
