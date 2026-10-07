export type Clinic = {
  id: string;
  name: string;
  area: string;
  address: string;
  description: string;
};
export type Doctor = {
  id: string;
  name: string;
  initials: string;
  specialty: string;
  clinicId: string;
  experience: number;
  price: number;
  clubPrice: number;
  color: string;
};
export type LabTest = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  clubPrice: number;
  turnaround: string;
  clinicId: string;
};
export type PlanId = 'individual' | 'family';

// Fictional catalogue: replace this adapter with contracted partners before launch.
export const clinics: Clinic[] = [
  {
    id: 'demo-clinic-1',
    name: 'SANA Clinic · Центр',
    area: 'Алмалинский район',
    address: 'Алматы · демонстрационная клиника',
    description:
      'Консультации специалистов и лабораторная диагностика в одном месте.',
  },
  {
    id: 'demo-clinic-2',
    name: 'SANA Clinic · Юг',
    area: 'Бостандыкский район',
    address: 'Алматы · демонстрационная клиника',
    description: 'Семейная медицина: приёмы для взрослых и детей.',
  },
  {
    id: 'demo-clinic-3',
    name: 'SANA Lab',
    area: 'Медеуский район',
    address: 'Алматы · демонстрационная лаборатория',
    description: 'Базовые анализы и комплексные исследования.',
  },
];
export const doctors: Doctor[] = [
  {
    id: 'demo-doctor-1',
    name: 'Алия Нурланова',
    initials: 'АН',
    specialty: 'Терапевт',
    clinicId: 'demo-clinic-1',
    experience: 12,
    price: 12000,
    clubPrice: 8500,
    color: '#E4ECE6',
  },
  {
    id: 'demo-doctor-2',
    name: 'Дамир Садыков',
    initials: 'ДС',
    specialty: 'Кардиолог',
    clinicId: 'demo-clinic-2',
    experience: 15,
    price: 18000,
    clubPrice: 13500,
    color: '#E8E5EF',
  },
  {
    id: 'demo-doctor-3',
    name: 'Мария Ким',
    initials: 'МК',
    specialty: 'Педиатр',
    clinicId: 'demo-clinic-2',
    experience: 9,
    price: 14000,
    clubPrice: 10000,
    color: '#F5E5D7',
  },
  {
    id: 'demo-doctor-4',
    name: 'Айгерим Омарова',
    initials: 'АО',
    specialty: 'Эндокринолог',
    clinicId: 'demo-clinic-1',
    experience: 11,
    price: 16000,
    clubPrice: 12000,
    color: '#E0EBF0',
  },
];
export const labTests: LabTest[] = [
  {
    id: 'demo-lab-1',
    name: 'Общий анализ крови',
    category: 'Базовые',
    description: 'Базовое исследование показателей крови.',
    price: 3200,
    clubPrice: 2200,
    turnaround: '1 рабочий день',
    clinicId: 'demo-clinic-3',
  },
  {
    id: 'demo-lab-2',
    name: 'Ферритин',
    category: 'Витамины и минералы',
    description: 'Исследование показателя запасов железа.',
    price: 5800,
    clubPrice: 3900,
    turnaround: '1–2 рабочих дня',
    clinicId: 'demo-clinic-3',
  },
  {
    id: 'demo-lab-3',
    name: 'Витамин D',
    category: 'Витамины и минералы',
    description: 'Исследование уровня 25-OH витамина D.',
    price: 9500,
    clubPrice: 6500,
    turnaround: '2 рабочих дня',
    clinicId: 'demo-clinic-3',
  },
  {
    id: 'demo-lab-4',
    name: 'ТТГ',
    category: 'Гормоны',
    description: 'Исследование тиреотропного гормона.',
    price: 4800,
    clubPrice: 3300,
    turnaround: '1–2 рабочих дня',
    clinicId: 'demo-clinic-1',
  },
];
export const plans = [
  {
    id: 'individual' as const,
    name: 'Club Individual',
    price: 3999,
    caption: 'Забота о себе',
    features: [
      'Партнёрские цены на консультации',
      'Специальные цены на анализы',
      'Записи и направления в одном месте',
    ],
  },
  {
    id: 'family' as const,
    name: 'Club Family',
    price: 6999,
    caption: 'Забота о близких',
    features: [
      'Все преимущества Individual',
      'Семейный формат подписки',
      'Состав семьи — на следующем этапе',
    ],
  },
];
export const getClinic = (id: string) =>
  clinics.find((clinic) => clinic.id === id);
export const getDoctor = (id: string) =>
  doctors.find((doctor) => doctor.id === id);
export const getLabTest = (id: string) =>
  labTests.find((test) => test.id === id);
