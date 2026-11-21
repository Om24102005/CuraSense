/* The welcome screen's animated background: three layers, each on its own canvas, behind the greeting. Cells drift at the back,
   ECG lines cross the middle, and three orbits round the seal lock in as the checklist rows complete (`progress`).
   Cheap on purpose: about half a millisecond of script per frame, a backing store capped at 1.5x, glows stamped from
   pre-rendered sprites, motion by elapsed time so it looks the same at 60 or 120 Hz. */
import type { Env, Layer } from './fx';
import microscope from './microscope';
import heartbeat from './heartbeat';
import orbits from './orbits';

const LAYERS: Layer[] = [microscope, heartbeat, orbits];   // back to front: one canvas each, in this order inside the host

/** Start drawing into the host's three <canvas> children. `progress.current` is how many checklist rows are done (0..3). Returns stop(). */
export function mountWelcomeFx(host: HTMLElement, progress: { current: number }): () => void {
  const canvases = Array.from(host.querySelectorAll('canvas'));
  const envs: Env[] = canvases.map((cv) => ({ g: cv.getContext('2d')!, W: 0, H: 0, sc: 1, light: false, cx: 0, cy: 0, bx: 0, by: 0, bw: 0, bh: 0, progress: 0 }));
  const screen = host.parentElement!;

  const measure = () => {
    const sc = Math.min(devicePixelRatio || 1, 1.5);   // the CSS upscales the rest; the picture is soft by design
    const seal = screen.querySelector('.wl-seal')!.getBoundingClientRect(), block = screen.querySelector('.wl-center')!.getBoundingClientRect();
    const light = document.documentElement.dataset.theme === 'light';
    canvases.forEach((cv, i) => {
      cv.width = Math.round(host.clientWidth * sc);
      cv.height = Math.round(host.clientHeight * sc);
      Object.assign(envs[i], { W: host.clientWidth, H: host.clientHeight, sc, light, cx: seal.left + seal.width / 2, cy: seal.top + seal.height / 2, bx: block.left + block.width / 2, by: block.top + block.height / 2, bw: block.width, bh: block.height });
      LAYERS[i].init(envs[i]);
    });
  };
  measure();
  host.dataset.on = '1';   // fades the canvases in

  let raf = 0, last = 0, t = 0, alive = true, rz = 0;
  const frame = (now: number) => {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    if (document.hidden) { last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    t += dt;
    for (let i = 0; i < LAYERS.length; i++) { envs[i].progress = progress.current; LAYERS[i].draw(envs[i], t, dt); }
  };
  raf = requestAnimationFrame(frame);
  const onResize = () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(measure); };
  addEventListener('resize', onResize);

  return () => { alive = false; cancelAnimationFrame(raf); cancelAnimationFrame(rz); removeEventListener('resize', onResize); };
}
