/* ═══════════════════════════════════════════════════════════════════
   CuraSense — Element Transitions
   ───────────────────────────────────────────────────────────────────
   Global, single-mount layer. On ANY user input — click, focus, hover-
   start, key-press inside a text field — the targeted element plays a
   1-second transition: an aurora sweep across its surface plus a soft
   glow halo. No per-component wiring, pure event delegation.

   How it works:
     1. The keyframes + utility class live in styles/index.css under
        .cs-elem-transition. Adding the class triggers the 1s animation
        via CSS, so it's GPU-cheap.
     2. This component attaches one capture-phase listener per event
        type at the document level. When an event fires, we walk up to
        the nearest "interactive surface" (button, input, link, card,
        nav button, tab trigger) and toggle the class.
     3. A WeakMap of element → cooldown-deadline prevents re-triggering
        on the same element more than ~1×/sec, so dragging across rows
        or rapid keystrokes don't create stutter.

   Opt-out: any ancestor with [data-no-cs-transition] suppresses it.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect } from 'react';

const CLASS = 'cs-elem-transition';
const DURATION_MS = 1000;
const COOLDOWN_MS = 240; // prevents stutter while dragging / typing fast

/** Selectors for elements that should receive the transition. */
const TRIGGER_SELECTOR = [
  'button',
  '[role="button"]',
  '[role="tab"]',
  'a[href]',
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
  '[data-cs-transition]',
  '.glass-card',
  '.magnetic-card',
  '.hover-glow',
  '[data-slot="card"]',
].join(',');

const cooldown = new WeakMap<Element, number>();
const liveTimers = new WeakMap<Element, number>();

function trigger(el: Element | null) {
  if (!el || !(el instanceof HTMLElement)) return;
  if (el.closest('[data-no-cs-transition]')) return;

  const now = performance.now();
  const next = cooldown.get(el) ?? 0;
  if (now < next) return;
  cooldown.set(el, now + COOLDOWN_MS);

  // Cancel a running animation on the same element so the new
  // interaction immediately re-arms the sweep.
  const prevTimer = liveTimers.get(el);
  if (prevTimer) {
    window.clearTimeout(prevTimer);
    el.classList.remove(CLASS);
    // force reflow so the next add re-runs the keyframes
    void el.offsetWidth;
  }
  el.classList.add(CLASS);
  const t = window.setTimeout(() => {
    el.classList.remove(CLASS);
    liveTimers.delete(el);
  }, DURATION_MS);
  liveTimers.set(el, t);
}

function nearestSurface(start: EventTarget | null): Element | null {
  if (!(start instanceof Element)) return null;
  return start.closest(TRIGGER_SELECTOR);
}

export default function ElementTransitions() {
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      trigger(nearestSurface(e.target));
    };
    const onFocusIn = (e: FocusEvent) => {
      trigger(nearestSurface(e.target));
    };

    // Note: previously we re-triggered on every keydown inside text
    // fields. That fires multiple times per second while the user
    // types and was the largest single contributor to perceived lag.
    // Sweep on focus-in is enough — typing keeps its native cursor
    // feedback without re-running a 1s animation each keystroke.

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('focusin', onFocusIn, true);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('focusin', onFocusIn, true);
    };
  }, []);

  return null;
}
