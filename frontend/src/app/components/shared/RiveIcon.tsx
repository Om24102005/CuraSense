import type { ReactNode } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

/* ═══════════════════════════════════════════════════════
   CuraSense — Rive Icon wrapper
   ───────────────────────────────────────────────────────
   Honest limitation: .riv is a compiled binary format authored in the
   Rive editor (state machines, interactive bones/meshes) — it can't be
   hand-written as code the way the Lottie JSON above can. No .riv asset
   exists in this project, so this wrapper is built and ready but not
   mounted anywhere in the live UI yet. Drop a real asset under
   src/assets/rive/ and render <RiveIcon src="/assets/rive/whatever.riv" />
   — the loading/fallback/cleanup plumbing below already works.
   ═══════════════════════════════════════════════════════ */

interface RiveIconProps {
  src: string;
  stateMachine?: string;
  width?: number;
  height?: number;
  fallback?: ReactNode;
}

export default function RiveIcon({ src, stateMachine, width = 64, height = 64, fallback = null }: RiveIconProps) {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachine,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => {
      // Swallow — missing/invalid .riv file falls back to `fallback` below
      // instead of a broken canvas or a thrown error.
    },
  });

  if (!rive) return <div style={{ width, height }}>{fallback}</div>;

  return (
    <div style={{ width, height }}>
      <RiveComponent />
    </div>
  );
}
