import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Badge,
  Button,
  Card,
  colors,
  DemoNote,
  Empty,
  Icon,
  Screen,
  Section,
  s,
} from '@/components/ui';
import { getClinic, getDoctor } from '@/data/catalog';
import {
  bookingDays,
  money,
  shortDate,
  slots,
  weekday,
} from '@/lib/marketplace';
import { useHealthStore } from '@/stores/health-store';

export default function DoctorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = getDoctor(id);
  const { planId, appointments, book } = useHealthStore();
  const days = bookingDays();
  const [date, setDate] = useState(days[0]);
  const [time, setTime] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (!doctor)
    return (
      <Screen back title="Врач не найден">
        <Empty
          title="Такой карточки нет"
          detail="Выберите специалиста из каталога."
          action="К врачам"
          onPress={() => router.replace('/doctors')}
        />
      </Screen>
    );
  const clinic = getClinic(doctor.clinicId);
  const unavailable = (slot: string) =>
    appointments.some(
      (item) =>
        item.status === 'demo' && item.date === date && item.time === slot,
    );
  function submit() {
    if (!doctor || !time || submitting) return;
    setSubmitting(true);
    try {
      const appointmentId = book(doctor.id, date, time);
      router.replace({
        pathname: '/appointment/[id]',
        params: { id: appointmentId },
      });
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : 'Не удалось создать запись. Попробуйте ещё раз.',
      );
      setSubmitting(false);
    }
  }
  return (
    <Screen back title={doctor.name} eyebrow="ЗАПИСЬ К ВРАЧУ">
      <Card>
        <View style={s.row}>
          <View
            style={{
              height: 76,
              width: 76,
              borderRadius: 23,
              backgroundColor: doctor.color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 28, color: colors.primary }}>
              {doctor.initials}
            </Text>
          </View>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={s.cardTitle}>{doctor.specialty}</Text>
            <Text style={s.body}>Стаж {doctor.experience} лет</Text>
            <Badge text="Демонстрационный врач" />
          </View>
        </View>
        <View style={s.divider} />
        <View style={s.row}>
          <Icon name="location-outline" />
          <View style={{ flex: 1 }}>
            <Text style={s.label}>{clinic?.name}</Text>
            <Text style={s.body}>{clinic?.area}</Text>
          </View>
        </View>
      </Card>
      <Section title="Когда вам удобно?" />
      <Text style={s.body}>Демонстрационное расписание · время Алматы</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {days.map((day) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${shortDate(day)}, ${weekday(day)}`}
            accessibilityState={{ selected: date === day }}
            key={day}
            onPress={() => {
              setDate(day);
              setTime(null);
              setError('');
            }}
            style={[
              s.chip,
              { alignItems: 'center', gap: 7, minWidth: 77 },
              day === date && s.chipSelected,
            ]}
          >
            <Text
              style={{
                color: day === date ? colors.white : colors.muted,
                fontSize: 12,
              }}
            >
              {weekday(day)}
            </Text>
            <Text style={[s.label, day === date && { color: colors.white }]}>
              {shortDate(day)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {slots.map((slot) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Время ${slot}`}
            accessibilityState={{
              selected: time === slot,
              disabled: unavailable(slot),
            }}
            disabled={unavailable(slot)}
            key={slot}
            onPress={() => {
              setTime(slot);
              setError('');
            }}
            style={[
              s.chip,
              { minWidth: 88, alignItems: 'center' },
              time === slot && s.chipSelected,
              unavailable(slot) && { opacity: 0.3 },
            ]}
          >
            <Text style={[s.label, time === slot && { color: colors.white }]}>
              {slot}
            </Text>
          </Pressable>
        ))}
      </View>
      <Card>
        <View style={s.between}>
          <Text style={s.body}>
            {planId ? 'Цена с Club' : 'Стоимость приёма'}
          </Text>
          <Text style={s.price}>
            {money(planId ? doctor.clubPrice : doctor.price)}
          </Text>
        </View>
        {!planId && (
          <Text style={s.body}>
            С Club: {money(doctor.clubPrice)}. Подписку можно выбрать во вкладке
            Club.
          </Text>
        )}
        <Text style={s.label}>
          {shortDate(date)}
          {time ? ` · ${time}` : ' · выберите время'}
        </Text>
        {!!error && (
          <Text accessibilityRole="alert" style={s.error}>
            {error}
          </Text>
        )}
        <Button
          title="Создать демозапись"
          disabled={!time || submitting || (!!time && unavailable(time))}
          onPress={submit}
          icon="calendar-outline"
        />
      </Card>
      <DemoNote text="Демозапись сохраняется только на вашем устройстве. Клиника её не получает, время не бронируется и оплата не проводится." />
    </Screen>
  );
}
