/* Primary navigation for the public site: brand + live status on the left, the three pages in the middle,
   theme toggle and Sign in / Sign up on the right. A drawer replaces the links below the md breakpoint. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivitySquare, ArrowUpRight, Menu, X } from 'lucide-react';
import { ThemeToggleButton } from '../../components/shared/ThemeToggleButton';
import { useMobileDrawerAnimation } from '../../animations';
import { SystemStatus } from './SystemStatus';
import { Link, ROUTES, type RouteId } from './router';
import type { AuthMode } from './AuthDialog';

export const NAV_LINKS: RouteId[] = ['platform', 'approach', 'access'];

interface SiteNavProps {
  route: RouteId;
  navigate: (to: RouteId, hash?: string) => void;
  onOpenAuth: (mode: AuthMode) => void;
  onPrefetch: (to: RouteId) => void;
}

export function SiteNav({ route, navigate, onOpenAuth, onPrefetch }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useMobileDrawerAnimation(drawerRef, menu);

  // Glass background only once the page has moved.
  useEffect(() => {
    const on = () => setScrolled((was) => { const now = scrollY > 8; return was === now ? was : now; });
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  // The indicator pill glides under the current page's link; no pill on the home page.
  useLayoutEffect(() => {
    const list = listRef.current, pill = pillRef.current;
    if (!list || !pill) return;
    const place = () => {
      const a = list.querySelector<HTMLElement>('[aria-current="page"]');
      if (!a) { pill.style.opacity = '0'; return; }
      pill.style.opacity = '1';
      pill.style.width = `${a.offsetWidth}px`;
      pill.style.transform = `translateX(${a.offsetLeft}px)`;
      pill.dataset.ready = '1';   // after the first placement, so it never slides in from the corner
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, [route]);

  // The drawer closes on navigation and on Escape, and the page behind it must not scroll.
  useEffect(() => { setMenu(false); }, [route]);
  useEffect(() => {
    if (!menu) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); burgerRef.current?.focus(); } };
    addEventListener('keydown', esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', esc); document.body.style.overflow = prev; };
  }, [menu]);

  const open = (mode: AuthMode) => { setMenu(false); onOpenAuth(mode); };

  return (
    <>
      <header className="sn" data-scrolled={scrolled} data-no-cs-transition>
        <div className="sn-in">
          <div className="sn-left">
            <Link to="home" navigate={navigate} className="sn-brand" aria-label="CuraSense, home">
              <span className="sn-mark" aria-hidden><ActivitySquare size={22} strokeWidth={2.2} /></span>
              <span className="sn-word"><b>CuraSense</b><small>Health intelligence · demo</small></span>
            </Link>
            <span className="sn-status"><SystemStatus /></span>
          </div>

          <nav className="sn-links" aria-label="Primary" ref={listRef}>
            <span className="sn-pill" ref={pillRef} aria-hidden />
            {NAV_LINKS.map((id) => (
              <Link
                key={id}
                to={id}
                navigate={navigate}
                className="sn-link"
                aria-current={route === id ? 'page' : undefined}
                onMouseEnter={() => onPrefetch(id)}
                onFocus={() => onPrefetch(id)}
              >
                {ROUTES[id].label}
              </Link>
            ))}
          </nav>

          <div className="sn-right">
            <span className="sn-theme"><ThemeToggleButton /></span>
            <button type="button" className="lp-btn lp-btn-ghost sn-signin" onClick={() => onOpenAuth('login')}>Sign in</button>
            <button type="button" className="lp-btn lp-btn-primary" onClick={() => onOpenAuth('register')}>Sign up</button>
            <button
              ref={burgerRef}
              type="button"
              className="sn-burger"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              aria-controls="site-drawer"
              onClick={() => setMenu((m) => !m)}
            >
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div id="site-drawer" ref={drawerRef} className="sn-drawer" role="dialog" aria-label="Menu" aria-modal="false" data-no-cs-transition>
        {NAV_LINKS.map((id) => (
          <Link key={id} to={id} navigate={navigate} data-drawer-item className="sn-drawer-link" aria-current={route === id ? 'page' : undefined}>
            {ROUTES[id].label}<ArrowUpRight size={18} aria-hidden />
          </Link>
        ))}
        <div data-drawer-item className="sn-drawer-actions">
          <button type="button" className="lp-btn lp-btn-ghost" onClick={() => open('login')}>Sign in</button>
          <button type="button" className="lp-btn lp-btn-primary" onClick={() => open('register')}>Sign up</button>
        </div>
        <div data-drawer-item className="sn-drawer-foot"><SystemStatus /><ThemeToggleButton /></div>
      </div>
    </>
  );
}
