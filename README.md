# CuraSense

AI-assisted analysis of **symptoms**, **medical scans** and **lab reports**, shown in plain language with an urgency level and the next steps. It runs as a website and as an iPhone app (React Native, in beta).

CuraSense is **informational and is not a medical device.** Every result says so, and a clinician makes the decision.

## What it does

A signed-out visitor sees a public site (Home, Platform, Approach, Access) with a live system-status panel. After creating an account, a user gets:

- **Symptoms**: pick from 197 symptoms in 14 categories, or describe their own. The AI returns likely conditions with probabilities, an urgency level (all clear, monitor, concerning, emergency) and recommendations.
- **Scans**: choose one of about 60 studies (X-ray, CT, MRI, ultrasound, nuclear, mammography and more) and upload an image, a DICOM file, a ZIP of a study, a scanned PDF or a written report. Every page of a file is checked on its own, and a page that is not the chosen kind of scan is refused with a button to the right page.
- **Reports**: paste lab text or upload almost any document. The AI extracts each biomarker with its range and a flag, and writes an assessment.
- **History and dashboard**: every saved analysis, counts, and a filter for the ones the user marked.
- **Settings**: display name and password, language (ten, with partial coverage), units, high contrast, large text, family members, and emergency contacts. With Auto-Alerts on, an emergency result offers Call and Message buttons for those contacts. The buttons are links the person presses; CuraSense never calls or sends anything itself.
- **Overwatch** (admin only): platform counts, the user list, and the latest analyses.

Marked as demonstrations on screen: booking an appointment (saved in the browser only), the wearable readings in Settings (generated, not from a device), and the AI preferences (saved, not yet used by the AI).

Sign-in uses a password plus a six-digit code from an authenticator app.

## How it works

```
browser or phone app ──► Node API (Express) ──► Python AI gateway (FastAPI) ──► DeepSeek API
   JWT, uploads            auth, rate limits,       reads files, checks page type,      text and vision models
                           MongoDB (users,          builds the prompts
                           analyses)
```

The browser never calls the Python service, and the gateway secret lives only in the two servers. The Node server can also serve the built website, so one address is the whole product.

| Folder | What it is |
|---|---|
| `frontend/` | The website: React 18, TypeScript, Vite, Tailwind, three.js for the 3D scenes |
| `apps/mobile/` | The iPhone app: Expo and React Native, English first |
| `packages/shared/` | Code both clients use: API client, translations, analysis and settings logic |
| `backend/node/` | Express API, MongoDB through Mongoose, TOTP sign-in |
| `backend/python/` | FastAPI gateway: file reading, routing, prompts, provider calls |

## Run it

You need Node, Python 3.12 and MongoDB (`brew services start mongodb-community@8.0` on a Mac), a `backend/.env` (see `backend/python/.env.example`), and a DeepSeek API key in it for real analyses. One-time setup is in `START.md`.

```bash
./start-dev.sh     # development: three servers, the site on http://localhost:5173
./start-prod.sh    # production build on one address, for a presentation (see PRESENTING.md)
```

## Test it

```bash
cd backend/node && npm test                                                       # API tests
cd backend/python && .venv/bin/python -W ignore -m unittest test_routing test_deepseek test_reports test_gateway_auth
cd frontend && npm run test:e2e                                                   # Playwright, on its own ports and database, with a fake AI
cd packages/shared && npm test
```

The end-to-end tests never call the real AI and never touch the development database.

## More

- `PRESENTING.md`: running it for an audience, what is switched off, what a public launch needs.
- `HANDOFF.md`: the full technical record: architecture, the AI pipeline and its measured results, security notes, known limits, work log.
- `NATIVE.md`: the Capacitor app that wraps the website, and `START.md`: local setup.
- `ATTRIBUTIONS.md`: third-party material.

Other markdown files in the repository root (`QUICK_START.md`, `SETUP_INSTRUCTIONS.md` and similar) describe an earlier version of the project and are out of date.
