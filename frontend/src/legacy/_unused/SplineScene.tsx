/* ═══════════════════════════════════════════════════════
   CuraSense — Spline 3D Scene Integration
   Dynamic 3D medical visualization with Spline
   ═══════════════════════════════════════════════════════ */

import { Suspense, useState } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineSceneProps {
  sceneUrl?: string;
  className?: string;
  fallback?: React.ReactNode;
}

export default function SplineScene({
  sceneUrl = 'https://prod.spline.design/6Wq1Q7pVJm2sGkL3/scene.splinecode',
  className = '',
  fallback,
}: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);

  if (error) return null;

  return (
    <div className={`spline-container ${className}`} style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '400px',
    }}>
      {!loaded && (fallback || (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-[var(--accent-violet)] border-t-transparent rounded-full animate-spin" />
        </div>
      ))}
      <Suspense fallback={null}>
        <Spline
          scene={sceneUrl}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
      </Suspense>
    </div>
  );
}
