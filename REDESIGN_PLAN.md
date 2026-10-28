# CuraSense redesign: Phase 0 audit and plan

Status: **Phase 0 only. No redesign code has been written under this brief.** This document needs sign-off before Phase 1.

## 1. Current architecture

```
Browser (React 18 + TS + Vite, frontend/)
  ├─ Node/Express gateway  :5001  (backend/node)  auth, predictions, settings, wearables, admin; MongoDB
  │     └─ proxies /analyze-symptoms → Python (Bearer GATEWAY_SECRET)
  └─ Python FastAPI gateway :8000 (backend/python) AI calls (DeepSeek only; Mistral/Groq/HF keys are placeholders)
        called DIRECTLY from the browser by SymptomChecker, ImageAnalysis, ReportAnalysis, and the welcome-page health probe
```

- **No client-side router.** `App.tsx` switches pages with `activeTab` state (`dashboard | analyze | history | booking | settings | admin`). No URLs, no deep links, no back button.
- **Auth state:** `localStorage` keys `curasense_token`, `curasense_user`, `curasense_theme`, plus a per-user prediction cache `curasense_pred_<userId>`. `isAuthenticated = !!curasense_token`.
- **Pages (`frontend/src/app/features/`):** auth (`WelcomeScreen`, `NarrativeReel`), dashboard, symptom-checker, image-analysis, report-analysis, history, booking, settings, admin.
- **i18n:** 10 languages (en es fr de hi ar zh ja pt ru) in `i18n/translations.ts`, but only about 38 `t()` calls exist. Most UI text is hard-coded English.
- **Tooling:** Vite 6, Tailwind 4, shadcn/Radix UI set, GSAP, Lenis, three + R3F + drei + postprocessing, `@rive-app/react-canvas`, `motion`. **No tests, no Playwright, no Astro, no git repository.**
- **Environment:** `frontend/.env` has `VITE_API_TOKEN`, `VITE_API_BASE_URL`, `VITE_NODE_BASE_URL`. `backend/.env` has `MONGODB_URI`, `PORT`, `JWT_SECRET`, `SMTP_USER/PASS`, `HF_TOKEN`, `GATEWAY_SECRET`, `GROQ_API_KEY`, `MISTRAL_API_KEY`. Node config also reads `PYTHON_AI_URL`.

## 2. API contracts the frontend depends on (must not change)

**Node, base `VITE_NODE_BASE_URL`, `Authorization: Bearer <curasense_token>` where noted**

| Method | Path | Auth | Used for |
|---|---|---|---|
| POST | `/register` | none | sign-up, returns `setupToken` |
| POST | `/totp-setup` | Bearer setupToken | QR + manual key |
| POST | `/totp-verify` | Bearer setupToken | finish sign-up, returns token |
| POST | `/login` | none | returns token, or `requiresTotp` + `totpToken` |
| POST | `/login-totp` | Bearer totpToken | 2FA login |
| POST | `/forgot-password`, `/verify-reset-code`, `/reset-password` | none | 3-step reset (code is currently returned to the client, no email) |
| POST | `/analyze-symptoms` | token | proxied to Python |
| POST | `/analyze-image`, `/analyze-report` | token | exist on Node; the UI does not use them |
| POST/GET/DELETE | `/save-prediction`, `/predictions`, `/predictions/:id` | token | history |
| GET/PATCH | `/api/user/settings` | token | settings |
| POST/GET | `/api/wearables/apple-health/sync`, `/status` | token | wearable sync |
| GET/DELETE | `/admin/stats`, `/admin/users`, `/admin/users/:id`, `/admin/predictions` | token + admin | admin |
| GET | `/health` | none | status pill |

**Python, base `VITE_API_BASE_URL`, `Authorization: Bearer <VITE_API_TOKEN>`**

- `POST /api/v1/diagnostics/symptoms`, `/imaging`, `/lab-report`, `/lab-report-file`
- `GET /health`

## 3. Findings that affect the redesign

1. **Security: the gateway secret ships in the browser bundle.** `VITE_API_TOKEN` equals `GATEWAY_SECRET`. Anyone can read it from the built JS and call the Python AI gateway directly, spending the DeepSeek key. The fix is additive: route all AI calls through the existing Node endpoints (`/analyze-symptoms` already exists, `/analyze-image` and `/analyze-report` exist too). That changes frontend calls only, not backend contracts. Needs your approval (see section 8).
2. **No health-data hygiene guarantees today.** Analytics, logging and URL behaviour need an explicit pass to meet the brief's "no health data in logs/URLs/third parties" rule.
3. **Image analysis is non-functional until a real Mistral or Groq key is set.** The redesign cannot fix this; UI must show a clear "unavailable" state.
4. **No router** means deep links, history detail URLs and role-gated routes do not exist. The brief assumes them.
5. **No test suite** exists, so "all existing tests still pass" is vacuous; Playwright is greenfield.
6. **Existing work from earlier in this session** (aurora backdrop, `Scene3D`, matcap scenes, Dark Moon CSS layer, `ExpandCard`) conflicts with the new creative direction and will be removed or replaced in Phase 1.

## 4. Proposed structure

Decision on Astro: the brief wants Astro for public pages and the React app for the authenticated area. The repo is a single Vite SPA with no shared package. I propose a pnpm workspace (pnpm is already in the repo):

```
packages/tokens      design tokens (CSS vars + TS), palette, type scale
packages/gl          shared GLSL, noise chunks, Core generator, tier detection, camera config
apps/site            Astro, static, React islands for 3D (landing, about, how-it-works)
apps/app             existing frontend/ moved, React SPA (auth + product)
pipeline/            bake scripts and docs (section 6)
```

