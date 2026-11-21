"""Uploaded file -> pages the AI steps read. Shared by the Scans and Reports pages.

A page is one unit of content: an image (photo, scan, rendered PDF page, DICOM frame) or a block of text.
Nothing is dropped silently: a file with too many pages is refused, and sampled DICOM frames and the files of a
ZIP that were not read are reported in the notes.
"""
import io
import re
import warnings
import xml.etree.ElementTree as ET
import zipfile
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from html.parser import HTMLParser

import numpy as np
import pydicom
import pymupdf
from PIL import Image, ImageOps, ImageSequence
from pydicom.dataset import FileMetaDataset
from pydicom.multival import MultiValue
from pydicom.uid import ExplicitVRBigEndian, ExplicitVRLittleEndian, ImplicitVRLittleEndian

try:  # an iPhone photo (HEIC / HEIF) opens like any other image once the plugin is registered
    import pillow_heif

    pillow_heif.register_heif_opener()
except ImportError:  # shortcut: without the plugin a HEIC photo is refused with a clear message; `pip install pillow-heif` reads it
    pillow_heif = None

MAX_PAGES = 40        # pages / frames per file. More than this is refused, never truncated
MAX_TEXT = 200_000    # characters of text per file, same rule
DICOM_FRAMES = 8      # a cine / volume DICOM (or one series of a ZIP) is sampled evenly, and the notes say so
SIDE = 2048           # longest side of an image sent to the vision model
MAX_PIXELS = 40_000_000  # a DICOM that declares more than this per frame is refused before it is decoded
TEXT_MIN = 20         # a PDF page with less text than this (and no big picture) is an image page, or blank
WORKERS = 8           # parallel AI calls per file for the quick steps (labelling)
READ_WORKERS = 24     # clinical reads reason for 10-60 s each, so a big file reads many pages at once (the provider cap is the real limit)
ZIP_FILES = 3000      # files in one ZIP
ZIP_BYTES = 600_000_000   # what all the files of a ZIP add up to once unpacked (the declared sizes are enforced, see _load_zip)
MEMBER_BYTES = 100_000_000  # one unpacked file of a ZIP
XML_BYTES = 60_000_000     # one XML part of an Office file (a big spreadsheet's sheet can be tens of MB)
SHEET_ROWS = 20_000        # rows read from one spreadsheet sheet; more is noted, never silent

Image.MAX_IMAGE_PIXELS = 80_000_000  # decompression-bomb guard

# DICOM Modality tag -> our modality. Read from the header, so no AI guess. Missing = ask the AI (SC, OT, XC, ...).
_DICOM_MODALITY = {
    "CT": "ct", "MR": "mri", "CR": "xray", "DX": "xray", "RG": "xray", "PX": "xray", "IO": "xray",
    "US": "ultrasound", "IVUS": "ultrasound", "MG": "mammogram", "PT": "nuclear", "NM": "nuclear",
    "XA": "fluoroscopy", "RF": "fluoroscopy", "ES": "endoscopy", "OP": "retinal", "OPT": "retinal",
    "OPM": "retinal", "OAM": "retinal", "BMD": "dexa",
}
# DICOM objects that are reports, overlays or plans rather than scan images.
_NOT_A_SCAN = {"SR", "KO", "PR", "DOC", "SEG", "REG", "FID", "RWV", "RTDOSE", "RTPLAN", "RTSTRUCT", "RTRECORD", "RTIMAGE"}
# BodyPartExamined is free-ish text ("CHEST", "CSPINE", "ABDOMENPELVIS"): the regions it names, see routing.REGIONS.
_REGION_WORDS = (
    ("head", ("HEAD", "SKULL", "BRAIN", "FACE", "ORBIT", "SINUS", "JAW", "SELLA", "CRANI", "MAXILLO", "PITUIT")),
    ("neck", ("NECK", "THYROID", "CAROTID", "LARYNX", "PHARYN")),
    ("chest", ("CHEST", "THORAX", "LUNG", "RIB", "MEDIAST")),
    ("heart", ("HEART", "CARDI", "CORONARY")),
    ("breast", ("BREAST",)),
    ("abdomen", ("ABD", "LIVER", "KIDNEY", "RENAL", "PANCREAS", "SPLEEN", "GALLBL", "BOWEL", "COLON", "STOMACH", "ADRENAL")),
    ("pelvis", ("PELV", "PROSTATE", "UTER", "BLADDER", "OVAR", "RECTUM", "SACRUM")),
    ("spine", ("SPINE", "VERTEB", "COCCYX")),
    ("upper_limb", ("SHOULDER", "ARM", "ELBOW", "WRIST", "HAND", "FINGER", "CLAVIC", "SCAPUL", "HUMER", "EXTREM")),
    ("lower_limb", ("HIP", "LEG", "THIGH", "KNEE", "ANKLE", "FOOT", "TOE", "FEMUR", "TIBIA", "CALCAN", "EXTREM")),
    ("whole_body", ("WHOLE", "TOTAL BODY")),
    ("eye", ("EYE", "RETIN", "OPTIC")),
    ("skin", ("SKIN",)),
)


