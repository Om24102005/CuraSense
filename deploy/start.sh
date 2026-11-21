#!/bin/bash
# Runs both servers. If either one stops, the container exits so the host restarts the whole product instead of leaving half of it up.
(cd /app/backend/python && exec python main.py) & ai=$!
(cd /app/backend/node && exec node server.js) & web=$!
trap 'kill "$ai" "$web" 2>/dev/null' TERM INT
while kill -0 "$ai" 2>/dev/null && kill -0 "$web" 2>/dev/null; do sleep 1 & wait $!; done
kill "$ai" "$web" 2>/dev/null
exit 1
