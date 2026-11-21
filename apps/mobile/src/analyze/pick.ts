import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import type { UploadFile } from '@curasense/shared/api/predictions';

export interface PickedFile { uri: string; name: string; type: string; size: number }

const TYPE_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', tif: 'image/tiff', tiff: 'image/tiff', bmp: 'image/bmp', heic: 'image/heic',
  dcm: 'application/dicom', dicom: 'application/dicom', zip: 'application/zip', pdf: 'application/pdf', txt: 'text/plain', md: 'text/markdown', csv: 'text/csv',
};

interface Asset { uri: string; name?: string | null; fileName?: string | null; mimeType?: string | null; size?: number | null; fileSize?: number | null }

const fromAsset = (a: Asset): PickedFile => {
  const name = a.name || a.fileName || `file-${Date.now()}`;
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return { uri: a.uri, name, type: a.mimeType || TYPE_BY_EXT[ext] || 'application/octet-stream', size: a.size ?? a.fileSize ?? 0 };
};

/** Photos from the library. HEIC photos come back as JPEG, which the server reads. */
export async function pickPhotos(limit: number): Promise<PickedFile[]> {
  const r = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: limit > 1,
    selectionLimit: limit,
    quality: 1,
    preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
  });
  return r.canceled ? [] : r.assets.map(fromAsset);
}

export async function takePhoto(): Promise<PickedFile[]> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) throw new Error('Camera access is off. Turn it on for CuraSense in the Settings app.');
  const r = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
  return r.canceled ? [] : r.assets.map(fromAsset);
}

/** Any file the Files app can reach: DICOM, ZIP, PDF, Word, text. The copy in the app's cache is what gets uploaded. */
export async function pickFiles(multiple: boolean): Promise<PickedFile[]> {
  const r = await DocumentPicker.getDocumentAsync({ multiple, copyToCacheDirectory: true, type: '*/*' });
  return r.canceled ? [] : r.assets.map(fromAsset);
}

/** What the shared upload functions take. A phone's FormData reads the file from its uri; a browser (the web build used for testing) needs a real File. */
export async function uploadable(f: PickedFile): Promise<UploadFile> {
  if (Platform.OS !== 'web') return { uri: f.uri, name: f.name, type: f.type };
  return new File([await (await fetch(f.uri)).blob()], f.name, { type: f.type });
}

export const formatSize = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
