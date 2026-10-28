import { useEffect, useState } from 'react';

const pad = (n: number) => String(n).padStart(2, '0');

/** "S.01 ── Title" numbered label; also the anchor the PageIndex scrolls to. */
export function SectionLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="dm-label" data-sec={title}>
      <b>S.{pad(n)}</b><i /><span>{title}</span>
    </div>
  );
}

/** Fixed side index of every [data-sec] / #reel-* block on the page; highlights the one in view. */
export function PageIndex({ watch }: { watch?: string }) {
  const [items, setItems] = useState<{ el: HTMLElement; label: string }[]>([]);
  const [on, setOn] = useState(0);

  useEffect(() => {
    // Wait a tick so the page's own sections have rendered.
    const t = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('[data-sec], [id^="reel-"]'));
      setItems(els.map((el) => ({ el, label: el.dataset.sec || el.id.replace('reel-', '').replace(/-/g, ' ') })));
    }, 250);
    return () => clearTimeout(t);
  }, [watch]);

  useEffect(() => {
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setOn(items.findIndex((i) => i.el === e.target)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    items.forEach((i) => io.observe(i.el));
    return () => io.disconnect();
  }, [items]);

  if (items.length < 2) return null;
  return (
    <nav className="dm-index" aria-label="On this page">
      {items.map((i, k) => (
        <button key={k} data-on={on === k} onClick={() => i.el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
          {i.label}<span />
        </button>
      ))}
    </nav>
  );
}

const TERMS = ['Symptom triage', 'Radiology imaging', 'Lab report analysis', 'Biomarker tracking', 'Genomic structures', 'Clinical-grade AI', 'Encrypted records', 'Two-factor secured'];

/** Scrolling capability strip. */
export function Marquee() {
  const row = [...TERMS, ...TERMS];
  return (
    <div className="dm-marquee" aria-hidden>
      <div>{row.map((t, i) => <span key={i}>{t} <b style={{ color: 'var(--dm-ink)' }}>✚</b></span>)}</div>
    </div>
  );
}