class Unsupported(ValueError):
    """Not an image, PDF, DICOM or text file."""


class NotAScan(ValueError):
    """A DICOM object that holds no image: a report, an overlay, a plan."""


class DicomIndex(NotAScan):
    """A DICOMDIR: the table of contents of a DICOM disc. It names the image files and holds none."""


class TooLarge(ValueError):
    """More pages, characters or bytes than one request reads. Refused whole, never cut."""


@dataclass
class Page:
    n: int                              # position in the file, from 1 (a frame number for DICOM)
    image: bytes | None = None
    text: str = ""
    dicom: dict | None = None           # {"modality": "ct" | None, "body_part": "HEAD", "regions": ["head"]}, from the header
    name: str = ""                      # inside a ZIP: the file, or the series, this page came from

    @property
    def title(self) -> str:
        return f"Page {self.n}" + (f" · {self.name}" if self.name else "")


@dataclass
class Doc:
    pages: list[Page] = field(default_factory=list)
    total: int = 1                      # pages / frames in the file; larger than len(pages) when sampled
    notes: list[str] = field(default_factory=list)  # shown to the user, e.g. which DICOM frames were analysed


def load(data: bytes) -> Doc:
    """Read an upload. Raises ValueError with a user-facing message."""
    if data[128:132] != b"DICM" and data[:4] in (b"PK\x03\x04", b"PK\x05\x06"):
        return _load_zip(data)
    return _load_one(data)


OLD_OFFICE = "Old Word / Excel / PowerPoint files (.doc, .xls, .ppt) cannot be read. Open the file, save it as PDF (or as .docx / .xlsx) and upload that."


def _load_one(data: bytes) -> Doc:
    """One file that is not a ZIP."""
    if data[:5] == b"%PDF-":
        return _load_pdf(data)
    if _is_dicom(data[:140]):
        return _load_dicom(data)
    if data[:8] == b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1":
        raise Unsupported(OLD_OFFICE)
    doc = _load_image(data)
    if doc:
        return doc
    if data[4:8] == b"ftyp" and data[8:12] in (b"heic", b"heix", b"hevc", b"hevx", b"mif1", b"msf1", b"heim", b"heis"):
        raise Unsupported("This is an iPhone (HEIC) photo and this server cannot open that format yet. Share it as JPEG, or take a screenshot of it, and upload that.")
    text = _decode(data)
    if text is None:
        raise Unsupported("Unsupported file type. Upload a PDF, photo or scan, Word / Excel / text file, or a ZIP.")
    if data[:5] == b"{\\rtf":
        text = _rtf_text(text)
    elif re.match(r"\s*(<!doctype html|<html|<\?xml[^>]*>\s*<html)", text[:200], re.I):
        text = _html_text(text)
    text = text.strip()
    if not text:
        raise ValueError("The file is empty or could not be read.")
    _check_text(len(text))
    return Doc([Page(1, text=text)])


# ── text-like files ───────────────────────────────────────────────────────

def _decode(data: bytes) -> str | None:
    """The text of a text-like file, or None when the bytes are binary."""
    if data[:3] == b"\xef\xbb\xbf":
        return data[3:].decode("utf-8", errors="replace")
    if data[:2] in (b"\xff\xfe", b"\xfe\xff"):  # Windows "Unicode" text
        return data.decode("utf-16", errors="replace")
    if b"\x00" in data[:8192]:
        return None
    try:
        return data.decode("utf-8")
    except UnicodeDecodeError:
        return data.decode("cp1252", errors="replace")  # Windows text with accents, µ, °


