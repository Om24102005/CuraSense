import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorRef.current || !followerRef.current) return;

    const xToCursor = gsap.quickTo(cursorRef.current, 'x', { duration: 0.1, ease: 'power3' });
    const yToCursor = gsap.quickTo(cursorRef.current, 'y', { duration: 0.1, ease: 'power3' });
    
    const xToFollower = gsap.quickTo(followerRef.current, 'x', { duration: 0.5, ease: 'power3' });
    const yToFollower = gsap.quickTo(followerRef.current, 'y', { duration: 0.5, ease: 'power3' });

    const onMouseMove = (e: MouseEvent) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.body.style.cursor = 'none';

    const interactables = document.querySelectorAll('button, a, input, [role="button"], .lucide');
    
    const onEnter = () => {
      gsap.to(cursorRef.current, { scale: 0.5, duration: 0.2 });
      gsap.to(followerRef.current, { scale: 1.5, backgroundColor: 'rgba(139,92,246,0.2)', borderColor: 'rgba(34,211,238,0.8)', duration: 0.2 });
    };
    
    const onLeave = () => {
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
      gsap.to(followerRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: '#8b5cf6', duration: 0.2 });
    };

    interactables.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.style.cursor = 'auto';
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-3 h-3 bg-cyan-400 rounded-full pointer-events-none z-[100000]" 
        style={{ transform: 'translate(-50%, -50%)' }} 
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-10 h-10 border border-purple-500 rounded-full pointer-events-none z-[99999]" 
        style={{ transform: 'translate(-50%, -50%)' }} 
      />
    </>
  );
}