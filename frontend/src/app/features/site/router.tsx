/* Tiny History-API router for the public (signed-out) site: four paths, no dependency.
   Real <a href> links, so middle-click and "open in new tab" work; plain clicks are handled in-page. */
import { useCallback, useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react';

export type RouteId = 'home' | 'platform' | 'approach' | 'access';

export const ROUTES: Record<RouteId, { path: string; label: string; title: string; description: string }> = {
  home: {
    path: '/', label: 'Home',
    title: 'CuraSense — AI health analysis for symptoms, scans and lab reports',
    description: 'CuraSense reads symptoms, medical images and lab reports with AI-assisted analysis and shows the result in plain language, with an urgency level and next steps.',
  },
  platform: {
    path: '/platform', label: 'Platform',
    title: 'Platform — CuraSense',
    description: 'Three analysis tools behind one account: what each one takes in, what it returns, how a request travels and what CuraSense runs on.',
  },
  approach: {
    path: '/approach', label: 'Approach',
    title: 'Approach — CuraSense',
    description: 'How CuraSense turns raw input into a structured, explained result: verification, analysis, structuring, and the limits to keep in mind.',
  },
  access: {
    path: '/access', label: 'Access',
    title: 'Access — CuraSense',
    description: 'How accounts work: sign-up, authenticator-app two-factor sign-in, account types, sessions, password recovery and live system status.',
  },
};

const BY_PATH = new Map(Object.entries(ROUTES).map(([id, r]) => [r.path, id as RouteId]));
export const routeFromPath = (p: string): RouteId => BY_PATH.get(p.replace(/(.)\/+$/, '$1')) ?? 'home';

/** Current route plus navigate(). `hash` scrolls to an element id once the page has swapped in. */
export function useRoute(): [RouteId, (to: RouteId, hash?: string) => void, boolean] {
  // pop: the change came from the browser's back or forward, which has its own gesture and scroll restore
  const [{ route, pop }, setNav] = useState(() => ({ route: routeFromPath(location.pathname), pop: false }));

  useEffect(() => {
    const onPop = () => setNav({ route: routeFromPath(location.pathname), pop: true });
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: RouteId, hash?: string) => {
    const url = ROUTES[to].path + (hash ? `#${hash}` : '');
    const scrollToTarget = () => {
      const el = hash ? document.getElementById(hash) : null;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'auto' });
    };
    if (to === routeFromPath(location.pathname)) {
      if (location.pathname + location.hash !== url) history.pushState({}, '', url);
      scrollToTarget();
      return;
    }
    history.pushState({}, '', url);
    setNav({ route: to, pop: false });   // PublicSite scrolls to the top while the veil covers the swap
    if (hash) setTimeout(scrollToTarget, 520);   // after the veil has covered and the new page has mounted
  }, []);

  return [route, navigate, pop];
}

/** <a href> that navigates in-page on a plain left click. */
export function Link({ to, hash, navigate, onClick, children, ...rest }: {
  to: RouteId; hash?: string; navigate: (to: RouteId, hash?: string) => void;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return (
    <a
      {...rest}
      href={ROUTES[to].path + (hash ? `#${hash}` : '')}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to, hash);
      }}
    >
      {children}
    </a>
  );
}
