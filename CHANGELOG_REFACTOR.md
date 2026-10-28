# CuraSense Refactor Log — Phases 1–3

This document records every change made across the architecture audit (Phase 1), the
module separation (Phase 2), and the animation system upgrade (Phase 3). No business
logic, API contract, or database schema was changed. All moved/split code is
byte-for-byte equivalent to the original — only its location and internal wiring changed.

A pre-refactor backup of the original `frontend/src`, `backend/node/server.js`,
`backend/node/package.json`, `backend/python/main.py`, `backend/python/ai_core.py`, and
`backend/python/requirements.txt` was taken before any file was moved or deleted.

---

## Phase 1 — Architecture Analysis (no files changed)

Produced a full map of the real stack (the `.md` docs in the repo root describe an
older Supabase-based build that no longer exists):

- **Frontend**: React 18 + TypeScript + Vite, talking to the Node gateway.
- **Node gateway** (`backend/node`): Express + MongoDB/Mongoose — auth (JWT + TOTP 2FA),
  predictions, settings, wearables, admin. Proxies only `/analyze-symptoms` to Python;
  `/analyze-image` and `/analyze-report` were hardcoded stubs.
- **Python AI gateway** (`backend/python`): FastAPI, gateway-secret auth, provider
  fallback chains (DeepSeek → HuggingFace → Mistral → Groq) for text and vision.
- **`supabase/functions/*`**: dead code, zero live imports — legacy from an earlier
  version of the project.

Findings that are still open (intentionally not fixed — out of refactor scope):
- Hardcoded admin password in the Node boot seed.
- `/forgot-password` returns the reset code directly in the API response instead of
  emailing it (SMTP vars are configured but unused).
- Node's `/analyze-image` and `/analyze-report` never actually call Python's real
  `/api/v1/diagnostics/imaging` and `/lab-report` routes.

---

## Phase 2 — Module Separation

### Frontend (`frontend/src/app/`)

**New structure:**
```
app/
  App.tsx                       # shell only — routing/layout; all GSAP logic moved out
  features/
    auth/            WelcomeScreen.tsx, NarrativeReel.tsx
    dashboard/       Dashboard.tsx
    symptom-checker/ SymptomChecker.tsx
    image-analysis/  ImageAnalysis.tsx
    report-analysis/ ReportAnalysis.tsx
    history/         PredictionHistory.tsx
    booking/         ConsultationBooking.tsx
    settings/        Settings.tsx
    admin/           AdminDashboard.tsx
  components/
    shared/           UserProfile, ThemeToggleButton, LoadingScreen, MedicalAIOutput
    backgrounds/      ThreeBackground, AuroraField, ParticleField, InteractionLayer,
                       ElementTransitions, SystemBootSequence, CinematicSequence,
                       SmoothScroll, MagneticCard, CustomCursor
    ui/               unchanged (47 shadcn/radix primitives)
    layout/           (reserved — header/drawer extraction not yet pulled out of App.tsx)
  animations/                   # NEW — see Phase 3 below for full contents
  state/
    AppSettingsContext.tsx       # moved from contexts/
  services/
    api/
      client.ts, auth.ts, password.ts, predictions.ts, admin.ts, settings.ts,
      wearables.ts, health.ts, index.ts (barrel)
                                  # split from the old utils/api.ts — every exported
                                  # function name kept identical, only file location
                                  # and import path changed
  i18n/, styles/                 unchanged
legacy/_unused/                  # quarantined, not deleted — see list below
```

