"""The Reports page reads any common document (PDF, photo, Word, Excel, PowerPoint, OpenDocument, RTF, HTML, text) and does
it fast: a lab report is recognised by its values, not by an AI call per page, and the fast model writes one compact answer.

Run with:  .venv/bin/python -W ignore -m unittest test_reports
"""
import io
import threading
import unittest
import zipfile
from unittest import mock

import pymupdf
from PIL import Image

from app.services import documents, lab_parser, routing
from app.services.image_detect import lab_score

VALUES = "Hemoglobin 13.2 g/dL (12-16)\nGlucose 98 mg/dL (70-99)\nCreatinine 0.9 mg/dL (0.6-1.2)\nTotal Cholesterol 245 mg/dL (125-200)\n"
JSON = '{"assessment":"**High** cholesterol.","confidence":90,"urgency":"low","biomarkers":[["Hemoglobin",13.2,"g/dL",12,16,"normal"]],"recommendations":["Eat well."]}'


def zipped(files: dict) -> bytes:
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w") as z:
        for name, content in files.items():
            z.writestr(name, content)
    return out.getvalue()


def png(seed: int = 0) -> bytes:
    """A picture that is not blank (a blank page is dropped), as PNG bytes."""
    im = Image.effect_noise((120, 90), 40 + seed).convert("RGB")
    out = io.BytesIO()
    im.save(out, "PNG")
    return out.getvalue()


def pdf(pages: list) -> bytes:
    """Each page is a text string or PNG bytes."""
    d = pymupdf.open()
    for p in pages:
        page = d.new_page()
        if isinstance(p, bytes):
            page.insert_image(page.rect, stream=p)
        else:
            page.insert_textbox(pymupdf.Rect(40, 40, 550, 800), p, fontsize=10)
    return d.tobytes()


# ── the document loader ───────────────────────────────────────────────────

