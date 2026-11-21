import { Component, type ReactNode } from 'react';

/* ═══════════════════════════════════════════════════════
   CuraSense — Error Boundary
   ───────────────────────────────────────────────────────
   Without this, an uncaught render error anywhere in the tree (a bad
   third-party animation payload, a malformed API response, anything)
   unmounts the whole app to a blank/black screen with no way back
   short of a hard reload — exactly what happened when the Lottie
   integration hit a runtime issue. This doesn't fix that class of bug,
   it just stops any single one from taking the entire app down.
   ═══════════════════════════════════════════════════════ */

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 999999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '1rem', padding: '2rem', textAlign: 'center',
            background: '#000005', color: '#ffffff',
            fontFamily: "var(--font-body)",
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: '1.25rem', fontWeight: 700 }}>
            Something went wrong
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.6, maxWidth: '480px' }}>
            {this.state.error.message || 'An unexpected error occurred.'}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '0.5rem', padding: '0.6rem 1.5rem', borderRadius: '999px',
              background: '#22d3ee', color: '#000', fontWeight: 600, border: 'none', cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