**Quarantined (moved to `frontend/src/legacy/_unused/`, confirmed zero live importers,
flagged for a later keep/delete decision — not removed per your instruction to flag
rather than delete unused code):**
- `ResetPassword.tsx` — duplicate of a flow `WelcomeScreen.tsx` already implements inline.
- `ScrollStory.tsx`, `ScrollThreeBackground.tsx`, `DashboardStats.tsx`, `FeatureCard.tsx`
- `CustomCursor.root-dup.tsx` — an older, unused duplicate of the live `CustomCursor` in `backgrounds/`.
- `FluidGradient.tsx`, `HolographicCard.tsx`, `ScrambleText.tsx`, `SplineScene.tsx`, `StepCard.tsx`, `MarkdownText.tsx`
- `_stray_sport-future.index.html`, `_stray_sport-future.style.css` — unrelated demo files found inside `components/`, no connection to CuraSense.
- `_stray_root_AiLoader.tsx`, `_stray_root_UserProfile.jsx` — stray duplicate files that were sitting outside `src/` at the `frontend/` root.

**Deleted (not quarantined — these were monoliths deliberately replaced by their own
split, not abandoned code):**
- `frontend/src/app/utils/api.ts` → replaced by `services/api/*`.

**Verification:** `vite build` — 1810 modules transformed, 0 errors. `eslint` — 0 errors/warnings on all new/touched files.

### Backend — Node (`backend/node/`)

`server.js` (673 lines, one file) split into:
```
app.js                     # express app assembly, mounted routes, /health
server.js                  # entry point: connectDB() + app.listen()
src/
  config/   env.js, db.js
  models/   User.js, Prediction.js
  middleware/ auth.js        (verifyToken, verifyAdmin, verifyPurposeToken, token issuers)
  controllers/ auth, password, analysis, prediction, admin, settings, wearable
  services/ pythonAiClient.js  (the fetch-to-Python proxy used by analysis.controller)
  routes/   one router file per domain + index.js aggregator
```
Every endpoint path, request/response shape, and piece of logic (including the
hardcoded admin seed and the stub `/analyze-image`/`/analyze-report`) was carried over
unchanged.

**Verification:** `node --check` on every new file — 0 syntax errors. Dry `import('./app.js')` — loads successfully, all routes mount.

### Backend — Python (`backend/python/`)

`ai_core.py` (663 lines, one file) split into:
```
main.py                     # thin: FastAPI() + CORS + 3 router includes + /health
app/
  config.py                  # env loading, API keys, model/URL constants
  deps.py                    # verify_gateway_auth
  schemas/   symptom.py, lab_report.py
  services/
    providers/ deepseek.py, huggingface.py, mistral.py, groq.py   (each: chat(), vision())
    chat.py                   # fallback-chain orchestrator (DeepSeek→HF→Mistral→Groq)
    image_utils.py            # detect_mime()
    image_detect.py           # detect_image_type() + its prompt
    triage.py                 # analyze_symptoms_with_mistral() + offline fallback
    radiology.py               # classify_medical_image_with_resnet() + SCAN_TYPE_LABELS
    lab_parser.py               # analyze_lab_report(), PDF extract/rasterize, file router
  routers/   symptoms.py, imaging.py, lab_report.py
```
`radiology.py` and `lab_parser.py` call into each other (a lab report uploaded to the
Scans tab gets redirected to lab parsing, and an X-ray uploaded to the Reports tab gets
redirected to radiology) — this is resolved with local (function-body) imports at the
two call sites rather than top-level imports, which breaks the circular-import cycle
without changing any behavior.

**Verification:** `py_compile` on every new file — 0 errors. `import main` in the venv — succeeds, and all 4 original routes (`/api/v1/diagnostics/symptoms`, `/imaging`, `/lab-report`, `/lab-report-file`) plus `/health` are present on the assembled FastAPI app.

---

## Phase 3 — Animation System (GSAP + anime.js v4, device-tier aware)

Per your instruction: **both** engines are kept — GSAP stays primary for
scroll-triggered/layout/timeline work, anime.js v4 is added for staggered
entrances/micro-interactions. Neither replaces the other. All animation logic (both
engines) lives under `frontend/src/app/animations/`, never inline in a component.

