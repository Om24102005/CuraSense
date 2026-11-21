# Run CuraSense locally

`./start-dev.sh` (in the project root) starts the whole app in one terminal. It runs the same three commands you would otherwise type in three terminals:

| Folder | Command | What it is | Address |
|---|---|---|---|
| `backend/python` | `py main.py` | Python AI gateway | http://localhost:8000 |
| `backend/node` | `node server.js` | Node backend (login, database, AI proxy) | http://localhost:5001 |
| `frontend` | `npm run dev` | The website (Vite) | http://localhost:5173 |

`py main.py` runs with the project's own Python in `backend/python/.venv`, which is the same one `py` picks inside that folder. The script is for macOS (it is a bash script).

## Run it

1. Make sure MongoDB is running. If you started it once with `brew services start mongodb-community@8.0`, it starts again by itself at login. `brew services list` shows its state.
2. Open Terminal and run:

   ```bash
   cd ~/Downloads/CURASENSE/CuraSense-main
   ./start-dev.sh
   ```

   If macOS answers "permission denied", run `chmod +x start-dev.sh` once and try again.
3. Wait for the ready line from each server. Three `▶` lines print first, then these appear:
   - `Uvicorn running on http://0.0.0.0:8000`
   - `Secure server running on port 5001` (and `Connected to MongoDB`)
   - `Local: http://localhost:5173/`
4. Open http://localhost:5173 in the browser.

Keep the terminal open while you work. The output of all three servers is mixed in it, so errors from any of them show up there.

## Stop

Press `Ctrl-C` in that terminal. It stops all three servers.

## If it says a port is already in use

```
✗ port 8000 is already in use by PID 86668 (Python)
```

An older copy of that server is still running, for example in another terminal. The script refuses to start in that case, so you never end up looking at old code by accident. Stop the old ones with `Ctrl-C` in their terminals, or free all three ports at once and start again:

```bash
kill $(lsof -nP -tiTCP:8000,5001,5173 -sTCP:LISTEN)
./start-dev.sh
```

## Other messages

- `[MongoDB] Connection failed` from the Node server: MongoDB is not running. Start it (step 1), then restart the script.
- `✗ .../.venv/bin/python not found`: do the one-time setup below.
- A page loads but the AI pages fail: check that `DEEPSEEK_API_KEY` is set in `backend/.env`.

## One-time setup (fresh clone, or after dependencies change)

```bash
cd backend/node && npm install
cd ../python && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cd ../../frontend && npm install
```

Make sure `backend/.env` exists (copy from `backend/python/.env.example` if missing) with `MONGODB_URI`, `PORT`, `PYTHON_AI_URL`, `GATEWAY_SECRET`, `JWT_SECRET` set.