Auth and the product stay in `apps/app` behind a real router (React Router) so URLs and deep links work. The landing page links into it. Fallback if you prefer less structure: keep one Vite app, add React Router, and prerender the landing page with a Node build script. This is simpler but loses Astro's static HTML for public pages.

## 5. Creative system

- **Concept:** "the body as a signal": a procedural, bio-luminous Core (cells, vessels, light).
- **Palette (4 tokens):** warm off-white, near-black, deep teal (clinical accent), one signal accent used sparingly. Contrast checked to WCAG 2.2 AA before use.
- **Type:** one open-licence grotesk (candidates: Inter Tight, Instrument Sans, Geist; final pick after licence check in Phase 1).
- **Intensity rule:** public pages get the full scene. Authenticated pages get restrained ambient 3D only; every form, table, upload and result is plain accessible DOM.

## 6. Technique plan and honest feasibility

The brief lists 15 techniques. Not all serve the story or can be done without artists. My proposal:

| # | Technique | Plan |
|---|---|---|
| 1,2,3,14,15 | Procedural Core, noise, curl-noise vessels, post, spline camera | Build in code (Phase 2) |
| 4 | Mouse fluid / ripple | Build, GPU ping-pong, touch-friendly (Phase 3) |
| 5 | Baked cloth | Node Verlet script writes a 4-direction ArrayBuffer; runtime blends (Phase 3) |
| 6 | VAT, 16-bit packed, two PNGs | Node packer + shader decode, desktop and mobile versions (Phase 3) |
| 7 | Baked maps + two matcap sets | Scripted maps for the Core; documented artist slots for the rest (Phase 3) |
| 8,9 | Hybrid video + 3D, camera reprojection, frame counter via `readPixels` | **Deferred.** Needs a real offline render to be meaningful. Build the sync harness with a placeholder clip and document the render brief in `HUMAN_TASKS.md` (Phase 5) |
| 10 | Glass cards | Transmission on public pages only, tier-gated |
| 11 | Analytic volumetric light | God-ray shader on the Core |
| 12 | DoF 3D text | SDF text with focus-driven blur on public hero |
| 13 | Gaussian splat scan room | Feature-flagged, lazy, static fallback; needs a captured splat from a human (placeholder in `HUMAN_TASKS.md`) |

Techniques 8, 9 and 13 produce nothing convincing without human-made assets, so they ship as working harnesses plus placeholders.

## 7. Budgets (targets, to be measured at the end)

- Landing LCP under 2.5 s on mid-tier mobile over throttled 4G, with the app shell usable before any WebGL loads.
- Landing JS before 3D: under 150 KB gzip. 3D chunk lazy-loaded, under 450 KB gzip.
- Authenticated app first load JS under 250 KB gzip, ambient 3D lazy.
- Per-scene assets: under 3 MB desktop, under 1.2 MB mobile. DPR cap 1.5 (high), 1.0 (mid and low).
- 60 fps target on high, adaptive step-down on sustained drops, render paused when offscreen or tab hidden.

## 8. Phases

0. Audit and plan (this document). **Stop for approval.**
1. Foundations: git branch, workspace, tokens, type, router, shell, a11y primitives, i18n externalisation, reduced-motion and tier detection. Remove superseded effects.
2. Core and landing scroll story (techniques 1-3, 11, 14, 15).
3. Interaction and baked assets (4-7, 12) plus `/pipeline` scripts and `npm run bake`.
4. Auth, dashboard (health signature), the three AI flows, history thumbnails, booking, settings, admin, Rive states, medical-safety UX.
5. Hybrid video harness, splat room, glass cards, `/labs`.
6. Playwright e2e and visual regression, budget measurements, `HUMAN_TASKS.md`, final summary.

Commit after every phase.

## 9. Risks

- **Scope.** This is months of studio work. Phases 1-4 are realistic here. Phase 5 depends on human assets.
- **Regression risk** in auth/2FA/reset when moving to a router. Mitigation: keep token handling byte-identical, add e2e tests first (Phase 1).
- **Performance** on low-end Android with Three.js plus post. Mitigation: tiers, adaptive step-down, no-WebGL fallback, 3D never on the critical path.
- **Rive:** I can write a clean DOM fallback, but I cannot author real `.riv` files; placeholders are documented.
- **Medical safety:** red-flag triage must render before any other content. Needs a defined keyword and rule list reviewed by a clinician (not just me).

## 10. Questions and approvals needed before Phase 1

1. **Git:** this folder has no `.git`. Your notes say `github.com/Om24102005/CuraSense` is current. May I `git init`, add that remote, fetch, and branch from its default branch, or do you want a fresh local repo? I will not push without asking.
2. **Secret exposure (finding 1):** may I route all AI calls through the existing Node endpoints and stop using `VITE_API_TOKEN` in the browser? Additive for the backend; Node already holds the secret. Strongly recommended.
3. **Structure:** pnpm workspace with Astro for public pages (section 4), or the simpler single Vite app with prerendering?
4. **Languages:** externalising every string means translating about all UI text for 10 languages. Do you want machine-translated drafts marked for review, or English plus the existing 9 only where keys already exist?
5. **Typeface:** any preference, or may I pick from the open-licence shortlist?
6. **Existing session work** (Scene3D, matcaps, Dark Moon CSS) will be removed in Phase 1. Confirm.
