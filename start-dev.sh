#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# CuraSense local dev launcher (macOS).
# Runs the three commands you would type by hand, each in its own folder,
# all in this one terminal:
#   backend/python   py main.py      Python AI gateway  → http://localhost:8000
#   backend/node     node server.js  Node backend       → http://localhost:5001
#   frontend         npm run dev     Vite frontend      → http://localhost:5173
# ("py main.py" runs with the project's .venv Python, which is what `py` picks in that folder.)
# MongoDB is expected to run as a brew service:
#     brew services start mongodb-community@8.0
# Press Ctrl-C to stop all three. How to use it: START.md
# ─────────────────────────────────────────────────────────────
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
PY_PORT=8000    # hard-coded in backend/python/main.py
NODE_PORT=5001  # PORT in backend/.env
WEB_PORT=5173   # Vite default

PYTHON="$ROOT/backend/python/.venv/bin/python"
[ -x "$PYTHON" ] || { echo "✗ $PYTHON not found. Do the one-time setup in START.md first."; exit 1; }

# Refuse to start while an old server holds a port: it would keep serving the old code while the
# new one dies with "address already in use" (and Vite would quietly move to the next port).
busy=""
for port in $PY_PORT $NODE_PORT $WEB_PORT; do
  pid=$(lsof -nP -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null | head -1 || true)
  if [ -n "$pid" ]; then
    name=$(ps -p "$pid" -o comm= 2>/dev/null || true)
    echo "✗ port $port is already in use by PID $pid (${name##*/})"
    busy=1
  fi
done
if [ -n "$busy" ]; then
  echo "Stop the old servers first (Ctrl-C in their terminals), or run:"
  echo "    kill \$(lsof -nP -tiTCP:$PY_PORT,$NODE_PORT,$WEB_PORT -sTCP:LISTEN)"
  exit 1
fi

echo "▶ Python AI gateway  → http://localhost:$PY_PORT"
( cd "$ROOT/backend/python" && exec "$PYTHON" main.py ) &
PY_PID=$!

echo "▶ Node backend       → http://localhost:$NODE_PORT"
# RESET_CODE_IN_RESPONSE=1: dev only. Without it the password reset is off (no mail service yet); with it the reset code is returned in the response,
# which lets anyone on your network take over an account, so ./start-prod.sh never sets it.
( cd "$ROOT/backend/node" && exec env RESET_CODE_IN_RESPONSE=1 node server.js ) &
NODE_PID=$!

echo "▶ Frontend (Vite)    → http://localhost:$WEB_PORT"
( cd "$ROOT/frontend" && exec npm run dev ) &
FE_PID=$!

# Ctrl-C lands here once (the trap is cleared first, so the EXIT trap does not run it a second time).
stop() { trap - EXIT INT TERM; echo; echo "Stopping..."; kill $PY_PID $NODE_PID $FE_PID 2>/dev/null || true; }
trap stop EXIT INT TERM
wait
