import { AlertTriangle, MessageSquare, Phone } from 'lucide-react';
import { EMERGENCY_NOTE, smsUrl, telUrl } from '@curasense/shared/settings';
import { useAppSettings } from '../../state/AppSettingsContext';

/**
 * Under a result that counts as an emergency, when the person has turned Auto-Alerts on in Settings: a Call and a Message button for each
 * emergency contact. They are links, so the person presses them; CuraSense never calls or sends anything itself. Renders nothing otherwise.
 */
export function EmergencyPrompt({ active, isDark }: { active: boolean; isDark: boolean }) {
  const { autoAlertsEnabled, emergencyContacts } = useAppSettings();
  if (!active || !autoAlertsEnabled) return null;

  const text = isDark ? '#fecaca' : '#7f1d1d';
  const muted = isDark ? 'rgba(254,202,202,0.75)' : 'rgba(127,29,29,0.78)';
  const link = (bg: string): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 0.95rem', borderRadius: '10px',
    fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', color: '#fff', background: bg,
  });

  return (
    <div role="alert" data-testid="emergency-panel" style={{ padding: '1rem 1.1rem', borderRadius: '14px', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.45)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 800, fontSize: '0.9rem' }}>
        <AlertTriangle className="w-5 h-5" aria-hidden /> This result is marked EMERGENCY
      </div>
      <p style={{ fontSize: '0.8rem', color: text, margin: '6px 0 12px', lineHeight: 1.5 }}>
        Seek immediate medical attention. If you are in danger, call your local emergency number now. CuraSense cannot call for help or send messages by itself.
      </p>

      {emergencyContacts.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {emergencyContacts.map((c) => (
            <div key={c.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: text }}>{c.name}</div>
                <div style={{ fontSize: '0.72rem', color: muted }}>{[c.relation, c.phone].filter(Boolean).join(' · ')}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={telUrl(c.phone)} aria-label={`Call ${c.name}`} data-testid={`emergency-call-${c.id}`} style={link('#dc2626')}><Phone className="w-4 h-4" aria-hidden /> Call</a>
                <a href={smsUrl(c.phone, EMERGENCY_NOTE, 'web')} aria-label={`Message ${c.name}`} data-testid={`emergency-message-${c.id}`} style={link('#b45309')}><MessageSquare className="w-4 h-4" aria-hidden /> Message</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '0.8rem', color: text }} data-testid="emergency-no-contacts">
          You have no emergency contacts yet. Add them in Settings, under Emergency Protocols.
        </p>
      )}
    </div>
  );
}
