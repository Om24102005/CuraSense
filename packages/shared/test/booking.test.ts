// The date maths is checked in India's time zone (UTC+5:30): that is where the website's UTC-based dates were a day out after midnight.
process.env.TZ = 'Asia/Kolkata';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DOCTORS, TIME_SLOTS, buildDates, getBookedSlots, canAdvance, makeBooking, parseBookings, parseContact, genRef, isoOf, fmtDate } from '../src/booking.ts';
import { birthDateProblem } from '../src/settings.ts';

test('the date strip starts tomorrow by the device calendar, with the number and the date agreeing', () => {
  const now = new Date('2026-11-16T20:00:00Z'); // 01:30 on 17 November in India, still the 16th in UTC
  assert.equal(now.getTimezoneOffset(), -330);
  const tiles = buildDates(now);
  assert.equal(tiles.length, 14);
  assert.deepEqual([tiles[0].iso, tiles[0].num, tiles[0].mon, tiles[0].day], ['2026-11-18', '18', 'Nov', 'Wed']);
  assert.equal(tiles[13].iso, '2026-12-01');
  for (const t of tiles) assert.equal(Number(t.iso.slice(8)), Number(t.num));
  assert.equal(isoOf(new Date(2026, 0, 5)), '2026-01-05');
  assert.match(fmtDate('2026-11-18'), /Wednesday, November 18, 2026/);
});

test('the invented free slots are the same every time and always leave some free', () => {
  for (const { iso } of buildDates(new Date('2026-11-16T09:00:00Z'))) {
    const booked = getBookedSlots(iso);
    assert.deepEqual([...booked], [...getBookedSlots(iso)]);
    assert.ok(booked.size >= 1 && booked.size <= 4 && booked.size < TIME_SLOTS.length, `${iso}: ${booked.size}`);
  }
});

test('a step can move on only when it has what it needs', () => {
  const none = { doctor: null, mode: null, date: '', time: '' };
  const doc = DOCTORS[0];
  assert.deepEqual([1, 2, 3, 4, 5].map((s) => canAdvance(s, none)), [true, false, false, false, true]);
  assert.equal(canAdvance(2, { ...none, doctor: doc }), true);
  assert.equal(canAdvance(3, { ...none, mode: 'online' }), true);
  assert.equal(canAdvance(4, { ...none, date: '2026-11-18' }), false);
  assert.equal(canAdvance(4, { ...none, date: '2026-11-18', time: '09:00 AM' }), true);
});

test('a booking copies the doctor, and leaves the diagnosis empty when none was attached', () => {
  const doc = DOCTORS[1];
  const b = makeBooking({ doctor: doc, mode: 'offline', date: '2026-11-18', time: '10:00 AM' }, null, new Date('2026-11-16T20:00:00Z'));
  assert.deepEqual([b.doctorName, b.doctorFee, b.doctorInitials, b.mode, b.diagnosisId, b.diagnosisLabel, b.createdAt], ['Dr. Raj Patel', 1200, 'RP', 'offline', null, null, '2026-11-16T20:00:00.000Z']);
  const c = makeBooking({ doctor: doc, mode: 'online', date: '2026-11-18', time: '10:00 AM' }, { id: 'p1', diagnosis: 'Flu', type: 'symptom' });
  assert.deepEqual([c.diagnosisId, c.diagnosisLabel, c.diagnosisType], ['p1', 'Flu', 'symptom']);
  assert.match(b.reference, /^CS-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  assert.equal(new Set(Array.from({ length: 300 }, genRef)).size, 300);
});

test('saved bookings and contact info are read back safely', () => {
  const good = makeBooking({ doctor: DOCTORS[0], mode: 'online', date: '2026-11-18', time: '09:00 AM' }, null);
  assert.equal(parseBookings(JSON.stringify([good, { junk: true }, null, 5, { ...good, mode: 'teleport' }])).length, 1);
  for (const raw of [null, undefined, '', '{', '{"a":1}', 'null']) assert.deepEqual(parseBookings(raw), []);
  assert.deepEqual(parseContact(null, 'Asha'), { name: 'Asha', phone: '', dob: '', notes: '' });
  assert.deepEqual(parseContact('{"name":"B","phone":"1","dob":"2000-01-01","notes":"x"}'), { name: 'B', phone: '1', dob: '2000-01-01', notes: 'x' });
  assert.deepEqual(parseContact('not json', 'Z'), { name: 'Z', phone: '', dob: '', notes: '' });
});

test('the sample doctors are well formed and one is unavailable, as on the website', () => {
  assert.equal(new Set(DOCTORS.map((d) => d.id)).size, DOCTORS.length);
  assert.deepEqual(DOCTORS.filter((d) => !d.available).map((d) => d.id), ['d5']);
  assert.equal(birthDateProblem(''), '');
  assert.notEqual(birthDateProblem('1/1/2000'), '');
});
