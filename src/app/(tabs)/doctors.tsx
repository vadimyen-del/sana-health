import { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Button,
  Card,
  Chips,
  DemoNote,
  Empty,
  Icon,
  Screen,
  SearchInput,
  s,
} from '@/components/ui';
import { DoctorCard } from '@/components/doctor-card';
import { getClinic } from '@/data/catalog';
import { searchClinics, searchDoctors } from '@/lib/marketplace';
import { useCatalog } from '@/services/catalog';

export default function Doctors() {
  const params = useLocalSearchParams<{ clinic?: string }>();
  const clinicId =
    typeof params.clinic === 'string' ? params.clinic : undefined;
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('Врачи');
  const [specialty, setSpecialty] = useState('Все');
  const catalog = useCatalog();
  const results = searchDoctors(query, specialty, clinicId);
  const clinicResults = searchClinics(query);
  const reset = () => {
    setQuery('');
    setSpecialty('Все');
    router.setParams({ clinic: '' });
  };
  return (
    <Screen title="Свои специалисты" eyebrow="ВРАЧИ И КЛИНИКИ">
      <Text style={s.body}>Найдите того, кому доверите своё здоровье.</Text>
      <SearchInput
        value={query}
        onChangeText={setQuery}
        placeholder="Имя, специальность или клиника"
      />
      <Chips
        options={['Врачи', 'Клиники']}
        selected={mode}
        onSelect={setMode}
      />
      {mode === 'Врачи' && (
        <Chips
          options={['Все', 'Терапевт', 'Кардиолог', 'Педиатр', 'Эндокринолог']}
          selected={specialty}
          onSelect={setSpecialty}
        />
      )}
      {!!clinicId && mode === 'Врачи' && (
        <Card>
          <Text style={s.label}>
            {getClinic(clinicId)?.name ?? 'Клиника не найдена'}
          </Text>
          <Button title="Показать все клиники" secondary onPress={reset} />
        </Card>
      )}
      <DemoNote />
      {catalog.isPending ? (
        <Text style={s.body}>Загружаем каталог…</Text>
      ) : catalog.isError ? (
        <Empty
          title="Каталог недоступен"
          detail="Попробуйте загрузить его ещё раз."
          action="Повторить"
          onPress={() => {
            void catalog.refetch();
          }}
        />
      ) : (
        <>
          <Text style={s.eyebrow}>
            НАЙДЕНО: {mode === 'Врачи' ? results.length : clinicResults.length}
          </Text>
          {mode === 'Врачи'
            ? results.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))
            : clinicResults.map((clinic) => (
                <Card key={clinic.id}>
                  <View style={s.row}>
                    <Icon name="business-outline" size={30} />
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={s.cardTitle}>{clinic.name}</Text>
                      <Text style={s.body}>{clinic.area}</Text>
                    </View>
                  </View>
                  <Text style={s.body}>{clinic.description}</Text>
                  <Button
                    title={
                      clinic.id === 'demo-clinic-3'
                        ? 'Посмотреть анализы'
                        : 'Посмотреть врачей'
                    }
                    secondary
                    onPress={() =>
                      router.push({
                        pathname: '/clinic/[id]',
                        params: { id: clinic.id },
                      })
                    }
                  />
                </Card>
              ))}
          {(mode === 'Врачи' ? results.length : clinicResults.length) === 0 && (
            <Empty
              title="Ничего не нашли"
              detail="Попробуйте другую специальность, название или сбросьте фильтры."
              action="Сбросить поиск"
              onPress={reset}
            />
          )}
        </>
      )}
    </Screen>
  );
}
