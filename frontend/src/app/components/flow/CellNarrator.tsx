/* Caption that explains the living cell, one step per landing section, driven by the same
   scroll position as the particles. Text is the landing page's own copy. */
import { useEffect, useState } from 'react';
import { STAGE_COPY, stageFromScroll } from '../../scenes/cell/stages';

export default function CellNarrator() {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s = stageFromScroll();
        if (s === null) return;
        setI(Math.round(s));
        setShow(s > 0.35 && s < 5.6); // hidden on the last step so the page's own CTA stays clear
      });
    };
    tick();
    addEventListener('scroll', tick, { passive: true });
    addEventListener('resize', tick);
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', tick); removeEventListener('resize', tick); };
  }, []);

  const c = STAGE_COPY[i];
  return (
    <div
      aria-hidden
      data-narrator
      style={{
        position: 'fixed', left: '50%', bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))', zIndex: 40, width: 'min(680px, calc(100vw - 32px))',
        transform: `translateX(-50%) translateY(${show ? 0 : 16}px)`, opacity: show ? 1 : 0,
        transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)',
        pointerEvents: 'none', padding: '12px 18px', borderRadius: 18,
        background: 'rgba(10, 16, 32, 0.55)', border: '1px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(14px) saturate(1.8)', WebkitBackdropFilter: 'blur(14px) saturate(1.8)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 18px 40px -16px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#7dd3fc' }}>
          {String(i + 1).padStart(2, '0')} / {String(STAGE_COPY.length).padStart(2, '0')} · {c.label}
        </span>
        <span style={{ flex: 1, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
          <span style={{ display: 'block', height: '100%', width: `${((i + 1) / STAGE_COPY.length) * 100}%`, background: 'linear-gradient(90deg,#22d3ee,#a855f7,#ec4899)', transition: 'width 0.6s ease' }} />
        </span>
      </div>
      <p key={i} style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: '#e6eefb', animation: 'cs-narr-in 0.5s ease both' }}>{c.text}</p>
      <style>{'@keyframes cs-narr-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){[style*="cs-narr-in"]{animation:none!important}}'}</style>
    </div>
  );
}
