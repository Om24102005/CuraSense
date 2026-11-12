/* The signed-out website: navigation, four pages (home, platform, approach, access), a footer, a per-page backdrop,
   and one sign-in / sign-up dialog that any page can open. Pages are code-split and prefetched when a link is hovered. */
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import CellNarrator from '../../components/flow/CellNarrator';
import { AuthDialog, type AuthIntent, type AuthMode } from './AuthDialog';
import HomePage from './HomePage';
import { SiteFooter } from './SiteFooter';
import { SiteNav } from './SiteNav';
import { ROUTES, useRoute, type RouteId } from './router';

// Each of these is its own chunk: the three.js cell scene only loads on Home, the shader backdrops only off Home.
const PageScene = lazy(() => import('../../scenes/PageScene'));
const PageBackdrop = lazy(() => import('../../scenes/backdrops/PageBackdrop'));
const loaders = {
  platform: () => import('./pages/PlatformPage'),
  approach: () => import('./pages/ApproachPage'),
  access: () => import('./pages/AccessPage'),
};
const PlatformPage = lazy(loaders.platform);
const ApproachPage = lazy(loaders.approach);
const AccessPage = lazy(loaders.access);
const prefetch = (id: RouteId) => { if (id !== 'home') void loaders[id](); };

interface PublicSiteProps {
  isDark: boolean;
  bootDone: boolean;
  onAuthenticate: (user: { name?: string }, kind: 'login' | 'signup') => void;
}

export function PublicSite({ isDark, bootDone, onAuthenticate }: PublicSiteProps) {
  const [route, navigate] = useRoute();
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const firstRoute = useRef(true);
  const [dlg, setDlg] = useState<{ open: boolean; mode: AuthMode; intent?: AuthIntent; n: number }>({ open: false, mode: 'login', n: 0 });
  // The living cell mounts on the first visit to Home and then stays: leaving Home only pauses and hides it, so coming back does
  // not rebuild its GPU resources (a 40 ms frame every time) or replay its intro.
  const [cellSeen, setCellSeen] = useState(route === 'home');
  useEffect(() => { if (route === 'home') setCellSeen(true); }, [route]);

  // Once the page is up, fetch the other pages' code in the gap before anyone can click, so a click never waits for a download.
  useEffect(() => {
    const id = window.setTimeout(() => { Object.values(loaders).forEach((load) => void load()); void import('../../scenes/backdrops/PageBackdrop'); }, 2500);
    return () => clearTimeout(id);
  }, []);

  const openAuth = useCallback((mode: AuthMode, intent?: AuthIntent) => setDlg((d) => ({ open: true, mode, intent, n: d.n + 1 })), []);
  const closeAuth = useCallback(() => setDlg((d) => ({ ...d, open: false })), []);

  // Per-page title and description, and (after the first load) keyboard focus on the new page for screen readers.
  useEffect(() => {
    const r = ROUTES[route];
    document.title = r.title;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = r.description;
    if (firstRoute.current) { firstRoute.current = false; return; }
    mainRef.current?.focus({ preventScroll: true });
  }, [route]);

  // A deep link with an anchor (/platform#stack) lands on that section once the lazy page has mounted.
  useEffect(() => {
    if (!location.hash) return;
    const t = window.setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 700);
    return () => clearTimeout(t);
  }, [route]);

  // Signing in from a deep link must not leave /platform in the address bar of the app.
  const authenticated = useCallback((user: { name?: string }, kind: 'login' | 'signup') => { history.replaceState({}, '', '/'); onAuthenticate(user, kind); }, [onAuthenticate]);

  return (
    <div id="public-root" ref={rootRef} data-route={route} className="relative z-10 min-h-dvh flex flex-col">
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); mainRef.current?.scrollIntoView(); }}>Skip to content</a>

      {cellSeen && <div className="cell-host" data-off={route !== 'home' || undefined}><Suspense fallback={null}><PageScene scene="welcome" light={!isDark} ready={bootDone} paused={route !== 'home'} slow={dlg.open} /></Suspense></div>}
      {route === 'home' ? (
        <CellNarrator />
      ) : (
        <>
          <Suspense fallback={null}><PageBackdrop key={route} variant={route} light={!isDark} /></Suspense>
          <div className="bd-scrim" aria-hidden />
        </>
      )}

      <SiteNav route={route} navigate={navigate} onOpenAuth={openAuth} onPrefetch={prefetch} />

      <main id="main" ref={mainRef} tabIndex={-1} className="site-main">
        <div key={route} className="page-enter">
          <Suspense fallback={<div className="page-fallback" aria-busy="true" />}>
            {route === 'home' && <HomePage isDark={isDark} navigate={navigate} onOpenAuth={openAuth} />}
            {route === 'platform' && <PlatformPage navigate={navigate} onOpenAuth={openAuth} />}
            {route === 'approach' && <ApproachPage navigate={navigate} onOpenAuth={openAuth} />}
            {route === 'access' && <AccessPage navigate={navigate} onOpenAuth={openAuth} />}
          </Suspense>
        </div>
      </main>

      <SiteFooter navigate={navigate} onOpenAuth={openAuth} />

      {dlg.n > 0 && (
        <AuthDialog key={dlg.n} open={dlg.open} mode={dlg.mode} intent={dlg.intent} container={rootRef.current} onClose={closeAuth} onAuthenticate={authenticated} />
      )}
    </div>
  );
}