```
animations/
  deviceTier.ts              # getDeviceTier()/useDeviceTier(): 'low' | 'mid' | 'high',
                               # from navigator.hardwareConcurrency, deviceMemory,
                               # connection.effectiveType/saveData
  config.ts                   # centralized durations, GSAP + anime.js easings,
                               # getDuration()/getStagger() — tier-scaled, and forced to
                               # 0 under prefers-reduced-motion
  engine/
    gsapEngine.ts              # shared GSAP + ScrollTrigger instance (registered once)
    animeEngine.ts              # re-exports animate/createTimeline/stagger from 'animejs'
  hooks/
    useReducedMotion.ts         # reactive prefers-reduced-motion binding
    useDocumentVisible.ts        # reactive Page Visibility API binding
    usePageTransition.ts         # (Phase 2 extraction, now tier/reduced-motion aware)
    useScrollProgressRail.ts      # same
    useHeaderDensify.ts            # same — also skips the backdrop-filter blur step on
                                   # low tier (blur is one of the more GPU-expensive CSS
                                   # properties to animate on weak mobile GPUs)
    useNavPillIndicator.ts          # same
    useMobileDrawerAnimation.ts      # GSAP still drives the clip-path container
                                     # open/close; the per-item entrance stagger now
                                     # runs on anime.js (animate() + stagger()) — a real,
                                     # live dual-engine call site, not just scaffolding
  presets/
    themeTransition.ts           # playThemeBodyTransition() — no-ops under
                                   # prefers-reduced-motion
```

**Device-tier wiring into existing background components** (no internal rewrite of
their rendering logic — just scaled the inputs they already accepted):
- `App.tsx` now computes `useDeviceTier()` once and passes `pulse={tier !== 'low'}` to
  both `AuroraField` usages (disables its shader pulse animation on low-end hardware).
- `ThreeBackground.tsx` gained an optional `quality?: 'low' | 'mid' | 'high'` prop
  (default `'high'`, so unset callers get the exact original 450/65/30 particle/node/
  connection counts). `App.tsx` passes `quality={deviceTier}`. On `low`, counts drop to
  120/24/12; on `mid`, 250/40/20.
- `ParticleField.tsx` was found to already be a no-op stub (kept only so existing
  imports still compile) — no tier-wiring was added there since it renders nothing
  regardless of any prop.

