import { useLayoutEffect, type RefObject } from 'react';
import { gsap, SplitText } from '../engine/gsapEngine';
import { useReducedMotion } from './useReducedMotion';

/** A headline rises line by line from behind a mask. SplitText re-splits it when the width or the web font changes the breaks. */
export function useMaskedLines(ref: RefObject<HTMLElement | null>, delay = 0.12) {
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    gsap.set(el, { autoAlpha: 0 });
    // Hidden only until the font has settled the line breaks; the timer means a font that never arrives cannot hide the title.
    const show = gsap.delayedCall(1, () => gsap.set(el, { autoAlpha: 1 }));
    const split = SplitText.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'ml', autoSplit: true,
      onSplit: (self) => {
        show.kill();
        gsap.set(el, { autoAlpha: 1 });
        return gsap.from(self.lines, { yPercent: 112, duration: 0.9, ease: 'expo.out', stagger: 0.09, delay });
      },
    });
    return () => {
      show.kill();
      split.revert();
      gsap.set(el, { clearProps: 'opacity,visibility' });
    };
  }, [ref, reduced, delay]);
}
