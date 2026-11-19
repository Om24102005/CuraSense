#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# CuraSense presentation launcher (macOS): the production build, one address for the whole product.
#   backend/python   AI gateway, loopback only        → 127.0.0.1:$AI_PORT
#   backend/node     the API and the built website    → http://<this Mac>:$WEB_PORT
# It runs next to ./start-dev.sh without touching it (other ports, its own database "curasense_live").
# The first run writes backend/.env.production (secrets made here, never printed, not in git).
# Press Ctrl-C to stop. What is switched off and how to go public: PRESENTING.md
# ─────────────────────────────────────────────────────────────
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
WEB_PORT="${WEB_PORT:-8080}"
AI_PORT="${AI_PORT:-8010}"
ENV_FILE="${ENV_FILE:-$ROOT/backend/.env.production}"
DIST="$ROOT/frontend/dist-web"
PYTHON="$ROOT/backend/python/.venv/bin/python"

[ -x "$PYTHON" ] || { echo "✗ $PYTHON not found. Do the one-time setup in START.md first."; exit 1; }
[ -d "$ROOT/backend/node/node_modules" ] && [ -d "$ROOT/frontend/node_modules" ] || { echo "✗ npm packages are missing. Do the one-time setup in START.md first."; exit 1; }
nc -z localhost 27017 2>/dev/null || { echo "✗ MongoDB is not running. Start it:  brew services start mongodb-community@8.0"; exit 1; }
for port in $WEB_PORT $AI_PORT; do
  if lsof -nP -tiTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then echo "✗ port $port is already in use (set WEB_PORT or AI_PORT to use another)"; exit 1; fi
done

# Secrets for this run: made once, kept in a file only you can read. The admin login for the Overwatch page is in it.
if [ ! -f "$ENV_FILE" ]; then
  ( umask 077
    {
      echo "# Written by start-prod.sh. Secrets for the presentation server; not in git. Delete the file to make new ones."
      echo "MONGODB_URI=mongodb://localhost:27017/curasense_live"
      echo "JWT_SECRET=$(openssl rand -hex 32)"
      echo "GATEWAY_SECRET=$(openssl rand -hex 24)"
      echo "ADMIN_EMAIL=admin@curasense.com"
      echo "ADMIN_PASSWORD=$(openssl rand -hex 12)"
    } > "$ENV_FILE" )
  echo "• Wrote $ENV_FILE (the admin login is inside; it is not printed here)."
fi
set -a; . "$ENV_FILE"; set +a

# The website, built to call the address it is served from (an empty VITE_NODE_BASE_URL), into its own folder so the phone-app build in frontend/dist is untouched.
if [ "${REBUILD:-}" = 1 ] || [ ! -f "$DIST/index.html" ] || [ -n "$(find "$ROOT/frontend/src" "$ROOT/packages/shared/src" "$ROOT/frontend/index.html" "$ROOT/frontend/vite.config.ts" -newer "$DIST/index.html" -type f -print -quit)" ]; then
  echo "▶ Building the website (about 10 seconds)…"
  ( cd "$ROOT/frontend" && VITE_NODE_BASE_URL= npx vite build --outDir dist-web --emptyOutDir --logLevel warn )
fi

export NODE_ENV=production PORT="$WEB_PORT" STATIC_DIR="$DIST" PYTHON_AI_URL="http://127.0.0.1:$AI_PORT" AI_HOST=127.0.0.1 AI_PORT
unset RESET_CODE_IN_RESPONSE   # the password reset stays off: no mail service, and the dev shortcut would let anyone take over an account

echo "▶ Python AI gateway  → 127.0.0.1:$AI_PORT"
( cd "$ROOT/backend/python" && exec "$PYTHON" main.py ) &
PY_PID=$!
echo "▶ Node server        → port $WEB_PORT"
( cd "$ROOT/backend/node" && exec node server.js ) &
NODE_PID=$!

stop() { trap - EXIT INT TERM; echo; echo "Stopping…"; kill $PY_PID $NODE_PID $CAF_PID 2>/dev/null || true; }
trap stop EXIT INT TERM
caffeinate -i -w $$ & CAF_PID=$!   # keep the Mac from sleeping while people are using it

for _ in $(seq 1 40); do
  health=$(curl -fsS -m 2 "http://127.0.0.1:$WEB_PORT/health" 2>/dev/null || true)
  case "$health" in *'"python":"ok"'*'"mongo":"connected"'*) break ;; esac
  sleep 0.5
done
case "$health" in
  *'"python":"ok"'*'"mongo":"connected"'*) ;;
  *) echo "✗ The servers did not come up healthy: ${health:-no answer from the Node server}"; exit 1 ;;
esac

LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
echo
echo "✓ CuraSense is up."
echo "    On this Mac:           http://localhost:$WEB_PORT"
[ -n "$LAN_IP" ] && echo "    Same Wi-Fi (phones):   http://$LAN_IP:$WEB_PORT"
echo "    Bonjour name:          http://$(scutil --get LocalHostName 2>/dev/null || hostname -s).local:$WEB_PORT   (Apple devices)"
echo "  If macOS asks whether node may accept incoming connections, choose Allow."
echo "  Password reset is off (no mail service). Admin (Overwatch) login: see $ENV_FILE"
wait
