import { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Badge,
  Button,
  Card,
  DemoNote,
  Empty,
  Icon,
  Screen,
  s,
} from '@/components/ui';
import { getClinic, getDoctor } from '@/data/catalog';
import { money, shortDate } from '@/lib/marketplace';
import { useHealthStore } from '@/stores/health-store';

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const appointment = useHealthStore((state) =>
    state.appointments.find((item) => item.id === id),
  );
  const cancel = useHealthStore((state) => state.cancelAppointment);
  const [confirm, setConfirm] = useState(false);
  if (!appointment)
    return (
      <Screen back title="Запись не найдена">
        <Empty
          title="Здесь пока пусто"
          detail="Сохранённые записи доступны в профиле."
          action="В профиль"
          onPress={() => router.replace('/profile')}
        />
      </Screen>
    );
  const doctor = getDoctor(appointment.doctorId);
  const clinic = doctor ? getClinic(doctor.clinicId) : undefined;
  const cancelled = appointment.status === 'cancelled';
  return (
    <Screen
      back
      title={cancelled ? 'Демозапись отменена' : 'Демозапись создана'}
      eyebrow="МОЯ ЗАПИСЬ"
    >
      <Card>
        <View style={s.row}>
          <Icon
            name={
              cancelled ? 'close-circle-outline' : 'checkmark-circle-outline'
            }
            size={35}
          />
          <Badge text={cancelled ? 'ОТМЕНЕНА' : 'ДЕМО · НЕ БРОНЬ'} />
        </View>
        <Text style={s.cardTitle}>{doctor?.name}</Text>
        <Text style={s.body}>
          {doctor?.specialty} · {clinic?.name}
        </Text>
        <View style={s.divider} />
        <Text style={s.cardTitle}>
          {shortDate(appointment.date)} · {appointment.time}
        </Text>
        <Text style={s.body}>Время Алматы</Text>
        <Text style={s.price}>{money(appointment.price)}</Text>
        <Text style={s.body}>
          {appointment.planId
            ? 'Цена Club на момент демозаписи'
            : 'Обычная цена на момент демозаписи'}
        </Text>
      </Card>
      <DemoNote text="Это демонстрация записи. Клиника её не получает. Для реального приёма потребуется подключённое расписание и подтверждение партнёра." />
      <Button
        title="Перейти в профиль"
        onPress={() => router.replace('/profile')}
      />
      {!cancelled &&
        (confirm ? (
          <Card>
            <Text style={s.label}>Отменить эту демозапись?</Text>
            <Button
              title="Да, отменить демозапись"
              onPress={() => {
                cancel(id);
                setConfirm(false);
              }}
            />
            <Button
              title="Оставить запись"
              secondary
              onPress={() => setConfirm(false)}
            />
          </Card>
        ) : (
          <Button
            title="Отменить демозапись"
            secondary
            onPress={() => setConfirm(true)}
          />
        ))}
    </Screen>
  );
}