**"Pause when hidden" requirement**: confirmed no component uses `setInterval` for its
render loop — every continuous animation (GSAP's internal ticker, raw
`requestAnimationFrame` in `AuroraField`/`CinematicSequence`/`ThreeBackground`, and
Three.js's own render loop) rides on `requestAnimationFrame`, which browsers already
throttle/suspend natively when a tab is backgrounded. `useDocumentVisible()` is
exported from `animations/` as a reusable utility for any future component that needs
to explicitly branch on tab visibility (e.g., skip a non-rAF computation), but no
duplicate pause logic was bolted onto the existing loops since they're already covered.

**Verification:**
- `vite build` — 1864 modules transformed (up from 1810: anime.js is now actually
  bundled, confirming the new import path is live), 0 errors.
- `eslint` on every new/changed animation file, `App.tsx`, and `ThreeBackground.tsx` —
  0 errors/warnings.
- Runtime-inspected the installed `animejs` package directly (`require()` + `Object.keys`)
  to confirm `animate`, `createTimeline`, and `stagger` are real exported functions
  before relying on them — all three confirmed present.

---

---

## Phase 4 — Cross-Device Responsiveness (iOS + Android)

### `frontend/index.html`
- Viewport meta gained `viewport-fit=cover` (lets content reach under notches/the
  Dynamic Island so safe-area insets can be applied deliberately instead of the OS
  just letterboxing the page) and `interactive-widget=resizes-content` (the modern
  Android Chrome descriptor that makes the layout viewport actually shrink when the
  on-screen keyboard opens, instead of the page being covered without resizing).

### `frontend/src/app/App.tsx`
- Sticky header: added `top: 'env(safe-area-inset-top)'`. Deliberately NOT touching
  `paddingTop` on this element — `useHeaderDensify` already animates that property via
  GSAP on every scroll tick, and a static safe-area value there would either get
  clobbered by the next tween or (if forced with `!important`) permanently freeze the
  condense animation. `top` is a property GSAP never writes to, so there's no
  conflict and the notch inset and the condense animation both work independently.
- Mobile drawer: added `paddingTop`/`paddingBottom` using `env(safe-area-inset-top)`
  and `env(safe-area-inset-bottom)` — safe because `useMobileDrawerAnimation` only
  ever animates `opacity`/`clipPath`/`display` on this element, never padding.
- `min-h-screen` → `min-h-dvh` (both occurrences) — `100vh` on iOS Safari is the
  *layout* viewport (doesn't shrink when the address bar is visible), so content can
  overflow or jump as the browser chrome shows/hides on scroll. `dvh` (dynamic
  viewport height) tracks the *actual* visible viewport.
- `AuroraField` (both render sites) now gets `pulse={deviceTier !== 'low'}`; the single
  `ThreeBackground` render site now gets `quality={deviceTier}` (see Phase 3's
  `useDeviceTier`, reused here).

### `frontend/src/app/features/auth/WelcomeScreen.tsx`
- `min-h-screen` → `min-h-dvh` on the hero section (same 100vh-bug reasoning).

### `frontend/src/app/features/auth/NarrativeReel.tsx`
- `minHeight: '100vh'` → `'100dvh'` (inline style, same reasoning).

### `frontend/src/app/features/history/PredictionHistory.tsx`
- Both `maxHeight: 'calc(100vh - 2.5rem)'` → `'calc(100dvh - 2.5rem)'`.

### `frontend/src/app/components/ui/drawer.tsx`
- Both `max-h-[80vh]` (vaul bottom-sheet, top/bottom directions) → `max-h-[80dvh]`.

### `frontend/src/app/components/backgrounds/ThreeBackground.tsx`
- Added an optional `quality?: 'low' | 'mid' | 'high'` prop (default `'high'`, so any
  caller that doesn't pass it gets the exact original 450/65/30 particle/node/
  connection counts — zero behavior change for existing callers). On `'mid'` the
  counts drop to 250/40/20, on `'low'` to 120/24/12. `ParticleField.tsx` was checked
  too but is already a no-op stub (kept only so its imports still compile), so no
  tier-wiring was added there — it renders nothing regardless of any prop.

### `frontend/src/styles/index.css`
- `html, body`: added `overscroll-behavior-y: none` — this single property stops both
  iOS Safari's rubber-band bounce at the top/bottom of the page AND Android Chrome's
  pull-to-refresh gesture, since both ride the same boundary-overscroll behavior.
  Inner scroll containers are untouched (e.g. the existing `[data-lenis-prevent]`
  `overscroll-behavior: contain` rule still works for Lenis-managed areas).
- `h1`–`h4`: added `clamp()`-based fluid `font-size` (e.g. `h1: clamp(1.75rem, 1.2rem +
  3vw, 3rem)`), which overrides `theme.css`'s fixed `var(--text-2xl)`-style sizing by
  cascade order (confirmed in the built CSS — the clamp rule compiles after, and wins).
  Scope: this covers every bare `<h1>`–`<h4>` tag app-wide from one place. It does
  **not** cover the many manually-styled "heading-like" `<div style={{fontSize:
  '1.4rem', fontFamily: Michroma}}>`-pattern elements used throughout the feature
  components (`SymptomChecker`, `ImageAnalysis`, `ConsultationBooking`, etc.) — doing
  that would mean hand-editing dozens of bespoke inline styles across 10+ large files
  with no way to visually verify the result from this environment, which is a
  different risk profile than one global, mechanically-checkable rule.
- `@media (max-width: 768px)`: added `input, textarea, select { font-size: 16px
  !important; }`. Several components intentionally use smaller inline font sizes
  (`0.8rem`–`0.9rem`) for visual density — found via a direct audit of every
  `<input>`/`<textarea>` in the app. Below 16px, iOS Safari auto-zooms the whole page
  on focus. Because inline `style` normally beats stylesheet rules, this needs
  `!important` to actually win — and `!important` on a stylesheet rule *does* override
  a plain (non-`!important`) inline style, confirmed intentionally rather than assumed.
  Scoped to `max-width: 768px` only, so desktop/tablet keep each component's designed
  size exactly as before.
- New `@media (pointer: coarse) { button, [role="button"], a[href] { min-height: 48px;
  min-width: 48px; } }` — 48px clears both iOS's 44pt and Android's 48dp guidance.
  `min-*` only grows undersized controls, never shrinks or distorts an already-sized
  one, and `pointer: coarse` means mouse/trackpad users see no change at all. This was
  chosen over editing the shadcn `Button` component directly because a grep across the
  whole app found **zero** `<Button>` usages outside `components/ui/` itself — every
  feature page uses raw `<button>` with its own inline styling, so a global CSS rule
  reaches all of them in one place; editing the unused component would have reached
  none of them.
- 8 decorative `:hover` rules (`.glass-card`, `.liquid-btn`, `.ghost-btn`,
  `.magnetic-card`, `.hover-glow`, `.card`/`[data-slot="card"]`, the global `a:hover`
  text-shadow, `.holographic-card`) were moved inside `@media (hover: hover) and
  (pointer: fine)`. Without this, touch devices can show a hover effect after a tap
  and leave it "stuck" until the user taps elsewhere — a well-known mobile Safari/
  Chrome quirk. `button:active`/`:focus-visible`/`input:focus` rules were deliberately
  left alone — those aren't hover-triggered and work correctly on touch already.

### Already satisfied, no changes needed
- **Dark/light mode**: the app already ships 5 themes (including an explicit `light`
  theme) via `themes.ts` + `ThemeContext` — this was in place before Phase 4.
- **"Pause when hidden" / battery**: confirmed (Phase 3) that every continuous loop in
  the app rides `requestAnimationFrame` (GSAP's internal ticker included) or Three.js's
  own render loop — never `setInterval` — so the browser's native tab-visibility
  throttling already applies. No redundant pause logic was added.
- **Press feedback**: a universal `button:active { transform: scale(0.96) }` rule
  (with a `prefers-reduced-motion` override) already existed in `index.css` before this
  pass — it already satisfies "smooth press feedback" app-wide.

### Explicitly out of scope for this pass (flagged, not silently skipped)
- **Fluid spacing via `clamp()`** beyond the heading rule above — the app's spacing is
  bespoke per component via Tailwind utilities (`px-4 sm:px-6 lg:px-8`-style breakpoint
  classes), which is a legitimate (if coarser-grained) responsive strategy already in
  use; converting every component's spacing to `clamp()` would touch the same 10+ large
  feature files as the typography scope-limit above, for the same reason.
- **Container queries** (`@container`) — Tailwind v4 supports them natively, but no
  existing layout was an unambiguous, low-risk candidate, so none were added
  speculatively.
- **`srcset`/responsive images** — audited: the app has one static asset and a generic
  `ImageWithFallback` wrapper for user-uploaded scan previews, not a photo gallery or
  marketing imagery that would benefit from responsive image sets.
- **Rotation / foldable viewports** — covered indirectly by the fluid/`dvh`/flex-based
  layout already in place; no foldable-specific CSS (e.g. `screen-spanning` queries)
  was added since there was no concrete foldable-only layout issue to target.

### Verification
- `vite build` — 1864 modules transformed (unchanged from Phase 3 — this pass only
  touched CSS/markup, no new JS modules), 0 errors.
- `eslint` on every touched `.tsx` file — 0 errors/warnings.
- Confirmed in the compiled `dist/assets/*.css` that the new `h1` clamp rule physically
  appears *after* `theme.css`'s `var(--text-2xl)` rule, so the cascade-order assumption
  it depends on is verified against the actual build output, not just reasoned about.

---

## Test Checklist

### Functionality (regression check — nothing here should have changed)
- [ ] Register → TOTP QR setup → verify code → land on Dashboard
- [ ] Login (no 2FA) → Dashboard; Login (2FA enabled) → TOTP prompt → Dashboard
- [ ] Forgot password → code → reset → login with new password
- [ ] Symptom Checker: select symptoms → Analyze → result renders, saves to History
- [ ] Image Analysis: upload a scan → Analyze → result renders (still the Node stub —
      unchanged from before the refactor, not a regression)
- [ ] Report Analysis: paste/upload a report → Analyze → result renders (same stub caveat)
- [ ] History: list loads, like toggle persists, full-report modal opens/closes
- [ ] Settings: change a preference → reload → persisted; Apple Health "Force Resync" works
- [ ] Admin (admin account only): stats/users/predictions tabs load; delete-user works
- [ ] Theme cycle button walks through all 5 themes and persists across reload
- [ ] Logout clears session and returns to Welcome screen

### Performance
- [ ] Chrome DevTools → Performance: scroll the dashboard/history pages, confirm steady
      ~60fps on desktop; throttle CPU 4x-6x to approximate a mid-range Android and
      re-check — the `useDeviceTier` low-tier branch should visibly reduce
      `ThreeBackground` particle count and disable `AuroraField`'s pulse
- [ ] `prefers-reduced-motion: reduce` (OS setting or DevTools emulation): GSAP/anime.js
      transitions should snap instantly instead of animating; CSS keyframe effects
      (`.aurora-sweep`, `.cs-elem-transition`, etc.) should stop entirely
- [ ] Bundle size: current build is ~1.33MB JS / ~126KB CSS (gzip ~365KB / ~21KB) — the
      "chunk >500KB" warning predates this refactor (not introduced by it); code-splitting
      is a separate, not-yet-started effort
- [ ] Background tab: switch away from the app for 30s+, switch back — no stutter/jump
      (confirms native `requestAnimationFrame` throttling behaved as expected)

### Device / viewport coverage
Test at each width (DevTools responsive mode or real devices): **320, 360, 390, 412,
430, 768, 820, 1024px**.
- [ ] No horizontal scrollbar/overflow at any width
- [ ] Header stays usable (nav collapses to the hamburger drawer below `md`)
- [ ] All interactive elements are comfortably tappable at 320–430px widths
- [ ] Rotate portrait↔landscape on a real iOS and a real Android device — layout
      doesn't jump or clip, header respects the notch in both orientations
- [ ] Focus a text input on a real iOS Safari and a real Android Chrome device — page
      must NOT zoom in, and the on-screen keyboard should resize the content instead of
      covering it
- [ ] Real iOS Safari: scroll past the top/bottom of a long page (History, Settings) —
      no rubber-band overscroll bounce
- [ ] Real Android Chrome: swipe down at the top of a scrollable page — no
      pull-to-refresh trigger
- [ ] A notched/Dynamic-Island device in landscape — header and mobile drawer content
      aren't obscured by the camera cutout

---

## Final Summary — Every File Touched (Phases 2–4; Phase 1 was analysis-only)

**Created:**
- `frontend/src/app/services/api/{client,auth,password,predictions,admin,settings,wearables,health,index}.ts`
- `frontend/src/app/animations/{index,config,deviceTier}.ts`
- `frontend/src/app/animations/engine/{gsapEngine,animeEngine}.ts`
- `frontend/src/app/animations/hooks/{usePageTransition,useScrollProgressRail,useHeaderDensify,useNavPillIndicator,useMobileDrawerAnimation,useReducedMotion,useDocumentVisible}.ts`
- `frontend/src/app/animations/presets/themeTransition.ts`
- `backend/node/app.js`
- `backend/node/src/config/{env,db}.js`
- `backend/node/src/models/{User,Prediction}.js`
- `backend/node/src/middleware/auth.js`
- `backend/node/src/services/pythonAiClient.js`
- `backend/node/src/controllers/{auth,password,analysis,prediction,admin,settings,wearable}.controller.js`
- `backend/node/src/routes/{auth,password,analysis,prediction,admin,settings,wearable}.routes.js` + `index.js`
- `backend/python/app/{config,deps}.py`
- `backend/python/app/schemas/{symptom,lab_report}.py`
- `backend/python/app/services/{image_utils,image_detect,triage,radiology,lab_parser,chat}.py`
- `backend/python/app/services/providers/{deepseek,huggingface,mistral,groq}.py`
- `backend/python/app/routers/{symptoms,imaging,lab_report}.py`
- `CHANGELOG_REFACTOR.md` (this file)

**Moved** (content unchanged, path only): all 9 feature page components into
`frontend/src/app/features/*`; `UserProfile`, `ThemeToggleButton`, `LoadingScreen`,
`MedicalAIOutput` into `components/shared/`; `ThreeBackground`, `AuroraField`,
`ParticleField`, `InteractionLayer`, `ElementTransitions`, `SystemBootSequence`,
`CinematicSequence`, `SmoothScroll`, `MagneticCard`, `CustomCursor` into
`components/backgrounds/`; `AppSettingsContext` into `state/`.

**Edited** (logic/content preserved, only the specific lines described in each phase
section above changed): `App.tsx`, `WelcomeScreen.tsx`, `NarrativeReel.tsx`,
`PredictionHistory.tsx`, `ThreeBackground.tsx`, `main.tsx`, `components/ui/drawer.tsx`,
`frontend/index.html`, `frontend/src/styles/index.css`, every feature component whose
relative imports needed a path update after the Phase 2 move (`Dashboard`,
`SymptomChecker`, `ImageAnalysis`, `ReportAnalysis`, `ConsultationBooking`,
`AdminDashboard`, `Settings`).

**Deleted** (superseded by their own split, not abandoned — see Phase 2):
`frontend/src/app/utils/api.ts`, `backend/python/ai_core.py`, and the original
monolithic contents of `backend/node/server.js` (replaced in place).

**Quarantined, not deleted** (14 files, zero confirmed live importers — see Phase 2
for the full list and reasoning): everything now under
`frontend/src/legacy/_unused/`.

**Backup**: a pre-refactor snapshot of the original `frontend/src`,
`backend/node/server.js` + `package.json`, and `backend/python/main.py` + `ai_core.py`
+ `requirements.txt` was taken before any move/delete, at
`/private/tmp/claude-501/-Users-omendarsingh-Downloads-CURASENSE-CuraSense-main/944a6d5b-3673-4073-a8ff-705324966020/scratchpad/backup_1793079151`.

## Risks / things worth your attention

- **No live device/browser testing was possible from this environment.** Every change
  was verified by: build success (`vite build`, 0 errors), lint (`eslint`, 0
  errors/warnings), Node (`node --check` + dry `import()`), and Python (`py_compile` +
  `import main`). The Test Checklist above is what still needs a human + a real device.
- The `useDeviceTier()` read is **one-shot per mount** (not reactive to a device's
  hardware "changing" mid-session, which doesn't really happen) but it also won't
  re-evaluate if, say, DevTools throttling is toggled without a full page reload —
  reload the page after changing throttle settings when testing.
- The header's `top: env(safe-area-inset-top)` + GSAP's animated `paddingTop` combo
  (see Phase 4 section above) was deliberately designed to avoid any property
  collision, but it's the one Phase 4 change most worth a specific look on a real
  notched device, since it's new coordination between a static CSS value and a
  pre-existing live animation.
- The three Phase 1 findings (hardcoded admin password, reset-code-returned-in-response,
  stub `/analyze-image` + `/analyze-report`) are **still unresolved** — out of scope for
  this refactor, flagged twice now (Phase 1 and here) so they don't get lost.
- The quarantined files in `legacy/_unused/` still need your explicit decision (delete
  vs. resurrect) — `ResetPassword.tsx` in particular is a full duplicate implementation
  of a flow `WelcomeScreen.tsx` already has live.
