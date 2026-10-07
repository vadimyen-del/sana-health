import assert from 'node:assert/strict';
import test from 'node:test';
import { doctors, plans } from '../src/data/catalog';
import {
  bookingDays,
  createAppointment,
  createReferral,
  dateKey,
  nextAppointment,
  persistedSchema,
  referralPayload,
  searchClinics,
  searchDoctors,
  searchLabs,
} from '../src/lib/marketplace';

const now = new Date('2026-10-07T19:30:00Z');
const input = {
  doctorId: doctors[0].id,
  date: '2026-10-09',
  time: '09:00',
  planId: null,
};
test('search matches Russian names, specialties and clinic districts, ignoring whitespace/case', () => {
  assert.equal(searchDoctors('  АЛИЯ  ')[0].id, doctors[0].id);
  assert.equal(searchDoctors('бостандыкский').length, 2);
  assert.equal(searchDoctors('', 'Кардиолог').length, 1);
  assert.equal(searchDoctors('', 'Кардиолог', 'demo-clinic-1').length, 0);
  assert.equal(searchClinics('МЕДЕУСКИЙ')[0].id, 'demo-clinic-3');
  assert.equal(searchLabs('ферритин', 'Витамины и минералы').length, 1);
  assert.equal(searchLabs('ферритин', 'Гормоны').length, 0);
  assert.deepEqual(searchDoctors('not-found'), []);
});
test('seven future dates follow Almaty midnight and month/year rollover', () => {
  assert.equal(dateKey(now), '2026-10-08');
  assert.deepEqual(bookingDays(now), [
    '2026-10-09',
    '2026-10-10',
    '2026-10-11',
    '2026-10-12',
    '2026-10-13',
    '2026-10-14',
    '2026-10-15',
  ]);
  assert.equal(bookingDays(new Date('2026-12-31T18:00:00Z'))[0], '2027-01-01');
});
test('booking snapshots full price or Club price and fixes the selected plan', () => {
  assert.equal(createAppointment(input, [], now).price, doctors[0].price);
  const club = createAppointment({ ...input, planId: 'family' }, [], now);
  assert.equal(club.price, doctors[0].clubPrice);
  assert.equal(club.planId, 'family');
  assert.equal(club.status, 'demo');
  assert.deepEqual(
    plans.map((plan) => plan.price),
    [3999, 6999],
  );
});
test('invalid doctor, past/out-of-range dates and invalid times cannot be booked', () => {
  for (const invalid of [
    { doctorId: 'missing' },
    { date: '2026-10-08' },
    { date: '2027-01-01' },
    { time: '03:00' },
  ]) {
    assert.throws(() => createAppointment({ ...input, ...invalid }, [], now));
  }
});
test('duplicate appointments and collisions are blocked; cancelled slots become available', () => {
  const existing = createAppointment(input, [], now);
  assert.throws(
    () => createAppointment(input, [existing], now),
    /уже есть запись/,
  );
  assert.throws(() =>
    createAppointment({ ...input, doctorId: doctors[1].id }, [existing], now),
  );
  assert.doesNotThrow(() =>
    createAppointment(input, [{ ...existing, status: 'cancelled' }], now),
  );
});
test('referral QR only carries a non-redeemable reference, with no patient or medical data', () => {
  const referral = createReferral('demo-lab-1', 'individual');
  assert.equal(referral.price, 2200);
  const payload = JSON.parse(referralPayload(referral));
  assert.deepEqual(Object.keys(payload).sort(), [
    'app',
    'mode',
    'referralId',
    'version',
  ]);
  assert.equal(payload.mode, 'demo');
  assert.equal(payload.referralId, referral.id);
  assert.throws(() => createReferral('missing', null));
});
test('persistence schema rejects corrupted state and preserves demo data through JSON', () => {
  const state = {
    planId: 'family',
    appointments: [createAppointment(input, [], now)],
    referrals: [createReferral('demo-lab-1', null)],
  };
  assert.deepEqual(
    persistedSchema.parse(JSON.parse(JSON.stringify(state))),
    state,
  );
  assert.equal(
    persistedSchema.safeParse({ ...state, planId: 'paid' }).success,
    false,
  );
  assert.equal(
    persistedSchema.safeParse({ appointments: 'corrupt' }).success,
    false,
  );
  assert.equal(
    persistedSchema.safeParse({
      ...state,
      appointments: [{ ...state.appointments[0], date: '2026-02-31' }],
    }).success,
    false,
  );
});
test('home shows the nearest future active appointment, independent of creation order', () => {
  const first = createAppointment(input, [], now);
  const later = createAppointment({ ...input, date: '2026-10-12' }, [], now);
  assert.equal(nextAppointment([later, first], now)?.id, first.id);
  assert.equal(
    nextAppointment([{ ...first, status: 'cancelled' }, later], now)?.id,
    later.id,
  );
  assert.equal(nextAppointment([first], new Date('2026-10-10')), undefined);
});
