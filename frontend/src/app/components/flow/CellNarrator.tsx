/* Caption that explains the living cell, one step per landing section, driven by the same
   scroll position as the particles. Text is the landing page's own copy. Styles: cell-scene.css. */
import { useEffect, useRef, useState } from 'react';
import { STAGE_COPY, stageFromScroll } from '../../scenes/cell/stages';

export default function CellNarrator() {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const dir = useRef(1);   // which way the reader is scrolling: the next line comes in from that side
  const rail = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0, last = 0;
    const tick = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s = stageFromScroll();
        if (s === null) return;
        if (s !== last) dir.current = s > last ? 1 : -1;
        last = s;
        // The rail follows the scroll itself, not the chapter count. Written straight to the element: scrolling re-renders nothing.
        if (rail.current) rail.current.style.transform = `scaleX(${((s + 1) / STAGE_COPY.length).toFixed(4)})`;
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
    <div aria-hidden data-narrator className="cs-narr" data-show={show || undefined}>
      <div className="cs-narr-head">
        <span className="cs-narr-label">
          {String(i + 1).padStart(2, '0')} / {String(STAGE_COPY.length).padStart(2, '0')} · {c.label}
        </span>
        <span className="cs-narr-rail"><span ref={rail} /></span>
      </div>
      <div className="cs-narr-mask"><p key={i} className="cs-narr-text" data-dir={dir.current}>{c.text}</p></div>
    </div>
  );
}