class FormatTests(unittest.TestCase):
    def test_word_keeps_paragraphs_and_table_rows(self):
        W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
        cell = lambda t: f"<w:tc><w:p><w:r><w:t>{t}</w:t></w:r></w:p></w:tc>"
        body = "<w:p><w:r><w:t>Blood report</w:t></w:r></w:p><w:tbl><w:tr>" + cell("Hemoglobin") + cell("13.2") + cell("g/dL") + "</w:tr><w:tr>" + cell("Glucose") + cell("98") + cell("mg/dL") + "</w:tr></w:tbl>"
        doc = documents.load(zipped({"[Content_Types].xml": "<Types/>", "word/document.xml": f"<w:document {W}><w:body>{body}</w:body></w:document>"}))
        self.assertEqual(doc.pages[0].text, "Blood report\nHemoglobin\t13.2\tg/dL\nGlucose\t98\tmg/dL")

    def test_a_scan_pasted_into_word_is_read_as_a_picture(self):
        W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
        doc = documents.load(zipped({"[Content_Types].xml": "<Types/>", "word/document.xml": f"<w:document {W}><w:body/></w:document>", "word/media/image1.png": png()}))
        self.assertTrue(doc.pages[0].image and not doc.pages[0].text)

    def test_excel_gives_one_line_per_row_with_tabs(self):
        NS = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
        strings = f"<sst {NS}><si><t>Hemoglobin</t></si><si><t>g/dL</t></si></sst>"
        sheet = f'<worksheet {NS}><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1"><v>13.2</v></c><c r="C1" t="s"><v>1</v></c></row><row r="2"><c r="A2" t="inlineStr"><is><t>Glucose</t></is></c><c r="C2"><v>98</v></c></row></sheetData></worksheet>'
        doc = documents.load(zipped({"[Content_Types].xml": "<Types/>", "xl/sharedStrings.xml": strings, "xl/worksheets/sheet1.xml": sheet}))
        self.assertEqual(doc.pages[0].text, "Sheet 1\nHemoglobin\t13.2\tg/dL\nGlucose\t\t98")

    def test_powerpoint_gives_a_page_per_slide(self):
        A = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"'
        slide = lambda t: f"<sld {A}><a:p><a:r><a:t>{t}</a:t></a:r></a:p></sld>"
        doc = documents.load(zipped({"[Content_Types].xml": "<Types/>", "ppt/slides/slide1.xml": slide("Results"), "ppt/slides/slide2.xml": slide("Hemoglobin 13.2")}))
        self.assertEqual([p.text for p in doc.pages], ["Results", "Hemoglobin 13.2"])

    def test_opendocument_text_and_tables(self):
        NS = 'xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"'
        content = (f"<office:document-content {NS}><office:body><office:text><text:p>Lab results</text:p><table:table>"
                   "<table:table-row><table:table-cell><text:p>Glucose</text:p></table:table-cell><table:table-cell><text:p>98</text:p></table:table-cell></table:table-row>"
                   "</table:table></office:text></office:body></office:document-content>")
        doc = documents.load(zipped({"mimetype": "application/vnd.oasis.opendocument.text", "content.xml": content}))
        self.assertEqual(doc.pages[0].text, "Lab results\nGlucose\t98")

    def test_an_app_file_that_is_not_a_document_is_refused(self):
        with self.assertRaisesRegex(ValueError, "app or Office file"):
            documents.load(zipped({"META-INF/MANIFEST.MF": "Manifest-Version: 1.0", "a.class": "x"}))

    def test_an_empty_word_file_says_so(self):
        W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
        with self.assertRaisesRegex(ValueError, "no readable text"):
            documents.load(zipped({"[Content_Types].xml": "<Types/>", "word/document.xml": f"<w:document {W}><w:body/></w:document>"}))

    def test_rtf_loses_its_markup_but_keeps_text_rows_and_accents(self):
        rtf = rb"{\rtf1\ansi{\fonttbl{\f0 Arial;}}{\*\generator Word;}\f0 Hemoglobin\tab 13.2 g/dL\par Caf\'e9 \u233? done}"
        self.assertEqual(documents.load(rtf).pages[0].text, "Hemoglobin\t13.2 g/dL\nCafé é done")

    def test_html_keeps_table_rows_and_drops_scripts(self):
        html = b"<!DOCTYPE html><html><style>td{}</style><table><tr><td>Hb</td><td>13.2</td></tr><tr><td>WBC</td><td>6.1</td></tr></table><script>alert(1)</script></html>"
        self.assertEqual(documents.load(html).pages[0].text, "Hb\t13.2\nWBC\t6.1")

    def test_windows_text_files_are_decoded(self):
        self.assertIn("Hemoglobin", documents.load(b"\xff\xfe" + "Hemoglobin 13.2\r\n".encode("utf-16-le")).pages[0].text)
        self.assertIn("µg/dL", documents.load("Iron 80 µg/dL".encode("cp1252")).pages[0].text)
        self.assertIn("µg/dL", documents.load(b"\xef\xbb\xbf" + "Iron 80 µg/dL".encode("utf-8")).pages[0].text)

    def test_old_office_files_get_a_clear_message(self):
        with self.assertRaisesRegex(documents.Unsupported, r"\.doc, \.xls"):
            documents.load(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1" + b"\x00" * 600)

    def test_binary_junk_is_refused(self):
        with self.assertRaisesRegex(documents.Unsupported, "Unsupported file type"):
            documents.load(b"MZ\x90\x00\x03\x00\x00\x00" + bytes(range(256)) * 4)

    @unittest.skipIf(documents.pillow_heif is None, "pillow-heif is not installed")
    def test_an_iphone_photo_opens(self):
        out = io.BytesIO()
        documents.pillow_heif.from_pillow(Image.open(io.BytesIO(png()))).save(out, format="HEIF")
        self.assertTrue(documents.load(out.getvalue()).pages[0].image)

    def test_garbled_pdf_text_is_told_from_real_text(self):
        self.assertFalse(documents._garbled("Hemoglobin 13.2 g/dL (12-16) Glucose 98 mg/dL (70-99) Creatinine 0.9 mg/dL"))
        self.assertFalse(documents._garbled("12.5 13.2 98 245 0.9 1.2 70 99 125 200 4.5 11.0 150 410 83 101 40 80 0 15 3.5 5.2"))
        self.assertTrue(documents._garbled("(cid:12)(cid:45)(cid:99)(cid:7) " * 8))
        self.assertTrue(documents._garbled(" " * 12))
        self.assertTrue(documents._garbled("��?� ���?? " * 8))
        self.assertFalse(documents._garbled("ok"))  # too short to judge


# ── the Reports flow (AI calls mocked) ────────────────────────────────────

class FlowTests(unittest.TestCase):
    def setUp(self):
        self.chat = mock.patch.object(lab_parser.chat_service, "chat", return_value=JSON).start()
        self.vision = mock.patch.object(lab_parser.chat_service, "vision", return_value=VALUES).start()
        mock.patch.object(lab_parser.chat_service, "vision_available", return_value=True).start()
        self.dets = mock.patch.object(lab_parser, "classify_doc", side_effect=lambda doc: [{"type": "lab_report", "confidence": 90, "regions": [], "region": "", "reason": ""}] * len(doc.pages)).start()
        self.addCleanup(mock.patch.stopall)

    def test_a_typed_report_needs_no_judging_and_one_fast_call(self):
        out = lab_parser.analyze_lab_report_file(pdf([VALUES]))
        self.assertEqual(out["biomarkers"][0]["name"], "Hemoglobin")
        self.dets.assert_not_called()
        self.assertEqual(self.chat.call_count, 1)
        self.assertTrue(self.chat.call_args.kwargs["fast"])

    def test_a_long_document_with_no_lab_values_is_judged_once_on_its_first_pages(self):
        self.dets.side_effect = lambda doc: [{"type": "other", "confidence": 90, "regions": [], "region": "", "reason": ""}] * len(doc.pages)
        out = lab_parser.analyze_lab_report_file(pdf(["Terms and conditions of the supplier. " * 20] * 19))
        self.assertIn("does not look like a lab", out["error"])
        self.dets.assert_called_once()
        self.assertLessEqual(len(self.dets.call_args.args[0].pages), 3)
        self.chat.assert_not_called()

    def test_a_scanned_report_is_transcribed_page_by_page_and_never_labelled(self):
        out = lab_parser.analyze_lab_report_file(pdf([png(i) for i in range(6)]))
        self.assertIn("biomarkers", out)
        self.assertEqual(self.vision.call_count, 6)
        self.assertTrue(all(c.kwargs["think"] is False for c in self.vision.call_args_list))  # copying text, no reasoning
        self.dets.assert_not_called()
        self.assertEqual(self.chat.call_count, 1)

    def test_one_photo_is_transcribed_then_analysed_as_text(self):
        out = lab_parser.analyze_lab_report_file(png())
        self.assertIn("biomarkers", out)
        self.vision.assert_called_once()
        self.assertIs(self.vision.call_args.kwargs["think"], False)
        self.dets.assert_not_called()
        self.assertEqual(self.chat.call_count, 1)

    def test_a_picture_of_something_else_is_sent_to_its_page_even_when_it_has_no_text(self):
        self.vision.return_value = "No text visible."
        self.dets.side_effect = lambda doc: [{"type": "xray", "confidence": 95, "regions": ["chest"], "region": "chest", "reason": ""}] * len(doc.pages)
        out = lab_parser.analyze_lab_report_file(png())
        self.assertEqual(out["redirect"]["page"], "scans")
        self.chat.assert_not_called()

    def test_pages_without_lab_values_are_left_out_and_named(self):
        junk = "Terms and conditions. " * 90
        out = lab_parser.analyze_lab_report_file(pdf([VALUES, junk, VALUES]))
        sent = self.chat.call_args.args[1]
        self.assertNotIn("Terms and conditions", sent)
        self.assertIn("Page 2 had no lab values and was not analysed.", out["assessment"])

    def test_short_pages_around_the_values_are_kept_as_context(self):
        lab_parser.analyze_lab_report_file(pdf(["Patient report header, collected fasting in the morning.", VALUES]))
        self.assertIn("collected fasting", self.chat.call_args.args[1])

    def test_when_every_transcription_fails_it_says_so(self):
        self.vision.return_value = None
        out = lab_parser.analyze_lab_report_file(pdf([png(1), png(2)]))
        self.assertIn("No readable text", out["error"])

    def test_an_ai_outage_is_reported_as_one_not_as_a_bad_file(self):
        self.chat.return_value = None
        self.assertIn("did not respond in time", lab_parser.analyze_lab_report_file(pdf([VALUES]))["error"])


class EvidenceTests(unittest.TestCase):
    def test_lab_results_are_recognised_whatever_separates_the_number_from_its_unit(self):
        tab = "Total Cholesterol\t245\tmg/dL\t125-200\nLDL\t165\tmg/dL\t0-100\nHDL\t38\tmg/dL\t40-60\nTG\t210\tmg/dL\t0-150"
        for name, text in {
            "tab": tab,
            "pipe": tab.replace("\t", "|"),                     # what OCR returned for the same scan on another run
            "csv": tab.replace("\t", ","),
            "unusual units": "Bilirubin 21.4 umol/L\nUrea 4.1 mmol/L\nTSH 2.1 mIU/L\nCRP 3 mg/L",
            "test names, no units": "Hemoglobin 13.2\nGlucose 98\nCreatinine 0.9\nSodium 138",
        }.items():
            with self.subTest(name):
                self.assertGreaterEqual(lab_score(text), 4)

    def test_ordinary_documents_are_not_mistaken_for_lab_results(self):
        self.assertEqual(lab_score("The supplier shall deliver the goods in 30 days. Payment of 500 mg is not applicable. Page 3 of 19."), 0)
        self.assertEqual(lab_score("Item 2 qty 4 price 12.50 total 50.00 tax 5.00 amount due 55.00 USD"), 0)


class UnreadPageTests(unittest.TestCase):
    """One stalled transcription must not silently cost a page of results."""

    def run_scan(self, answers):
        calls = []
        lock = threading.Lock()

        def vision(*a, **k):
            with lock:
                calls.append(1)
                return answers[len(calls) - 1] if len(calls) <= len(answers) else None

        with mock.patch.object(lab_parser.chat_service, "vision", side_effect=vision), \
             mock.patch.object(lab_parser.chat_service, "chat", return_value=JSON) as chat, \
             mock.patch.object(lab_parser.chat_service, "vision_available", return_value=True), \
             mock.patch.object(lab_parser, "classify_doc", side_effect=AssertionError("a lab scan needs no judging")):
            out = lab_parser.analyze_lab_report_file(pdf([png(1), png(2), png(3)]))
        return out, chat, len(calls)

    def test_a_failed_page_is_asked_again_and_nothing_is_lost_when_that_works(self):
        out, chat, calls = self.run_scan([VALUES, VALUES, None, VALUES])
        self.assertEqual(calls, 4)
        self.assertEqual(chat.call_args.args[1].count("Hemoglobin 13.2"), 3)
        self.assertNotIn("could not be read", out["assessment"])

    def test_a_page_that_still_fails_is_named_and_the_rest_is_analysed(self):
        out, chat, calls = self.run_scan([VALUES, VALUES, None, None])
        self.assertEqual(calls, 4)
        self.assertEqual(chat.call_args.args[1].count("Hemoglobin 13.2"), 2)
        self.assertRegex(out["assessment"], r"Page \d could not be read because the AI service did not answer")
        self.assertNotIn("had no lab values", out["assessment"])  # a failed page is not a page without values

    def test_a_pipe_separated_scan_is_recognised_without_judging(self):
        piped = "Total Cholesterol|245|mg/dL|125-200\nLDL|165|mg/dL|0-100\nHDL|38|mg/dL|40-60\nTG|210|mg/dL|0-150"
        out, chat, _ = self.run_scan([piped, piped, piped])
        self.assertIn("biomarkers", out)


class AnswerTests(unittest.TestCase):
    def test_rows_may_be_arrays_or_objects_and_numbers_may_be_strings(self):
        raw = ('{"assessment":"x","confidence":"88","urgency":"low","biomarkers":['
               '["Total Cholesterol",245,"mg/dL",125,200,"high"],'
               '{"name":"Glucose","value":"1,020","unit":"mg/dL","normal_min":70,"normal_max":99},'
               '["HDL",38,"mg/dL",40,null,"low"],["eGFR",95,"mL/min",90,null,null],'
               '["Blood group","B Positive","",null,null,null],["x"]],"recommendations":[]}')
        out = lab_parser._normalise_lab_response(raw)
        rows = {r["name"]: r for r in out["biomarkers"]}
        self.assertEqual(set(rows), {"Total Cholesterol", "Glucose", "HDL", "eGFR"})  # the blood group is not a number; "x" is not a row
        self.assertEqual(rows["Total Cholesterol"]["status"], "high")
        self.assertEqual(rows["Glucose"]["value"], 1020.0)
        self.assertEqual(rows["Glucose"]["status"], "critical")  # more than 1.5 times the upper bound
        self.assertEqual(rows["HDL"]["status"], "low")           # a lower bound alone is enough
        self.assertEqual(rows["eGFR"]["status"], "normal")
        self.assertEqual(out["confidence"], 88)

    def test_an_unknown_urgency_and_a_missing_confidence_get_safe_defaults(self):
        out = lab_parser._normalise_lab_response('{"assessment":"x","urgency":"whenever","biomarkers":[["A",1,"u",0,2,"normal"]]}')
        self.assertEqual((out["urgency"], out["confidence"]), ("medium", 80))

    def test_no_numeric_values_is_a_refusal_not_zeros(self):
        out = lab_parser._normalise_lab_response('{"assessment":"x","biomarkers":[["Blood group","B Positive","",null,null,null]]}')
        self.assertIn("No lab test values", out["error"])

    def test_malformed_json_is_reported(self):
        self.assertIn("malformed", lab_parser._normalise_lab_response("not json at all")["error"])
        self.assertIn("malformed", lab_parser._normalise_lab_response("[1, 2]")["error"])


if __name__ == "__main__":
    unittest.main()
