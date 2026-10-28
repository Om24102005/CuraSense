# Start CuraSense locally

Run once (fresh clone / deps changed):

```bash
cd backend/node && npm install
cd ../python && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cd ../../frontend && pnpm install
```

Make sure `backend/.env` exists (copy from `backend/python/.env.example` if missing) with `MONGODB_URI`, `PORT`, `PYTHON_AI_URL`, `GATEWAY_SECRET`, `JWT_SECRET` set.

Every run, before the final command:

```bash
brew services start mongodb-community@8.0
```

Final command (starts Python AI gateway :8000, Node backend :5001, Vite frontend :5173):

```bash
./start-dev.sh
```
