# CuraSense: full project handoff

Written 2026-11-11 for whoever continues this project next: a new AI session or a developer. Paste it as the first message of a new session, or read it once from top to bottom. It says what the website is, how each part works, what was changed and why, what has been verified and what has not, and how the owner likes to work.

It contains no secrets. Environment variables are listed by name only, and the known security gaps point at files instead of repeating credentials. Do not add any to this file.

All paths are relative to the project root `CuraSense-main/` (on the owner's Mac: `~/Downloads/CURASENSE/CuraSense-main`).

## Contents

0. Read this first (state of the repo and the working agreements)
1. What CuraSense is
2. Stack and versions
3. Repository layout
4. Running, configuring and testing it
5. Architecture: the request chain, auth, API, data
6. The AI pipeline in detail (Symptoms, Scans, Reports)
7. The frontend in detail
8. Visual systems: themes, 3D scenes, animation, loading page
9. Tests and how to verify changes
10. Work log, oldest to newest
11. Known issues, risks and technical debt
12. What has not been verified
13. Open items and suggested next steps
14. First ten minutes for a new session
15. The iPhone and Android apps (added 2026-11-12)

---

## 0. Read this first

### State of the repository (2026-11-11)

- Branch `redesign/immersive-3d`. Last commit `05f74242` (2026-10-28), 38 commits in total. Remote branches: `origin/main` and two `railway/code-change-*` branches.
- **Everything done since 2026-10-28 is uncommitted.** `git status --short` lists 75 entries: 48 modified or deleted tracked files (+1,358 / -2,080 lines) and a large set of new untracked files. The untracked files include some that the product cannot run without: `backend/python/app/services/documents.py` and `routing.py`, the three Python test files, all of `frontend/src/app/features/site/`, `frontend/src/app/scenes/`, `components/intro/`, `components/flow/`, the loading page (`LoadingStage.tsx`, `loading-stage.css`, `plasma-orb/`), five new CSS files, e2e specs 05 to 09, `scripts/` and `graphify-out/`.
- Added on 2026-11-12, also uncommitted: `frontend/ios/`, `frontend/android/`, `frontend/assets/`, `frontend/capacitor.config.json`, `frontend/e2e/10-mobile.spec.ts`, `frontend/src/app/native/`, `frontend/src/styles/native.css` and `NATIVE.md` (section 15).
- Treat the working tree as the only copy of that work. Do not run `git checkout .`, `git restore`, `git stash`, `git clean` or `git reset --hard` unless the owner says so explicitly. Do not commit unless asked. Whoever commits should split the work into logical commits (the work log in section 10 is a good guide).
- Files deleted on purpose in this work: `animations/presets/pageTransition.ts`, `backgrounds/CinematicSequence.tsx`, `backgrounds/SmoothScroll.tsx`, `backgrounds/SystemBootSequence.tsx`, `features/auth/WelcomeScreen.tsx`. The old Elastic Mesh, Ember Eclipse, Opal Loop and Ember Sun HorizonX drops were also removed (never committed).

### Working agreements with the owner

These come from the owner's own instructions and corrections. Follow them.

1. **Their dev servers are theirs.** The owner runs the app on ports 8000 (Python), 5001 (Node) and 5173 (Vite). Never kill or restart those, and never test against them with data. Test on separate ports with a scratch database (for example Python 8001, Node 5201 with its own `JWT_SECRET`, database `curasense_verify`), then stop what you started and drop the scratch database. The Playwright suite already uses its own isolated stack (section 9).
2. **Never send the owner's own files to an AI service without asking.** They chose synthetic test files for all AI testing. For example `~/Downloads/PO10004863304-244.pdf` must not be run through the AI. Build test files yourself.
3. **Never print or copy secrets.** `backend/.env` holds real keys. Talk about key names only.
4. **Backend edits need a restart that only the owner can do.** `uvicorn` runs without reload and Node runs without `--watch`. After any change under `backend/`, tell the owner to press Ctrl-C in the terminal running `./start-dev.sh` and start it again. Always say so.
5. **Subjective design choices: ask first, with previews.** Use a question tool with 2 concrete options and previews. The owner said "ask questions if u have doubts" and picked one of two concepts. They reject work bluntly when it reads as clip-art (see 8.7).
6. **The landing hero must stay a recognisable living cell.** Data-visualisation morphs of it were rejected.
7. **Text over 3D needs a glass plate.** Bare small copy on top of a 3D scene was rejected. Use `data-lg="plate"` and check both themes.
8. **Check visuals in both themes and on a real GPU.** Software GL (SwiftShader) gave a false pass once. Use headless Google Chrome on Metal with the Display P3 colour flag (recipe in section 9). Reproduce the owner's screenshot first, then fix.
9. **Copy must stay code-backed.** Never write claims the code does not support: HIPAA, GDPR, SOC or ISO, "encrypted", "human in the loop", ICD-10 or SNOMED, AUC or F1 figures, "under 4 seconds", heatmaps or ROI boxes, "ResNet", real bookings, real wearable sync. The safe claims list is in 7.2.
10. **Do not edit source while a Playwright run or a GPU measurement is in flight.** Vite hot reload gives stale-selector failures and skewed numbers.
11. **Do not re-list old limits as unsolved.** The owner asked twice to fix the AI limits ("I want no loopholes"); every limit listed was attempted. Section 6 says what is measured. Do not ask again about answers already given (the owner's decisions are in section 10).
12. **Reply style.** Terse, answer first. Smallest complete change. Leave one small test for any non-trivial logic. Mark a deliberate shortcut with a comment `shortcut: <the limit>, <when to upgrade>`. End each reply with one or two lines on what was skipped, what was not verified, and any risk. Comments, docs and commit messages are written in plain prose. (The owner runs Claude Code with two style plugins, a terse "caveman" voice and "ponytail ultra"; another tool can ignore the plugin names and keep the behaviour.)
13. If you must refer to a person whose pronouns you do not know, use they/them.

The owner's machine: MacBook Air (Apple M5, fanless), built-in 2880x1864 display at 60 Hz, Chrome (about version 155 to 156), running `npm run dev` (dev mode, not a build).

---

## 1. What CuraSense is

A medical AI web app. A signed-out visitor sees a public marketing site (Home, Platform, Approach, Access) with a 3D living cell on the landing page and a sign-in/sign-up dialog. A signed-in user gets:

- **Dashboard**: counts of analyses (all time, today), average confidence, quick actions, breakdown by type, recent analyses.
- **Analyze**: three AI tools in tabs.
  - **Symptoms**: pick from 197 symptoms in 14 categories and/or type custom ones; the AI returns conditions with probabilities, an urgency level (low, medium, high, emergency) and recommendations.
  - **Scans**: pick one of about 60 studies (X-ray, CT, MRI, ultrasound, PET/nuclear, mammography, other); upload an image, DICOM, a ZIP of a study, a scanned PDF or a written report; the AI reads it as a radiologist would. Each page of a file is checked on its own and refused (with a button to the right page) if it is not the selected kind of scan.
  - **Reports**: paste lab report text or upload almost any document; the AI extracts biomarkers with ranges and flags and writes an assessment.
- **History**: all saved analyses, with a detail panel and a "like" filter.
- **Book appointment**: a browser-only simulation of booking a consultation (no backend, stored in `localStorage`, and the UI says so).
- **Settings**: identity, AI preferences (explain level, output depth), dependents, emergency contacts, language (10 languages), measurement units, high contrast, large text, connected devices (wearables), and admin global controls for admins.
- **Overwatch** (admin only): platform stats, user list with delete, latest predictions.

The AI output is informational and is shown with disclaimers. It is not a medical device.

Dark and light themes only. English plus nine translations (partial coverage).

---

## 2. Stack and versions

| Layer | What | Notes |
|---|---|---|
| Frontend | React 18.3.1, TypeScript, Vite 6.3.5, Tailwind 4.1.12 (`@tailwindcss/vite`) | Single page app, no router library for the signed-in app; the public site has its own tiny History API router |
| UI kit | Radix UI primitives with shadcn-style wrappers in `components/ui/` (48 files), lucide-react icons | Most wrappers are unused by features |
| 3D | three 0.184, @react-three/fiber 8, @react-three/postprocessing 2; raw WebGL for page backdrops | `@react-three/drei` is installed but not imported |
| Animation | gsap 3.15 (primary), animejs 4, motion 12 | GSAP is used in 27 files |
| Other | input-otp (six-box code), react-hook-form, sonner, recharts, cmdk, vaul, embla, @rive-app/react-canvas, @tsparticles | Several only appear through the `components/ui` wrappers |
| Backend API | Node (ESM) with Express 4.19, Mongoose 8.4, bcryptjs 2.4, jsonwebtoken 9, speakeasy 2 + qrcode (TOTP), multer 2.5, cors, dotenv, nodemailer (installed, unused) | Node 26.3 on the owner's machine |
| AI gateway | Python 3.12 FastAPI + uvicorn, requests, pymupdf, pydicom (+ pylibjpeg codecs), pillow, pillow-heif, numpy, pydantic, python-multipart, python-dotenv | Virtualenv at `backend/python/.venv` |
| Database | MongoDB 8 (brew service `mongodb-community@8.0`) | Collections `users` and `predictions` |
| AI models | DeepSeek (the only real key): `deepseek-v4-pro` (text only, reasons for a long time) and `deepseek-flash` (text and images). Fallback chain Hugging Face (Mistral 7B, Pixtral 12B), Mistral API, Groq (Llama 3.3 70B, Llama 4 vision) | HF, Mistral and Groq keys are placeholders, so everything runs on DeepSeek |
| Tests | Python `unittest` (104), Node `node --test` (16), Playwright (41) | Section 9 |
| Phone apps | Capacitor 8.6 (core, app, keyboard, splash-screen; SystemBars is in core) wrapping the built website; `@capacitor/assets` for icons and splash | Xcode project in `frontend/ios` (Swift Package Manager), Android Studio project in `frontend/android`; Inter is self-hosted (`@fontsource-variable/inter`) |

Oddities: `frontend/package.json` is named `@figma/my-make-file` (the project began as a Figma Make export) and lists server packages (express, cors, mongoose, bcryptjs, jsonwebtoken, nodemailer, dotenv) that the frontend never imports. `@mui/*`, `@splinetool/*`, `react-dnd*`, `react-slick` and `date-fns` are installed but never imported outside `src/legacy`. The repo root also has a `pnpm-workspace.yaml` and `frontend/node_modules` are symlinks into the root `node_modules/.pnpm`, yet scripts use `npm`.

---

## 3. Repository layout

```
CuraSense-main/
├─ start-dev.sh            one-command launcher (Python 8000, Node 5001, Vite 5173)
├─ START.md                how to use the launcher (current)
├─ HANDOFF.md              this file
├─ CHANGELOG_REFACTOR.md   2026-10-28 refactor log, phases 1-4 and the UI/UX rebuild (accurate history)
├─ REDESIGN_PLAN.md        2026-10-28 phase 0 audit and redesign plan
├─ README.md, RUNNING.md, PROJECT_SUMMARY.md, QUICK_START.md, SETUP_INSTRUCTIONS.md,
│  BACKEND_SETUP.md, AI_MODELS_GUIDE.md, IMPLEMENTATION_GUIDE.md, FEATURES_CHECKLIST.md
│                          STALE (2026-05-26): describe "MediAI Pro" on Supabase, which no longer exists
├─ supabase/, utils/supabase/   dead code from that older build (zero live imports)
├─ guidelines/Guidelines.md, ATTRIBUTIONS.md   Figma Make leftovers
├─ dist/                   old build output (gitignored)
├─ graphify-out/           knowledge graph of the repo (GRAPH_REPORT.md, graph.html, graph.json); untracked
├─ scripts/                graphify_live.py (file watcher), graphify_supplement.py; untracked
├─ backend/
│  ├─ .env                 shared by Node and Python (key names in section 4); gitignored
│  ├─ node/                Express API
│  │  ├─ server.js, app.js            entry and app assembly (/health lives in app.js)
│  │  ├─ src/config/                  env.js, db.js
│  │  ├─ src/models/                  User.js, Prediction.js
│  │  ├─ src/middleware/              auth.js, rateLimit.js, upload.js
│  │  ├─ src/controllers/             auth, password, analysis, prediction, admin, settings, wearable
│  │  ├─ src/routes/                  one router per domain + index.js
│  │  ├─ src/services/pythonAiClient.js   the only code that talks to the Python gateway
│  │  └─ test/ai-proxy.test.js        16 tests
│  └─ python/              FastAPI AI gateway
│     ├─ main.py                      app, CORS (none by default), /health, port 8000
│     ├─ app/config.py, deps.py       keys and model names; gateway bearer check
│     ├─ app/routers/                 symptoms.py, imaging.py, lab_report.py
│     ├─ app/schemas/                 pydantic payloads
│     ├─ app/services/
│     │  ├─ chat.py                   provider fallback chain
│     │  ├─ providers/                deepseek.py, huggingface.py, mistral.py, groq.py
│     │  ├─ documents.py              reads any file into pages (686 lines)
│     │  ├─ image_detect.py           what is this page? (type, regions, lab_score)
│     │  ├─ routing.py                page gating, region table, refusals with redirects
│     │  ├─ radiology.py              Scans read
│     │  ├─ lab_parser.py             Reports read
│     │  ├─ triage.py                 Symptoms read, with an offline rule-based fallback
│     │  └─ image_utils.py            detect_mime
│     └─ test_routing.py (62), test_deepseek.py (11), test_reports.py (31), test_models.py (old connectivity script, not a unit test)
└─ frontend/
   ├─ index.html           CSP meta, no-flash theme bootstrap script, fonts
   ├─ vite.config.ts, playwright.config.ts, package.json
   ├─ e2e/                 specs 01-09, fake-ai.mjs (fake gateway), helpers.ts, global-setup.ts
   └─ src/
      ├─ main.tsx          mounts ErrorBoundary > AppSettingsProvider > App; calls watchFrames()
      ├─ app/App.tsx       the shell (589 lines): public vs signed-in, header, tabs, arrival overlays
      ├─ app/themes.ts     dark and light variable maps
      ├─ app/state/AppSettingsContext.tsx   settings, language, accessibility, sync with the DB
      ├─ app/i18n/translations.ts           10 languages
      ├─ app/services/api/                  fetch wrappers (client, auth, password, predictions, settings, wearables, admin, health)
      ├─ app/features/                      site/ (public), auth/NarrativeReel, dashboard, symptom-checker, image-analysis,
      │                                     report-analysis, history, booking, settings, admin
      ├─ app/components/                    shared/ (loading page, notices, profile), intro/, flow/, backgrounds/, ui/ (shadcn)
      ├─ app/scenes/                        cell/ (landing living cell), PageScene (per-tab particles), backdrops/ (public page shaders)
      ├─ app/animations/                    gsap and anime engines, hooks, device tier, frame rate
      ├─ styles/                            index.css (854 lines, global overrides), theme, typography, site, site-pages,
      │                                     landing-ui, liquid-glass, intro, cell-scene, tailwind
      └─ legacy/_unused/                    21 quarantined files with zero importers; has pre-existing type and lint errors
```

---

## 4. Running, configuring and testing it

### Run everything

```bash
cd ~/Downloads/CURASENSE/CuraSense-main
./start-dev.sh          # Ctrl-C stops all three
```

It runs, each in its own folder: `backend/python` `.venv/bin/python main.py` (port 8000, hard-coded), `backend/node` `node server.js` (port 5001 from `backend/.env`), `frontend` `npm run dev` (Vite, port 5173). It refuses to start while one of those ports is held, so you never look at old code by accident. MongoDB must be running (`brew services start mongodb-community@8.0`). Details and the one-time setup are in `START.md`.

One-time setup on a fresh clone:

```bash
cd backend/node && npm install
cd ../python && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cd ../../frontend && npm install
```

### Environment variables (names only)

`backend/.env` (loaded by both Node and Python): `MONGODB_URI`, `PORT`, `PYTHON_AI_URL`, `JWT_SECRET`, `GATEWAY_SECRET`, `SMTP_USER`, `SMTP_PASS` (unused), `HF_TOKEN`, `GROQ_API_KEY`, `MISTRAL_API_KEY`, `DEEPSEEK_API_KEY`. Optional: `DEEPSEEK_TEXT_MODEL`, `DEEPSEEK_FAST_MODEL`, `HF_TEXT_MODEL`, `HF_VISION_MODEL`, `CORS_ORIGINS` (Python). `backend/python/.env.example` is a template. Only `DEEPSEEK_API_KEY` is a real key; the others are placeholders that `config.py` recognises and ignores. `frontend/.env`: `VITE_NODE_BASE_URL` (defaults to `http://localhost:5001`).

### Build and checks

```bash
cd frontend
npm run build                      # vite build; passes
npm run test:e2e                   # Playwright, isolated stack (needs MongoDB running)
node ../node_modules/.pnpm/typescript@*/node_modules/typescript/bin/tsc --noEmit -p .    # 39 errors, all pre-existing
npx eslint 'src/**/*.{ts,tsx}'     # 11 problems (5 errors, 6 warnings), all pre-existing
cd ../backend/node && npm test                                                            # 16 tests
cd ../python && .venv/bin/python -W ignore -m unittest test_routing test_deepseek test_reports   # 104 tests
```

`npx tsc` does not work in `frontend/` because TypeScript is not a dependency; use the path above and always count the errors (a `grep` over empty output hides a missing compiler). The 39 tsc errors are React Three Fiber JSX typing (`group`, `mesh`, `points` not in `JSX.IntrinsicElements`) in `scenes/cell` and `PageScene`, one `q.dpr` type in `CellScene`, and `src/legacy/_unused`. The ESLint problems are missing `react-hooks/exhaustive-deps` rule definitions in `scenes/cell/parts.tsx`, `process is not defined` in `e2e/fake-ai.mjs`, and legacy files. Neither number was changed by the recent work.

Ports: Python 8000, Node 5001, Vite 5173. Playwright's own stack: fake AI 8101, Node 5101, Vite 5273, database `curasense_e2e`.

---

## 5. Architecture: the request chain, auth, API, data

### The chain

```
browser ──► Node API (5001) ──► Python AI gateway (8000) ──► DeepSeek (https, api.deepseek.com)
 JWT          verifyToken            Bearer GATEWAY_SECRET          (fallbacks: HF, Mistral, Groq)
 uploads      per-user rate limit
              byte-sniffed upload rules
```

The browser never calls Python. The gateway secret lives only in Node (`src/services/pythonAiClient.js`) and Python. Node waits 60 s for symptoms, 90 s for pasted lab text, and 240 s for scan or report files.

### Auth

- Passwords: bcryptjs, 10 salt rounds.
- Sign-up: `POST /register` returns a 15-minute **setup token** (`purpose: totp_setup`); `POST /totp-setup` returns the QR code, `otpauth` URL and manual secret (issuer "CuraSense"); `POST /totp-verify` with the six-digit code enables 2FA and returns the full token.
- Login: `POST /login` checks the password. If the user has 2FA it returns `{ requiresTotp: true, totpToken }` (15 minutes, `purpose: totp_login`); `POST /login-totp` with the code returns the full token. (A user without 2FA gets the full token directly; this legacy path is not covered by e2e.)
- Full token: 24 h, claims `_id` and `role`. `verifyToken` rejects any token that carries a `purpose` claim (403 "Wrong token type."), which closed a 2FA bypass on 2026-10-28.
- TOTP: speakeasy, window of 1 step either side (30 s steps, 6 digits).
- `verifyAdmin` checks `role` from the token. `requireMongo` returns 503 when the database is down.
- Password reset (`/forgot-password`, `/verify-reset-code`, `/reset-password`): 6-digit code, 30 minutes, new password at least 6 characters. See section 11 for the gaps.

### Node API

| Method and path | Auth | What it does |
|---|---|---|
| `GET /health` | none | `{ python, server, mongo, uri }`; the site's status pill and the Access page read it |
| `POST /register`, `/totp-setup`, `/totp-verify`, `/login`, `/login-totp` | none or purpose token | Sign-up and sign-in as above |
| `POST /forgot-password`, `/verify-reset-code`, `/reset-password` | none | Password reset |
| `POST /analyze-symptoms` | JWT, rate limit | JSON `{ symptoms }` (string or array, at most 2,000 characters). Adds the user's wearable baseline from MongoDB when synced. Proxies to Python |
| `POST /analyze-image` | JWT, rate limit, upload rules | multipart: `file`, `scan_type`, `study`, `regions`, `context`. `scan_type` and `regions` are checked against fixed lists |
| `POST /analyze-report` | JWT, rate limit | JSON `{ reportText, context }` (at most 60,000 characters) or multipart `file` + `context` |
| `POST /save-prediction`, `GET /predictions`, `DELETE /predictions/:id` | JWT | The user's saved analyses |
| `GET /api/user/settings`, `PATCH /api/user/settings` | JWT | Settings in MongoDB (the source of truth; localStorage is a cache) |
| `POST /api/wearables/apple-health/sync`, `GET .../status` | JWT | Stores biometrics pushed by a client; there is no real HealthKit link |
| `GET /admin/stats`, `/admin/users`, `/admin/predictions`; `DELETE /admin/users/:id` | JWT + admin | Overwatch |

Rate limit: `middleware/rateLimit.js`, fixed window per user id, 20 calls per 10 minutes on each AI route (one bucket per tool), in memory (per process). `express.json` accepts up to 50 MB.

Upload rules (`middleware/upload.js`, multer in memory, kind decided by **magic bytes**, never the extension or declared type):

- Kinds sniffed: image (JPEG, PNG, WebP, TIFF, BMP, GIF), HEIC/HEIF (ftyp brands), DICOM, ZIP (which covers Word, Excel, PowerPoint and OpenDocument), PDF, old Office (OLE), and text (BOM, HTML, RTF heads, or by extension).
- `imaging`: 25 MB per file, 60 MB for a ZIP; kinds image, DICOM, ZIP, PDF, text.
- `labReport`: 25 MB per file, 40 MB for a ZIP or Office file; kinds image, ZIP, PDF, text, OLE.
- Errors: 413 "File too large (max X MB, or Y MB for a ZIP or Word / Excel file)."; 415 "Unsupported file type. Upload <hint>." (a disguised non-image on Scans is rejected, covered by e2e).

### Data (MongoDB)

- `User`: `name`, `email` (unique), `password` (bcrypt), `role` (`user` or `admin`), `resetCode`, `resetCodeExpiry`, `totpSecret`, `totpEnabled`, `createdAt`, `settings` { `aiPreferences` {explainLevel clinical|simple, outputDepth concise|comprehensive}, `dependents[]`, `emergencyProtocols` {contacts[], autoAlertsEnabled}, `localization` {measurementStandard, language, highContrast, largeText} }, `wearableData` {restingHeartRate, heartRateVariability, sleepDuration, bloodOxygenAverage, lastSyncedAt}.
- `Prediction`: `userId`, `type` (`symptom`, `image` or `report`), `diagnosis`, `confidence`, `details`, `recommendations[]`, `timestamp`, `liked`, `urgency` (low, medium, high, emergency), `conditions[{name, probability}]`, `biomarkers[{name, value, unit, status, normal_min, normal_max}]`, `scanSections[{title, findings[]}]`.
- On start-up Node seeds one admin account if it does not exist (see section 11).

### Python gateway

- `GET /health` (no auth): `{ status, service, ai_keys_loaded }`.
- `POST /api/v1/diagnostics/symptoms` (JSON), `/imaging` (form: `patient_id`, `scan_type`, `study`, `context`, `regions`, `file`), `/lab-report` (JSON text), `/lab-report-file` (form: `patient_id`, `context`, `file`). All require `Authorization: Bearer <GATEWAY_SECRET>`.
- Handlers are plain `def`, so FastAPI runs the blocking AI calls in its thread pool.
- No CORS origins by default (`CORS_ORIGINS` opts in).

---

## 6. The AI pipeline in detail

### 6.1 Providers and the DeepSeek client

- `chat.chat()` and `chat.vision()` try DeepSeek, then Hugging Face, then Mistral, then Groq. Providers without a real key skip at once. `think=False` turns DeepSeek reasoning off, `fast=True` skips the pro model, `patient=True` lets a long structured answer take minutes.
- `deepseek-v4-pro` is text only and slow; `deepseek-flash` takes images. Both count reasoning tokens against `max_tokens`. With 3,000 tokens 3 of 8 scan reads came back empty, so empty or truncated answers are asked again with the budget doubled up to `MAX_TOKENS_CAP = 32000`.
- Calls are streamed with an idle timeout (`IDLE = 40` s) and an overall deadline. Text plans: `(pro, 35 s), (flash, 20 s)` normally, `(pro, 150), (flash, 100)` for patient calls. Vision uses flash with a 120 s total. Clinical reads run up to 24 at a time (`documents.READ_WORKERS`, provider cap `_SLOTS` 24); the quick labelling steps run 8 at a time (`documents.WORKERS`).
- **The 2026-11-11 stall finding.** About one in two NEW connections to api.deepseek.com (one CloudFront address) never completed that day: the connection was never answered, or the request upload hung, while healthy calls answered in 0.5 to 1 s. In `requests` the connect value of `timeout=(connect, read)` also bounds the SEND phase, so a stalled upload shows up as `Read timed out. (read timeout=<the connect value>)`. That odd message is the tell. The old code gave up on the first timeout, which surfaced as "The AI model failed to return a response" on Scans. The fix in `providers/deepseek.py`: `CONNECT = 6`, `ATTEMPTS = 6`, every `requests.RequestException` is retried at once on a fresh connection (no pause), HTTP 429/500/502/503/504 are retried with a short pause (a 400 is not), each wait is capped by the call's remaining budget. `test_deepseek.py` covers it (11 tests). To diagnose a similar report, time raw calls first (curl phase timings, a spy around `requests.post`) before touching gating logic.

### 6.2 Reading any file: `documents.py`

`documents.load(bytes)` returns a `Doc(pages, total, notes)` of `Page(n, image, text, dicom, name)`.

| Input | How it is read |
|---|---|
| PDF | pymupdf; typed pages give text, scanned pages are rendered to pictures; garbled text is detected (`_garbled`) and the page is read as a picture; password-protected PDFs are refused with a message |
| Images | JPEG, PNG, WebP, TIFF (every frame), BMP, GIF, HEIC/HEIF (pillow-heif; if the plugin is missing a clear message) |
| DICOM | pydicom; also files without the preamble (needs SOPClassUID or Modality); header decides modality and, through `_REGION_WORDS` on BodyPartExamined, the body region, without AI; a lone DICOMDIR gets an explanation and is skipped inside a ZIP |
| Word, Excel, PowerPoint, OpenDocument | the ZIP XML parsed with the standard library (tables kept, spreadsheets capped at 20,000 rows, 60 MB of XML); a scan pasted into a Word file is read as a picture |
| RTF, HTML (table cells kept per row), CSV, TSV, JSON, XML, plain text | decoded as UTF-8 (BOM), UTF-16 or cp1252 |
| ZIP | each member read by content; DICOM grouped by SeriesInstanceUID, sorted by InstanceNumber, 8 evenly spaced per series, labelled for example "Series 1 (CT chest, 8 of 30 images)"; other app ZIPs refused with "This is an app or Office file this page cannot read. Save it as PDF and upload that." |
| Old `.doc`, `.xls`, `.ppt` (OLE) | an instant message asking for a save as PDF or the newer format |

Limits: 40 pages (`MAX_PAGES`, loud refusal above that), 200,000 characters of text, ZIP of at most 3,000 files, 600 MB unpacked, 100 MB per member (declared sizes are enforced because `zipfile` cuts the stream there).

### 6.3 Deciding what a page is: `image_detect.py` and `routing.py`

- Every PDF page, TIFF frame and DICOM frame is judged on its own. A labelling look asks the fast model (reasoning off, a 768 px copy because full-size copies from 24 parallel uploads timed out) for the page type and up to 3 body regions from a closed list. Three votes; a split gets 4 more looks first; still unsure means refuse (**fail closed**).
- `routing.MODALITIES` lists the 12 types (xray, ct, mri, ultrasound, nuclear, mammogram, skin_lesion, ecg, endoscopy, retinal, dexa, fluoroscopy) and `ALSO_OK` the allowed look-alikes (PET-CT, barium studies). `routing.REGIONS` is the closed list of 13 body regions (head, neck, chest, heart, breast, abdomen, pelvis, spine, upper_limb, lower_limb, whole_body, eye, skin).
- The AI never sees which study the user chose. The study's regions are the table `IDS_BY_REGION` in `ImageAnalysis.tsx` (`whole_body` accepts any region; a study not listed, such as skin, retinal, ECG, endoscopy, angiogram, EUS or capsule, accepts any). `routing.region_ok` compares the two with no AI. `_BORDERS` is short on purpose: chest~abdomen, upper_limb~chest and pelvis~lower_limb each let a wrong body part through when measured.
- `routing.refuse(message, page, scan_type)` returns `{ "error": message, "redirect": { "page": "symptoms"|"scans"|"reports"|null, "scan_type": ... } }`. The frontend turns that into `WrongPageNotice` with a button "Open <page> page".
- `lab_score(text)` decides lab-ness without AI: it counts number-plus-unit results with any separator (tab, pipe, comma; OCR changes its table format from run to run) or at least three lab test names plus digits.

### 6.4 Scans: `radiology.analyze_scan`

1. Load pages, label each, keep the pages that fit the selected study (`routing.sort_pages` with `check_scan`); refuse the whole file with a redirect if none fit; pages that do not fit are listed in the notes.
2. Read every kept image page (and the written-report pages together as one document) with the fast model **with reasoning on** (measured: with reasoning off an Osgood-Schlatter knee became an "urgent avulsion fracture"). The prompt starts "STEP 1 - what is this file" and the model answers `NOT_A_MATCH: reason` if the file is not the selected scan (a second gate: wrong region caught 14 of 14 with this wording, 9 of 14 with "if it does not match, say so").
3. Join the reads into markdown (`### title` per page, a "Not analysed / notes" section). Returned inside `vision_analysis`: `detected_kind`, `detected_confidence`, `detected_reason`, `scan_type_used`, `analysis` (markdown), `pages {analysed, skipped, total}`, `model`. Errors come back as `{ error }` or with a `redirect`.

### 6.5 Reports: `lab_parser`

- Paste path: `analyze_lab_report(text, context)`, then the compact biomarker call below.
- File path: `analyze_lab_report_file`: **every page to text first** (typed pages instantly; scanned pages transcribed in parallel by the fast model with reasoning off, a failed page asked once more and named in the notes if it still fails), then `lab_score` over the texts. If the file looks like a lab report the texts go to **one** call to the fast model (reasoning on) that returns compact arrays `[name, value, unit, min, max, status]` plus assessment, confidence, urgency and recommendations. If the file has no lab values it is judged once (a text sample, or its first two pictures): an X-ray is redirected to Scans, other content is refused.
- Status flags are recomputed in code from value and range (critical beyond 1.5 times the upper bound or under 0.5 times the lower). Rows that are not numbers (Positive, blood group) are skipped, never turned into zeros; a lower bound alone ("> 40") still sets low or normal.
- Result: `analysis { assessment, confidence, urgency, biomarkers[], recommendations[] }`.
- Measured: the same 91 markers extracted identically by pro-verbose, flash-verbose and flash-compact; compact took 3 to 13 s against 19 to 120 s. A direct vision-to-JSON read for one scan was rejected (5 s up to a 100 s failure) in favour of OCR then text (11 to 13 s every time). Through Node: Word, RTF, HTML and UTF-16 text 4 to 7 s, a typed PDF 3 s, a phone photo 11 s, a 67-marker panel 18 s, a 12-page scan 23 s, a 19-page non-lab PDF refused in 1.2 s.

### 6.6 Symptoms: `triage.analyze_symptoms_with_mistral`

(The function name is a leftover; it uses the shared chain.) One JSON-mode call; the model may answer `not_symptoms` with `belongs_on` (reports or scans), which becomes a refusal with a redirect. Output: `{ assessment, confidence, urgency, conditions[{name, probability 0-100}], recommendations[] }`, wrapped by the router as `{ status, module, analysis, result }`. If no AI provider answers, `_local_triage_fallback` returns a rule-based result with confidence 55 (this is the "offline triage" the owner once complained about, which happened because the AI was failing).

### 6.7 Measured results (2026-11-10)

Type detection 51 of 52 real images; 216 of 232 under rotate, flip, blur, noise, invert, viewer frame, wrong caption and a "ignore instructions" overlay (0 prompt-injection successes; 24 of 24 non-medical files refused even with a fake "CT scan" caption). Region table: 0 of 32 matching studies refused, 1 of 30 wrong studies let through. Second gate alone: wrong modality 13 of 14, wrong region 14 of 14, non-medical 6 of 6. A 40-page scan PDF reads every page with reasoning in 44 s (62 s through Node). Known bad fixtures for any eval: one "MRI abdomen" sample is really a brain MRI, one "nuclear bone" sample is a resolution figure, `samples/ct.png` is a viewer screenshot that flips between CT and MRI.

---

## 7. The frontend in detail

### 7.1 The shell: `App.tsx`

Two trees. **Signed out:** `AuroraBackdrop`, `InteractionLayer`, `ElementTransitions`, `PublicSite`, the first-visit `IntroSequence` and the arrival overlay. **Signed in:** header with a sliding nav pill, mobile drawer, scroll-progress rail, `PageScene` and `LiquidFlow` behind the content, the six tabs below, the arrival overlay.

Signed-in navigation is state (`activeTab`: dashboard, analyze, history, booking, settings, admin), not URLs. The Analyze tab holds sub-tabs (`analyzeTab`: symptoms, image, report). A door clicked on the landing page stores `curasense_intent` in `sessionStorage`; after login the app opens Analyze on that tool.

Predictions: loaded from `GET /predictions`, merged with a per-user cache in `localStorage` (`curasense_pred_<userId>`) so fields missing on the server survive. New analyses go through `savePrediction`.

### 7.2 Public site (`features/site/`)

`PublicSite.tsx` (shell, lazy pages, title and description per route), `router.tsx` (own History API router: `/`, `/platform`, `/approach`, `/access`), `SiteNav.tsx` (brand and ACTIVE pill left, links with a sliding pill, theme toggle and Sign in/up right, drawer under 880 px), `SiteFooter.tsx`, `HomePage.tsx` (greeting, two buttons, three "doors" into the tools; the cell stays clear on the right), `pages/PlatformPage.tsx`, `ApproachPage.tsx`, `AccessPage.tsx` (with a live system check), `ui.tsx` (Reveal, PageHero, PageIndex, LiveStatus), `SystemStatus.tsx` (one shared `/health` poller, the status pill), `AuthDialog.tsx` (Radix dialog holding all login, sign-up, forgot-password and 2FA state; opens from any page with `onOpenAuth(mode, intent?)`), `AuthStepFx.tsx`, `CodeBoxes.tsx` (six separate boxes on the `input-otp` package: paste fills all six, "372 110" works, auto-submits on the sixth digit, a wrong code shakes and clears). `features/auth/NarrativeReel.tsx` (1,302 lines) is the home page's scroll story.

Backdrops: `scenes/backdrops/` raw WebGL (`PageBackdrop`, `shaders.ts`): Platform is a lattice, Approach a flow field whose beam follows the pipeline stepper (`bus.ts`), Access a gateway ring and grid.

**Copy that is safe to write** (all code-backed): authenticator-app 2FA at sign-up (TOTP, 6 digits, 30 s, plus or minus one step); bcrypt; 24-hour sessions; AI keys only on the server; 20 AI calls per 10 minutes per user per tool; uploads checked by content (415); size limits; 197 symptoms in 14 categories; four urgency levels; lab flags recomputed in code; files are not stored; input is sent to third-party LLM providers. `NarrativeReel.tsx` still holds several unbacked figures; the owner was told, and it was not rewritten.

### 7.3 Signed-in features

- `dashboard/Dashboard.tsx` (144 lines): four stat tiles, three quick actions, type breakdown, recent analyses.
- `symptom-checker/SymptomChecker.tsx` (642): 197 symptoms in 14 categories, custom symptoms, urgency card, conditions, recommendations; passes its symptom names to the loading page.
- `image-analysis/ImageAnalysis.tsx` (805): `SCAN_TYPES` (the studies), `IDS_BY_REGION`, upload of up to the limits above, optional context, result in markdown through `MedicalAIOutput`, `WrongPageNotice` on a redirect.
- `report-analysis/ReportAnalysis.tsx` (533): paste or upload; `ACCEPTED` list of extensions, 25 MB per file and 40 MB for a ZIP or Office file checked in the browser first, old `.doc/.xls/.ppt` refused client-side with advice, a "busy service" card when the error says the AI did not respond, biomarker table.
- `history/PredictionHistory.tsx` (1,092): list, detail panel, "like" and "show liked" filter, full report view.
- `booking/ConsultationBooking.tsx` (1,360): doctor, mode, slot, confirm; a 0.9 s and 1.8 s fake delay; bookings and contact info in `localStorage` (`curasense_bookings`, `curasense_contact_info`); a visible note that it is a simulation.
- `settings/Settings.tsx` (1,188): Identity, AI Inference Preferences, Dependent and Family Management, Emergency Protocols, Localization and Accessibility, Connected Devices (heart rate, HRV, SpO2, sleep), and Admin Global Controls.
- `admin/AdminDashboard.tsx` (184): "Overwatch": counts, user list with delete, latest 100 predictions.

### 7.4 Settings and language

`state/AppSettingsContext.tsx`: `localStorage` is a fast cache (keys `cura_lang`, `cura_highContrast`, `cura_largeText`, `cura_measurement`, `cura_explainLevel`, `cura_outputDepth`, `cura_dependents`, `cura_emergencyContacts`, `cura_autoAlerts`), MongoDB is the source of truth (`syncFromDB()` on login, `clearAll()` on logout). Languages: en, es, fr, de, hi, ar, zh, ja, pt, ru (about 108 keys each in `i18n/translations.ts`); many strings inside features, including the Settings headings, are still hard-coded English, so translation is partial. High contrast and large text are real toggles.

### 7.5 Browser storage keys

`localStorage`: `curasense_token`, `curasense_user`, `curasense_theme`, `curasense_pred_<userId>`, `curasense_bookings`, `curasense_contact_info`, plus the `cura_*` keys above. `sessionStorage`: `cs_booted` (the intro played), `curasense_intent`. Logout clears the token, user and theme, calls `clearAll()` and reloads.

### 7.6 API wrappers (`services/api/`)

`client.ts`: `fetchAPI` (JSON, adds the bearer header, returns `{ data }` or `{ error }`) and `postForm` (multipart). Files: `auth.ts`, `password.ts`, `predictions.ts` (`analyzeSymptoms`, `analyzeImage(file, scanType, study, context, regions)`, `analyzeReportText`, `analyzeReportFile`, `savePrediction`, `getPredictions`, `deletePrediction`), `settings.ts`, `wearables.ts`, `admin.ts`, `health.ts`, and a barrel `index.ts`.

---

## 8. Visual systems

### 8.1 Themes and styling

- `themes.ts` has exactly two themes, `dark` and `light`, as maps of CSS variables (`--bg-base`, `--bg-surface`, `--bg-card`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent-cyan`, `--accent-violet`, `--header-bg`, status colours, shadows, `--focus-ring`). Every text pair was checked against WCAG AA. The variable name `--accent-violet` is kept for compatibility but now holds a blue (`#2667ff` dark, `#0a2472` light); `--accent-cyan` is `#87bfff` dark and `#2667ff` light.
- `index.html` carries a no-flash script that stamps `data-theme` and the paint-critical variables on `<html>` before React runs. **Keep it in sync with `themes.ts`.** Only those few variables are on `<html>` until the theme is toggled; the rest sit on the `App` wrapper div.
- Toggling the theme uses a View Transition circle reveal (`animations/presets/themeTransition.ts`). View Transitions are used nowhere else (they froze the live background on every page switch).
- Tailwind 4 plus a lot of hand-written CSS: `styles/index.css` (global overrides), `liquid-glass.css` (`data-lg` variants: bare `[data-lg]`, `plate` used in 29 places, `clear` used on the landing auth card, `inset`), `site.css`, `site-pages.css`, `landing-ui.css`, `intro.css`, `cell-scene.css`, `theme.css`, `typography.css`. Fonts: Inter and JetBrains Mono from Google Fonts. Content cards are flat tinted surfaces on purpose; only the nav, popovers and dialog blur (a blur over an animating canvas is recomputed every frame).

**Global CSS traps** (each one cost real time):

- `.cs-elem-transition { position: relative }` is added to any button, link or input on press and focus. An absolutely positioned control jumped between pointerdown and pointerup so clicks did nothing. Use selectors above one class; controls carry `data-no-cs-transition`.
- `button:not([id="theme-toggle"]) { text-transform: none !important; transition: all }` so write button labels in capitals in the data, and a GSAP tween on a button is smoothed (late) by that transition (`riseIn()` in `AuthDialog` switches transitions off for the tween).
- `input, textarea, select { background: var(--bg-surface) !important; backdrop-filter ... }` hides icons under inputs; `.lp-auth input` and `input.cb-input` override it with `!important`.
- `[data-lg][data-lg] { position: relative }` beats a plain class.
- `[role="dialog"] { background: var(--bg-card) !important }` makes anything with that role translucent or wrongly coloured. Full-screen overlays use `role="region"`; the real dialog panel is overridden in `.ad-panel[role="dialog"]`.
- Themed variables such as `--accent-*` exist on `App`'s wrapper, so anything portalled to `<body>` (overlays, `LoadingScreen`) misses them. Use `:root` tokens (`--ar-*`, `--pg-*`) or set the variable on the overlay's own container (what `LoadingScreen` does).
- A reveal uses an animation with `backwards` fill, not a transition (a transition delay lingered on hover).
- GLSL: never write `smoothstep` with edge0 greater than edge1 (undefined); use `1. - smoothstep(lo, hi, x)`.
- A freshly imported Radix package can crash once in dev ("Invalid hook call", duplicate React) while Vite re-optimises: reload, it is not a bug.

### 8.2 The landing page's living cell (`scenes/cell/`)

A procedural, bio-luminous cell: `CellScene.tsx` (327 lines, lazy chunk with post-processing and about 20 shaders), `parts.tsx`, `glsl.ts`, `neon.tsx` (the dark theme's neon plasma-globe look), `stages.ts` (scroll maps to a continuous stage index over seven page sections; Catmull-Rom keys drive camera, transform, exposure, veil and story props), `uniforms.ts`, `CellFallback.tsx`. It mounts on the first Home visit and stays mounted (paused and hidden off Home). Behind the sign-in dialog it runs slowed (about 20 fps, the `slow` prop).

Things to know before touching it:

- three flips winding for `BackSide` materials, so `gl_FrontFacing` is true there; a `BACKPASS` define flips normals instead.
- Shaders author colour in display space and decode to linear in `packOut`.
- `EffectComposer multisampling` must stay 0 (MSAA lost every additive glow on Apple/ANGLE Metal; software GL rendered it fine, so only a real GPU run catches it).
- `pow(negative, n)` is NaN. The composer buffers are half-float, so one NaN pixel got smeared by Bloom and Chrome presented a near-blank frame 2 to 4 percent of the time (the "cell flashes" bug). Everywhere: `pow(max(x, 0.), n)`; `packWith` also returns 0 on NaN or Inf.
- Dark-theme cilia once output alpha near 0 beside bright colour. On a colour-managed Display P3 screen Chrome drops pixels whose alpha is near 0, so the hairs vanished for about 1 s every 2.75 s. Fix: `a = mix(a, .06, N)` in `CILIA_FS`. Plasma rays and Halo (`neon.tsx`) still output alpha 0 and are partly dropped on P3 screens (stable, left alone).
- A resolution-only governor (`dpr` as React state, trimmed mean of 60 frames, shrinks 15% above 18.5 ms and grows below 17.2 ms) replaced an older one-way quality ladder that left transient slowdowns permanent. Tier (`getDeviceTier`) is picked once at mount; never flip post or geometry at runtime. The membrane noise lives in the vertex shader.
- Reduced motion uses `frameloop='demand'`: a prop change draws no frame, so `World` calls `invalidate()` and snaps uniforms. Strand placement is derived from the stage-3 camera at 16:10.
- The thin white wobbly arcs seen once in a screenshot never reproduced and remain UNRESOLVED. If they return, ask for scroll position, theme and whether a hard reload fixes it.
- A dev-only recorder (stripped from production): in the console, `copy(JSON.stringify(__csReport(15)))` returns frame times, event counts and uniforms.

### 8.3 Per-page scenes and backdrops

`scenes/PageScene.tsx` draws a fixed particle cloud behind each signed-in tab (`generators.ts`: dashboard a heart, analyze a helix, history a flow, booking "care", settings a cell, admin a neural net), lazy-loaded, nothing on low-tier devices or without WebGL. `components/flow/LiquidFlow.tsx` and `CellNarrator.tsx` drive the liquid-glass behaviour of `[data-lg]` cards.

### 8.4 Animation system (`animations/`)

GSAP is primary (scroll, layout, timelines), anime.js supports staggers and micro-interactions, `motion` is used in two files. Everything is under `animations/`: `deviceTier.ts` (low, mid or high from CPU count, memory, connection), `config.ts` (durations scaled by tier, forced to 0 under reduced motion), `frameRate.ts`, hooks (`usePageTransition`, `useScrollProgressRail`, `useHeaderDensify`, `useNavPillIndicator`, `useMobileDrawerAnimation`, `useReducedMotion`, `useDocumentVisible`), and `presets/themeTransition.ts`. A tab switch fades and slides `#page-content` in with a GSAP tween (`usePageTransition`), never with a View Transition.

`frameRate.ts` measures the screen's real refresh rate (`data-hz` on `<html>`; a page cannot change the monitor's rate and `requestAnimationFrame` already follows it) and runs a watchdog that sets `data-fx="1"` then `"2"` when over a quarter of frames miss the budget in two 3 s windows in a row (never in the first 8 s). Level 1 drops the SVG refraction and the dialog blur; level 2 drops every backdrop blur (rules at the end of `liquid-glass.css`; the level 2 rule must out-rank `:root.lg-refract [data-lg]`). Per-frame constants were converted to time-based.

### 8.5 Arrival animations (built 2026-11-01, tuned 2026-11-02)

The owner chose a heartbeat style (ECG line, pulse ring, brand mark).

- **Step effects** (`AuthStepFx.tsx`, `.ad-fx` in `intro.css`): a loading ring, then a success tick, then the next step slides in. Minimum 650 ms loading and 950 ms tick (120 ms under reduced motion) so they never flash. Used for login password to code, sign-up to authenticator setup, and the three forgot-password steps.
- **First-visit intro** (`components/intro/IntroSequence.tsx`): about 3.5 s, once per browser session (`sessionStorage cs_booted`), never on deep links or under reduced motion; Skip button, also Esc, Enter or Space; an iris opens onto the landing page.
- **Welcome** (`WelcomeSequence.tsx`): after the authenticator code: the iris closes, "Identity verified", "Welcome back, <first name>" (or "Welcome to CuraSense" after sign-up), a checklist whose ticks wait for the real `syncFromDB()` and `getPredictions()`, then the iris opens onto the dashboard. At least 3.3 s. A reload with a saved session plays a short version (about 1.2 s). Its background (`welcomeFx/`: cells, heartbeat lines, orbits that lock in as the real rows finish) skips under reduced motion and on the short version.
- **No-overlap rule (the owner's explicit requirement):** the final authenticator-code submit shows no small animation, only the big welcome. `e2e/07` proves it with a MutationObserver (order `loading, success, welcome`).
- Wiring: `App.tsx` holds `arrival` state. The welcome covers the screen first; `onCovered` flips `isAuthenticated` inside `flushSync`; `onSettle` mounts the 3D scene in a calm moment (mounting during the iris caused a 100 to 300 ms hitch); `onReveal` sets `cinematicDone`. The iris is a CSS `mask-image` radial gradient driven by tweening `--r` with GSAP. A 15 s safety timeout means a hung request cannot trap the user.
- Traps: see the `role="dialog"`, missing-variable and `cs-elem-transition` items in 8.1. A custom Skip button needs its own click handler, not only a key handler.

### 8.6 Performance work (2026-10-31 to 11-02)

On the owner's 60 Hz machine steady state was already 60 fps everywhere; the stutter was single dropped frames at switches. Causes and fixes: View Transitions on every switch (now theme reveal only); the cell rebuilt on every Home visit (now kept); a blur and box-shadow animated on the whole dialog panel and a stagger aimed at the old step's nodes in dev mode (fixed); first visit of each page compiling shaders (pages and scenes are prefetched after 2.5 s and `vite.config.ts` has `server.warmup` for them); `button { transition: all }` delaying GSAP tweens; the login page swap being one long synchronous commit (`flushSync` plus a two-frame delay). Lenis smooth scroll was removed (native scrolling, by the owner's choice). Per-event style writes on `<html>` were removed. Known remaining: one dropped frame (30 to 50 ms) on the first theme toggle, on the first visit to each inner page, on dialog open and around the login page swap.

### 8.7 The Analyze loading page

`components/shared/LoadingScreen.tsx` is the one screen all three Analyze tabs show while a request runs. Each tab passes `variant` (`symptoms`, `scans`, `reports`) and `subject` (the user's own data: scan picture URLs for formats the browser can show, the pasted report lines, the symptom names).

It starts as the compact panel (dark blurred card with a spinner and message). After 450 ms it lazy-loads `LoadingStage.tsx` (about 10 kB gzipped) and the overlay turns opaque dark with no blur. **The "reading lens"** (the owner picked it from two options): a dimmed copy of the user's own content fills the page; a sharp copy sits in a circle that travels with the plasma orb and moves exactly opposite to it (nested `translate` keyframes with identical timing, so no per-frame script, transform only); numbers in report text light up, symptom words fill in, a scan sharpens; three thin rings pulse out of the orb and the orb is pulsed by a synthetic `pointerdown` every 1,400 ms; caption, elapsed clock, "This can take up to a minute" (no fake progress). Accent per tab: blue symptoms, teal scans, violet reports. When there is no text (an uploaded file) the Reports tab shows a faux report sheet. Reduced motion, no WebGL 2 API and a failed chunk download keep the compact panel (the analysis completes either way).

The hero is the **HorizonX Plasma Orb** (`components/shared/plasma-orb/`: `plasma-orb.engine.js` and `.d.ts` byte for byte from `https://horizonx.so/r/plasma-orb.json`, `PlasmaOrb.tsx` adapted for React 18, `plasma-orb.css`). Licence: HorizonX Drops License, free for commercial and client products; keep the banner at the top of the engine file; do not repackage it as a library or template. HorizonX is otherwise a paid library; only the five free "drops" at `https://horizonx.so/r/registry.json` are usable.

**Design history (do not repeat):** a lone orb in a small dark panel was "way too empty". A second version surrounded it with Elastic Mesh, Ember Eclipse and Opal Loop drops and was rejected: "the orb is still good but wtf is surrounding it. it looks like diamond next to shit". Lesson: one cohesive, distinctive concept; thin lines, one accent per tab, lots of dark space; the hero should do something meaningful. All three extra drops were deleted.

Measured on the real GPU (Chrome on Metal, 1710x952 at 2x, 60 Hz): p95 frame 17.0 to 18.3 ms against 17.6 ms for the compact panel, no frame over 25 ms, the watchdog never fired, one extra GL context released afterwards.

### 8.8 Wrong-page notice

`components/shared/WrongPageNotice.tsx`: an amber "Not analysed" card with the refusal message rendered through `MedicalAIOutput` and, when the gateway sent a `redirect`, a button "Open Symptoms / Scans / Reports page" that calls `onSwitchTab`.

---

## 9. Tests and how to verify changes

| Suite | Command | Count | Covers |
|---|---|---|---|
| Python | `cd backend/python && .venv/bin/python -W ignore -m unittest test_routing test_deepseek test_reports` | 104 (62 + 11 + 31) | gating and routing; provider retries and budgets; file formats, report flow, lab_score, answers |
| Node | `cd backend/node && npm test` | 16 | auth guards, upload rules and any-document acceptance, proxy behaviour, rate limit |
| Playwright | `cd frontend && npm run test:e2e` | 41 | 01 auth (5), 02 analysis and history (6), 03 booking and settings (5), 04 session and admin (4), 05 landing scene (4), 06 site pages (4), 07 arrival animations (3), 08 wrong page (6), 09 loading page (4) |
| Playwright, phones | `cd frontend && npx playwright test --project=iphone --project=android` | 10 (9 run, 1 skipped on iPhone) | `10-mobile.spec.ts`, once in real WebKit (iPhone 15) and once in Chromium (Pixel 7): no page scrolls sideways, the menu reaches every page and signs out, Analyze tab names show, phones never get the 'high' 3D profile, content starts below an emulated notch (Chromium only) |

Playwright runs an isolated stack (fake AI gateway on 8101, Node on 5101, Vite on 5273, database `curasense_e2e`), one worker, `reducedMotion: 'reduce'` (so most specs never mount the 3D loading page). The fake gateway (`e2e/fake-ai.mjs`) answers the four gateway routes, `GET /_last-imaging`, and holds any request containing `slow-please` until `GET /_release` (that is how spec 09 sees the loading page). Each spec ends with a "no uncaught errors or console errors" test (`trackErrors`, `expectedErrors`, `errorsOf` in `helpers.ts`). A blocked-module test must use a FRESH context because a failed or loaded ES module is cached per document. Last full run (2026-11-11): 41 of 41, plus a production build, tsc and ESLint unchanged.

**Real AI checks** need the real key and a scratch stack; use synthetic files only (rule 2). Harness scripts lived in the session scratchpad and were not kept. Eval recipes: Wikimedia Commons API for labelled public-domain images (rate limits with 429, back off about 20 s); pydicom's bundled files via `pydicom/data/test_files/*.dcm` (never `get_testdata_files("*.dcm")`, it downloads). The region eval takes about 17 s and the perturbation eval about 63 s.

**Checking 3D or motion on the real GPU:**

```js
chromium.launch({ channel: 'chrome', headless: true,
  args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--force-color-profile=display-p3-d65'] })
```

Viewport 1710x952 (or 1440x932) at `deviceScaleFactor: 2`. Playwright's bundled headless shell is software GL and hides real bugs. `navigator.hardwareConcurrency` overridden to 6 forces the mid tier. Set `navigator.webdriver` to false when testing the resolution governor (it is skipped for automation). Record the **wall-clock gap between callbacks** (`performance.now()` inside the callback) plus a `PerformanceObserver` for `long-animation-frame`; headless Chrome keeps the rAF timestamp argument on a clean 16.7 ms grid even when the main thread is late. Test both `vite` (dev, what the owner runs) and `vite build` plus `vite preview`. Do not use `--disable-frame-rate-limit` on this site (the GPU queue floods). Your own test runs share the owner's GPU and can degrade their live tab, so keep them short. CDP `Page.startScreencast` plus a blank-frame counter measures what the compositor actually presents; `canvas.captureStream()` reads before the post chain and misses flicker. Always test colour changes with the P3 flag as well as sRGB.

**A harness note:** `kill $pids` with newline-separated PIDs in a variable fails in zsh; pass the PIDs as separate words. A run script's trap only kills its subshell PIDs, so check ports afterwards.

---

## 10. Work log, oldest to newest

**Origin.** The project began as a Figma Make export (the package name is still `@figma/my-make-file`) for "MediAI Pro" on Supabase. The root docs dated 2026-05-26 describe that and are stale; `supabase/` and `utils/supabase/` are dead code. It was rebuilt as CuraSense on React, Node with MongoDB, and a Python AI gateway.

**2026-10-28 (all committed).**
- Architecture analysis and refactor, phases 1 to 4 (`CHANGELOG_REFACTOR.md`): frontend split into features, components, services, state; Node `server.js` (673 lines) split into app, config, models, middleware, controllers, services and routes; Python `ai_core.py` (663 lines) split into config, deps, schemas, providers, services and routers; a GSAP plus anime.js animation system with device tiers; cross-device responsiveness for iOS and Android; a UI/UX rebuild that reduced five themes to dark and light and adopted the full animation library list (the owner's choices).
- `REDESIGN_PLAN.md` (phase 0 audit): the "body as a signal" concept, a bio-luminous Core; branch `redesign/immersive-3d`. Scene3D, matcap scenes and the "Dark Moon" CSS layer were removed.
- Security phase 1: the gateway secret moved server-side and every AI call is proxied through Node. A 2FA bypass was closed (pre-2FA purpose tokens are refused on protected routes). Node dependencies upgraded, audit clean (0 vulnerabilities). AI token budgets raised for the reasoning model. Three baseline bugs found by the first e2e run were fixed. The Playwright baseline suite (20 tests) on an isolated stack.

**2026-10-29.** A graphify knowledge graph of the repo (`graphify-out/`) and a live watcher (LaunchAgent `com.curasense.graphify-live`, script `scripts/graphify_live.py`, 5 s debounce: `graphify update . --force`, then `scripts/graphify_supplement.py` re-adds CSS and config nodes, then `graphify export html`). Log: `~/Library/Logs/graphify-live.log` (a log inside `~/Downloads` made launchd fail with exit 78). Remove with `launchctl bootout gui/$(id -u)/com.curasense.graphify-live && rm ~/Library/LaunchAgents/com.curasense.graphify-live.plist`. The watcher spawns about 10 workers per file edit, so macOS `syspolicyd` spikes while editing. Doc and image changes are not watched; run `/graphify . --update` for those. Whether the agent is still running was not checked on 2026-11-11 (`launchctl list | grep curasense`).

**2026-10-30 and 10-31.** The landing page's living cell (section 8.2) was built and then repaired through several rounds of the owner's screenshots: the NaN-pixel flicker root cause, the resolution governor, a calm pass on brightness and "lightning", slower hair and vein motion. Detail in 8.2.

**2026-11-01.** The public site (section 7.2): navbar, Home, Platform, Approach, Access, shader backdrops, the auth dialog, the status pill, an own router. The cilia-alpha root cause on Display P3 screens. The arrival animations (8.5). e2e specs 05 to 07 added. The old boot splash, `CinematicSequence` and `WelcomeScreen` were deleted.

**2026-11-02.** The smoothness pass (8.6): no stutter or dropped frames on switches, refresh-rate awareness, a six-box code input, an animated welcome background. The owner's decisions: keep all deliberate pauses (0.65 s loading, 0.95 s tick, welcome at least 3.3 s, intro 3.5 s); slow the cell behind the dialog (about 20 fps, not frozen); native scrolling; keep the iris; the welcome background is Orbits plus Microscope plus Heartbeat; the six boxes auto-check.

**2026-11-10.** The Analyze AI pipeline (section 6): the owner reported "offline triage" and models not working. Fixes: install and use pymupdf for every PDF page; each analysis page works only on its own kind of content and says which page to use otherwise (fail-closed gating, `routing.py`, `WrongPageNotice`, e2e spec 08); the listed limits fixed (DICOM and DICOMDIR, ZIP series, body-region matching through a deterministic table, reasoning kept on for clinical reads); `start-dev.sh` and `START.md` (the owner runs three commands by hand and asked for one script).

**2026-11-11.**
1. The owner asked whether HorizonX's design could be used here. After a study (the paid library, five free drops) they chose "go with #1": the Plasma Orb as the AI-is-thinking visual.
2. "AI model failed to return a response" on Scans: root cause was DeepSeek connections stalling (6.1); fixed in `deepseek.py` and tested.
3. The loading screen went from a lone orb ("too empty"), to a mesh-and-eclipse collage (rejected), to the **reading lens** (accepted concept, 8.7), with a lazy chunk, graceful fallback and e2e spec 09. A theme-variable bug (the spinner invisible because the portal missed `--accent-cyan`) was found and fixed on the way.
4. The owner uploaded a PDF to Reports: more than 3 minutes, then "Could Not Read Report" (that red card title comes from the frontend for any server error). They asked for any file type to work, fast and with the best result. The Reports pipeline was rewritten (6.5) and `documents.py` widened to Word, Excel, PowerPoint, OpenDocument, RTF, HTML, CSV, JSON, XML, text encodings, HEIC and ZIPs; Node upload rules and the frontend accepted-types list were widened to match. The owner chose synthetic files for testing.
5. This handoff file.

**2026-11-12.** The iPhone and Android apps (section 15 and `NATIVE.md`). The owner asked for the website as iOS and Android apps without lag or issues, pushed into Xcode and configured there, built with Claude Design, and to be asked before anything goes live on the web. Capacitor wraps the built website; the Xcode project builds with Xcode 27.2 and ran in the iPhone 17 Pro simulator; the Android project is generated and configured but could not be built (no JDK or SDK on this Mac). The website itself gained phone fixes (safe areas, Sign out in the phone menu, Analyze tab names, a lighter 3D profile for phones, self-hosted Inter). A Claude Design canvas shows the screens: https://claude.ai/artifact/WibvTg6MEoyRivjgY4PNkW (private to the owner's account; made from real screenshots; not visually checked after publishing, as that artifact type asks).

**2026-11-12 (later): premium mobile upgrade, stages 0 and 1.** The owner asked for a premium, cross-platform upgrade that preserves the existing code: upgrade, never rebuild, and ask before replacing frameworks, rewriting architecture, removing features, or changing schemas, auth behaviour or the API. Branch `upgrade/premium-mobile-ux`; commit `4e26be7c` snapshots all work that was uncommitted on `redesign/immersive-3d` (221 files; the public site, 3D scenes, iOS and Android projects and e2e specs 05 to 10 had no git history before it). Baseline from `vite build`: 3033 modules in 2.5 s, entry JS 1,902.75 kB (549.95 kB gzip), CSS 195 kB (34.8 kB gzip), 7 lazy sites; three.js and tsparticles are in the entry chunk because `AdminDashboard.tsx`, `UserProfile.tsx` and `SuccessBurst.tsx` import them eagerly.

Stage 1 is the commit right after the snapshot:
- The menu's close button was hidden under the drawer, so a phone user could not close the menu. Public site: `.sn` was z-index 50 under `.sn-drawer` 55 and is now 56. Signed in: the header was z-50 under the drawer z-55; it now rises to z-56 only while the drawer is open (21 Radix popups use z-50), and the drawer's top padding is 5.5rem plus the safe area.
- The signed-in brand lockup was painted as a card box by `index.css` line 278 (`[class*="card"]` matches `magnetic-card`), and its logo glow was clipped. Fixed with important utilities on that one wrapper.
- Page title plates are full width below 640 px. The Home caption clears the home indicator.
- In the no-blur state (`data-fx="2"`) the clear glass, plates, nav, Platform tab pill, Home caption and signed-in menu get dense fills (`liquid-glass.css`, `site.css`, `site-pages.css`); before, text behind them showed through.

Tests: a new case in `10-mobile.spec.ts` (the menu closes with its own button) failed before the fix and passes after. The full e2e run gave 47 passed, 1 failed, 1 skipped, 4 not run. The failure was `03-booking-settings` hard-coding the 09:00 AM slot, which the app pre-books on some dates (`getBookedSlots`, one day in five, including 2026-11-13); the test now clicks the first enabled slot and that spec passed 5 of 5. Screenshots came from headless Chrome on Metal and Playwright WebKit with an iPhone 15 Plus profile; Playwright's WebKit draws no backdrop blur at all, so it only stands in for the no-blur state. Not checked: a real iPhone, Android (never built), VoiceOver. Rollback: `git revert` the stage 1 commit removes it; `git reset --hard 4e26be7c` returns to the snapshot. Waiting on the owner: screenshots from the real phone.

**2026-11-12 (later still): backend hardening and the React Native decision.** The owner chose React Native with Expo for the phone apps (the recommendation was to stay on Capacitor) and approved the non-breaking security fixes only. A migration plan was presented for sign-off; no app code exists yet, and the website and the Capacitor projects stay untouched until the new app reaches parity. The hardening, all in `backend/node`:
- CORS is an allow-list instead of allow-all (`app.js`). The Capacitor origins (`capacitor://localhost`, `https://localhost`) always pass; localhost, loopback, `.local` names and private-LAN addresses pass outside production; any other site, such as the live website, must be listed in the new optional `CORS_ORIGINS` variable (comma separated). A request without an Origin header (curl, server to server) passes.
- The JSON body limit is 2 MB instead of 50 MB. Uploads go through multer, and the largest JSON body is a 60,000-character pasted report.
- `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy` are set by hand and `X-Powered-By` is off. helmet is not installed; HSTS belongs with the HTTPS setup.
- `/login` (30 per 15 minutes), `/login-totp` (15) and the three reset routes (15, one shared bucket) are rate limited per IP before the database is touched, with the existing `userRateLimit`. Sign-up is not limited: it only creates accounts, and the e2e suite signs up many users from one IP.
- Before going live: call `app.set('trust proxy', 1)` behind a reverse proxy (otherwise every user shares one bucket), set `NODE_ENV=production`, and set `CORS_ORIGINS` to the real website.
- Tests: `test/hardening.test.js` and `test/cors-production.test.js`; all 21 backend tests pass, and the full e2e run gave 52 passed, 1 skipped (WebKit safe area), 0 failed.
- Still open, because they change login behaviour and wait for go-live preparation: `/forgot-password` returns the reset code (account takeover), `config/db.js` creates an admin account with a hard-coded password on every start, `config/env.js` falls back to a hard-coded JWT secret, the TOTP secret is stored in plain text, and the token lives in `localStorage` (the Expo app will use SecureStore).

**2026-11-12 (R1 and R2 of the React Native app).** The owner approved the migration plan, with full parity as the scope, iOS first, and Android later (no JDK or SDK on this Mac). R1 (`packages/shared`): the API client, translations and theme tokens moved out of the website into `@curasense/shared`; the old website paths are one-line re-exports; the client is configured once per app with `configureApi({ baseUrl, getToken })`, and the token getter may be async. Checks: 39 type errors before and after (none in moved files), entry JS 550.07 kB gzip (+0.08 kB), full e2e 52 passed, 1 skipped. R2 (`apps/mobile`, section 16): an Expo SDK 58 app with sign-in, sign-up with the authenticator step, forgot password, and a five-tab shell whose tabs other than Home and Settings are placeholders for later stages. Checks: 0 type errors, `expo-doctor` 20 of 20, a Hermes bundle for iOS (2.9 MB), a unit test for the token-expiry check, and a browser run of the app's web build against the isolated backend that passed 13 of 13 steps (sign-up with 2FA, wrong codes, sign-out, sign-in with 2FA, session restore, expired token, password reset, sign-in with the new password), in dark and light. Rollback: git revert the R1 and R2 commits.

**2026-11-12 (R3, the Analyze tab).** R3a (commit `5fa9a7c8`): the 197-symptom list, the scan catalogue (studies, groups, image kind and body regions per study, urgency levels, upload limits), the sample report, the upload-file rules and the result-text parser moved into `packages/shared`, and the website imports them (455 lines left `SymptomChecker`, `ImageAnalysis` and `MedicalAIOutput`; moved by slicing the source, not retyped). `packages/shared/src/analysis.ts` turns the gateway's answers for symptoms, lab reports and scans into the result the app shows and saves (ported from the website's three screens, which keep their own copy for now). `npm test` in `packages/shared` runs 14 tests with Node's type stripping, no build. R3b: the Analyze tab of the app is a nested stack, the way a phone app navigates: a menu of three doors, then Check symptoms (searchable list by category, chips, your own symptom), Read a scan (a sheet to choose the study, photos, camera or Files up to 6 files, context) and Lab report (paste text or upload one file, sample report). Results show urgency, the written answer, conditions with probabilities, lab values with range bars, scan sections and recommendations; a refused text or file shows the "Not analysed" notice with a button to the right screen; only successful analyses are saved to the history, as on the website. Also fixed: the router lost a deep link opened while the saved session was still loading (the navigator now mounts once the session state is known), and the tab labels clipped descenders in the web build. Checks: website type check 39 (unchanged), website build identical, full e2e 52 passed and 1 skipped (one earlier run had a one-off WebKit "Importing a module script failed" on the first phone test, then passed three times alone and in the next full run); app type check 0, `expo-doctor` 20 of 20, a 3 MB iOS bundle; a browser run of the app's web build against the isolated backend and the fake AI gateway passed 10 of 10 Analyze steps (search and select symptoms, own symptom, result; refused text and the way to the right screen; choose a study, upload a file, and the modality, study label and regions reaching the AI service; unsupported file refused before upload; refused scan shown as not analysed; sample report with its lab values; PDF upload; DICOM sent to the Scans screen without an upload; only 4 analyses saved: symptom, scan, 2 reports) and the 13 auth steps still pass.

**2026-11-13 (R4, Home and History).** `packages/shared/src/history.ts` holds the history record type, `normalizePrediction`, `summarize` (total, today by the device's calendar day, average confidence, counts per type, most used, latest) and the date formatters, with 4 tests (18 shared tests now). In the app: the Home tab is the dashboard (four gradient stat tiles, quick actions that open the right analysis screen, a breakdown by analysis type, the three latest analyses, pull to refresh), and the History tab is a nested stack: the list (stats, a "liked" filter, pull to refresh) and one analysis opened as a full report (urgency, written assessment, conditions with a top match, lab values with range notes, scan findings, numbered recommendations, a heart to like it). A `PredictionsProvider` in the tabs layout holds the user's analyses for Home, Analyze and History, so a new analysis shows in History straight away. Differences from the website, on purpose: the website's fourth dashboard tile shows a fixed "2.5s" that nothing measures, so the app shows the time of your latest analysis instead; likes are kept on the phone only (AsyncStorage per user), as on the website, because the API has no like endpoint; there is no delete (the website has none either, although the API has `DELETE /predictions/:id`). New dependencies: `@react-native-async-storage/async-storage` (community package, on Expo's compatibility list; it will also hold settings in R5) and `expo-linear-gradient` (first-party). Checks: app type check 0, `expo-doctor` 20 of 20, 3.1 MB iOS bundle, a browser run of the app's web build against the isolated backend with records seeded through the API passed 8 of 8 steps (dashboard numbers, newest first, a quick action, history stats, a lab report with its value notes, a symptom analysis with its top match, a scan with its findings, a like that survives a reload and filters the list, a new analysis appearing in History without a reload, empty states for a new account), and the Analyze (10) and auth (13) runs still pass.

**2026-11-14 (R5a, Settings).** `packages/shared/src/settings.ts` holds the settings types and defaults, the ten language names, `parseServerSettings` (the stored settings object to the app's values, skipping anything of the wrong kind), `toServerPayload` (only the fields that changed, in the shape `PATCH /api/user/settings` stores), the checks for a new family member and a new emergency contact, and `telUrl`; it has 6 tests (24 shared tests now). In the app the Settings tab is a nested stack (`app/(tabs)/settings/`: the list, AI language, family members, emergency contacts) on top of `src/settings/SettingsContext.tsx`. That context keeps a copy of the settings on the phone (AsyncStorage key `curasense_settings`) so the app starts with the right contrast and text size, pulls the account's settings after sign-in (the server wins, unless you changed something while it was loading), wipes the copy when you sign out (as the website's `clearAll` does), and applies each change at once, saves it to the account and undoes it with a visible and spoken notice if the save fails. The website saves its AI and language settings on a Save button; the app saves on each change, as iOS settings do. High contrast is a second palette in `useTheme` (solid borders, no faded text; by my calculation, over the page and card colours, muted text goes from 4.1 to 4.3:1 up to 9.8 to 12.7:1 and borders from 1.2 to 1.3:1 up to 7.7 to 11.5:1). Large clinical text makes the AI answer text, lab values and recommendations 20% bigger (`AppText` `dense`). The root layout now waits for the settings as well as the session before it draws, so the first screen never flashes in the wrong contrast.

Left out of the app on purpose (each checked in code): the website's identity Save, its "Update Encryption" password change and its Hugging Face key check have no handler or no endpoint behind them (the API has no profile or password-change route), so the app shows the account name and email only; the Auto-Alerts toggle is stored but nothing reads it, so the app does not show it (the stored value is left alone when other emergency settings are saved) and the contacts page says that CuraSense contacts nobody, with a Call button on each contact instead (a `tel:` link); the avatar upload only ever lived in the browser. Also found: nothing on the server reads `aiPreferences` (explanation style, detail), the language or the units. The Node analysis controller and the Python gateway ignore them, so on the website and in the app they are saved to the account but change no answer, and the app says so under those controls. Whether they should reach the AI prompts is the owner's decision (it would change answers for everyone who has set them). The app's own text is English only for now, so the language setting is the AI output language only. By my calculation the website's normal muted text colour is 4.1 to 4.3:1 against its page and card colours, a little under the 4.5:1 AA mark for small text, although the comment in `themes.ts` says about 5.2 and 6.8:1; the website's palette was not changed.

Checks: app type check 0; shared tests 24 of 24; `expo-doctor` 20 of 20; the iOS bundle is still 3.1 MB; a browser run of the app's web build against the isolated backend passed 13 of 13 settings steps, each change read back from the server and not only from the screen (explanation style and detail, units, language, high contrast with its colours surviving a reload, large text growing the answer text from 15 to 18 px, a failed save undone with a notice, a family member and a contact added, validated and removed, the Call link, settings changed on the server showing up after a reload, sign-out wiping the phone's copy, a second account starting clean); the auth (13), Analyze (10) and History (8) runs still pass. Native: the Release build on the iPhone 17 Pro simulator builds, installs, launches and reaches the sign-in screen (the new wait for the settings does not hang the splash screen), with no crash report. The simulator cannot be tapped from the command line, so the Settings screens themselves were checked in the web build only; the Switch thumb colour and the Call link need a look on a real iPhone.

**2026-11-16 (R5b, Booking).** `packages/shared/src/booking.ts` holds the six sample doctors, the 12 time slots, the 14-day date strip, the invented "taken" slots, the reference generator, the step rules, `makeBooking` and safe readers for saved bookings and contact info; it has 6 tests (30 shared tests now; the date test runs in India's time zone). In the app the Book tab is a nested stack (`app/(tabs)/book/`: the five-step wizard, My bookings with the user's information, and one booking's page) with `src/book/` (a `BookingsProvider` that keeps bookings and contact details per account in AsyncStorage under `curasense_bookings_<userId>` and `curasense_contact_<userId>`, and the shared parts: step progress, doctor avatar and stars, the attached-diagnosis summary, the demonstration notice).

What the website's booking really is, found by reading it: a simulation. There is no booking endpoint. The doctors are made-up people at real hospitals (Apollo, Max Healthcare, Fortis, AIIMS, Tata Memorial, Medanta) with invented ratings, review counts and fees in rupees. The free slots are invented from the date. The success screen says "Confirmation sent to <your email>" after a timer, although no email service exists, and only the last page says the booking is a simulation. The app ports the flow but does not repeat the false claims: every booking screen opens with "Demonstration only. The doctors are samples, nothing is sent to any doctor or hospital, and bookings stay on this phone"; the success text says no email was sent and nobody was told; the status reads "Saved on this phone" instead of "Confirmed"; the list marks each booking DEMO; the artificial 900 ms wait and the 1.8 s "sending email" state are gone; and the line "Secure encrypted video platform" is dropped because there is no such platform. Other differences, on purpose: bookings and contact details are per account (the website keeps one set per browser, so a second person on the same browser sees the first person's); the date strip uses the device's calendar day (the website used the UTC day, so east of Greenwich in the first hours after midnight a tile showed one day number but carried the previous day's date, and "tomorrow" was saved as today; measured at 01:30 in India; the website still has this); a booking is cancelled from its own page with a Keep / Yes, cancel confirmation (the website used an accordion); the date of birth is typed as YYYY-MM-DD and checked; the "New booking" buttons clear the wizard. Not done: the animated success burst (R6) and a date picker. For the store (R7): the sample doctors at real hospital names with invented ratings and fees must be replaced with plainly fictional names or removed before any store submission.

Checks: app type check 0; shared tests 30 of 30; `expo-doctor` 20 of 20; the iOS bundle is 3.2 MB (3.1 MB before) and Hermes compiled it; a browser run of the app's web build against the isolated backend passed 17 of 17 booking steps (the wizard end to end with an attached analysis, an unavailable doctor and a taken slot refused, the review and success wording with no email claim, a booking's page, Keep and a real cancel, My bookings with a checked and saved contact form, bookings and contact details surviving a reload, a second account seeing none of it, the date strip after midnight in India, the light theme), and the settings (13), auth (13), Analyze (10) and History (8) runs still pass. Not verified: the booking screens natively (the simulator cannot be tapped, and no native code or dependency changed in this stage, so the Release build was not repeated) and date formatting on Hermes (the bundle compiles, but only the web build ran it).

**2026-11-16 (R5c, the emergency prompt).** The owner approved the design shown after R5b. `packages/shared/src/emergency.ts` has `isEmergency(result)`: the AI marked a symptom or lab result EMERGENCY, or a page of a scan is Critical or Emergency in the AI's own words (the website's Auto-Alerts text says "critical or emergency"; "Concerning" does not count, because a prompt that fires often stops being read). `settings.ts` gained the device-only `emergencyNumber` (default 112, kept on the phone and never sent to the account: `toServerPayload` returns nothing for it and the settings context skips the request when there is nothing to send), `emergencyNumberProblem`, `EMERGENCY_NOTE` ("I need help. Please call me as soon as you can.": nothing about health) and `smsUrl` (iOS and Android separate the message body differently); 3 new tests (33 shared tests now). In the app, `src/emergency/EmergencyPrompt.tsx` sits under the urgency banner of a fresh result (`ResultView`, so all three Analyze screens). When the Emergency prompt switch is on and the result is an emergency, a sheet opens once: "This result is marked EMERGENCY", a solid red "Call emergency services (<number>)", a Call and a Message button for each contact, a note that CuraSense cannot call for help by itself, and Not now; with no contacts it says so and links to Settings. A red "Emergency contacts and services" button under the banner reopens it. Every button only opens the dialler or Messages (`tel:` and `sms:`): the person taps, iOS asks them to confirm a call, and the Message sheet needs a tap on Send. The app never calls, texts or emails, and nothing goes through the server. The switch is the website's `emergencyProtocols.autoAlertsEnabled` (off by default, so someone who turned it on in the website has it on in the app); it sits in a new Emergency group in Settings with the contacts, and the number is edited on the contacts page. The sheet opens by itself only for the result being looked at when it appears: a tab keeps its screens mounted and a Modal ignores which tab is showing, so turning the switch on from Settings first threw the sheet over Settings about an old result (found by the browser test, fixed). The fake AI (`frontend/e2e/fake-ai.mjs`) answers any request that mentions "e2e-emergency" as an emergency (urgency emergency for symptoms and labs, "Urgency Level: Critical" for scans); the website's own e2e does not use that word.

Checks: app type check 0; shared tests 33 of 33; `expo-doctor` 20 of 20; the iOS bundle is 3.2 MB; a browser run of the app's web build against the isolated backend passed 12 of 12 emergency steps (the switch saved to the account; the number checked and kept on the phone only, the account holding none; the sheet opening by itself for a symptom, a lab report and a Critical scan page; the Call links `tel:911` and `tel:+919876543210` and the Message link `sms:+919876543210&body=...` read from the browser's navigation; Not now and the reopen button; nothing for a result that is not an emergency or with the prompt off; no sheet thrown over Settings when the switch is turned on; the no-contacts sheet linking to Settings), and the booking (17), settings (13), auth (13), Analyze (10) and History (8) runs still pass. The Release build (which also covers R5b) builds, installs and launches on the iPhone 17 Pro simulator to the sign-in screen with no crash report. Not verified: that a real iPhone dials and opens Messages with the note (the simulator has no phone or Messages app), VoiceOver reading of the sheet, and how the native page sheet looks (the simulator cannot be tapped).

**2026-11-16 (R6a, haptics, sharing and accessibility).** The owner chose R6a first; the animated welcome (R6b) and the animated loading screen (R6c) are still to do. **Haptics:** `expo-haptics` 58.0.8 (first-party Expo, the only new dependency; it is native, so the app needs a rebuild with `npx expo run:ios`). `src/haptics.ts` has `tick`, `success`, `warning` and `failure`. A tick when a choice changes (segmented controls, switches, booking choices, dates, slots, language rows); success when a booking, family member, contact or contact information is saved and when a result arrives; a warning when a result is an emergency; failure when a save is undone and whenever an error banner appears. iOS follows the person's System Haptics setting; the web build does nothing; the simulator has no haptic engine, so none of it has been felt. **Sharing:** `packages/shared/src/share.ts` (`resultToText`, `plainText`, and the disclaimer text, moved here) with 4 tests (37 shared tests now); a `ShareButton` on every fresh result and on the History report opens React Native's built-in share sheet (no dependency) with the analysis as plain text: date, urgency, confidence, the assessment without markdown marks, conditions, lab values, recommendations and the disclaimer. The person chooses where it goes; the app sends nothing itself.

**Accessibility.** An audit of 25 screens in the web build (every control has an accessible name, every target is 44 points or more, every screen has a heading) found no missing names or headings; it found segmented controls at 38 points and two search inputs at 40, now 44. The remaining small targets are web-only (the web header's back link, 30 points) or have a `hitSlop` that makes them 46 to 50 (the password eye and the like heart). A banner that appears is announced with `AccessibilityInfo.announceForAccessibility` (iOS does not read live regions) and an error banner also taps the phone; the save notice and information banners are exempt. Every icon is hidden from screen readers and no longer scales with the text through `src/ui/Icon.tsx`: import `Ionicons` from there, never from `@expo/vector-icons`. Muted text is a little stronger than the website's tokens (alpha 0.52 dark and 0.60 light instead of 0.48 and 0.56) so it reaches 4.6:1 on every surface (the website's are 4.1 to 4.3:1). Text now grows to 200% (it was capped at 150%). That was checked by scaling every text node in the web build (a script, not the real Dynamic Type) on 430 and 375 point wide screens: it found a wrapped button label touching the edges of its box (buttons now have vertical padding), the Reports sample link and the My bookings header overflowing (they wrap now), two-button rows squeezing their labels (they stack now), the booking header link colliding with its title (it is a fixed-size bar button now) and tab labels (the tab bar does not scale); after the fixes all 25 screens fit at 2x on both widths.

Checks: app type check 0; shared tests 37 of 37; `expo-doctor` 20 of 20; the iOS bundle is 3.2 MB; web-build runs against the isolated backend: Share 4 of 4 (the text built for a fresh result and for a saved one, read from a replaced `navigator.share`, and the error when the share sheet cannot open), emergency 12, booking 17, settings 13, auth 13, Analyze 10, History 8; the audit of 25 screens (every control named, a heading on every screen, no target under 44 points except the web-only header back link and the password eye and like heart, which have a `hitSlop`); the text-size check at 1.5x and 2x on 430 and 375 point wide screens (all 25 screens fit after the fixes). The Release build with `expo-haptics` compiles, links, installs and launches on the iPhone 17 Pro simulator, and its sign-in screen at the largest accessibility text size in dark mode lays out and scrolls cleanly (the simulator was put back to the normal text size and light mode and shut down). Not verified: VoiceOver reading anything (it cannot be driven here), the haptics themselves (the simulator has no haptic engine), the share sheet on a real iPhone, and text size natively beyond the sign-in screen (the other screens were checked with the script in the web build).

**2026-11-16 (R6b, the animated welcome).** The owner chose it after R6a; it follows the website's heartbeat style (ECG line, pulse ring, brand mark) and needs no new dependency: React Native's own `Animated` with the native driver does everything (I had said Reanimated might be declared as a direct dependency; it was not needed). `src/welcome/Welcome.tsx` is a full-screen dark overlay (dark whatever the phone's appearance, like the native splash it follows) that `app/(tabs)/_layout.tsx` renders over the tabs, so it covers the first frame after sign-in. How the person arrived comes from `AuthContext` (`arrival`: `signin`, `signup` or `resume`, set by `signIn(token, user, how)` and by restoring a saved session, cleared by `endArrival`). **Signing in or up:** at least 3 s (1 s under Reduce Motion): the brand mark beats about once a second with two pulse rings leaving it, an ECG line is drawn under it by a travelling dot, then "IDENTITY VERIFIED" ("ACCOUNT CREATED" after sign-up), "Welcome back, <first name>" ("Welcome to CuraSense" after sign-up) and a checklist of three rows: settings, history, dashboard. A row ticks only when its real task has finished and it has been on screen 0.6 s: the settings row waits for the account sync (`sync` in `SettingsContext`: pending, ok or failed), the history row for the first load in `PredictionsContext`, and the dashboard row for the other two. A failed task shows an amber row ("Using the settings saved on this phone", "Could not load your history") and the welcome still ends. A Skip button appears after 1 s; a hung request cannot keep the overlay up for more than 15 s. A success tap (haptics) when it ends. **A saved session resuming at launch:** the short version, about 1.2 s: mark, rings, ECG line and the greeting, no checklist, no Skip. **Reduce Motion:** nothing moves (static mark and line, rows appear at once). The overlay is a modal for VoiceOver (`accessibilityViewIsModal`) and announces the greeting. `src/welcome/timeline.ts` and `ecg.ts` are pure and have 4 Node tests (`node --test src/welcome/timeline.test.ts`). The root stack no longer animates the switch to the tabs (`animation: 'none'`), so the welcome is not carried in by a slide. The website's first-visit intro and its small step effects in the sign-in dialog were not ported (the app has no landing page to reveal, and nothing small plays before the big welcome, so the website's no-overlap rule holds trivially); the website's iris reveal was replaced by a fade, because a circular mask needs a masking library or Skia.

**Seen natively, with a throwaway route.** Nobody can sign in on the simulator without tapping, so I built a route that rendered the welcome on its own (reverted, not committed) and captured frames on the iPhone 17 Pro simulator: the beating mark, the rings, the ECG line with its travelling dot, the title and the rows look as designed, and it found two things the browser could not show. First, the status bar clock and battery were dark on the dark overlay in light mode: the generated `Info.plist` has `UIViewControllerBasedStatusBarAppearance` on, so React Native's `<StatusBar>` does nothing on iOS (the app's own `<StatusBar>` in `app/_layout.tsx` has never had an effect there; iOS has been following the system's light or dark); the tabs screen now sets the native stack option `statusBarStyle: 'light'` while the welcome is up and `'auto'` otherwise, which measured white text afterwards. Second, the native splash showed the app icon as a hard-edged square next to the welcome's rounded mark: `assets/splash-icon.png` is the icon with iOS-style rounded corners and `app.json` points `expo-splash-screen` at it (`npx expo prebuild --platform ios --no-install` regenerates the native asset). iOS caches launch screens: a changed splash image shows only after the app is deleted and the `Library/SplashBoard` folders in the simulator's app containers are removed.

Checks: app type check 0; Node tests in the app 6 of 6 (token and the welcome's timeline and ECG geometry); shared tests 37 of 37; `expo-doctor` 20 of 20; the iOS bundle is 3.2 MB; web-build runs against the isolated backend: welcome 10 of 10 (a real sign-in through the screens with the overlay covering the tab bar, the greeting by first name and a length of 3 to 7 s; the checklist showing the real results; a slow settings call keeping its row pending past the minimum time; failed calls shown as amber rows with the welcome still ending; Skip; the short welcome on a reload; sign-up wording; Reduce Motion; the 15 s limit when nothing answers), share 4, emergency 12, booking 17, settings 13, auth 13, Analyze 10, History 8. Native: the welcome rendered on the iPhone 17 Pro simulator through the throwaway route (frames captured, both problems above found and re-checked after the fixes), and the Release build links and launches. Not verified: the welcome after a real sign-in or a real saved session on a device (the simulator cannot sign in; only the web build ran the real triggers), the exit fade and Reduce Motion natively, VoiceOver reading the overlay, and the success tap when it ends.

**2026-11-17 (R6d, native visual QA and polish).** The owner looked at the old Capacitor app (a WebView of the website: its log shows `capacitor://localhost`, GSAP and THREE; both it and the new app are named "CuraSense" on the phone, bundle ids `com.curasense.app` and `com.curasense.mobile`) and called it laggy and not premium, and asked for perfect dimensions and placement; I told them which app was which and audited the new one on the simulator, which until then had been seen natively only on its sign-in screen. Method: a throwaway tour build (never committed): a `Tour` component mounted in the root layout signed in with a seeded account (token, user and prediction ids baked in through `EXPO_PUBLIC_TOUR_*` at build time, against the isolated backend on port 5101) and stepped through every screen on a timer with `router.navigate`, a temporary hook in `Screen` scrolled the visible page, a temporary hook in the booking wizard set its step, and a temporary route rendered a fresh result with and without the emergency sheet; a script relaunched the app on a simulator and kept one screenshot per settled screen (consecutive-frame comparison). Captured on the iPhone 17e (390 pt wide), 17 Pro (402) and 17 Pro Max (440), in light and dark, and at the largest accessibility text size (AX5, capped at 2x). Findings and fixes: (1) the iOS 26 back button carried the previous screen's title, which made wide pills of different widths and pushed the title off centre; every stack now sets `headerBackButtonDisplayMode: 'minimal'` (a round chevron, title centred); (2) the Book header's wide "My bookings" pill (which also pulled its title left) is a round list icon like the heart on a report; (3) History tiles put the number first so the numbers line up when a label wraps; (4) a lab value's two notes overflowed the card on narrow phones and now wrap; (5) My bookings rows wrapped their date to three lines and now use a short date (`fmtShort`, "Thu, Nov 19"); (6) the Arabic language row rendered "(Arabic) العربية" (bidirectional text took the Arabic as the paragraph direction), now `writingDirection: 'ltr'`; (7) link buttons on a card's right edge carried 20 pt of side padding so their text sat inside the card's edge, now aligned; (8) "Add contacts in Settings" closed the sheet and pushed a route in the same instant, and UIKit does not push a screen while a sheet is leaving (the tour stalled behind a sheet for minutes), so the push waits 450 ms; (9) at AX5: the tabs' own header title grew and was clipped (`headerTitleAllowFontScaling: false`), History tiles stack, a lab value's name broke mid-word, confidence rows and doctor and booking rows squeezed their text to a sliver or truncated it (they wrap now), and step numerals overflowed their circles. Dark mode and the other two phone sizes needed no further changes.

Checks: app type check 0, `expo-doctor` 20 of 20, iOS bundle 3.2 MB, Node tests 6 (app) and 37 (shared); web-build runs against the isolated backend: welcome 10 of 10, share 4, emergency 12, booking 17, settings 13, History 8; the accessibility audit (every control named, a heading on every screen; the only small targets are web-only or have a `hitSlop`); the 2x text-size check on 430 and 375 point widths (0 issues on 25 screens); the throwaway tour re-run natively after the fixes. Not re-run: the dedicated sign-in and Analyze web scripts, which macOS deleted from `/tmp` overnight (see below); sign-in and sign-up are covered by the welcome run and the analysis flows by the share and emergency runs. Rebuilt and installed on the owner's iPhone 15 Plus with the Mac's new address (`10.64.195.161`; it was `172.20.10.2` on the phone's hotspot): the previous build there could no longer reach the server. The owner then asked for the new app's home-screen name to be "CuraSense Beta" so it is not mistaken for the old Capacitor app (still named "CuraSense", bundle `com.curasense.app`, untouched): it is `ios.infoPlist.CFBundleDisplayName` in `apps/mobile/app.json`, and Expo then ignores `name` for iOS (`npx expo config --type introspect` prints that). Do not rename through `expo.name`: a prebuild without `--clean` would create a second Xcode project. `ios/` is gitignored, so the running project's `Info.plist` was set with `PlistBuddy -c "Set :CFBundleDisplayName 'CuraSense Beta'"` (the file uses one tab of indent, which is why a text edit missed), and the phone got the rebuilt app installed over the old one, keeping its data. Bundle id, product name and Xcode scheme are unchanged. Android's label still comes from `name` (not built yet).

**2026-11-17 (first sign-up on the real iPhone).** The owner's phone showed "Network error. Please check your connection." in the OLD Capacitor app (the website's dialog: "STEP 1 · ACCOUNT", "Already have an account? Sign in"; the native app's sign-up has a subtitle and "I already have an account"). Cause: `frontend/.env` has `VITE_NODE_BASE_URL=http://localhost:5001`, Vite bakes it into the bundle, and on a phone `localhost` is the phone. CORS (`capacitor://localhost` is allowed) and the iOS settings (`NSAllowsLocalNetworking`, `NSLocalNetworkUsageDescription`) were already right. Fix, no tracked file changes: `cd frontend && VITE_NODE_BASE_URL=http://<mac ip>:5001 npx vite build && npx cap sync ios`, then `xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release -destination 'generic/platform=iOS' -derivedDataPath <dir> -allowProvisioningUpdates DEVELOPMENT_TEAM=6XD4S6BDC8 build`, `xcrun devicectl device install app --device <udid> <dir>/Build/Products/Release-iphoneos/App.app`, and launch `com.curasense.app`. Capacitor is 8.6.0 on Swift Package Manager (no Pods, no workspace); `dist` and `ios/App/App/public` are gitignored. Like the native app, the old app keeps the address it was built with, so a new network needs a rebuild. The native app (CuraSense Beta) did reach the server: the owner's sign-up created `omi930191@gmail.com` in `medical_ai_db` at 11:28:53 phone time. The dev database is `medical_ai_db`, not `curasense` (`mongosh mongodb://localhost:27017/medical_ai_db`). That sign-up stopped after step 1: `totpEnabled` is false, so signing up again says "Email already in use", and `login` (`auth.controller.js`, around lines 97 to 109) issues a full token to any account whose `totpEnabled` is false, so an abandoned sign-up stays a password-only account; add this to the go-live security fixes. A phone's request to port 5001 is too short for `netstat` sampling to catch; a new row in `users` is reliable proof that a request arrived.

Obsidian vault of the project graph: `~/.local/bin/graphify export obsidian` (graphify is a `uv tool` at `~/.local/bin`, not on PATH) writes `graphify-out/obsidian`: one note per graph node (2,997), 191 community notes (`_COMMUNITY_*`, only 5 have names, the rest are `Community N`) and `graph.canvas`. Obsidian itself is not installed on this Mac. Re-run the export to refresh it after the graph changes.

**2026-11-17 (R6c, loading animations in the native app).** The owner pasted a list of twenty loader names (Spinner Arc, Bouncing Dots, Pulse Rings, Indeterminate Bar, Skeleton Shimmer, Orbit, Equalizer Bars, Square Morph, Liquid Fill, Dot Grid Wave, Infinity Trail, Flipping Square, Gradient Ring, Typing Dots, Spoke Spinner, Percent Bar, Chasing Squares, Text Shimmer, Battery Charge, Bouncing Ball) and asked to use them "wherever you can and as much as you can" and "something more amazing if possible". Native app only: the website keeps the reading-lens loading page the owner chose earlier. No new dependency (built-in `Animated` plus the installed `expo-linear-gradient`). `apps/mobile/src/loaders/`: `catalog.ts` (the twenty in the owner's order, with where each is used; Node-tested), `motion.ts` (one looping clock per loader, everything else is an interpolation of it; `curve(clock, fn, n, phase)` bakes the phase into the sampled curve; `NATIVE = Platform.OS !== 'web'`), `pure.ts` (figure eight, `withAlpha`), `frame.tsx` (accessible box: one progress indicator, or hidden when `label={null}`), `spinners.tsx`, `dots.tsx`, `bars.tsx`, `shapes.tsx`, `shimmer.tsx` (Skeleton, SkeletonGroup, ShimmerText), `previews.tsx`, `LoadStatus.tsx`, and the flagship `ReadingLens.tsx`. The flagship is the wait for an AI analysis: an orb with pulse rings glides along a figure-eight path with a fading trail over the person's OWN input (chips for symptoms, the chosen image or a file card for scans, the first lines of the text for reports; drawn on the phone only) while a beam scans, in the colour of the tool (blue, purple, pink), under a text-shimmer title, typing dots, a real timer and a per-tool signature (Orbit, Dot Grid Wave, Liquid Fill). It replaces the plain spinner in `src/analyze/Loading.tsx` (testID `loading` kept; without a kind it is a Gradient Ring). Wiring: buttons (Spinner Arc, Spoke Spinner for link buttons); Welcome (Equalizer Bars, Bouncing Dots, Square Morph per pending row, and a Battery Charge that fills as the real loads finish); Home and History (Skeleton Shimmer tiles and rows, a sliding bar while the first load runs, Chasing Squares while pulled to refresh, Bouncing Ball in the empty-list caption); Percent Bar for the real counts of scan files (of 6) and report characters (of 60,000), never for an invented percentage; Settings, About, Loading animations shows all twenty with where each is used (Flipping Square has no real wait yet and appears only there). Reduce Motion gives a still frame. Traps found: in the browser build `Animated.loop` with `useNativeDriver: true` plays ONE iteration (the welcome already used a web-only `false`; use `NATIVE`); derived `Animated.add` / `modulo` nodes stop updating after a re-render on web, so there are none, and every loader is wrapped in `memo` so it keeps its animated nodes (never build animated nodes in a parent that re-renders each second); transforms need the loop to end at a seamless value (`fn(0)` equals `fn(1)`), and a sawtooth needs its own clock because sampling smears a jump. Tests: `src/loaders/catalog.test.ts` (4), web-build flow `mobile-loaders.cjs` (all twenty present and moving, Reduce Motion stops them, skeletons during a slow first load, the three waits showing the person's own symptoms, pasted text and image, no page errors). The accessibility and 2x text-size scripts also cover the gallery and the symptom and report waits (0 issues at 430 and 375 points). The reading lens is at least 200 tall and grows with large text; its beam has its own clipped layer, because a beam resting below the lens made the container's scroll height 64 taller and tripped the overflow check. Native proof on the iPhone 17 Pro simulator (a throwaway tour build, reverted; frames on a fixed cadence because animations never settle, so the old settled-frame grabber cannot be used): all twenty rows animate (percent bar counting, chasing squares, text sheen, battery charging, ball with squash and shadow), the four waits (symptoms, scan over an image, report, plain ring) show the orb, trail, rings, beam, timer and signature loader, and the full sign-in welcome shows the three row loaders and the battery filling as the real loads finish. Not verified natively: the Home and History skeletons (the first load is too fast to catch; the same Skeleton is in the gallery), the pull-to-refresh strip, button spinners, VoiceOver, performance on a real device. Simulator traps: `simctl install` needs a bundle path that still exists (uninstalling deletes the container, so install from DerivedData), `simctl keychain <udid> reset` clears the saved session so the next launch is a full sign-in, and a leftover process from an older tour build can keep navigating (relaunch after `terminate`, and check frames against the tour you wrote). expo-doctor is 19 of 20: upstream patch releases expo 58.0.26 and expo-router 58.0.32 are out; not applied (a patch bump needs a rebuild and its own regression run).

---

## 11. Known issues, risks and technical debt

### Security gaps (all pre-existing; none introduced by the recent work; none fixed unless the owner asks)

1. **`/forgot-password` returns the reset code in its JSON response** and the UI shows it. No email is ever sent (the SMTP variables and nodemailer are unused), yet the reset screen's copy says the code comes "from your email". It also answers 404 for unknown accounts (account enumeration), generates the code with `Math.random`, and neither it nor `/verify-reset-code` nor `/login` is rate limited, so a 6-digit code can be brute-forced.
2. **A hard-coded admin bootstrap account** is created at start-up in `backend/node/src/config/db.js`, with the password in source. A default `JWT_SECRET` fallback exists in `backend/node/src/config/env.js`. If `.env` ever loses the variable, tokens become forgeable. Node also logs the full `MONGODB_URI` when it connects.
3. `cors()` is fully open on Node; `express.json` accepts 50 MB; the in-memory rate limiter is per process (use a shared store before running more than one Node instance).
4. The Python gateway binds `0.0.0.0:8000`; `verify_gateway_auth` compares the secret with `!=` (not constant time) and accepts an empty bearer token when `GATEWAY_SECRET` is unset, so with no secret anyone on the network can spend DeepSeek credit. The Vite dev server also binds `0.0.0.0` with `allowedHosts: true`.
5. The `index.html` CSP allows `'unsafe-inline'`, `'unsafe-eval'` and any `https:` script source.
6. TOTP secrets are stored in plain text in MongoDB. `verifyToken` trusts the JWT alone, so a deleted user or a changed role keeps working for up to 24 hours.
7. Health data is not logged by Node (only status codes), but the text and files go to third-party LLM providers; the public copy says so.

### Product and code debt

- "Like" in History is local only (state plus the `localStorage` cache); the server has a `liked` field but no endpoint updates it.
- Booking is a browser-only simulation (labelled as such). Wearable "sync" stores whatever a client posts; there is no HealthKit integration.
- `NarrativeReel.tsx` contains unbacked figures (see 7.2). Translations are partial (7.4).
- Stale docs: README, RUNNING, PROJECT_SUMMARY, QUICK_START, SETUP_INSTRUCTIONS, BACKEND_SETUP, AI_MODELS_GUIDE, IMPLEMENTATION_GUIDE, FEATURES_CHECKLIST (all "MediAI Pro" and Supabase). `START.md`, `CHANGELOG_REFACTOR.md` and `REDESIGN_PLAN.md` are current for what they cover.
- Dead weight: `supabase/`, `utils/supabase/`, `src/legacy/_unused` (21 files, with type and lint errors), unused dependencies (section 2), server packages in `frontend/package.json`, the root `dist/`.
- **App Store and Google Play need account deletion inside the app** (Apple guideline 5.1.1(v)); CuraSense has none (no `DELETE` route for a user's own account, no Settings button). A store submission would be rejected until it exists. Also needed for the stores: a privacy-policy URL, the health-data declaration (data goes to DeepSeek), a live https backend, a bundle id the owner owns (`com.curasense.app` is a placeholder).
- The Android project (`frontend/android`) has never been built: this Mac has no JDK, Android Studio or SDK.
- Large files that would benefit from splitting: `ConsultationBooking.tsx` (1,360), `NarrativeReel.tsx` (1,302), `Settings.tsx` (1,188), `PredictionHistory.tsx` (1,092), `ImageAnalysis.tsx` (805), `scenes/cell/parts.tsx` (755), `documents.py` (686).
- `tsc` 39 errors and ESLint 11 problems, pre-existing (section 4).
- Provider fallbacks (Hugging Face, Mistral, Groq) are untested with real keys and are placeholders in `.env`.
- DeepSeek behaviour varies by day (the stall finding). Any "AI failed" report should start with timing raw calls.
- The Python `triage.py` function name `analyze_symptoms_with_mistral` is a leftover from an earlier provider.

---

## 12. What has not been verified

- Safari and Firefox (CSS `mask-image` for the iris, WebGL, View Transition fallback, `translate` keyframes), a real phone (touch, small layouts, the loading page on mobile), a real 120 Hz display, headed Chrome beyond the owner's own use, and screen readers.
- Update 2026-11-12: real WebKit is now covered (Playwright WebKit with an iPhone 15 profile, and the iOS simulator's own WKWebView). Still not checked: Firefox, any physical iPhone or Android phone (so no real phone frame rates; the Mac's GPU is far faster), the camera and photo picker on a device, Android Studio builds, and store submission.
- The login path for a user without 2FA, in e2e.
- The `GATEWAY_SECRET`-unset case on Python.
- The fallback providers with real keys.
- Whether the graphify LaunchAgent is still running.
- The narrow (446 px wide) landing layout puts the headline over the bright cell with no glass plate (noticed, not fixed, not asked).

---

## 13. Open items and suggested next steps

The owner said "after this we have more things to work on" without saying what. Ask what they want before starting anything large. Reasonable options to offer, in order of value:

1. **Commit the work** in logical commits (needs the owner's go-ahead). It is the single biggest risk: 75 uncommitted entries, several untracked and essential.
2. **Security hardening** (section 11, items 1 to 6): remove the reset code from the response or add real email delivery; rate limit login and reset; move the admin seed and the JWT secret fallback out of source; constant-time gateway compare and refuse an empty secret; tighten CORS, body limit and CSP.
3. **Replace the stale root docs** with one accurate README.
4. **Device checks**: Safari, Firefox, a phone, a 120 Hz screen.
5. **Going live on the web** (asked on 2026-11-12: the owner answered **not yet**; if they later say yes, their pick is Railway, which the repo's `railway/*` branches also suggest; nothing was deployed or published): the website, the Node API and the Python gateway would each need a home, plus MongoDB, https, a `CORS` list that includes `capacitor://localhost`, and the security items above. The phone apps need that https backend before anyone but the owner can use them.
6. **Housekeeping**: remove dead dependencies and `legacy/_unused`, fix tsc and ESLint noise, persist "like" or remove it, decide whether booking gets a backend.

---

## 14. First ten minutes for a new session

```bash
cd ~/Downloads/CURASENSE/CuraSense-main
git status --short | wc -l                    # about 75; confirms the uncommitted state
git log -3 --format='%h %ad %s' --date=short
lsof -nP -iTCP:8000,5001,5173 -sTCP:LISTEN    # are the owner's servers up? (do not touch them)
brew services list | grep mongodb             # MongoDB running?
(cd backend/python && .venv/bin/python -W ignore -m unittest test_routing test_deepseek test_reports 2>&1 | tail -3)
(cd backend/node && npm test 2>&1 | tail -8)
```

Then read: this file, `START.md`, `NATIVE.md`, and `graphify-out/GRAPH_REPORT.md` (an architecture map; `graphify-out/graph.html` is interactive). If you are Claude Code in this project, auto-memory notes sit outside the repo under `~/.claude/projects/<project-slug>/memory/` (14 notes; their content is folded into this file, so another tool can ignore them).

Run the Playwright suite (`cd frontend && npm run test:e2e`) only when nothing else is editing the source. Before changing AI behaviour, read section 6 and the measured numbers; before changing anything visual, read 8.1 to 8.7 and the working agreements in section 0.

---

## 15. The iPhone and Android apps (added 2026-11-12)

The owner asked for the website as an iOS and Android app "without any issues or lag", pushed into Xcode and configured there, and to be asked before anything is put live on the web. Practical guide for the owner: `NATIVE.md`. What follows is for whoever maintains it.

**How it works.** Capacitor 8.6 wraps `frontend/dist` (the Vite build) in a native shell. `npm run app:sync` builds the site and copies it into both native projects (`ios/App/App/public`, `android/app/src/main/assets/public`, both git-ignored); `npm run app:ios` and `npm run app:android` also open Xcode or Android Studio. `npm run app:assets` regenerates every icon and splash size from `frontend/assets/*.png` (rendered from the public site's brand mark; the sources are plain PNGs, edit them freely). The shell config is `frontend/capacitor.config.json` (JSON on purpose: the CLI would need the `typescript` package, which this project does not install, to read a `.ts` config, and an ESM `.js` config is read wrongly). Do not run `cap add` again (it would overwrite the hand configuration below), and **never set `server.appStartPath`**: with it the iOS app closed itself a second after launch.

**Where the app talks to.** The same Node API; the address is baked in at build time from `VITE_NODE_BASE_URL` (default `http://localhost:5001`). `vite.config.ts` has a tiny plugin that puts that address's origin into the page's Content-Security-Policy in `index.html` (the `__API_ORIGIN__` placeholder; keep it). iOS allows plain http only for local-network addresses (`NSAllowsLocalNetworking`); everything else must be https. Android debug builds allow cleartext through `android/app/src/debug/AndroidManifest.xml`; release never does. Node's CORS is open, so the app's origins (`capacitor://localhost` on iOS, `https://localhost` on Android) are accepted; if CORS is ever restricted, add them.

**iOS configuration (hand-made, in the generated project).** `Info.plist`: portrait only on iPhone (iPad rotates), `arm64` required, camera and photo-library usage texts, a local-network usage text, App Transport Security local networking, `ITSAppUsesNonExemptEncryption = false`. `LaunchScreen.storyboard` background is the page's navy `#05070f`. Bundle id `com.curasense.app`, version 1.0 (1), deployment target iOS 15, Swift packages (no CocoaPods). The Team is not set: the owner picks it in Xcode (Signing & Capabilities); setting a Team needs their Apple ID.

**Android configuration (hand-made, never built).** Manifest: backup off (the saved sign-in lives in the web view's storage), `CAMERA` permission with the camera feature optional (the file picker then offers the camera). Theme: `forceDarkAllowed=false` (the page has its own themes), navy window and splash background. `MainActivity` calls `EdgeToEdge.enable(this)` as the SystemBars plugin asks. `minSdk 24`, `targetSdk 36`.

**Native glue.** `src/app/native/index.ts`: does nothing in a browser; in the app it adds `native` and `ios` or `android` to `<html>`, lifts the splash two frames after first paint (`launchAutoHide` is off), keeps the system bar text readable on both themes (`SystemBars.setStyle`, called from `setTheme` in `App.tsx`), and on Android routes the back button through a stack of handlers (`useBackHandler`: open menu, then back to dashboard, then browser history, then exit). `src/styles/native.css`: tap highlight and double-tap-zoom off on touch screens; inside the app no rubber-band, no long-press callout, no accidental selection (text you read stays selectable); `.cs-inset` moves the landing cell and its labels down by the notch inset.

**Phone fixes in the website itself.** Safe areas: `--sn-h` includes `env(safe-area-inset-top)` so the public nav, hero offsets and drawers move together; the signed-in header pads its content below the inset while its background reaches the top; the drawers, dialog height, footer, intro Skip button and the loading page pad for the notch and home bar. The signed-in drawer has a **Sign out** button (the profile menu is `hidden sm:flex`, so phones had no way out). The Analyze tab labels are always visible (they were `hidden sm:inline`, so phones saw bare icons with no accessible name). Inter is self-hosted (`main.tsx` imports `@fontsource-variable/inter/wght.css`; `--font-body` lists `'Inter Variable'`; the Google Fonts links and their CSP entries are gone; `--font-mono` no longer names JetBrains Mono, which nothing used). `color-scheme` follows the theme so native controls and the phone keyboard match. The no-flash script in `index.html` sets it too.

**The phone performance profile (the "no lag" part).** `animations/deviceTier.ts`: `isPhone()` is a coarse pointer with a short screen side under 500 CSS px. Apple devices (iPhone, iPad, iPadOS) are always at least `mid`, because WebKit reports at most 4 cores whatever the chip, which used to read as `low` (no cell, no particles). Any other phone is capped at `mid`, never `high`, even with 8 cores. `CellScene.tsx` has a `phone` quality entry (the `mid` scene at up to 1.5x pixel ratio; the resolution governor still steps it down); `PageScene.tsx` uses 2,600 particles on a phone (4,200 mid, 9,000 high). Measured on the Mac's GPU in Chrome with the phone profile versus the old behaviour: both 60 fps even with the CPU slowed 4x; uncapped, the median frame costs 0.6 ms against 1.0 ms and the 95th percentile 2.1 ms against 4.0 ms. The Mac's GPU is many times faster than a phone's, so this shows direction, not phone frame rates.

**Verified.** `xcodebuild` for the iPhone 17 Pro simulator succeeds with Xcode 27.2 (one warning); the app installs, launches, shows the landing page with the 3D cell in light and dark appearance, puts content below the Dynamic Island, and its web view reached the Node API (a temporary probe in the build copy; removed afterwards). The 10 phone tests pass (9 run, 1 skipped on iPhone), mutation-checked (re-breaking the tab labels, the phone tier rule and the header inset each makes its test fail). Desktop Playwright 41/41, `tsc` 39 errors and ESLint 11 problems, all unchanged from the baseline.

**Traps found.** (1) The iOS simulator's `simctl` hung for minutes on its first use after the Xcode update; it needs the runtime install to finish once. (2) A running simulator app (continuous WebGL) plus this Mac's 8.7 of 10 GB swap made the timing-sensitive intro Skip test fail in full desktop runs (passes alone, and in full once other apps were stopped): do not judge e2e results while the simulator or other heavy apps run. (3) `page.goto` while a lazy chunk is loading makes WebKit report "Importing a module script failed"; the phone spec waits for `networkidle` between pages. (4) After a sign-out the page reloads, so a test seeding the session with `addInitScript` must seed only once (`signedInAs` in `e2e/helpers.ts` does). (5) `Emulation.setSafeAreaInsetsOverride` (Chromium) emulates a notch for screenshots and tests, but the app only reacts to `html.native` for the cell offset.

**Not done.** Account deletion (store requirement), a bottom tab bar for phones (the drawer works; a tab bar would be a design change the owner has not asked for), push notifications, deep links, biometric sign-in, secure token storage (the session is in web storage like on the website), the Android build and every real-device check.

---

## 16. The React Native app (`apps/mobile`, added 2026-11-12)

**What it is.** An Expo SDK 58 / React Native 0.88 app that calls the same Node API as the website. It is the owner's chosen direction for the phone apps; the Capacitor projects in `frontend/ios` and `frontend/android` stay untouched and shippable until the new app reaches parity (the owner wants full parity before it counts as done). It is an independent npm project (own `package-lock.json`), deliberately not part of the pnpm workspace: Metro and pnpm's linked `node_modules` do not mix well, and the website's install stays as it was.

**Layout.** `app/` is Expo Router: `index.tsx` (sends "/" to the right place), `(auth)/` (sign-in, sign-up, forgot-password), `(tabs)/` (home, analyze, history, book, settings). `app/(tabs)/settings/` is a nested stack (the list, AI language, family members, emergency contacts) with `src/settings/` (the settings context, the rows and the floating save notice); `app/(tabs)/book/` is a nested stack (the wizard, `mine`, `[ref]`) with `src/book/` (bookings context and parts), and also sets `initialRouteName`; `src/emergency/` holds the emergency sheet and the prompt that `ResultView` shows; `src/welcome/` holds the welcome overlay, its timeline and its ECG geometry; `src/haptics.ts` holds the haptic taps, `src/ui/Icon.tsx` the icon wrapper and `src/ui/ShareButton.tsx` the share button; its layout sets `unstable_settings.initialRouteName` so a reload on a sub-page keeps the list underneath it. The Analyze and History stacks do not set it yet, so a reload on a history report shows the report with no list under it (web only; there are no deep links into the app). `src/auth/` holds the session (`AuthContext`, secure `storage`, `isTokenExpired`), `src/ui/` the small component kit (text, button, text field, six-box code input, banner, card, screen), `src/theme.ts` the colours from the shared theme tokens (follows the phone's light or dark setting). `app/(tabs)/home.tsx` is the dashboard, `app/(tabs)/history/` a nested stack (list, `[id]` full report) with `src/history/` (the predictions context, rows and report sections). `app/(tabs)/analyze/` is a nested stack (menu, symptoms, scans, reports) and `src/analyze/` holds its parts: the file pickers (`pick.ts`: photo library, camera, Files app, and the conversion to what the shared upload functions take), the result view, the answer-text renderer, the wrong-page notice and the loading view. Shared code comes from `packages/shared` through `metro.config.js` and the `@curasense/shared` path in `tsconfig.json`; the website uses a Vite alias for the same package.

**Run it.** `cd apps/mobile && npm install`. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` (the simulator can use `http://localhost:5001`; a real iPhone needs the Mac's address on the same Wi-Fi). `npx expo start` for the dev server, `npx expo run:ios` to build and open the iOS simulator (this generates the git-ignored `ios/` folder with CocoaPods). `npm run typecheck`; `node --test src/auth/token.test.ts`. The backend's CORS allow-list does not matter to a native app (it sends no Origin header); the web build used for testing runs from `http://localhost:<port>`, which the dev allow-list accepts.

**On a real iPhone (steps and checklist, prepared 2026-11-16; nothing below has been run on a phone yet).** The dev stack from `./start-dev.sh` must be running (Node API on port 5001, Python gateway on 8000, MongoDB). A phone cannot use `localhost`: build the app with `EXPO_PUBLIC_API_URL=http://<the Mac's address>:5001` (`ipconfig getifaddr en0`). The Release configuration embeds the JavaScript, so no Metro server is needed. Steps: (1) On the iPhone turn Developer Mode on (Settings, Privacy & Security; it restarts the phone), connect it by cable, unlock it and tap Trust. (2) `cd apps/mobile && npx expo prebuild --platform ios --no-install` after any `app.json` change (it merges into the git-ignored `ios/` folder). (3) Signing: open `ios/CuraSense.xcworkspace`, select the CuraSense target, Signing & Capabilities, tick Automatically manage signing and choose your Team (a free Apple ID team works for 7 days at a time). If Xcode says the bundle identifier `com.curasense.mobile` is not available, change it to something unique for the test; it is a placeholder and R7 needs the real one. (4) `EXPO_PUBLIC_API_URL=http://$(ipconfig getifaddr en0):5001 npx expo run:ios --configuration Release --device <UDID>` (`xcrun devicectl list devices` shows the UDID). (5) On the phone: Settings, General, VPN & Device Management, trust the developer app; open CuraSense and allow Local Network access when asked (the app needs it to reach the Mac; `NSLocalNetworkUsageDescription` is in `app.json`). The Mac and the phone must be on the same network. A Mac that is a client of the phone's own Personal Hotspot has an address like 172.20.10.2; if the app cannot reach the server that way, put both on the same Wi-Fi. Analyses on the phone use the real AI gateway and cost what they cost. A `tel:` link shows iOS's own confirmation before a call: tap Cancel when testing the emergency button.\n\n**What only a real phone can confirm (the checklist).** Sign in: the welcome (beating mark, rings, ECG line, the checklist ticking, Skip), the success tap at the end, the short welcome after force-quitting and reopening, and Reduce Motion (Settings, Accessibility, Motion) making it still. Settings: haptics on every switch and segmented control, the failed-save undo with airplane mode on. Analyze: a symptom analysis, a photo from the library, a photo from the camera, a PDF from the Files app, and the loading view. Emergency: turn the prompt on, add a contact with your own number, run a symptom text that describes a real emergency (for example crushing chest pain spreading to the left arm with sweating and breathlessness; the real AI decides whether it is marked EMERGENCY), then check the sheet opens by itself, Call emergency services shows iOS's confirmation (Cancel it), Call and Message on the contact open the dialler and Messages with the note typed in (do not send, or send it to yourself). Share: the Share button on a result and on a History report, into Notes and Messages. Booking: the wizard, haptics on choices and slots, the saved booking in My bookings. Accessibility: VoiceOver (Settings, Accessibility, VoiceOver) through Settings, the booking wizard and the emergency sheet, listening for unlabelled stops and for the sheet and welcome being announced; Larger Text at the largest accessibility size through Settings, Book, History, the emergency sheet; Bold Text; Increase Contrast. Appearance: light and dark, the in-app High contrast and Large clinical text switches, the status bar colour on the welcome, the splash screen. Account: sign out, sign in again (settings and bookings are per account), a wrong password and a wrong code.\n\n**Decisions and traps.**
- The token is kept in the Keychain or Keystore (`expo-secure-store`); the web build falls back to `localStorage` so the flows can be tested in a browser. An expired token (the JWT `exp` claim) is dropped at launch.
- The bundle id and Android package are the placeholder `com.curasense.mobile` (the Capacitor app uses `com.curasense.app`); both are store-readiness items (R7).
- `app.json` has no typed routes and no extra native modules yet; each later stage adds only what it needs. `@expo/vector-icons` needs `expo-font` installed directly (the doctor check says so).
- The forgot-password screen shows the reset code the server returns, exactly like the website, because no email service exists; when the backend stops returning it (go-live), the screen just does not show it.
- `npx expo install` failed here for packages that were not yet installed (a spawn error from the Expo CLI under Node 26); plain `npm install <package>@<version from expo/bundledNativeModules.json>` works.
- In the web build a stack keeps earlier screens mounted but hidden, so test selectors must be limited to visible elements.
- Settings: react-native-web does not expose `accessibilityState.selected` as an attribute, so a browser test reads the selected segment by its fill colour (`rgb(38, 103, 255)`), and a `Switch` by `getByRole('switch', { name })`. `Linking.openURL('tel:...')` on the web build sets `window.location`, so a test reads it from the CDP event `Page.frameRequestedNavigation`; the real dialler can only be checked on an iPhone. Icon glyphs are private-use characters in `innerText`, strip `[\uE000-\uF8FF]` before comparing. The copy of the settings on the phone (dependents' names, birth dates and allergies, emergency contacts) is in AsyncStorage, which the app does not encrypt, and is wiped at sign-out; the go-live review may want it in SecureStore or not kept at all.
- Booking: a browser test of the date strip near midnight needs `timezoneId: 'Asia/Kolkata'` on the context and `page.clock.setFixedTime(<today 20:00 UTC>)` (01:30 the next morning in India). Reloading on `/book/mine` reopens the app on My bookings (with the wizard underneath), so a test must not wait for the Home greeting after a reload. In React Native 0.88 a `ScrollView` ref is typed `ComponentRef<typeof ScrollView>`.
- Emergency prompt: a React Native `Modal` opens over everything whichever tab is showing, and tabs keep their screens mounted, so anything that opens a Modal from state must not react to settings changed on another tab (the prompt reads the setting once, when the result appears). The web build sends `tel:` links through `window.location` (read them with the CDP event `Page.frameRequestedNavigation`) and `sms:` links through `window.open`.
- To see a screen natively that needs a signed-in session (the simulator cannot be tapped): add a temporary route that renders it with stand-in data, point `app/index.tsx` at it, build with `npx expo run:ios --configuration Release --device "iPhone 17 Pro"`, capture frames with `xcrun simctl io <udid> screenshot`, then revert. Do not commit it. In the web build `Animated.timing` reads `Date.now()`, so a test that freezes the clock (`page.clock.setFixedTime`) freezes every animation; the welcome's exit therefore also has a timer.
- macOS clears files in `/tmp` that have not been touched for about three days, at midnight: the web-test launcher, the static server and the sign-in and Analyze scripts vanished mid-regression, and the run then reported failures that were not code failures (re-run a failing harness alone after restoring the scripts before blaming the code). Keep harness scripts somewhere durable or touch them. The device address is baked into the app at build time, so a new network needs a rebuild with `EXPO_PUBLIC_API_URL=http://$(ipconfig getifaddr en0):5001`; to install without Xcode: `xcodebuild -workspace ios/CuraSense.xcworkspace -scheme CuraSense -configuration Release -destination 'generic/platform=iOS' -derivedDataPath <dir> -allowProvisioningUpdates DEVELOPMENT_TEAM=<team id> CODE_SIGN_STYLE=Automatic build`, then `xcrun devicectl device install app --device <udid> <dir>/Build/Products/Release-iphoneos/CuraSense.app` and `xcrun devicectl device process launch --terminate-existing --device <udid> com.curasense.mobile`. `npx expo prebuild` regenerates `ios/` without Pods: run `pod install` in `ios/` afterwards. UIKit cannot navigate or present while a native sheet or Modal is presented or still leaving.
- Welcome: every browser test that signs in or loads a saved session now sees the overlay (up to about 3 s after a sign-in, 1.2 s after a reload) and Playwright waits for it because the overlay intercepts clicks; tests of the welcome itself read timings with `Date.now()`, slow or fail the settings and predictions calls with `page.route`, and use `reducedMotion: 'reduce'` on the context for Reduce Motion. A box-shadow in react-native-web follows the element's own border radius, so put the radius on the element that carries the shadow; and an element later in the tree paints over an earlier one, so layers that must stay on top need a `zIndex`.
- Accessibility and text size: import icons from `src/ui/Icon` (it hides them from VoiceOver); a text-size check in the web build scales every text node with a script (react-native-web has no Dynamic Type), ignores the bottom tab bar (clipped by the page edge in the web build) and treats nodes under `[inert]` as absent (react-native-web marks screens that are not showing `inert`, they are not `display: none`).
- No test files are committed for the screens yet. The flow script used for the checks (export the web build with `EXPO_PUBLIC_API_URL` pointing at an isolated backend, serve it, drive it with Playwright and `otplib`) lived in the scratchpad; a committed native e2e tool (Maestro, a new tool) needs the owner's approval.

**Not done yet.** R6c (animated loading screen), R7 of the plan, a real-iPhone check of the emergency buttons, real Apple Watch data, a real profile and password change (needs two new API routes, which the owner must approve), the Auto-Alerts feature if the owner wants it built for real, the AI settings reaching the AI prompts (owner's decision), language switching for the app's own text (it is English only so far; the shared `translations.ts` is ready), the animated welcome and native polish (haptics, share sheet, VoiceOver, the website's animated loading screen instead of the plain spinner view), store readiness. Left out of R3 on purpose: the website's client-side reading of text files on the Scans page (it refuses lab-looking text before upload; the app leaves that to the server's page gating), and the camera path is untested (it needs a real device). Verified in the web build, as an iOS bundle, and natively on the iPhone 17 Pro simulator (a Release build with the JavaScript bundle embedded: it installs and launches, the sign-in screen is right in light and dark, and text scales cleanly up to the largest accessibility size). The simulator cannot be tapped from the command line, and a deep link (`xcrun simctl openurl booted curasense:///sign-up`) only raises iOS's "Open in CuraSense?" alert, which survives relaunches until the simulator is rebooted; so the sign-up, sign-in and reset flows are checked in the web build. `npx expo run:ios --configuration Release --device "iPhone 17 Pro"` builds, installs and opens the app (the first build compiles React Native through CocoaPods and takes several minutes); it ends with an error at its last step because AppleScript cannot focus the Simulator window, even though the build, install and launch succeeded. Expo's tooling rewrites `tsconfig.json` on its own runs, so the committed copy is the formatted one it produces. The iPhone 15 Plus run (needs the signing team set in the generated Xcode project and `EXPO_PUBLIC_API_URL` pointed at the Mac's address) and everything on Android are still to do.
