/* Building blocks shared by the Platform, Approach and Access pages: scroll reveal, page hero, sections,
   a sticky in-page index, call-to-action band. Styles: styles/site.css (.pg-*, .rv). */
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import type { AuthIntent, AuthMode } from './AuthDialog';
import type { RouteId } from './router';
import { overallOf, STATE_TEXT, SYSTEMS, useSystemHealth, type Probe } from './SystemStatus';

/** What every page component receives. */
export interface PageProps {
  navigate: (to: RouteId, hash?: string) => void;
  onOpenAuth: (mode: AuthMode, intent?: AuthIntent) => void;
}

/** Fades and lifts its children in once they scroll into view (CSS transition; no layout cost). */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', ...rest }: { children: ReactNode; delay?: number; className?: string; as?: ElementType; [k: `data-${string}`]: string | boolean | undefined }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return <Tag {...rest} ref={ref} className={`rv ${seen ? 'is-in' : ''} ${className}`} style={delay ? { animationDelay: `${delay}ms` } : undefined}>{children}</Tag>;
}

export function PageHero({ eyebrow, title, lede, actions, aside }: { eyebrow: string; title: ReactNode; lede: string; actions?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="pg-hero">
      <div className="pg-hero-in">
        <div className="pg-hero-copy">
          <p className="pg-eyebrow"><i aria-hidden />{eyebrow}</p>
          <h1 className="pg-title">{title}</h1>
          <p className="pg-lede">{lede}</p>
          {actions && <div className="pg-actions">{actions}</div>}
        </div>
        {aside && <div className="pg-hero-aside">{aside}</div>}
      </div>
    </header>
  );
}

export function Section({ id, eyebrow, title, lede, children, className = '' }: { id?: string; eyebrow?: string; title: string; lede?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`pg-section ${className}`} aria-labelledby={id ? `${id}-h` : undefined}>
      <Reveal className="pg-section-head">
        {eyebrow && <p className="pg-eyebrow"><i aria-hidden />{eyebrow}</p>}
        <h2 className="pg-h2" id={id ? `${id}-h` : undefined}>{title}</h2>
        {lede && <p className="pg-sublede">{lede}</p>}
      </Reveal>
      {children}
    </section>
  );
}

/** Sticky row of anchors under the main nav; highlights the section on screen. */
export function PageIndex({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.2, 0.6] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className="pg-index" aria-label="On this page" data-no-cs-transition>
      <div className="pg-index-in">
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} aria-current={active === i.id ? 'true' : undefined}
             onClick={(e) => { e.preventDefault(); document.getElementById(i.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.replaceState({}, '', `#${i.id}`); }}>
            {i.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function CtaBand({ title, text, primary, secondary }: { title: string; text: string; primary: { label: string; onClick: () => void }; secondary?: { label: string; onClick: () => void } }) {
  return (
    <Reveal className="pg-cta">
      <div>
        <h2 className="pg-h2">{title}</h2>
        <p className="pg-sublede">{text}</p>
      </div>
      <div className="pg-actions">
        <button type="button" className="lp-btn lp-btn-primary pg-btn" onClick={primary.onClick}>{primary.label} <ArrowRight size={17} aria-hidden /></button>
        {secondary && <button type="button" className="lp-btn lp-btn-ghost pg-btn" onClick={secondary.onClick}>{secondary.label}</button>}
      </div>
    </Reveal>
  );
}

/** The real /health read-out, as a card: used by the Platform hero and the Access page. */
export function LiveStatus({ title = 'Live right now' }: { title?: string }) {
  const s = useSystemHealth();
  const overall = overallOf(s);
  const headline = { checking: 'Checking systems…', active: 'All systems operational', degraded: 'Some systems are down', offline: 'Can’t reach the server' }[overall];
  return (
    <div className="pg-live" data-state={overall}>
      <div className="pg-live-head">
        <span className="pg-eyebrow"><i aria-hidden />{title}</span>
        <span className="pg-live-time">{s ? s.at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '…'}</span>
      </div>
      <p className="pg-live-title" role="status"><span className="pg-live-dot" aria-hidden />{headline}</p>
      <ul>
        {SYSTEMS.map((x) => {
          const st = (s?.[x.id] ?? 'unknown') as Probe;
          return (
            <li key={x.id} data-s={st}>
              <i aria-hidden />
              <span><b>{x.name}</b><small>{x.note}</small></span>
              <em>{STATE_TEXT[st]}{x.id === 'api' && st === 'up' && s?.ms != null ? ` · ${s.ms} ms` : ''}</em>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
