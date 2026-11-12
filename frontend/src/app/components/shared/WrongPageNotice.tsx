import { AlertTriangle } from 'lucide-react';
import MedicalAIOutput from './MedicalAIOutput';

/* Shown when the AI service refuses a file or text because it belongs on another analysis page.
   `redirect` is the gateway's { page, scan_type }; page is 'symptoms' | 'scans' | 'reports' | null. */
export type Redirect = { page: 'symptoms' | 'scans' | 'reports' | null; scan_type?: string | null };

const TABS = { symptoms: { tab: 'symptoms', label: 'Symptoms' }, scans: { tab: 'image', label: 'Scans' }, reports: { tab: 'report', label: 'Reports' } } as const;

interface Props {
  message: string;
  redirect?: Redirect | null;
  onSwitchTab?: (tab: string) => void;
  isDark: boolean;
  T: { amberBg: string; amberBdr: string; amberTxt: string; text: string; muted: string; btnBg: string; head: string };
  S: string;
}

export function WrongPageNotice({ message, redirect, onSwitchTab, isDark, T, S }: Props) {
  const target = redirect?.page ? TABS[redirect.page] : undefined;
  return (
    <div role="alert" style={{ padding: '1.25rem', borderRadius: '14px', background: T.amberBg, border: `1px solid ${T.amberBdr}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
        <AlertTriangle className="w-4 h-4" style={{ color: T.amberTxt }} />
        <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '1rem' }}>Not analysed</h4>
      </div>
      <MedicalAIOutput text={message} isDark={isDark} textColor={T.text} mutedColor={T.muted} />
      {target && onSwitchTab && (
        <button
          onClick={() => onSwitchTab(target.tab)}
          style={{ marginTop: '0.9rem', padding: '0.6rem 1.1rem', borderRadius: '10px', background: T.btnBg, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: S, fontWeight: 700, fontSize: '0.8rem' }}
        >
          Open {target.label} page
        </button>
      )}
    </div>
  );
}
