import { useEffect, useId, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';

interface ExpandCardProps {
  children: ReactNode;
  /** Extra content shown only in the opened view. */
  detail: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Card that grows into a centred detail view on click (shared-layout morph). */
export function ExpandCard({ children, detail, className, style }: ExpandCardProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <motion.div
        layoutId={id}
        className={className}
        style={{ ...style, cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen(true)}
      >
        {children}
      </motion.div>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'grid', placeItems: 'center', padding: '1rem', background: 'var(--overlay)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
            >
              <motion.div
                layoutId={id}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                style={{ ...style, width: 'min(92vw, 30rem)', padding: '1.75rem', cursor: 'default' }}
              >
                {children}
                <div style={{ marginTop: '1.25rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: 1.6 }}>{detail}</div>
                <button
                  onClick={() => setOpen(false)}
                  style={{ marginTop: '1.25rem', padding: '0.55rem 1.2rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
