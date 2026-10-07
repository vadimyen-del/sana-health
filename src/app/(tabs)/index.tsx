import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  Badge,
  Button,
  Card,
  colors,
  DemoNote,
  Icon,
  Screen,
  Section,
  s,
} from '@/components/ui';
import { DoctorCard } from '@/components/doctor-card';
import { doctors, getDoctor } from '@/data/catalog';
import { useHealthStore } from '@/stores/health-store';
import { nextAppointment, shortDate } from '@/lib/marketplace';

export default function Home() {
  const appointments = useHealthStore((state) => state.appointments);
  const appointment = nextAppointment(appointments);
  return (
    <Screen>
      <View style={s.between}>
        <View style={s.row}>
          <View style={h.logo}>
            <Icon name="add" color={colors.white} size={26} />
          </View>
          <Text style={h.wordmark}>
            sana
            <Text style={{ color: colors.muted, fontWeight: '400' }}>
              {' '}
              health
            </Text>
          </Text>
        </View>
        <Badge text="АЛМАТЫ" />
      </View>
      <View style={{ gap: 8, marginTop: 14 }}>
        <Text style={s.eyebrow}>ЗДОРОВЬЕ РЯДОМ</Text>
        <Text style={h.greeting}>Больше заботы.{'\n'}Меньше хлопот.</Text>
        <Text style={s.body}>Ваши врачи, анализы и привилегии — вместе.</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Поиск врача или клиники"
        style={s.search}
        onPress={() => router.push('/doctors')}
      >
        <Icon name="search-outline" color={colors.muted} />
        <Text style={s.body}>Врач, специальность или клиника</Text>
      </Pressable>
      <View style={h.hero}>
        <View style={s.between}>
          <View style={s.row}>
            <Icon name="sparkles" color={colors.lime} size={18} />
            <Text style={h.clubLabel}>SANA CLUB</Text>
          </View>
          <Badge text="MEMBERSHIP" dark />
        </View>
        <Text style={h.heroTitle}>Забота, которая{'\n'}доступнее с Club</Text>
        <Text style={h.heroBody}>
          Партнёрские цены на приёмы и анализы{'\n'}для вас и вашей семьи.
        </Text>
        <View style={s.between}>
          <View>
            <Text style={h.heroPrice}>
              от 3 999 ₸
              <Text style={{ fontSize: 13, fontWeight: '400' }}> / мес.</Text>
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Узнать о SANA Club"
            style={h.heroArrow}
            onPress={() => router.push('/club')}
          >
            <Icon name="arrow-forward" color={colors.ink} />
          </Pressable>
        </View>
      </View>
      <View style={h.quickRow}>
        <Pressable
          accessibilityRole="button"
          style={h.quick}
          onPress={() => router.push('/doctors')}
        >
          <View style={h.quickIcon}>
            <Icon name="medkit-outline" size={25} />
          </View>
          <Text style={s.label}>К врачу</Text>
          <Text style={h.quickCaption}>Подобрать специалиста</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={h.quick}
          onPress={() => router.push('/labs')}
        >
          <View style={[h.quickIcon, { backgroundColor: '#EFE9DF' }]}>
            <Icon name="flask-outline" size={25} color="#92724B" />
          </View>
          <Text style={s.label}>Сдать анализы</Text>
          <Text style={h.quickCaption}>Цены с привилегией</Text>
        </Pressable>
      </View>
      {appointment && (
        <>
          <Section title="Ближайшая демозапись" />
          <Card>
            <Text style={s.cardTitle}>
              {getDoctor(appointment.doctorId)?.name}
            </Text>
            <Text style={s.body}>
              {shortDate(appointment.date)} · {appointment.time} · Алматы
            </Text>
            <Button
              title="Посмотреть запись"
              secondary
              onPress={() =>
                router.push({
                  pathname: '/appointment/[id]',
                  params: { id: appointment.id },
                })
              }
            />
          </Card>
        </>
      )}
      <Section
        title="Найдите своего врача"
        action="Все"
        onPress={() => router.push('/doctors')}
      />
      <DoctorCard doctor={doctors[0]} />
      <Card style={{ backgroundColor: '#EBF0E5' }}>
        <View style={s.row}>
          <Icon name="qr-code-outline" size={29} />
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>Направление под рукой</Text>
            <Text style={s.body}>Выберите анализ и создайте демо-QR.</Text>
          </View>
        </View>
        <Button
          title="Перейти к анализам"
          secondary
          onPress={() => router.push('/labs')}
        />
      </Card>
      <DemoNote />
    </Screen>
  );
}
const h = StyleSheet.create({
  logo: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.9,
  },
  greeting: {
    fontSize: 35,
    lineHeight: 41,
    fontWeight: '600',
    letterSpacing: -1.4,
    color: colors.ink,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 26,
    padding: 23,
    gap: 19,
    marginTop: 4,
  },
  clubLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.white,
  },
  heroTitle: {
    fontSize: 27,
    lineHeight: 33,
    letterSpacing: -0.7,
    fontWeight: '500',
    color: colors.white,
  },
  heroBody: { fontSize: 13, lineHeight: 20, color: '#DBE9DF' },
  heroPrice: { fontSize: 24, color: colors.white, fontWeight: '600' },
  heroArrow: {
    backgroundColor: colors.lime,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  quickRow: { flexDirection: 'row', gap: 12 },
  quick: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 22,
    padding: 17,
    gap: 8,
  },
  quickIcon: {
    width: 45,
    height: 45,
    backgroundColor: colors.light,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  quickCaption: { fontSize: 11, lineHeight: 16, color: colors.muted },
});
