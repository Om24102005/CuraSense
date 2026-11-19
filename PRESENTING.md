# Presenting CuraSense

`./start-prod.sh` runs the production version of CuraSense on this Mac: the website and the API on one address, the AI service behind it, a database of its own. It runs next to `./start-dev.sh` and does not touch it. Nothing in it is published to the internet.

## Start it

1. MongoDB must be running (`brew services list` shows it; `brew services start mongodb-community@8.0` starts it).
2. In Terminal:

   ```bash
   cd ~/Downloads/CURASENSE/CuraSense-main
   ./start-prod.sh
   ```

3. The first run builds the website (about 10 seconds) and writes `backend/.env.production`, which holds the secrets for this server and the admin login. Later runs rebuild the website only if its code changed. When the servers are healthy, the script prints the addresses:
   - `http://localhost:8080` on this Mac.
   - `http://<ip>:8080` for phones and laptops on the same Wi-Fi.
   - `http://<name>.local:8080` for Apple devices on the same Wi-Fi.
4. If macOS asks whether `node` may accept incoming connections, choose Allow. Without that, other devices cannot connect.

Leave the terminal open. The script keeps the Mac from going to sleep while it runs (closing the lid still sleeps it). Press Ctrl-C to stop everything.

The iPhone app "CuraSense Beta" currently talks to the development server (port 5001, the development database). To show it against this production server, rebuild it with `EXPO_PUBLIC_API_URL=http://<this Mac's address>:8080` (the build recipe is in `HANDOFF.md`, section 16). The website needs nothing like that: it was built for whatever address it is opened on.

## What people will meet

- **Sign-up needs an authenticator app** (Google Authenticator, Microsoft Authenticator, 1Password and so on): the sign-up asks them to scan a QR code, and every sign-in asks for the six-digit code. Sign up once yourself before the session, on your own phone, so you have an account to show.
- **The AI** reads symptoms, scans and lab reports and answers in about 10 to 20 seconds for symptoms, longer for large files. It is informational and every result says so.
- **Marked as demonstrations on screen**: booking an appointment (saved in the browser only, no doctor, no email), the wearable readings in Settings (generated numbers, not from a watch), and the AI preferences in Settings (saved, but the AI does not use them yet).
- **Password reset is off.** It needs a mail service, which does not exist yet, so the reset screen says it is not set up. If someone loses a password, delete their account in the Overwatch page and let them sign up again.
- **Overwatch (admin)**: sign in with the admin email and password in `backend/.env.production`. Open the file yourself (`open -e backend/.env.production`) and keep it off the projector.

## Where the data is

The server uses its own database, `curasense_live`. Your development data in `medical_ai_db` is not touched. To start again from nothing, stop the server and run:

```bash
mongosh mongodb://localhost:27017/curasense_live --eval 'db.dropDatabase()'
```

That deletes every account and every saved analysis in it. The admin account is created again at the next start. To keep a copy first: `mongodump --db curasense_live --out ~/curasense-backup`.

## Cost and limits

Every analysis calls the DeepSeek API, which costs money. Each account can run 20 analyses per tool every 10 minutes, and one network address can create 60 accounts an hour (`REGISTER_LIMIT_PER_HOUR` raises that for a venue where many people share one address). Set a monthly spending limit in the DeepSeek dashboard before more than a handful of people use it.

## Going public (not done; it needs your go-ahead)

The same build runs on a hosting platform. What it needs, none of it set up yet:

- A host for the Node service and one for the Python service (Railway was your earlier pick), a MongoDB they can reach (Atlas or the host's own), and a domain with HTTPS. Phones and strangers need HTTPS.
- Node service, in `backend/node`: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET` (32 characters or more), `GATEWAY_SECRET`, `PYTHON_AI_URL` (the Python service's private address), `ADMIN_EMAIL` and `ADMIN_PASSWORD` (12 characters or more), `STATIC_DIR` (the built website), `TRUST_PROXY=1`.
- Python service, in `backend/python`: the same `GATEWAY_SECRET`, `DEEPSEEK_API_KEY`, `AI_HOST=0.0.0.0` and `AI_PORT` as the host assigns. Keep it on the private network, not on the internet.
- The website is built in `frontend` with `VITE_NODE_BASE_URL= npx vite build --outDir dist-web` (the empty value means "my own address"). The Node service finds it through `STATIC_DIR`.
- The phone app is rebuilt with `EXPO_PUBLIC_API_URL` set to the https address.

This recipe has not been tried on a host. The rate limits and the sign-in checks assume `TRUST_PROXY=1` behind a proxy.

## Before real users arrive

- Delete the old admin account `Curasense_D_Hawk` from any database that has it, or give it a new password by setting `ADMIN_EMAIL` to its address and `ADMIN_PASSWORD` to a new one. Its old password was written in the source code and is in the git history, so treat it as public.
- Write the privacy notice: what people type and upload goes to the DeepSeek API.
- Decide on password reset (needs a mail service) and on account deletion (the app stores need it; the website has none yet).
- Accounts that stopped sign-up at the authenticator step can sign in with the password alone. Deleting such accounts, or requiring the authenticator step at sign-in, closes that.
