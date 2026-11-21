import Lottie from 'lottie-react';
import pulseDotAnim from '../../../assets/lottie/pulse-dot.json';

/* ═══════════════════════════════════════════════════════
   CuraSense — Loading Pulse (Lottie)
   ───────────────────────────────────────────────────────
   Honest note on scope: this ships a small hand-authored Lottie JSON
   (a pulsing dot — opacity + scale keyframes only, no trim-paths/mattes)
   rather than a designer-exported After Effects animation, since no
   such asset file exists in this project. It's correct, valid Lottie
   JSON and renders for real — swap pulseDotAnim for a richer exported
   .json whenever one is available; the wiring here doesn't change.
   ═══════════════════════════════════════════════════════ */

interface LoadingPulseProps {
  size?: number;
}

export default function LoadingPulse({ size = 28 }: LoadingPulseProps) {
  return (
    <div style={{ width: size, height: size }} aria-hidden>
      <Lottie animationData={pulseDotAnim} loop autoplay style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