class _HtmlText(HTMLParser):
    """Visible text of an HTML page: a line per block, a tab between table cells, no scripts or styles."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out: list[str] = []
        self.hidden = 0
        self.cells = 0  # cells seen in the current table row

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.hidden += 1
        elif tag in ("td", "th"):
            self.out.append("\t" if self.cells else "")
            self.cells += 1
        elif tag in ("br", "p", "div", "tr", "li", "table", "h1", "h2", "h3", "h4", "h5", "h6"):
            self.out.append("\n")
            self.cells = 0

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.hidden = max(0, self.hidden - 1)
        elif tag in ("p", "div", "tr", "li", "table"):
            self.out.append("\n")

    def handle_data(self, data):
        if not self.hidden:
            self.out.append(data)


def _html_text(html: str) -> str:
    parser = _HtmlText()
    parser.feed(html)
    text = "".join(parser.out)
    return re.sub(r"\n[ \t\n]*\n", "\n", re.sub(r"[ \t]*\t[ \t]*", "\t", text))


_RTF_SKIP = {"fonttbl", "colortbl", "stylesheet", "info", "pict", "header", "footer", "footnote", "themedata", "colorschememapping",
             "datastore", "latentstyles", "listtable", "listoverridetable", "rsidtbl", "generator", "xmlnstbl"}


def _rtf_text(rtf: str) -> str:
    """The text of an RTF file: control words dropped, paragraphs and table cells kept as line and tab breaks."""
    out, depth, skip_at, i, n = [], 0, None, 0, len(rtf)
    while i < n:
        c = rtf[i]
        if c == "{":
            depth += 1
            m = re.match(r"\{\\(\*)?\\?([a-z]+)", rtf[i:i + 40])
            if skip_at is None and m and (m.group(1) or m.group(2) in _RTF_SKIP):
                skip_at = depth
            i += 1
        elif c == "}":
            if skip_at == depth:
                skip_at = None
            depth -= 1
            i += 1
        elif c == "\\":
            m = re.match(r"\\([a-zA-Z]+)(-?\d+)? ?|\\'([0-9a-fA-F]{2})|\\(.)", rtf[i:i + 64], re.S)
            i += m.end() if m else 1
            if not m or skip_at is not None:
                continue
            word, num, hexa, sym = m.groups()
            if word in ("par", "line", "row"):
                out.append("\n")
            elif word in ("tab", "cell"):
                out.append("\t")
            elif word == "u" and num:
                out.append(chr(int(num) % 65536))
                if rtf[i:i + 1] == "?":
                    i += 1  # the ASCII stand-in that follows \uN
            elif hexa:
                out.append(bytes.fromhex(hexa).decode("cp1252", "replace"))
            elif sym in ("{", "}", "\\"):
                out.append(sym)
        else:
            if skip_at is None and c not in "\r\n":
                out.append(c)
            i += 1
    return re.sub(r"\n[ \t]*\n+", "\n", "".join(out))


def each(items: list, fn, workers: int = WORKERS) -> list:
    """Run fn on every item in parallel (they are independent AI calls) and keep the order."""
    with ThreadPoolExecutor(max(1, min(workers, len(items)))) as ex:
        return list(ex.map(fn, items))


def _check_text(n: int) -> None:
    if n > MAX_TEXT:
        raise TooLarge(f"This file has {n:,} characters of text; the limit is {MAX_TEXT:,}. Split it and upload the parts.")


def _too_many(n: int) -> ValueError:
    return TooLarge(f"This file has {n} pages; the limit is {MAX_PAGES}. Split it and upload the parts.")


# ── images ────────────────────────────────────────────────────────────────

def _encode(im: Image.Image) -> bytes:
    """Normalise to what the vision API reads: upright, 8-bit, grayscale PNG or RGB JPEG, at most SIDE px."""
    im = ImageOps.exif_transpose(im)  # a phone photo's rotation changes what the model sees
    if im.mode in ("I;16", "I;16L", "I;16B", "I", "F"):
        im = Image.fromarray(_to_8bit(np.asarray(im, dtype=np.float32)), "L")
    elif im.mode in ("RGBA", "LA", "PA") or (im.mode == "P" and "transparency" in im.info):
        rgba = im.convert("RGBA")
        bg = Image.new("RGB", rgba.size, "white")
        bg.paste(rgba, mask=rgba.getchannel("A"))
        im = bg
    elif im.mode not in ("L", "RGB"):
        im = im.convert("RGB")
    im.thumbnail((SIDE, SIDE))
    out = io.BytesIO()
    if im.mode == "L":
        im.save(out, "PNG")
    else:
        im.save(out, "JPEG", quality=92)
    return out.getvalue()


def _to_8bit(arr: np.ndarray, lo: float | None = None, hi: float | None = None) -> np.ndarray:
    if lo is None or hi is None:
        lo, hi = np.percentile(arr, (0.5, 99.5))
    if hi <= lo:
        hi = lo + 1
    return (np.clip((arr - lo) / (hi - lo), 0, 1) * 255).astype(np.uint8)


def _load_image(data: bytes) -> Doc | None:
    """None when the bytes are not an image. Every frame of a multi-page TIFF / animated image is a page."""
    try:
        im = Image.open(io.BytesIO(data))
        n = getattr(im, "n_frames", 1)
    except Exception:
        return None
    if n > MAX_PAGES:
        raise _too_many(n)
    try:
        return Doc([Page(i, image=_encode(f)) for i, f in enumerate(ImageSequence.Iterator(im), 1)], n)
    except Exception:
        raise ValueError("Could not read this image. It may be corrupted or too large.") from None


# ── PDF ───────────────────────────────────────────────────────────────────

def _garbled(text: str) -> bool:
    """Text that a PDF stores with a broken font map comes out as private-use symbols, replacement characters or (cid:NN):
    it cannot be read as text, so the page is rendered and read as a picture instead."""
    t = "".join(text.split())
    if len(t) < 40:
        return False
    bad = sum(1 for c in t if c == "\ufffd" or 0xE000 <= ord(c) <= 0xF8FF) + 6 * t.count("(cid:")
    return bad / len(t) > 0.15 or sum(c.isalnum() for c in t) / len(t) < 0.4


def _load_pdf(data: bytes) -> Doc:
    """Every page is read. A page that is mostly text is a text page; anything else is rendered as an image."""
    try:
        pdf = pymupdf.open(stream=data, filetype="pdf")
    except Exception:
        raise ValueError("Could not open this PDF. It may be corrupted.") from None
    if pdf.needs_pass:
        raise ValueError("This PDF is password-protected.")
    if pdf.page_count == 0:
        raise ValueError("This PDF has no pages.")
    if pdf.page_count > MAX_PAGES:
        raise _too_many(pdf.page_count)

    pages, chars = [], 0
    for n, page in enumerate(pdf, 1):
        text = page.get_text().strip()
        area = page.rect.width * page.rect.height
        big_picture = any(pymupdf.Rect(i["bbox"]).width * pymupdf.Rect(i["bbox"]).height >= 0.3 * area for i in page.get_image_info())
        if len(text) >= TEXT_MIN and not big_picture and not _garbled(text):
            chars += len(text)
            _check_text(chars)
            pages.append(Page(n, text=text))
            continue
        scale = min(150 / 72, 3000 / max(page.rect.width, page.rect.height))  # 150 dpi, but a huge page never renders huge
        pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale))
        if not pix.is_unicolor:  # a blank page has nothing to analyse
            pages.append(Page(n, image=_encode(Image.frombytes("RGB", (pix.width, pix.height), pix.samples))))
    return Doc(pages, pdf.page_count)


# ── DICOM ─────────────────────────────────────────────────────────────────

def _bare_dicom(head: bytes) -> bool:
    """A data set saved without the 128-byte preamble starts with a group 0002 or 0008 element (little endian)."""
    return len(head) >= 8 and head[0] in (0x02, 0x08) and head[1] == 0 and head[3] == 0


def _is_dicom(head: bytes) -> bool:
    """Only a first guess from the leading bytes: _read_dicom is the real check."""
    return head[128:132] == b"DICM" or _bare_dicom(head)


def _regions(body_part: str) -> list[str]:
    v = body_part.upper()
    found = [region for region, words in _REGION_WORDS if any(w in v for w in words)]
    return found + (["head"] if v == "EAR" else [])


def _even(n: int, k: int) -> list[int]:
    return list(range(n)) if n <= k else [round(i * (n - 1) / (k - 1)) for i in range(k)]


def _first(v):
    return float(v[0] if isinstance(v, (list, MultiValue)) else v)


def _dicom_frame(ds, index: int | None) -> Image.Image:
    """One frame as it would look in a viewer: modality LUT, window, MONOCHROME1 inverted, 8-bit."""
    arr = pydicom.pixels.pixel_array(ds, index=index) if index is not None else ds.pixel_array
    photometric = str(ds.get("PhotometricInterpretation", ""))
    if photometric == "PALETTE COLOR":
        arr = pydicom.pixels.apply_color_lut(arr, ds)
    if arr.ndim == 3 and arr.shape[-1] == 3:  # colour
        arr = arr if arr.dtype == np.uint8 else _to_8bit(arr.astype(np.float32), 0, float(arr.max()) or 1)
        return Image.fromarray(arr, "RGB")
    arr = arr.astype(np.float32) * float(ds.get("RescaleSlope", 1) or 1) + float(ds.get("RescaleIntercept", 0) or 0)
    c, w = ds.get("WindowCenter"), ds.get("WindowWidth")
    lo, hi = (_first(c) - _first(w) / 2, _first(c) + _first(w) / 2) if c is not None and w is not None and _first(w) > 0 else (None, None)
    out = _to_8bit(arr, lo, hi)
    return Image.fromarray(255 - out if photometric == "MONOCHROME1" else out, "L")


_CORRUPT = "Could not read this DICOM file. It may be corrupted."


def _read_dicom(src, header_only: bool = False):
    """Parse a DICOM file, with or without the preamble. header_only stops before the pixels (cheap, for sorting a series)."""
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            ds = pydicom.dcmread(src, force=True, stop_before_pixels=header_only)
    except Exception:
        raise ValueError(_CORRUPT) from None
    # force=True accepts any bytes: only something that names its SOP class or modality is DICOM
    if not (ds.get("SOPClassUID") or ds.get("Modality") or ds.file_meta.get("MediaStorageSOPClassUID")):
        raise ValueError(_CORRUPT)
    if "TransferSyntaxUID" not in ds.file_meta:  # no preamble / meta group: the decoder needs the encoding spelled out
        implicit, little = getattr(ds, "original_encoding", None) or (ds.is_implicit_VR, ds.is_little_endian)
        ds.file_meta = FileMetaDataset()
        ds.file_meta.TransferSyntaxUID = ImplicitVRLittleEndian if implicit else (ExplicitVRLittleEndian if little else ExplicitVRBigEndian)
    return ds


def _scan_info(ds) -> dict:
    """The two header fields that say what the scan is, plus the regions the body part names. Nothing else leaves the file."""
    kind = str(ds.get("Modality", "")).upper()
    if ds.get("DirectoryRecordSequence") is not None or ds.file_meta.get("MediaStorageSOPClassUID") == "1.2.840.10008.1.3.10":
        raise DicomIndex("This is a DICOMDIR, the index of a DICOM disc: it lists images but holds none. Upload the image files, or a ZIP of the whole study folder.")
    if kind in _NOT_A_SCAN or "Rows" not in ds or "Columns" not in ds:
        raise NotAScan(f"This DICOM file ({kind or 'unknown type'}) holds no scan image to analyse.")
    if int(ds.Rows) * int(ds.Columns) > MAX_PIXELS:
        raise ValueError("This DICOM image is too large to read. Export it at a smaller size as PNG/JPG or PDF.")
    body = str(ds.get("BodyPartExamined", "")).strip()[:40]
    return {"modality": _DICOM_MODALITY.get(kind), "body_part": body, "regions": _regions(body)}


def _dicom_pages(ds, picks: list[int], info: dict, name: str = "") -> list[Page]:
    """The wanted frames of one DICOM file, decoded."""
    frames = int(ds.get("NumberOfFrames", 1) or 1)
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            return [Page(i + 1, image=_encode(_dicom_frame(ds, i if frames > 1 else None)), dicom=info, name=name) for i in picks]
    except Exception:
        raise ValueError("Could not decode the image inside this DICOM file. Export it as PNG/JPG or PDF from your viewer.") from None


def _load_dicom(data: bytes) -> Doc:
    """Pixels plus the header fields that tell us what the scan is. No patient data leaves this function."""
    ds = _read_dicom(io.BytesIO(data))
    info = _scan_info(ds)
    frames = int(ds.get("NumberOfFrames", 1) or 1)
    picks = _even(frames, DICOM_FRAMES)
    pages = _dicom_pages(ds, picks, info)
    notes = [f"Analysed {len(picks)} evenly spaced frames of {frames}."] if frames > len(picks) else []
    return Doc(pages, frames, notes)


# ── ZIP ───────────────────────────────────────────────────────────────────

def _junk(name: str) -> bool:
    """Files an archiver adds on its own: never the user's content."""
    base = name.rsplit("/", 1)[-1]
    return name.startswith("__MACOSX/") or base in (".DS_Store", "Thumbs.db", "desktop.ini") or base.startswith("._")


