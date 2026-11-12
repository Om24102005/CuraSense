import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanFileProblem, reportFileProblem } from '../src/files.ts';

const MB = 1024 * 1024;
const file = (name: string, type = '', size = 1000) => ({ name, type, size });

test('scan upload: images, DICOM, ZIP, PDF and text are fine; other files are refused', () => {
  for (const f of [file('a.jpg', 'image/jpeg'), file('IM0001.dcm'), file('study.zip', 'application/zip'), file('r.pdf', 'application/pdf'), file('n.txt', 'text/plain'), file('x', 'application/dicom')])
    assert.equal(scanFileProblem(f), null, f.name);
  assert.match(scanFileProblem(file('movie.mp4', 'video/mp4'))!, /Unsupported/);
});

test('scan upload: a ZIP may be larger than a single file', () => {
  assert.match(scanFileProblem(file('a.png', 'image/png', 26 * MB))!, /max 25MB/);
  assert.equal(scanFileProblem(file('a.zip', 'application/zip', 50 * MB)), null);
  assert.match(scanFileProblem(file('a.zip', 'application/zip', 61 * MB))!, /max 60MB/);
});

test('report upload: a scan file is sent to the Scans page, old Office files are explained, size limits differ for ZIP-like files', () => {
  assert.deepEqual(reportFileProblem(file('IM1.dcm'))?.redirect, { page: 'scans' });
  assert.match(reportFileProblem(file('old.doc'))!.message, /save it as \*\*PDF\*\*/);
  assert.match(reportFileProblem(file('big.pdf', 'application/pdf', 26 * MB))!.message, /max 25MB/);
  assert.equal(reportFileProblem(file('labs.docx', '', 30 * MB)), null);
  assert.match(reportFileProblem(file('labs.docx', '', 41 * MB))!.message, /max 40MB/);
  assert.equal(reportFileProblem(file('labs.pdf', 'application/pdf')), null);
});
