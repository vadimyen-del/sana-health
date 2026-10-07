import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Button,
  Card,
  DemoNote,
  Empty,
  Screen,
  Section,
  s,
} from '@/components/ui';
import { DoctorCard } from '@/components/doctor-card';
import { doctors, getClinic, labTests } from '@/data/catalog';
import { money } from '@/lib/marketplace';

export default function ClinicDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clinic = getClinic(id);
  if (!clinic)
    return (
      <Screen back title="Клиника не найдена">
        <Empty
          title="Откройте каталог"
          detail="Возможно, ссылка устарела."
          action="К каталогу"
          onPress={() => router.replace('/doctors')}
        />
      </Screen>
    );
  const staff = doctors.filter((doctor) => doctor.clinicId === id);
  const tests = labTests.filter((test) => test.clinicId === id);
  return (
    <Screen back title={clinic.name} eyebrow="КЛИНИКА">
      <Card>
        <Text style={s.cardTitle}>{clinic.area}</Text>
        <Text style={s.body}>{clinic.address}</Text>
        <Text style={s.body}>{clinic.description}</Text>
      </Card>
      <DemoNote />
      {staff.length > 0 && (
        <>
          <Section title="Специалисты клиники" />
          {staff.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </>
      )}
      {tests.length > 0 && (
        <>
          <Section title="Анализы в клинике" />
          {tests.map((test) => (
            <Card key={test.id}>
              <Text style={s.cardTitle}>{test.name}</Text>
              <Text style={s.body}>
                {money(test.clubPrice)} с Club · обычно {money(test.price)}
              </Text>
              <Button
                title="Посмотреть анализ"
                secondary
                onPress={() =>
                  router.push({
                    pathname: '/lab/[id]',
                    params: { id: test.id },
                  })
                }
              />
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}
