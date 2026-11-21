"""Each analysis page accepts only its own kind of content. Anything else is refused and sent to the right page.

Fail closed: if the AI could not tell what a page is, the page is refused, never analysed on a guess.
"""

from collections import Counter

# modality -> (name used in messages, heading of that group in the Scans page's "Scan Type" list)
MODALITIES = {
    "xray": ("X-ray", "X-Ray"),
    "ct": ("CT scan", "CT Scan"),
    "mri": ("MRI scan", "MRI"),
    "ultrasound": ("ultrasound", "Ultrasound"),
    "nuclear": ("PET / nuclear medicine scan", "Nuclear Medicine/PET"),
    "mammogram": ("mammogram", "Mammography"),
    "skin_lesion": ("skin lesion photo", "Other Imaging"),
    "ecg": ("ECG strip", "Other Imaging"),
    "endoscopy": ("endoscopy image", "Other Imaging"),
    "retinal": ("retinal image", "Other Imaging"),
    "dexa": ("DEXA scan", "Other Imaging"),
    "fluoroscopy": ("fluoroscopy / angiogram", "Other Imaging"),
}
# Studies whose images can legitimately look like another modality (PET-CT, barium studies).
ALSO_OK = {"nuclear": {"ct"}, "fluoroscopy": {"xray"}, "xray": {"fluoroscopy"}}

# Body regions. The AI picks from this list for what a file shows (the words are what it is told each one means), and
# every study on the Scans page lists the regions it covers, so "does the file fit the study" is a table lookup, not a judgement.
REGIONS = {
    "head": "brain, skull, face, sinuses, orbits, jaw, teeth",
    "neck": "thyroid, throat, carotid arteries, neck soft tissue",
    "chest": "lungs, ribs, mediastinum, pleura",
    "heart": "the heart and its chambers",
    "breast": "the breast",
    "abdomen": "liver, gallbladder, pancreas, spleen, kidneys, bowel, aorta",
    "pelvis": "bladder, uterus, ovaries, prostate, rectum, pelvic bones",
    "spine": "the vertebral column at any level",
    "upper_limb": "shoulder, arm, elbow, wrist, hand",
    "lower_limb": "hip, thigh, knee, leg, ankle, foot",
    "whole_body": "a survey of the whole body, head to legs, in one image",
    "eye": "the eye and retina",
    "skin": "the skin surface",
}
# Regions that overlap so much in practice that an image of one counts for a study of the other: the skull base shows in
# neck images, the heart sits in the chest, an abdomen-pelvis study is one protocol. Kept short on purpose: every extra pair
# is a way for the wrong body part to pass (measured: chest~abdomen let a CT abdomen through a CT chest study).
_BORDERS = [("head", "neck"), ("neck", "spine"), ("chest", "heart"), ("chest", "breast"), ("abdomen", "pelvis")]
NEAR = {r: {b for a, b in _BORDERS if a == r} | {a for a, b in _BORDERS if b == r} for r in REGIONS}


def refuse(message: str, page: str | None = None, scan_type: str | None = None) -> dict:
    """`error` is the readable message; `redirect` tells the UI which page to offer."""
    return {"error": message, "redirect": {"page": page, "scan_type": scan_type}}


def _seen(det: dict) -> str:
    name = MODALITIES[det["type"]][0]
    return f"**{name}**" + (f" of the **{det['region']}**" if det["region"] and det["region"] != "none" else "")


def region_ok(seen: list[str], covers: list[str]) -> bool | None:
    """Do the regions a file shows fit the regions the selected study covers? None = the file's region is unknown.

    A study that covers the whole body takes anything. A whole-body image does not fit a study of one region: it is a different study.
    """
    if not covers or "whole_body" in covers:
        return True
    if not seen:
        return None
    return bool(set(seen) & (set(covers).union(*(NEAR[c] for c in covers))))


def check_scan(det: dict, wanted: str, study: str = "", covers: list[str] | None = None) -> dict | None:
    """Scans page. `wanted` is the modality the user picked (anything else means 'any scan'); `covers` the regions of the
    selected study (empty = any region). None = analyse."""
    t = det["type"]
    if t == "unknown":
        return refuse(det["reason"])
    if t == "lab_report":
        return refuse("This looks like a **lab / blood report**, not a scan. Open the **Reports** page and upload it there.", "reports")
    if t == "other":
        return refuse("This does not look like a medical scan. Upload an X-ray, CT, MRI, ultrasound or other medical image.")
    if wanted in MODALITIES and t != wanted and t not in ALSO_OK.get(wanted, ()):
        return refuse(f"Detected {_seen(det)}, but you selected **{MODALITIES[wanted][0]}**. Choose **{MODALITIES[t][1]}** in the Scan Type list on the Scans page.", "scans", t)
    fits = region_ok(det.get("regions", []), covers or [])
    if fits is None:  # fail closed: a region that cannot be read cannot be matched to the study
        return refuse(f"Could not tell which body region this shows, so it cannot be checked against the selected study **{study}**. Try a clearer or larger image, or upload the original DICOM file.")
    if fits is False:
        return refuse(f"Detected {_seen(det)}, which does not match the selected study **{study}**. Choose the study that matches it in the Scan Type list.", "scans", t)
    return None


def check_report(det: dict) -> dict | None:
    """Reports page: only lab / blood / biomarker reports. None = analyse."""
    t = det["type"]
    if t == "unknown":
        return refuse(det["reason"])
    if t == "lab_report":
        return None
    if t in MODALITIES:
        return refuse(f"Detected {_seen(det)}, not a lab report. Open the **Scans** page, choose **{MODALITIES[t][1]}** in the Scan Type list and upload it there.", "scans", t)
    return refuse("This does not look like a lab / blood report. Upload a blood or biomarker report (CBC, lipid panel, HbA1c, ...).")


def sort_pages(pages: list, dets: list, check) -> tuple[list, list[str], dict | None]:
    """Apply a page rule to every page of a file.

    Returns (pages to analyse, one skip note per refused page, the refusal to show when nothing is left).
    A file may mix content (a lab page inside a scan PDF): each page is judged on its own, and no page is dropped silently.
    """
    keep, refusals, by_reason = [], [], {}
    for page, det in zip(pages, dets):
        refusal = check(det)
        if refusal is None:
            keep.append(page)
            continue
        refusals.append(refusal)
        by_reason.setdefault(refusal["error"], []).append(page)
    # pages refused for the same reason share one note; inside a ZIP they are named by their file or series
    notes = []
    for why, group in by_reason.items():
        if group[0].name:
            names = list(dict.fromkeys(p.name for p in group))
            notes.append(f"{', '.join(names)} {'was' if len(names) == 1 else 'were'} not analysed: {why}")
        else:
            nums = [p.n for p in group]
            notes.append(f"Page {nums[0]} was not analysed: {why}" if len(nums) == 1 else f"Pages {', '.join(map(str, nums))} were not analysed: {why}")
    if keep or not refusals:
        return keep, notes, None
    if len(by_reason) == 1:  # every page for the same reason (a whole series, a whole PDF): say it once
        return keep, notes, refusals[0]
    # several pages, none usable: list every reason, and offer the page most of them point to
    targets = Counter((r["redirect"]["page"], r["redirect"]["scan_type"]) for r in refusals)
    (page, scan_type), _ = targets.most_common(1)[0]
    return keep, notes, refuse("None of the pages could be analysed here:\n" + "\n".join(f"- {n}" for n in notes), page, scan_type)
