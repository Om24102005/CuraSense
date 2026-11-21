import multer from 'multer';

/* Upload validation for the AI endpoints. The declared MIME type and file
   name come from the client and are not trusted: the type is decided from the
   file's leading bytes. */

const MB = 1024 * 1024;

/** Returns 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff' | 'heic' | 'dicom' | 'zip' | 'pdf' | 'ole' | 'text' | null.
 *  A Word / Excel / PowerPoint / OpenDocument file is a ZIP; old .doc / .xls / .ppt files are 'ole'. */
export function sniff(buf, name = '') {
  if (!buf || buf.length < 4) return null;
  const asc = (a, b) => buf.toString('latin1', a, b);
  // DICOM first: its 128-byte preamble may legitimately start like a TIFF (dual-format files), and DICOM wins.
  if (buf.length > 132 && asc(128, 132) === 'DICM') return 'dicom';
  if (asc(0, 4) === 'PK\x03\x04' || asc(0, 4) === 'PK\x05\x06') return 'zip';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf[0] === 0x89 && asc(1, 4) === 'PNG') return 'png';
  if (asc(0, 4) === 'RIFF' && asc(8, 12) === 'WEBP') return 'webp';
  if (asc(0, 4) === 'GIF8') return 'gif';
  if (asc(0, 2) === 'BM') return 'bmp';
  if ((asc(0, 2) === 'II' && buf[2] === 0x2a && buf[3] === 0) || (asc(0, 2) === 'MM' && buf[2] === 0 && buf[3] === 0x2a)) return 'tiff';
  if (asc(0, 5) === '%PDF-') return 'pdf';
  // An iPhone photo: an ISO media file with a HEIF brand.
  if (buf.length >= 12 && asc(4, 8) === 'ftyp' && /^(heic|heix|hevc|hevx|mif1|msf1|heim|heis)$/.test(asc(8, 12))) return 'heic';
  // Old Word / Excel / PowerPoint: the Python service refuses it with an explanation of how to convert it.
  if (buf.length >= 8 && buf.toString('hex', 0, 8) === 'd0cf11e0a1b11ae1') return 'ole';
  // A DICOM data set saved without the 128-byte preamble starts with a group 0002 or 0008 element. Only a first guess:
  // the Python service reads the content and refuses anything that is not really DICOM.
  if (buf.length >= 8 && (buf[0] === 0x08 || buf[0] === 0x02) && buf[1] === 0 && buf[3] === 0) return 'dicom';
  // Windows "Unicode" text has NUL bytes by design, but starts with a byte-order mark.
  if ((buf[0] === 0xff && buf[1] === 0xfe) || (buf[0] === 0xfe && buf[1] === 0xff)) return 'text';
  // Other text has no signature: accept text-like extensions, and HTML / RTF that announce themselves, with no NUL bytes in the first 8 KB.
  const textual = !buf.subarray(0, 8192).includes(0);
  const head = asc(0, Math.min(buf.length, 64)).trimStart().toLowerCase();
  if (textual && (/\.(txt|csv|tsv|md|json|xml|html?|rtf|log|hl7|eml|ya?ml)$/i.test(name) || /^(<!doctype html|<html|\{\\rtf)/.test(head))) return 'text';
  return null;
}

const IMAGE_KINDS = ['jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'heic'];

/** What each AI endpoint accepts and the size cap per file (a ZIP of a whole study gets its own, larger cap). */
export const UPLOAD_RULES = {
  imaging: { maxBytes: 25 * MB, zipBytes: 60 * MB, kinds: [...IMAGE_KINDS, 'dicom', 'zip', 'pdf', 'text'], hint: 'an image, PDF, DICOM, ZIP or text file' },
  labReport: { maxBytes: 25 * MB, zipBytes: 40 * MB, kinds: [...IMAGE_KINDS, 'zip', 'pdf', 'text', 'ole'], hint: 'a PDF, photo or scan, Word / Excel / text file, or a ZIP' },
};

/** Multer + byte-level type check. Sets req.file and req.fileKind, or answers 400/413/415. */
export function acceptUpload(rule) {
  // multer cannot see the type before it has the bytes, so it enforces the largest cap and the per-type cap follows below.
  // shortcut: a 60 MB file that is not a ZIP is buffered before it is refused; sniff the first chunk in a custom multer storage if upload abuse shows up.
  const parse = multer({ storage: multer.memoryStorage(), limits: { fileSize: Math.max(rule.maxBytes, rule.zipBytes), files: 1, fields: 9 } }).single('file');
  const tooBig = (res) => res.status(413).json({ error: `File too large (max ${rule.maxBytes / MB} MB, or ${rule.zipBytes / MB} MB for a ZIP or Word / Excel file).` });
  return (req, res, next) => {
    parse(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return err.code === 'LIMIT_FILE_SIZE' ? tooBig(res) : res.status(400).json({ error: 'Invalid upload.' });
      }
      if (err) return res.status(400).json({ error: 'Invalid upload.' });
      if (!req.file || req.file.size === 0) return res.status(400).json({ error: 'A non-empty file is required.' });
      const kind = sniff(req.file.buffer, req.file.originalname);
      if (!kind || !rule.kinds.includes(kind)) return res.status(415).json({ error: `Unsupported file type. Upload ${rule.hint}.` });
      if (req.file.size > (kind === 'zip' ? rule.zipBytes : rule.maxBytes)) return tooBig(res);
      req.fileKind = kind;
      next();
    });
  };
}

/** For endpoints that take either JSON text or a file: run the upload step only for multipart bodies. */
export const acceptUploadIfMultipart = (rule) => {
  const upload = acceptUpload(rule);
  return (req, res, next) => (req.is('multipart/form-data') ? upload(req, res, next) : next());
};