def _short(name: str) -> str:
    """A file name as shown back to the user: no folders, no control characters (a name can hold a line break), at most 60 characters."""
    return "".join(c if c.isprintable() else " " for c in name.rsplit("/", 1)[-1])[:60]


# ── Word / Excel / PowerPoint / OpenDocument files (zip containers of XML) ──

_W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
_A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
_S = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
_T = "{urn:oasis:names:tc:opendocument:xmlns:text:1.0}"
_X = "{urn:oasis:names:tc:opendocument:xmlns:table:1.0}"


def _xml(zf: zipfile.ZipFile, name: str) -> ET.Element:
    if zf.getinfo(name).file_size > XML_BYTES:
        raise TooLarge(f"This file has a part over {XML_BYTES // 1_000_000} MB of text. Save it as PDF and upload that.")
    try:
        return ET.fromstring(zf.read(name))
    except ET.ParseError:
        raise ValueError("Could not read this file. It may be corrupted.") from None


def _docx_para(p: ET.Element) -> str:
    return "".join(
        (t.text or "") if t.tag == _W + "t" else "\t" if t.tag == _W + "tab" else "\n" if t.tag in (_W + "br", _W + "cr") else ""
        for t in p.iter()
    ).strip()


def _load_docx(zf: zipfile.ZipFile, names: set[str]) -> Doc:
    body = _xml(zf, "word/document.xml").find(_W + "body")
    lines: list[str] = []
    for el in body if body is not None else []:
        if el.tag == _W + "p":
            lines.append(_docx_para(el))
        elif el.tag == _W + "tbl":  # a table keeps its rows: one line per row, a tab between cells
            for tr in el.iter(_W + "tr"):
                lines.append("\t".join(" ".join(filter(None, (_docx_para(p) for p in tc.iter(_W + "p")))) for tc in tr.findall(_W + "tc")))
    text = "\n".join(lines).strip()
    _check_text(len(text))
    pages = [Page(1, text=text)] if len(text) >= TEXT_MIN else []
    if not pages:  # a scan pasted into Word: read the pictures
        media = sorted(n for n in names if n.startswith("word/media/"))[:MAX_PAGES]
        for n in media:
            doc = _load_image(zf.read(n))
            if doc:
                pages += [Page(len(pages) + 1, image=pg.image) for pg in doc.pages]
    return Doc(pages, max(1, len(pages)))


