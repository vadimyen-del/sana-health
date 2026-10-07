import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { PlanId } from '@/data/catalog';
import {
  createAppointment,
  createReferral,
  emptyDemoData,
  persistedSchema,
  type DemoData,
} from '@/lib/marketplace';

const storageKey = 'sana-health.demo.v1';
let writeQueue: Promise<void> = Promise.resolve();
interface HealthStore extends DemoData {
  hydrated: boolean;
  storageError: string | null;
  hydrate: () => Promise<void>;
  selectPlan: (id: PlanId | null) => void;
  book: (doctorId: string, date: string, time: string) => string;
  cancelAppointment: (id: string) => void;
  issueReferral: (labId: string) => string;
  resetDemo: () => void;
}
function save(state: HealthStore) {
  const snapshot = JSON.stringify({
    planId: state.planId,
    appointments: state.appointments,
    referrals: state.referrals,
  });
  writeQueue = writeQueue
    .catch(() => {})
    .then(async () => {
      try {
        await AsyncStorage.setItem(storageKey, snapshot);
        useHealthStore.setState({ storageError: null });
      } catch {
        useHealthStore.setState({
          storageError:
            'Не удалось сохранить изменения на устройстве. Они доступны до перезапуска.',
        });
      }
    });
}
export const useHealthStore = create<HealthStore>((set, get) => ({
  ...emptyDemoData,
  hydrated: false,
  storageError: null,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(storageKey);
      const parsed = raw ? persistedSchema.safeParse(JSON.parse(raw)) : null;
      if (parsed?.success) set(parsed.data);
      else if (raw)
        set({
          storageError:
            'Сохранённые демоданные не удалось прочитать. Начните новый сценарий.',
        });
    } catch {
      set({
        storageError:
          'Хранилище недоступно. Приложение работает в текущем сеансе.',
      });
    } finally {
      set({ hydrated: true });
    }
  },
  selectPlan: (planId) => {
    set({ planId });
    save(get());
  },
  book: (doctorId, date, time) => {
    const state = get();
    const appointment = createAppointment(
      { doctorId, date, time, planId: state.planId },
      state.appointments,
    );
    set({ appointments: [appointment, ...state.appointments] });
    save(get());
    return appointment.id;
  },
  cancelAppointment: (id) => {
    set({
      appointments: get().appointments.map((item) =>
        item.id === id ? { ...item, status: 'cancelled' } : item,
      ),
    });
    save(get());
  },
  issueReferral: (labId) => {
    const referral = createReferral(labId, get().planId);
    set({ referrals: [referral, ...get().referrals] });
    save(get());
    return referral.id;
  },
  resetDemo: () => {
    set({ planId: null, appointments: [], referrals: [] });
    save(get());
  },
}));
