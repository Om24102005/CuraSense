import multer from 'multer';

/* Upload validation for the AI endpoints. The declared MIME type and file
   name come from the client and are not trusted: the type is decided from the
   file's leading bytes. */

const MB = 1024 * 1024;

/** Returns 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff' | 'dicom' | 'pdf' | 'text' | null. */
export function sniff(buf, name = '') {
  if (!buf || buf.length < 4) return null;
  const asc = (a, b) => buf.toString('latin1', a, b);
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf[0] === 0x89 && asc(1, 4) === 'PNG') return 'png';
  if (asc(0, 4) === 'RIFF' && asc(8, 12) === 'WEBP') return 'webp';
  if (asc(0, 4) === 'GIF8') return 'gif';
  if (asc(0, 2) === 'BM') return 'bmp';
  if ((asc(0, 2) === 'II' && buf[2] === 0x2a && buf[3] === 0) || (asc(0, 2) === 'MM' && buf[2] === 0 && buf[3] === 0x2a)) return 'tiff';
  if (asc(0, 5) === '%PDF-') return 'pdf';
  if (buf.length > 132 && asc(128, 132) === 'DICM') return 'dicom';
  // Plain text has no signature: accept only text-like extensions with no NUL bytes in the first 8 KB.
  if (/\.(txt|csv|md)$/i.test(name) && !buf.subarray(0, 8192).includes(0)) return 'text';
  return null;
}

const IMAGE_KINDS = ['jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'];

/** What each AI endpoint accepts and the size cap per file. */
export const UPLOAD_RULES = {
  imaging: { maxBytes: 25 * MB, kinds: [...IMAGE_KINDS, 'dicom', 'pdf', 'text'] },
  labReport: { maxBytes: 15 * MB, kinds: [...IMAGE_KINDS, 'pdf', 'text'] },
};

/** Multer + byte-level type check. Sets req.file and req.fileKind, or answers 400/413/415. */
export function acceptUpload(rule) {
  const parse = multer({ storage: multer.memoryStorage(), limits: { fileSize: rule.maxBytes, files: 1, fields: 8 } }).single('file');
  return (req, res, next) => {
    parse(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        const tooBig = err.code === 'LIMIT_FILE_SIZE';
        return res.status(tooBig ? 413 : 400).json({ error: tooBig ? `File too large (max ${rule.maxBytes / MB} MB).` : 'Invalid upload.' });
      }
      if (err) return res.status(400).json({ error: 'Invalid upload.' });
      if (!req.file || req.file.size === 0) return res.status(400).json({ error: 'A non-empty file is required.' });
      const kind = sniff(req.file.buffer, req.file.originalname);
      if (!kind || !rule.kinds.includes(kind)) return res.status(415).json({ error: 'Unsupported file type.' });
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
