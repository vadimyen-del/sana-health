import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import {
  Badge,
  Button,
  Card,
  colors,
  DemoNote,
  Empty,
  Screen,
  s,
} from '@/components/ui';
import { getLabTest } from '@/data/catalog';
import { money, referralPayload } from '@/lib/marketplace';
import { useHealthStore } from '@/stores/health-store';

export default function ReferralDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const referral = useHealthStore((state) =>
    state.referrals.find((item) => item.id === id),
  );
  if (!referral)
    return (
      <Screen back title="Направление не найдено">
        <Empty
          title="Создайте новое направление"
          detail="Выберите исследование в каталоге анализов."
          action="К анализам"
          onPress={() => router.replace('/labs')}
        />
      </Screen>
    );
  const test = getLabTest(referral.labId);
  return (
    <Screen back title="QR-направление" eyebrow="ВСЕГДА ПОД РУКОЙ">
      <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
        <Badge text="ДЕМОНСТРАЦИЯ · НЕ ДЕЙСТВУЕТ" />
        <Text style={[s.cardTitle, { textAlign: 'center' }]}>{test?.name}</Text>
        <View
          accessible
          accessibilityLabel="QR-код демонстрационного направления, не принимается в клинике"
          style={{
            backgroundColor: colors.white,
            padding: 16,
            marginVertical: 10,
          }}
        >
          <QRCode
            value={referralPayload(referral)}
            size={190}
            quietZone={8}
            color={colors.ink}
            backgroundColor={colors.white}
            ecl="M"
          />
        </View>
        <Text selectable style={[s.body, { fontSize: 11 }]}>
          {referral.id}
        </Text>
        <Text style={s.price}>{money(referral.price)}</Text>
        <Text style={s.body}>
          {referral.planId
            ? 'Демонстрационная цена Club'
            : 'Демонстрационная обычная цена'}
        </Text>
      </Card>
      <DemoNote text="Этот QR не является медицинским направлением и не принимается клиниками. В рабочей версии сервер выдаст защищённый код после подтверждения услуги." />
      <Button
        title="Мои направления"
        onPress={() => router.replace('/profile')}
      />
      <Button
        title="Выбрать ещё анализ"
        secondary
        onPress={() => router.replace('/labs')}
      />
    </Screen>
  );
}
