import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { parseSections, STATUS_COLORS, STATUS_RE } from '@curasense/shared/medicalText';
import { useTheme, type Palette } from '../theme';
import { AppText } from '../ui/AppText';
import { radius } from '../ui/tokens';

type Icon = keyof typeof Ionicons.glyphMap;

// The same section families the website colours, with an icon for each.
const SECTION_DEFS: { re: RegExp; color: string; icon: Icon }[] = [
  { re: /urgency|alert level|priority|emergency/i, color: '#f87171', icon: 'warning' },
  { re: /finding|observation|detected|identified|abnormal result/i, color: '#60a5fa', icon: 'search' },
  { re: /assessment|diagnosis|impression|clinical picture/i, color: '#34d399', icon: 'medkit' },
  { re: /risk|concern|warning|caution|red flag/i, color: '#fbbf24', icon: 'alert-circle' },
  { re: /recommend|treatment|next step|action|what to do|plan/i, color: '#a78bfa', icon: 'checkmark-circle' },
  { re: /follow.?up|monitor|schedule|surveillance/i, color: '#2dd4bf', icon: 'time' },
  { re: /summary|overview|highlights|key finding/i, color: '#a78bfa', icon: 'information-circle' },
  { re: /analysis|result|report|scan type|interpretation/i, color: '#60a5fa', icon: 'pulse' },
];
const DEFAULT_SECTION: { color: string; icon: Icon } = { color: '#94a3b8', icon: 'document-text' };
const sectionOf = (title: string) => SECTION_DEFS.find((d) => d.re.test(title)) ?? DEFAULT_SECTION;

/** **bold** text and status words (high, normal, critical, ...) inside one line. Must sit inside a Text. */
function Inline({ text, bold }: { text: string; bold: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
        const b = part.match(/^\*\*([^*]+)\*\*$/);
        if (b) return <Text key={i} style={{ color: bold, fontWeight: '700' }}>{b[1]}</Text>;
        return part.split(STATUS_RE).map((word, j) => {
          const status = STATUS_COLORS[word.toLowerCase()];
          return status
            ? <Text key={`${i}-${j}`} style={{ color: status.c, fontWeight: '800' }}>{word.toUpperCase()}</Text>
            : <Text key={`${i}-${j}`}>{word}</Text>;
        });
      })}
    </>
  );
}

function Row({ marker, children }: { marker: ReactNode; children: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 4 }}>
      {marker}
      <AppText variant="callout" style={{ flex: 1, lineHeight: 22 }}>{children}</AppText>
    </View>
  );
}

function Line({ line, t }: { line: string; t: Palette }) {
  const s = line.trim();
  if (!s) return <View style={{ height: 5 }} />;
  const bold = t.text;

  const bullet = s.match(/^[-*•]\s+(.+)/);
  if (bullet) return <Row marker={<View style={{ width: 7, height: 7, borderRadius: 4, marginTop: 8, backgroundColor: t.accent }} />}><Inline text={bullet[1]} bold={bold} /></Row>;

  const numbered = s.match(/^(\d+)[.)]\s+(.+)/);
  if (numbered) {
    return (
      <Row marker={<View style={{ minWidth: 22, height: 22, borderRadius: 11, marginTop: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.primary }}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{numbered[1]}</Text></View>}>
        <Inline text={numbered[2]} bold={bold} />
      </Row>
    );
  }

  const keyValue = s.match(/^\*\*([^*]{2,45})\*\*\s*[:：]\s*(.+)/);
  if (keyValue) {
    return (
      <View style={{ paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: t.border }}>
        <AppText variant="caption" tone="muted">{keyValue[1]}</AppText>
        <AppText variant="callout" style={{ lineHeight: 22 }}><Inline text={keyValue[2].trim()} bold={bold} /></AppText>
      </View>
    );
  }

  if (/^---+$/.test(s)) return <View style={{ height: 1, backgroundColor: t.border, marginVertical: 6 }} />;
  return <AppText variant="callout" style={{ lineHeight: 23, marginBottom: 2 }}><Inline text={s} bold={bold} /></AppText>;
}

/** The AI service's answer text: titled sections, bullets, numbered steps, label: value rows, with status words coloured. */
export function MedicalText({ text }: { text: string }) {
  const t = useTheme();
  if (!text?.trim()) return null;
  return (
    <View style={{ gap: 10 }}>
      {parseSections(text).map((sec, si) => {
        const hasContent = sec.lines.some((l) => l.trim());
        if (!sec.title) return <View key={si}>{sec.lines.map((line, li) => <Line key={li} line={line} t={t} />)}</View>;
        const { color, icon } = sectionOf(sec.title);
        return (
          <View key={si} style={{ borderRadius: radius.md, borderWidth: 1, borderColor: `${color}55`, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: `${color}1a` }}>
              <Ionicons name={icon} size={15} color={color} />
              <Text accessibilityRole="header" style={{ color, fontSize: 11, fontWeight: '800', letterSpacing: 1.6, textTransform: 'uppercase', flexShrink: 1 }}>{sec.title}</Text>
            </View>
            {hasContent ? <View style={{ padding: 12 }}>{sec.lines.map((line, li) => <Line key={li} line={line} t={t} />)}</View> : null}
          </View>
        );
      })}
    </View>
  );
}
