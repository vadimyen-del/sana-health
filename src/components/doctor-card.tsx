import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { getClinic, type Doctor } from '@/data/catalog';
import { money } from '@/lib/marketplace';
import { Badge, Button, Card, colors, s } from './ui';

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card>
      <View style={s.row}>
        <View
          style={{
            width: 64,
            height: 72,
            borderRadius: 20,
            backgroundColor: doctor.color,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{ fontSize: 23, fontWeight: '500', color: colors.primary }}
          >
            {doctor.initials}
          </Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={s.cardTitle}>{doctor.name}</Text>
          <Text style={s.body}>
            {doctor.specialty} · Стаж {doctor.experience} лет
          </Text>
        </View>
      </View>
      <Text style={s.body}>{getClinic(doctor.clinicId)?.name}</Text>
      <View style={s.divider} />
      <View style={s.between}>
        <View style={{ gap: 5 }}>
          <Text style={s.price}>{money(doctor.clubPrice)}</Text>
          <Text style={s.body}>с Club · обычно {money(doctor.price)}</Text>
        </View>
        <Badge text="SANA Club" />
      </View>
      <Button
        title="Выбрать время"
        secondary
        onPress={() =>
          router.push({ pathname: '/doctor/[id]', params: { id: doctor.id } })
        }
      />
    </Card>
  );
}
