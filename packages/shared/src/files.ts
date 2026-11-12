// What the app checks about a chosen file before sending it (its size and kind). The AI service decides the rest by reading the file.
// Limits come from the same catalogue the website uses.
import { MAX_FILE_MB, MAX_ZIP_MB } from './scans.ts';
import type { Redirect } from './analysis.ts';

export interface FileInfo { name: string; type: string; size: number }

/** null when a scan upload is acceptable, otherwise the reason it is refused. */
export function scanFileProblem(f: FileInfo): string | null {
  const name = f.name.toLowerCase();
  const type = f.type.toLowerCase();
  const isZip = name.endsWith('.zip') || type === 'application/zip' || type === 'application/x-zip-compressed';
  const maxMb = isZip ? MAX_ZIP_MB : MAX_FILE_MB;
  if (f.size > maxMb * 1024 * 1024) return `Too large (max ${maxMb}MB${isZip ? '' : `; zip several files together, up to ${MAX_ZIP_MB}MB`})`;
  const readable = isZip || type.startsWith('image/') || type === 'application/dicom' || type === 'application/pdf' || type.startsWith('text/')
    || /\.(dcm|dicom|pdf|txt|md)$/.test(name);
  return readable ? null : 'Unsupported file type for scan analysis.';
}

export const REPORT_MAX_FILE_MB = 25;
export const REPORT_MAX_ZIP_MB = 40; // a ZIP of report pages, or a Word / Excel file (a ZIP inside)
const ZIP_LIKE = /\.(zip|docx|xlsx|pptx|odt|ods|odp)$/;

/** null when a report upload is acceptable, otherwise the refusal to show (some name the page the file belongs on). */
export function reportFileProblem(f: FileInfo): { message: string; redirect?: Redirect } | null {
  const name = f.name.toLowerCase();
  const maxMb = ZIP_LIKE.test(name) ? REPORT_MAX_ZIP_MB : REPORT_MAX_FILE_MB;
  if (f.size > maxMb * 1024 * 1024) return { message: `File too large (max ${maxMb}MB). Please compress or split the file.` };
  if (name.endsWith('.dcm') || name.endsWith('.dicom') || f.type === 'application/dicom') {
    return { message: 'This is a **DICOM scan file**, not a lab report. Open the **Scans** page and upload it there.', redirect: { page: 'scans' } };
  }
  if (/\.(doc|xls|ppt)$/.test(name)) {
    return { message: 'Old Word / Excel / PowerPoint files (.doc, .xls, .ppt) cannot be read. Open the file, save it as **PDF** (or as .docx / .xlsx) and upload that.' };
  }
  return null;
}