def _col(ref: str) -> int:
    n = 0
    for ch in re.match(r"[A-Z]*", ref).group():
        n = n * 26 + ord(ch) - 64
    return max(0, n - 1)


def _load_xlsx(zf: zipfile.ZipFile, names: set[str]) -> Doc:
    shared = ["".join(t.text or "" for t in si.iter(_S + "t")) for si in _xml(zf, "xl/sharedStrings.xml").iter(_S + "si")] if "xl/sharedStrings.xml" in names else []
    sheets = sorted((n for n in names if re.fullmatch(r"xl/worksheets/sheet\d+\.xml", n)), key=lambda n: int(re.search(r"(\d+)\.xml", n).group(1)))
    pages, notes, chars = [], [], 0
    for k, name in enumerate(sheets, 1):
        rows, cut = [], False
        for row in _xml(zf, name).iter(_S + "row"):
            if len(rows) >= SHEET_ROWS:
                cut = True
                break
            cells: dict[int, str] = {}
            for c in row.findall(_S + "c"):
                v, kind = c.find(_S + "v"), c.get("t")
                if kind == "inlineStr":
                    cells[_col(c.get("r", "A"))] = "".join(t.text or "" for t in c.iter(_S + "t"))
                elif v is not None and v.text is not None:
                    cells[_col(c.get("r", "A"))] = shared[int(v.text)] if kind == "s" and int(v.text) < len(shared) else v.text
            if cells:
                rows.append("\t".join(cells.get(i, "") for i in range(max(cells) + 1)))
        if rows:
            text = f"Sheet {k}\n" + "\n".join(rows)
            chars += len(text)
            _check_text(chars)
            pages.append(Page(len(pages) + 1, text=text))
        if cut:
            notes.append(f"Sheet {k} has more than {SHEET_ROWS:,} rows; only the first {SHEET_ROWS:,} were read.")
    return Doc(pages, max(1, len(pages)), notes)


