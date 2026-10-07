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
import { getClinic, getLabTest } from '@/data/catalog';
import { money } from '@/lib/marketplace';
import { useHealthStore } from '@/stores/health-store';

export default function LabDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const test = getLabTest(id);
  const { planId, issueReferral } = useHealthStore();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (!test)
    return (
      <Screen back title="Анализ не найден">
        <Empty
          title="Откройте каталог"
          detail="Выберите анализ из списка."
          action="К анализам"
          onPress={() => router.replace('/labs')}
        />
      </Screen>
    );
  return (
    <Screen back title={test.name} eyebrow="АНАЛИЗЫ">
      <Card>
        <Badge text={test.category} />
        <Text style={s.body}>{test.description}</Text>
        <View style={s.row}>
          <Icon name="time-outline" />
          <Text style={s.body}>{test.turnaround}</Text>
        </View>
        <View style={s.row}>
          <Icon name="business-outline" />
          <Text style={[s.body, { flex: 1 }]}>
            {getClinic(test.clinicId)?.name}
          </Text>
        </View>
        <View style={s.divider} />
        <View style={s.between}>
          <Text style={s.body}>Обычная цена</Text>
          <Text style={s.label}>{money(test.price)}</Text>
        </View>
        <View style={s.between}>
          <Text style={s.label}>Партнёрская цена Club</Text>
          <Text style={s.price}>{money(test.clubPrice)}</Text>
        </View>
      </Card>
      <Card>
        <Text style={s.cardTitle}>Ваше демо-направление</Text>
        <Text style={s.body}>
          Выбранная цена: {money(planId ? test.clubPrice : test.price)}
          {planId ? ' с Club' : ' без Club'}.
        </Text>
        <Text style={s.body}>
          QR сохранится в профиле. Это заготовка будущего направления, которую
          нельзя использовать в лаборатории.
        </Text>
        {!!error && (
          <Text accessibilityRole="alert" style={s.error}>
            {error}
          </Text>
        )}
        <Button
          title="Создать демо-QR"
          icon="qr-code-outline"
          disabled={submitting}
          onPress={() => {
            setSubmitting(true);
            try {
              const referralId = issueReferral(id);
              router.replace({
                pathname: '/referral/[id]',
                params: { id: referralId },
              });
            } catch (issue) {
              setError(
                issue instanceof Error ? issue.message : 'Попробуйте ещё раз.',
              );
              setSubmitting(false);
            }
          }}
        />
        {!planId && (
          <Button
            title="Посмотреть Club"
            secondary
            onPress={() => router.push('/club')}
          />
        )}
      </Card>
      <DemoNote text="Цены и лаборатория демонстрационные. Необходимость анализа и подготовку к нему уточняют у врача и выбранной лаборатории." />
    </Screen>
  );
}
