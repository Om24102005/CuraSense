/* ═══════════════════════════════════════════════════════
   CuraSense — Scramble Text Effect (Threlte-style)
   Characters scramble on hover/viewport entry
   ═══════════════════════════════════════════════════════ */

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  scrambleSpeed?: number;
  triggerOnView?: boolean;
  delay?: number;
  style?: React.CSSProperties;
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function ScrambleText({
  text,
  className = '',
  as: Tag = 'span',
  scrambleSpeed = 0.03,
  triggerOnView = true,
  delay = 0,
  style = {},
}: ScrambleTextProps) {
  const elRef = useRef<HTMLElement>(null);
  const [displayText, setDisplayText] = useState(triggerOnView ? '' : text);
  const hasTriggered = useRef(false);

  const scramble = useCallback(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    const el = elRef.current;
    if (!el) return;

    const original = text;
    let frame = 0;
    const totalFrames = Math.round(1 / scrambleSpeed);

    const interval = setInterval(() => {
      frame++;
      let result = '';
      const progress = frame / totalFrames;
      const charsToReveal = Math.floor(progress * original.length);

      for (let i = 0; i < original.length; i++) {
        if (i < charsToReveal) {
          result += original[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayText(result);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayText(original);
      }
    }, scrambleSpeed * 1000);
  }, [text, scrambleSpeed]);

  useEffect(() => {
    if (!triggerOnView) {
      const timeout = setTimeout(scramble, delay * 1000);
      return () => clearTimeout(timeout);
    }

    const el = elRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const timeout = setTimeout(scramble, delay * 1000);
        return () => clearTimeout(timeout);
      },
    });

    return () => st.kill();
  }, [triggerOnView, scramble, delay]);

  return (
    <Tag
      ref={elRef as any}
      className={`scramble-text ${className}`}
      style={{
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
    >
      {displayText}
    </Tag>
  );
}
