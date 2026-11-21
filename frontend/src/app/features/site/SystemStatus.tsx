/* Live system-status pill: one word (ACTIVE when every service is up) and a hover/focus/tap popover that lists what is
   running. Node's /health reports itself, the Python AI service and MongoDB, so the browser never probes the AI service
   directly. One shared poller feeds every consumer (nav pill, mobile drawer, Access page). Styles: styles/landing-ui.css (.sys-*). */
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';

export type Probe = 'up' | 'down' | 'unknown';
export interface Snapshot { api: Probe; ai: Probe; db: Probe; ms: number | null; at: Date }
export type Overall = 'checking' | 'active' | 'degraded' | 'offline';

const POLL_MS = 15000;
const TIMEOUT_MS = 5000;
// An empty VITE_NODE_BASE_URL means "this site's own address" (the production build, served by the API itself); only an unset one falls back to localhost.
const NODE_BASE = (import.meta.env.VITE_NODE_BASE_URL ?? 'http://localhost:5001').replace(/\/$/, '');

/* ── one poller, shared ─────────────────────────────────────────────── */
let snap: Snapshot | null = null;
const listeners = new Set<() => void>();
let timer = 0;

async function probe() {
  if (document.hidden) return;   // nobody is looking; the visibility handler probes again on return
  const ctl = new AbortController();
  const guard = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  const t0 = performance.now();
  let next: Snapshot = { api: 'down', ai: 'unknown', db: 'unknown', ms: null, at: new Date() };   // unreachable until proven otherwise
  try {
    const r = await fetch(`${NODE_BASE}/health`, { signal: ctl.signal, cache: 'no-store' });
    const j = r.ok ? await r.json() : null;
    if (j) next = { api: j.server === 'ok' ? 'up' : 'down', ai: j.python === 'ok' ? 'up' : 'down', db: j.mongo === 'connected' ? 'up' : 'down', ms: Math.round(performance.now() - t0), at: new Date() };
  } catch { /* offline */ } finally { clearTimeout(guard); }
  snap = next;
  listeners.forEach((l) => l());
}
const onVisible = () => { if (!document.hidden) probe(); };

function subscribe(l: () => void) {
  listeners.add(l);
  if (listeners.size === 1) {
    probe();
    timer = window.setInterval(probe, POLL_MS);
    document.addEventListener('visibilitychange', onVisible);
  }
  return () => {
    listeners.delete(l);
    if (listeners.size === 0) { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); }
  };
}

export const useSystemHealth = () => useSyncExternalStore(subscribe, () => snap);

export const overallOf = (s: Snapshot | null): Overall =>
  !s ? 'checking' : s.api !== 'up' ? 'offline' : s.ai === 'up' && s.db === 'up' ? 'active' : 'degraded';

export const SYSTEMS: { id: 'api' | 'ai' | 'db'; name: string; note: string }[] = [
  { id: 'api', name: 'API gateway', note: 'Sign-in, records and routing' },
  { id: 'ai', name: 'AI engine', note: 'Symptom triage, imaging, lab reports' },
  { id: 'db', name: 'Patient database', note: 'Accounts, history and settings' },
];
export const STATE_TEXT: Record<Probe, string> = { up: 'Operational', down: 'Down', unknown: 'Unknown' };
export const REFRESH_SECONDS = POLL_MS / 1000;

// Upper-case in the data: a global `button { text-transform: none !important }` rule in index.css would undo a CSS text-transform here.
const LABEL: Record<Overall, string> = { checking: 'CHECKING', active: 'ACTIVE', degraded: 'DEGRADED', offline: 'OFFLINE' };

export function SystemStatus() {
  const s = useSystemHealth();
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef(0);
  const popId = useId();
  const open = hover || pinned;

  const overall = overallOf(s);
  const systems = SYSTEMS.map((x) => ({ ...x, s: (s?.[x.id] ?? 'unknown') as Probe }));
  const up = systems.filter((x) => x.s === 'up').length;
  const headline = { checking: 'Checking systems…', active: 'All systems operational', degraded: `${up} of ${systems.length} systems running`, offline: 'Can’t reach the server' }[overall];
  const detail = { checking: 'One moment.', active: 'Everything CuraSense needs is up and answering.', degraded: 'Some features may be unavailable right now.', offline: 'Start the backend or check your connection.' }[overall];

  // A pinned popover (tap, click or keyboard focus) closes on Escape or on a press anywhere else.
  useEffect(() => {
    if (!pinned) return;
    const away = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setPinned(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [pinned]);
  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  return (
    <div
      ref={wrap}
      className="sys"
      data-state={overall}
      data-open={open}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') { clearTimeout(leaveTimer.current); setHover(true); } }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') { leaveTimer.current = window.setTimeout(() => setHover(false), 140); } }}
      onFocus={(e) => { if (e.target.matches(':focus-visible')) setPinned(true); }}
      onBlur={(e) => { if (!wrap.current?.contains(e.relatedTarget as Node)) setPinned(false); }}
      onKeyDown={(e) => { if (e.key === 'Escape') { setPinned(false); setHover(false); } }}
    >
      <button type="button" className="sys-pill" aria-expanded={open} aria-controls={popId} aria-label={`System status: ${LABEL[overall].toLowerCase()}`} onClick={() => setPinned((p) => !p)}>
        <span className="sys-dot" aria-hidden />
        <span>{LABEL[overall]}</span>
      </button>

      <div id={popId} role="region" aria-label="System status details" data-lg="plate" className="sys-pop">
        <div className="sys-head">
          <span className="sys-eyebrow">System status</span>
          <span className="sys-live"><i aria-hidden />Live</span>
        </div>
        <div className="sys-title">{headline}</div>
        <div className="sys-sub">{detail}</div>
        <ul className="sys-list">
          {systems.map((x) => (
            <li key={x.id} className="sys-row" data-s={x.s}>
              <i className="sys-row-dot" aria-hidden />
              <div>
                <div className="sys-row-name">{x.name}</div>
                <div className="sys-row-note">{x.note}</div>
              </div>
              <div className="sys-row-state">
                {STATE_TEXT[x.s]}
                {x.id === 'api' && s?.ms != null && x.s === 'up' && <span className="sys-row-ms">{s.ms} ms</span>}
              </div>
            </li>
          ))}
        </ul>
        <div className="sys-foot">
          <span>{s ? `Checked ${s.at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Checking…'}</span>
          <span>Refreshes every {REFRESH_SECONDS} s</span>
        </div>
      </div>
    </div>
  );
}
