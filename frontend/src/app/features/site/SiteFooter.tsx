/* Footer for every public page: where to go, how to get in, and the one honest sentence about what this is. */
import { ActivitySquare } from 'lucide-react';
import { Link, ROUTES, type RouteId } from './router';
import type { AuthMode } from './AuthDialog';

export function SiteFooter({ navigate, onOpenAuth }: { navigate: (to: RouteId, hash?: string) => void; onOpenAuth: (mode: AuthMode) => void }) {
  return (
    <footer className="sf" data-no-cs-transition>
      <div className="sf-in">
        <div className="sf-brand">
          <span className="sn-mark" aria-hidden><ActivitySquare size={20} strokeWidth={2.2} /></span>
          <div>
            <b>CuraSense</b>
            <p>AI-assisted analysis of symptoms, medical images and lab reports, shown in plain language.</p>
          </div>
        </div>

        <nav className="sf-col" aria-label="Site">
          <h2>Explore</h2>
          {(['platform', 'approach', 'access', 'privacy'] as RouteId[]).map((id) => <Link key={id} to={id} navigate={navigate}>{ROUTES[id].label}</Link>)}
        </nav>

        <div className="sf-col">
          <h2>Account</h2>
          <button type="button" onClick={() => onOpenAuth('login')}>Sign in</button>
          <button type="button" onClick={() => onOpenAuth('register')}>Create an account</button>
          <button type="button" onClick={() => onOpenAuth('forgot')}>Reset a password</button>
        </div>

        <div className="sf-col">
          <h2>In an emergency</h2>
          <p>CuraSense is not for emergencies. If someone may be in danger, call your local emergency number now.</p>
        </div>
      </div>

      <div className="sf-base">
        <span>© {new Date().getFullYear()} CuraSense</span>
        <span>Decision-support tool. Not a medical device and not a substitute for a clinician.</span>
      </div>
    </footer>
  );
}
