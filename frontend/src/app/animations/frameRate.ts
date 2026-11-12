/* The screen's refresh rate, measured, and a watchdog for frames the page cannot keep up with.

   A web page cannot change the monitor's refresh rate. What it decides is whether its own loops follow it: requestAnimationFrame
   (so GSAP, three.js and everything built on them) already fires once per screen refresh, whatever that is: 60, 90, 120, 144 Hz.
   What breaks that is a loop with 60 Hz baked in (a per-frame constant, a fixed 16 ms budget) and a loop too heavy for the
   frame it is given. This module measures the real rate so a loop can budget against it, and switches the costliest effects off
   (data-fx on <html>, see liquid-glass.css) when frames keep being missed. */

const RATES = [30, 48, 50, 60, 72, 75, 90, 100, 120, 144, 165, 240];
const snap = (hz: number) => RATES.reduce((best, r) => (Math.abs(r - hz) < Math.abs(best - hz) ? r : best));

let hz = 60;
let started = false;

/** The screen's refresh rate in Hz: 60 until it has been measured. */
export const refreshRate = () => hz;
/** One screen frame in milliseconds, at the measured rate. */
export const frameBudgetMs = () => 1000 / hz;

const WINDOW_MS = 3000;     // the watchdog looks at 3 s at a time
const MISSED_SHARE = 0.25;  // a quarter of the frames late, in two windows in a row, is overload and not a hitch
const FIRST_MS = 8000;      // page load, the intro and a cold dev server are not judged

/** Start measuring. Safe to call more than once. */
export function watchFrames() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const ring = new Float32Array(8), sorted = new Float32Array(8);
  let n = 0, last = 0, lastWall = 0, fastest = Infinity;
  let winStart = 0, frames = 0, missed = 0, bad = 0, mute = FIRST_MS;

  const tick = (now: number) => {
    requestAnimationFrame(tick);
    const wall = performance.now();
    if (document.hidden) { last = 0; lastWall = 0; return; }
    const gap = last ? now - last : 0;
    // `now` is the frame's own time on the screen's grid; some browsers (headless Chrome) keep it clean even when the thread ran
    // late, so lateness is also read off the wall clock.
    const late = lastWall ? wall - lastWall : 0;
    last = now; lastWall = wall;
    if (!gap || gap > 250 || late > 250) return;   // the first frame, or the tab was away

    // The rate: the fastest run of eight frames in a row shows the screen's own interval.
    ring[n++ % 8] = gap;
    if (n >= 8) {
      sorted.set(ring);
      sorted.sort();
      const med = sorted[4];
      if (med < fastest) { fastest = med; hz = snap(1000 / med); document.documentElement.dataset.hz = String(hz); }
    }

    // The watchdog.
    if (!winStart) winStart = now;
    frames++;
    if (Math.max(gap, late) > frameBudgetMs() * 1.5) missed++;
    if (now - winStart >= WINDOW_MS) {
      if (now > mute) bad = missed / frames > MISSED_SHARE ? bad + 1 : 0;
      if (bad >= 2) { degrade(); bad = 0; mute = now + 6000; }
      winStart = now; frames = 0; missed = 0;
    }
  };
  requestAnimationFrame(tick);
}

/** One step down, never back up: effects that flicker on and off are worse than a plainer page. */
function degrade() {
  const root = document.documentElement;
  root.dataset.fx = String(Math.min(2, Number(root.dataset.fx || 0) + 1));
}
