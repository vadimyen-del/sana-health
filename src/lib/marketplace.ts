import { z } from 'zod';
import {
  clinics,
  doctors,
  getDoctor,
  getLabTest,
  labTests,
  type PlanId,
} from '../data/catalog';

export const money = (value: number) =>
  `${new Intl.NumberFormat('ru-RU').format(value)} ₸`;
const normalized = (value: string) =>
  value.trim().toLocaleLowerCase('ru-RU').replace(/ё/g, 'е');
export function searchDoctors(
  query: string,
  specialty = 'Все',
  clinicId?: string,
) {
  const needle = normalized(query);
  return doctors.filter((doctor) => {
    const clinic = clinics.find((item) => item.id === doctor.clinicId);
    return (
      (!clinicId || doctor.clinicId === clinicId) &&
      (specialty === 'Все' || doctor.specialty === specialty) &&
      normalized(
        `${doctor.name} ${doctor.specialty} ${clinic?.name} ${clinic?.area}`,
      ).includes(needle)
    );
  });
}
export const searchClinics = (query: string) =>
  clinics.filter((clinic) =>
    normalized(`${clinic.name} ${clinic.area} ${clinic.address}`).includes(
      normalized(query),
    ),
  );
export const searchLabs = (query: string, category = 'Все') =>
  labTests.filter(
    (test) =>
      (category === 'Все' || category === test.category) &&
      normalized(`${test.name} ${test.category}`).includes(normalized(query)),
  );

// Dates are computed in the marketplace timezone, not the device's timezone.
export const dateKey = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Almaty',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
export function bookingDays(now = new Date()) {
  const start = dateKey(now);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${start}T12:00:00+05:00`);
    date.setUTCDate(date.getUTCDate() + index + 1);
    return dateKey(date);
  });
}
export const shortDate = (date: string) =>
  new Date(`${date}T12:00:00+05:00`).toLocaleDateString('ru-RU', {
    timeZone: 'Asia/Almaty',
    day: 'numeric',
    month: 'short',
  });
export const weekday = (date: string) =>
  new Date(`${date}T12:00:00+05:00`).toLocaleDateString('ru-RU', {
    timeZone: 'Asia/Almaty',
    weekday: 'short',
  });
export const slots = ['09:00', '10:30', '12:00', '14:30', '16:00', '17:30'];
export const planSchema = z.enum(['individual', 'family']);
const validDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const parsed = new Date(`${value}T12:00:00+05:00`);
    return Number.isFinite(parsed.getTime()) && dateKey(parsed) === value;
  }, 'Invalid calendar date');
export const appointmentSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  date: validDateSchema,
  time: z.string().refine((value) => slots.includes(value)),
  price: z.number().nonnegative(),
  planId: planSchema.nullable(),
  status: z.enum(['demo', 'cancelled']),
  createdAt: z.string(),
});
export type Appointment = z.infer<typeof appointmentSchema>;
export function nextAppointment(appointments: Appointment[], now = new Date()) {
  return appointments
    .filter(
      (item) =>
        item.status === 'demo' &&
        new Date(`${item.date}T${item.time}:00+05:00`).getTime() >
          now.getTime(),
    )
    .sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
    )[0];
}
export const referralSchema = z.object({
  id: z.string(),
  labId: z.string(),
  createdAt: z.string(),
  price: z.number().nonnegative(),
  planId: planSchema.nullable(),
  mode: z.literal('demo'),
});
export type Referral = z.infer<typeof referralSchema>;
export const persistedSchema = z.object({
  planId: planSchema.nullable(),
  appointments: z.array(appointmentSchema),
  referrals: z.array(referralSchema),
});
export type DemoData = z.infer<typeof persistedSchema>;
export const emptyDemoData: DemoData = {
  planId: null,
  appointments: [],
  referrals: [],
};
const id = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
export function createAppointment(
  input: {
    doctorId: string;
    date: string;
    time: string;
    planId: PlanId | null;
  },
  existing: Appointment[],
  now = new Date(),
): Appointment {
  const doctor = getDoctor(input.doctorId);
  if (!doctor)
    throw new Error('Врач не найден. Выберите специалиста в каталоге.');
  if (!bookingDays(now).includes(input.date) || !slots.includes(input.time))
    throw new Error('Выберите доступные дату и время заново.');
  if (
    existing.some(
      (item) =>
        item.status === 'demo' &&
        item.date === input.date &&
        item.time === input.time,
    )
  )
    throw new Error('На это время уже есть запись. Выберите другое время.');
  return {
    id: id('visit'),
    ...input,
    price: input.planId ? doctor.clubPrice : doctor.price,
    status: 'demo',
    createdAt: now.toISOString(),
  };
}
export function createReferral(labId: string, planId: PlanId | null): Referral {
  const test = getLabTest(labId);
  if (!test) throw new Error('Анализ не найден. Откройте каталог заново.');
  return {
    id: id('referral'),
    labId,
    planId,
    price: planId ? test.clubPrice : test.price,
    createdAt: new Date().toISOString(),
    mode: 'demo',
  };
}
// Deliberately non-redeemable and contains no patient data. A backend will issue signed tokens.
export const referralPayload = (referral: Referral) =>
  JSON.stringify({
    version: 1,
    app: 'sana-health',
    mode: 'demo',
    referralId: referral.id,
  });
