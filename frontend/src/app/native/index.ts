/* ═══════════════════════════════════════════════════════
   CuraSense — glue for the iPhone and Android apps (Capacitor)
   ───────────────────────────────────────────────────────
   The same website runs inside a native shell. Everything here does nothing in a browser, so the website itself is
   unchanged. In the app it: marks <html> (`native`, `ios` or `android`, which native.css keys on), lifts the splash
   screen once the page has painted, keeps the system bars readable on both themes, and gives the Android back button
   something sensible to do.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react';
import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();   // 'ios' | 'android' | 'web'

const backHandlers: Array<() => void> = [];

/** Call once at start-up. */
export function initNative() {
  if (!isNative) return;
  document.documentElement.classList.add('native', platform);
  syncNativeTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  // Two frames in, the first screen is on the glass: lift the splash then, so the app never shows a blank frame between them.
  requestAnimationFrame(() => requestAnimationFrame(() => { void SplashScreen.hide({ fadeOutDuration: 250 }).catch(() => {}); }));

  if (platform === 'android') {
    // The most recent handler wins (a menu or dialog that is open); with none left, go back a page, and at the first page leave the app.
    void App.addListener('backButton', ({ canGoBack }) => {
      const top = backHandlers[backHandlers.length - 1];
      if (top) top();
      else if (canGoBack) history.back();
      else void App.exitApp();
    });
  }
}

/** Light text on the dark theme, dark text on the light one, in the status bar (and the Android navigation bar). */
export function syncNativeTheme(theme: 'dark' | 'light') {
  if (!isNative) return;
  void SystemBars.setStyle({ style: theme === 'dark' ? SystemBarsStyle.Dark : SystemBarsStyle.Light }).catch(() => {});
}

/** While `active`, the Android back button runs `fn` instead of leaving (close the menu, go to the dashboard). Newest first. */
export function useBackHandler(active: boolean, fn: () => void) {
  const latest = useRef(fn);
  latest.current = fn;
  useEffect(() => {
    if (!active || !isNative) return;
    const h = () => latest.current();
    backHandlers.push(h);
    return () => { const i = backHandlers.lastIndexOf(h); if (i >= 0) backHandlers.splice(i, 1); };
  }, [active]);
}
