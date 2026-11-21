import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '../ui/Icon';
import type { PickedFile } from '../analyze/pick';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';

// What the reading lens passes over: the person's own input, drawn on the phone only (nothing here is sent anywhere), dimmed behind the orb.

/** The symptoms that were chosen, as chips. */
export function SymptomChips({ names }: { names: string[] }) {
  const t = useTheme();
  const shown = names.slice(0, 9);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, padding: 16 }}>
      {shown.map((n, i) => (
        <View key={`${n}-${i}`} style={{ paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: t.border, backgroundColor: t.card }}>
          <AppText variant="caption" numberOfLines={1}>{n}</AppText>
        </View>
      ))}
      {names.length > shown.length ? <AppText variant="caption" tone="muted" style={{ alignSelf: 'center' }}>+{names.length - shown.length} more</AppText> : null}
    </View>
  );
}

function FileCard({ name, extra }: { name: string; extra?: string }) {
  const t = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 8, padding: 16 }}>
      <Ionicons name="document-text-outline" size={40} color={t.textMuted} />
      <AppText variant="caption" numberOfLines={1} style={{ maxWidth: 240 }}>{name}</AppText>
      {extra ? <AppText variant="caption" tone="muted">{extra}</AppText> : null}
    </View>
  );
}

/** The first image, filling the lens; a file card for DICOM, PDF and ZIP files. */
export function ScanThumb({ files }: { files: PickedFile[] }) {
  const first = files[0];
  if (!first) return null;
  const more = files.length > 1 ? `+${files.length - 1} more` : undefined;
  if (first.type.startsWith('image/') && !first.type.includes('tiff')) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Image source={{ uri: first.uri }} resizeMode="cover" style={StyleSheet.absoluteFill} accessibilityIgnoresInvertColors />
        {more ? <View style={{ position: 'absolute', right: 10, bottom: 8 }}><AppText variant="caption" style={{ color: '#fff', fontWeight: '700' }}>{more}</AppText></View> : null}
      </View>
    );
  }
  return <FileCard name={first.name} extra={more} />;
}

/** The first lines of pasted text, or the name of an uploaded file. */
export function ReportLines({ text, fileName }: { text?: string; fileName?: string }) {
  const lines = (text ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 8);
  if (!lines.length) return fileName ? <FileCard name={fileName} /> : null;
  return (
    <View style={{ gap: 4, padding: 16 }}>
      {lines.map((l, i) => <AppText key={i} variant="caption" tone="secondary" numberOfLines={1}>{l}</AppText>)}
    </View>
  );
}
