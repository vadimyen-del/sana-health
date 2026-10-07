import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  Badge,
  Button,
  Card,
  colors,
  Empty,
  Icon,
  Screen,
  Section,
  s,
} from '@/components/ui';
import { getDoctor, getLabTest, plans } from '@/data/catalog';
import { money, shortDate } from '@/lib/marketplace';
import { useHealthStore } from '@/stores/health-store';

export default function Profile() {
  const { planId, appointments, referrals, storageError, resetDemo } =
    useHealthStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const plan = plans.find((item) => item.id === planId);
  return (
    <Screen title="Моё здоровье" eyebrow="ПРОФИЛЬ">
      <Card>
        <View style={s.row}>
          <View
            style={{
              padding: 16,
              backgroundColor: colors.light,
              borderRadius: 20,
            }}
          >
            <Icon name="person-outline" size={28} />
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={s.cardTitle}>Гость SANA</Text>
            <Text style={s.body}>Демонстрационный профиль</Text>
          </View>
        </View>
        <Badge text={plan ? `${plan.name} · демо` : 'Без подписки Club'} />
        <Button
          title={plan ? 'Посмотреть мой тариф' : 'Познакомиться с Club'}
          secondary
          onPress={() => router.push('/club')}
        />
      </Card>
      {storageError && (
        <Text accessibilityRole="alert" style={s.error}>
          {storageError}
        </Text>
      )}
      <Section title="Мои записи" />
      {appointments.length === 0 ? (
        <Empty
          title="Здесь будут ваши записи"
          detail="Выберите специалиста и удобное время в каталоге."
          action="Найти врача"
          onPress={() => router.push('/doctors')}
        />
      ) : (
        appointments.map((item) => (
          <Card key={item.id}>
            <View style={s.between}>
              <Text style={s.label}>
                {shortDate(item.date)} · {item.time}
              </Text>
              <Badge text={item.status === 'cancelled' ? 'Отменена' : 'Демо'} />
            </View>
            <Text style={s.cardTitle}>
              {getDoctor(item.doctorId)?.name ?? 'Специалист'}
            </Text>
            <Text style={s.body}>
              {money(item.price)} · {item.planId ? 'Цена Club' : 'Обычная цена'}
            </Text>
            <Button
              title="Детали записи"
              secondary
              onPress={() =>
                router.push({
                  pathname: '/appointment/[id]',
                  params: { id: item.id },
                })
              }
            />
          </Card>
        ))
      )}
      <Section title="QR-направления" />
      {referrals.length === 0 ? (
        <Empty
          title="Все направления под рукой"
          detail="Создайте демонстрационное направление из карточки анализа."
          action="Выбрать анализ"
          onPress={() => router.push('/labs')}
        />
      ) : (
        referrals.map((item) => (
          <Card key={item.id}>
            <View style={s.row}>
              <Icon name="qr-code-outline" size={30} />
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={s.cardTitle}>
                  {getLabTest(item.labId)?.name ?? 'Анализ'}
                </Text>
                <Text style={s.body}>
                  Демо-направление · {money(item.price)}
                </Text>
              </View>
            </View>
            <Button
              title="Открыть QR"
              secondary
              onPress={() =>
                router.push({
                  pathname: '/referral/[id]',
                  params: { id: item.id },
                })
              }
            />
          </Card>
        ))
      )}
      <Section title="О приложении" />
      <Text style={s.body}>
        SANA Health · 0.1.0{'\n'}Записи, выбор тарифа и направления сохраняются
        на этом устройстве. Регистрация и реальные медицинские услуги появятся
        после подключения партнёров.
      </Text>
      {confirmReset ? (
        <Card>
          <Text style={s.cardTitle}>Начать демо заново?</Text>
          <Text style={s.body}>
            Выбор тарифа, записи и направления на этом устройстве будут очищены.
          </Text>
          <Button
            title="Очистить демоданные"
            onPress={() => {
              resetDemo();
              setConfirmReset(false);
            }}
          />
          <Button
            title="Оставить данные"
            secondary
            onPress={() => setConfirmReset(false)}
          />
        </Card>
      ) : (
        <Button
          title="Начать демо заново"
          secondary
          onPress={() => setConfirmReset(true)}
        />
      )}
    </Screen>
  );
}
