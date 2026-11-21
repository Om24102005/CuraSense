// Single shared GSAP + ScrollTrigger instance for the whole app.
// Phase 3 will add animeEngine.ts alongside this (dual-engine, not a replacement)
// plus device-tier gating consumed by the hooks in ../hooks/.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, Flip, SplitText);

export { gsap, ScrollTrigger, Flip, SplitText };
