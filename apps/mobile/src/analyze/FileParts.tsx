import { Image, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { radius } from '../ui/tokens';
import { formatSize, type PickedFile } from './pick';

/** Three ways to add a file on a phone: the photo library, the camera, the Files app. */
export function AddFiles({ onPhotos, onCamera, onFiles, disabled }: { onPhotos: () => void; onCamera: () => void; onFiles: () => void; disabled?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      <Button title="Photos" variant="secondary" testID="add-photos" disabled={disabled} onPress={onPhotos} style={{ flexGrow: 1 }} />
      <Button title="Camera" variant="secondary" testID="add-camera" disabled={disabled} onPress={onCamera} style={{ flexGrow: 1 }} />
      <Button title="Files" variant="secondary" testID="add-files" disabled={disabled} onPress={onFiles} style={{ flexGrow: 1 }} />
    </View>
  );
}

export function FileRow({ file, onRemove }: { file: PickedFile; onRemove: () => void }) {
  const t = useTheme();
  const isImage = file.type.startsWith('image/') && !file.type.includes('heic');
  return (
    <View testID="file-row" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: radius.md, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}>
      {isImage
        ? <Image source={{ uri: file.uri }} style={{ width: 44, height: 44, borderRadius: 8 }} accessibilityIgnoresInvertColors />
        : <View style={{ width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: t.card }}><Ionicons name="document-outline" size={22} color={t.accent} /></View>}
      <View style={{ flex: 1 }}>
        <AppText variant="callout" numberOfLines={1}>{file.name}</AppText>
        {file.size ? <AppText variant="caption" tone="muted">{formatSize(file.size)}</AppText> : null}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${file.name}`} hitSlop={12} onPress={onRemove}>
        <Ionicons name="close-circle" size={24} color={t.textMuted} />
      </Pressable>
    </View>
  );
}
