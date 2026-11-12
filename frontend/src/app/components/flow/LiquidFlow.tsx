/* Turns the inline-styled cards of the active page into liquid-glass panels and makes
   every panel and heading flow in as one smooth, straight stream while scrolling.
   No per-feature wiring: it finds card-like boxes by their computed style. */
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../animations/engine/gsapEngine';
import { useDeviceTier } from '../../animations/deviceTier';
import { useReducedMotion } from '../../animations/hooks/useReducedMotion';

const SVG_ID = 'lg-distort';

function isCard(el: HTMLElement) {
  if (el.closest('[data-no-lg]') || el.parentElement?.closest('[data-lg]')) return false;
  const r = el.getBoundingClientRect();
  if (r.width < 140 || r.height < 56) return false;
  const cs = getComputedStyle(el);
  if (parseFloat(cs.borderTopLeftRadius) < 10) return false;
  const bg = cs.backgroundColor, hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
  return hasBg || cs.backgroundImage !== 'none' || parseFloat(cs.borderTopWidth) > 0;
}

export default function LiquidFlow({ tabKey }: { tabKey: string }) {
  const tier = useDeviceTier();
  const reduced = useReducedMotion();

  // Chromium-only refraction: backdrop-filter may reference an SVG displacement filter.
  useEffect(() => {
    if (tier !== 'high' || !CSS.supports('backdrop-filter', `url(#${SVG_ID}) blur(1px)`)) return;
    const wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    wrap.innerHTML = `<svg width="0" height="0"><filter id="${SVG_ID}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G"/></filter></svg>`;
    document.body.appendChild(wrap);
    document.documentElement.classList.add('lg-refract');
    return () => { wrap.remove(); document.documentElement.classList.remove('lg-refract'); };
  }, [tier]);

  useEffect(() => {
    const root = document.getElementById('page-content');
    if (!root) return;
    const seen = new WeakSet<Element>();
    const marked = new Set<HTMLElement>();   // only what we set: variants authored in markup (plate, inset) stay
    const tweens: gsap.core.Tween[] = [];
    let timer = 0;

    const flowIn = (el: HTMLElement, i: number) => {
      if (reduced) return;
      const r = el.getBoundingClientRect();
      // Already on screen at load: no scrub, avoids a flash of the hidden state.
      const vh = innerHeight;
      const tw = gsap.fromTo(el,
        { y: 56, opacity: 0, scale: 0.975 },
        { y: 0, opacity: 1, scale: 1, ease: 'none', immediateRender: r.top > vh * 0.92,
          scrollTrigger: { trigger: el, start: `top ${97 - (i % 3) * 2}%`, end: 'top 70%', scrub: 0.9, invalidateOnRefresh: true } });
      tweens.push(tw);
    };

    const scan = () => {
      let i = 0;
      root.querySelectorAll<HTMLElement>('div,section,article,form,li').forEach((el) => {
        if (seen.has(el)) return;
        if (isCard(el)) {
          seen.add(el);
          if (!el.dataset.lg) {
            const inlineBg = el.style.background || el.style.backgroundImage;
            const tinted = /gradient/.test(inlineBg) || getComputedStyle(el).backgroundImage !== 'none';
            el.dataset.lg = tinted ? 'tint' : 'clear';
            marked.add(el);
            // Stylesheet !important card backgrounds beat inline gradients; an inline !important wins back.
            if (/gradient/.test(inlineBg)) el.style.setProperty('background', inlineBg, 'important');
          }
          flowIn(el, i++);
        }
      });
      root.querySelectorAll<HTMLElement>('h1,h2,h3,[data-reveal]').forEach((el) => {
        if (seen.has(el) || el.closest('[data-lg]')) return;
        seen.add(el); flowIn(el, i++);
      });
      ScrollTrigger.refresh();
    };

    const schedule = () => { clearTimeout(timer); timer = window.setTimeout(scan, 140); };
    const mo = new MutationObserver(schedule);
    mo.observe(root, { childList: true, subtree: true });
    schedule();

    // Pointer-following specular highlight on the hovered panel only.
    let raf = 0, cur: HTMLElement | null = null;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = (e.target as HTMLElement | null)?.closest?.('[data-lg]') as HTMLElement | null;
        cur = el;
        if (!el) return;
        const b = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - b.left}px`);
        el.style.setProperty('--my', `${e.clientY - b.top}px`);
      });
    };
    root.addEventListener('pointermove', move, { passive: true });

    return () => {
      clearTimeout(timer); cancelAnimationFrame(raf); mo.disconnect();
      root.removeEventListener('pointermove', move);
      tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
      marked.forEach((el) => { delete el.dataset.lg; });
      void cur;
    };
  }, [tabKey, reduced]);

  return null;
}