def _load_pptx(zf: zipfile.ZipFile, names: set[str]) -> Doc:
    slides = sorted((n for n in names if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)), key=lambda n: int(re.search(r"(\d+)\.xml", n).group(1)))
    if len(slides) > MAX_PAGES:
        raise _too_many(len(slides))
    pages, chars = [], 0
    for name in slides:
        text = "\n".join("".join(t.text or "" for t in p.iter(_A + "t")) for p in _xml(zf, name).iter(_A + "p")).strip()
        if text:
            chars += len(text)
            _check_text(chars)
            pages.append(Page(len(pages) + 1, text=text))
    return Doc(pages, len(slides) or 1)


def _load_odf(zf: zipfile.ZipFile, names: set[str]) -> Doc:
    lines: list[str] = []

    def walk(el: ET.Element) -> None:
        if el.tag in (_T + "p", _T + "h"):
            lines.append("".join(el.itertext()).strip())
        elif el.tag == _X + "table-row":
            lines.append("\t".join(" ".join(filter(None, ("".join(p.itertext()).strip() for p in cell.iter() if p.tag in (_T + "p", _T + "h")))) for cell in el if cell.tag in (_X + "table-cell", _X + "covered-table-cell")))
        else:
            for child in el:
                walk(child)

    walk(_xml(zf, "content.xml"))
    text = "\n".join(lines).strip()
    _check_text(len(text))
    return Doc([Page(1, text=text)] if text else [], 1)


