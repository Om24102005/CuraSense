import {
  AlertTriangle, Stethoscope, Search, FileText,
  CheckCircle, Clock, AlertCircle, Info, Activity,
} from 'lucide-react';
import { STATUS_RE, STATUS_COLORS, parseSections, type Section } from '@curasense/shared/medicalText';

interface Props {
  text: string;
  isDark: boolean;
  textColor: string;
  mutedColor: string;
}

// ── Section identity map ──────────────────────────────────────────────────────

const SECTION_DEFS = [
  { re: /urgency|alert level|priority|emergency/i,                  color: '#f87171', bg: 'rgba(248,113,113,0.10)', bd: 'rgba(248,113,113,0.30)', Icon: AlertTriangle },
  { re: /finding|observation|detected|identified|abnormal result/i, color: '#60a5fa', bg: 'rgba(96,165,250,0.10)',  bd: 'rgba(96,165,250,0.30)',  Icon: Search       },
  { re: /assessment|diagnosis|impression|clinical picture/i,        color: '#34d399', bg: 'rgba(52,211,153,0.10)', bd: 'rgba(52,211,153,0.30)',  Icon: Stethoscope  },
  { re: /risk|concern|warning|caution|red flag/i,                   color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', bd: 'rgba(251,191,36,0.30)',  Icon: AlertCircle  },
  { re: /recommend|treatment|next step|action|what to do|plan/i,    color: '#a78bfa', bg: 'rgba(167,139,250,0.10)',bd: 'rgba(167,139,250,0.30)', Icon: CheckCircle  },
  { re: /follow.?up|monitor|schedule|surveillance/i,                 color: '#2dd4bf', bg: 'rgba(135,191,255,0.10)', bd: 'rgba(135,191,255,0.30)',  Icon: Clock        },
  { re: /summary|overview|highlights|key finding/i,                  color: '#a78bfa', bg: 'rgba(167,139,250,0.10)',bd: 'rgba(167,139,250,0.30)', Icon: Info         },
  { re: /analysis|result|report|scan type|interpretation/i,          color: '#60a5fa', bg: 'rgba(96,165,250,0.10)', bd: 'rgba(96,165,250,0.30)',  Icon: Activity     },
];
const DEF_SEC = { color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', bd: 'rgba(148,163,184,0.18)', Icon: FileText };

function getSec(title: string) {
  for (const d of SECTION_DEFS) if (d.re.test(title)) return d;
  return DEF_SEC;
}

// ── Inline renderers ──────────────────────────────────────────────────────────

function inlineStatus(text: string, fallbackColor: string): React.ReactNode[] {
  return text.split(STATUS_RE).map((part, i) => {
    const st = STATUS_COLORS[part.toLowerCase()];
    if (st) {
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            padding: '1px 7px',
            borderRadius: '5px',
            background: st.b,
            color: st.c,
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            verticalAlign: 'middle',
            margin: '0 2px',
            lineHeight: '1.7',
          }}
        >
          {part}
        </span>
      );
    }
    return <span key={i} style={{ color: fallbackColor }}>{part}</span>;
  });
}

function inlineBold(text: string, textColor: string, headColor: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return (
    <>
      {parts.map((part, i) => {
        const bm = part.match(/^\*\*([^*]+)\*\*$/);
        if (bm) return <strong key={i} style={{ color: headColor, fontWeight: 700 }}>{bm[1]}</strong>;
        return <span key={i}>{inlineStatus(part, textColor)}</span>;
      })}
    </>
  );
}

// ── Per-line renderer ─────────────────────────────────────────────────────────

function renderLine(
  line: string,
  idx: number,
  isDark: boolean,
  textColor: string,
  mutedColor: string,
): React.ReactNode {
  const t = line.trim();
  if (!t) return <div key={idx} style={{ height: '5px' }} />;

  const headColor  = isDark ? '#f1f5f9' : '#0f172a';
  const bulletBg   = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const dividerClr = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  // Bullet list  ─  - item  or  * item
  const bm = t.match(/^[-*•]\s+(.+)/);
  if (bm) return (
    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '7px 11px', borderRadius: '8px', background: bulletBg, marginBottom: '4px' }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', marginTop: '8px', flexShrink: 0 }} />
      <span style={{ fontSize: '0.82rem', lineHeight: 1.65, flex: 1 }}>{inlineBold(bm[1], textColor, headColor)}</span>
    </div>
  );

  // Numbered list  ─  1. item  or  1) item
  const nm = t.match(/^(\d+)[.)]\s+(.+)/);
  if (nm) return (
    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '7px 11px', borderRadius: '8px', background: bulletBg, marginBottom: '4px' }}>
      <div style={{ minWidth: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.63rem', fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: '2px' }}>{nm[1]}</div>
      <span style={{ fontSize: '0.82rem', lineHeight: 1.65, flex: 1 }}>{inlineBold(nm[2], textColor, headColor)}</span>
    </div>
  );

  // Key-value  ─  **Label**: value
  const kvm = t.match(/^\*\*([^*]{2,45})\*\*\s*[:：]\s*(.+)/);
  if (kvm) return (
    <div key={idx} style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px', padding: '5px 0', borderBottom: `1px solid ${dividerClr}` }}>
      <span style={{ fontSize: '0.76rem', fontWeight: 600, color: mutedColor, minWidth: 115, flexShrink: 0 }}>{kvm[1]}</span>
      <span style={{ fontSize: '0.83rem', lineHeight: 1.65 }}>{inlineStatus(kvm[2].trim(), textColor)}</span>
    </div>
  );

  // Horizontal rule
  if (/^---+$/.test(t)) return <div key={idx} style={{ height: '1px', background: dividerClr, margin: '6px 0' }} />;

  // Plain prose with bold + status inline
  return (
    <div key={idx} style={{ fontSize: '0.83rem', lineHeight: 1.78, marginBottom: '2px' }}>
      {inlineBold(t, textColor, headColor)}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MedicalAIOutput({ text, isDark, textColor, mutedColor }: Props) {
  const M = "var(--font-display)";
  if (!text?.trim()) return null;
  const sections = parseSections(text);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {sections.map((sec, si) => {
        const hasTitle   = Boolean(sec.title);
        const { color, bg, bd, Icon } = hasTitle ? getSec(sec.title) : DEF_SEC;
        const hasContent = sec.lines.some(l => l.trim());

        return (
          <div
            key={si}
            style={{
              borderRadius: hasTitle ? '12px' : '0',
              border: hasTitle ? `1px solid ${bd}` : 'none',
              overflow: 'hidden',
            }}
          >
            {/* Colored section header */}
            {hasTitle && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 13px', background: bg, borderBottom: `1px solid ${bd}` }}>
                <Icon style={{ width: 13, height: 13, color, flexShrink: 0 }} />
                <span style={{ fontFamily: M, fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.16em', color, textTransform: 'uppercase' }}>
                  {sec.title}
                </span>
              </div>
            )}

            {/* Section body */}
            {hasContent && (
              <div style={{ padding: hasTitle ? '10px 13px' : '0', display: 'flex', flexDirection: 'column' }}>
                {sec.lines.map((line, li) => renderLine(line, li, isDark, textColor, mutedColor))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