def _office_loader(zf: zipfile.ZipFile, names: set[str]):
    """The loader for a zip that is really a Word / Excel / PowerPoint / OpenDocument file, else None."""
    if "[Content_Types].xml" in names:
        if "word/document.xml" in names:
            return _load_docx
        if any(n.startswith("xl/worksheets/") for n in names):
            return _load_xlsx
        if any(n.startswith("ppt/slides/") for n in names):
            return _load_pptx
    if "content.xml" in names and "mimetype" in names and zf.read("mimetype")[:40].startswith(b"application/vnd.oasis.opendocument"):
        return _load_odf
    return None


def _load_zip(data: bytes) -> Doc:
    """A folder of files: a DICOM study exported from a disc, a set of images, or PDFs. Every file is read by what it
    contains, not by its name. DICOM files are grouped into series and each series is sampled evenly; nothing is written to disk."""
    try:
        zf = zipfile.ZipFile(io.BytesIO(data))
        infos = [i for i in zf.infolist() if not i.is_dir() and not _junk(i.filename)]
    except Exception:
        raise ValueError("Could not open this ZIP. It may be corrupted.") from None
    if not infos:
        raise ValueError("This ZIP has no files in it.")
    if len(infos) > ZIP_FILES:
        raise TooLarge(f"This ZIP holds {len(infos):,} files; the limit is {ZIP_FILES:,}. Zip one study or series.")
    if any(i.flag_bits & 0x1 for i in infos):
        raise ValueError("This ZIP is password-protected.")
    # A member can never unpack to more than its declared size (zipfile cuts the stream there), so these limits hold.
    if sum(i.file_size for i in infos) > ZIP_BYTES or any(i.file_size > MEMBER_BYTES for i in infos):
        raise TooLarge(f"This ZIP unpacks to more than {ZIP_BYTES // 1_000_000} MB (or holds a file over {MEMBER_BYTES // 1_000_000} MB). Zip one study or series.")
    names = {i.filename for i in infos}
    office = _office_loader(zf, names)
    if office:
        doc = office(zf, names)
        if not doc.pages:
            raise ValueError("This file has no readable text or pictures. Save it as PDF and upload that.")
        return doc
    if names & {"[Content_Types].xml", "mimetype", "META-INF/MANIFEST.MF"}:
        raise ValueError("This is an app or Office file this page cannot read. Save it as PDF and upload that.")

    ignored, unread = Counter(), []
    pages: list[Page] = []
    total = 0
    series: dict[str, dict] = {}   # SeriesInstanceUID -> info, label parts, [(instance number, member, frames)]
    for info in infos:
        try:
            with zf.open(info) as f:
                head = f.read(140)
            if head[:4] in (b"PK\x03\x04", b"PK\x05\x06") and head[128:132] != b"DICM":
                ignored["ZIP inside the ZIP (not opened)"] += 1
            elif _is_dicom(head):
                with zf.open(info) as f:
                    ds = _read_dicom(f, header_only=True)
                scan = _scan_info(ds)
                s = series.setdefault(str(ds.get("SeriesInstanceUID", "")) or "?", {"info": scan, "kind": str(ds.get("Modality", "")).upper(), "items": []})
                s["items"].append((int(ds.get("InstanceNumber", 0) or 0), info, int(ds.get("NumberOfFrames", 1) or 1)))
            elif info.file_size == 0:
                ignored["empty files"] += 1
            else:
                doc = _load_one(zf.read(info))
                total += doc.total
                for p in doc.pages:
                    pages.append(Page(0, p.image, p.text, p.dicom, _short(info.filename) + (f" p.{p.n}" if doc.total > 1 else "")))
                if len(pages) > MAX_PAGES:
                    raise TooLarge(f"This ZIP holds more than {MAX_PAGES} pages; the limit is {MAX_PAGES}. Split it and upload the parts.")
        except TooLarge:
            raise  # one file over a limit refuses the whole upload
        except DicomIndex:
            pass  # the disc index names the images, which are read from their own files
        except NotAScan:
            ignored["DICOM objects that hold no image (reports, overlays)"] += 1
        except Unsupported:
            ignored["files that are not scans, reports or images (for example viewer programs)"] += 1
        except ValueError as e:
            unread.append(f"{_short(info.filename)} ({e})")

    budget = MAX_PAGES - len(pages)
    if series and budget < len(series):
        raise TooLarge(f"This ZIP holds {len(series)} DICOM series and {len(pages)} other pages; at most {MAX_PAGES} pages can be read at once. Zip fewer series.")
    per = min(DICOM_FRAMES, budget // len(series)) if series else 0
    for k, s in enumerate(series.values(), 1):
        # shortcut: slices are ordered by InstanceNumber, not by position in the body; upgrade (ImagePositionPatient) if a scanner numbers them out of order
        items = sorted(s["items"], key=lambda t: (t[0], t[1].filename))
        flat = [(m, f) for _, m, frames in items for f in range(frames)]
        picks = [flat[i] for i in _even(len(flat), per)]
        # the label says when a series is a sample, so the heading of its analysis and any refusal note carry it
        count = f"{len(picks)} of {len(flat)}" if len(flat) > len(picks) else str(len(flat))
        label = f"Series {k} ({s['kind'] or 'unknown modality'}{' ' + s['info']['body_part'].lower() if s['info']['body_part'] else ''}, {count} image{'s' if len(flat) != 1 else ''})"
        total += len(flat)
        got: dict[tuple, Page] = {}
        for member in dict.fromkeys(m for m, _ in picks):  # each file is unpacked once, and only if it was picked
            wanted = [f for m, f in picks if m is member]
            try:
                ds = _read_dicom(io.BytesIO(zf.read(member)))
                for f, page in zip(wanted, _dicom_pages(ds, wanted, s["info"], label)):
                    got[(member.filename, f)] = page
            except ValueError as e:
                unread.append(f"{_short(member.filename)} ({e})")
        pages += [got[(m.filename, f)] for m, f in picks if (m.filename, f) in got]

    if not pages:
        raise ValueError("No scans, reports or images could be read from this ZIP." + "".join(f" {n}." for n in _zip_notes(ignored, unread)))
    for n, page in enumerate(pages, 1):
        page.n = n
    return Doc(pages, total, _zip_notes(ignored, unread))


def _zip_notes(ignored: Counter, unread: list[str]) -> list[str]:
    out = [f"Ignored {n} {what}." for what, n in ignored.items()]
    if unread:
        out.append("Could not read: " + "; ".join(unread[:5]) + (f"; and {len(unread) - 5} more." if len(unread) > 5 else "."))
    return out
