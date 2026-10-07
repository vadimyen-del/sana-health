import { Text, View } from 'react-native';
import {
  Badge,
  Button,
  Card,
  colors,
  DemoNote,
  Icon,
  Screen,
  s,
} from '@/components/ui';
import { plans } from '@/data/catalog';
import { money } from '@/lib/marketplace';
import { useHealthStore } from '@/stores/health-store';

export default function Club() {
  const planId = useHealthStore((state) => state.planId);
  const selectPlan = useHealthStore((state) => state.selectPlan);
  return (
    <Screen title={'Ваша привилегия —\nзабота о себе'} eyebrow="SANA CLUB">
      <Card style={{ backgroundColor: colors.primary, padding: 26 }}>
        <View style={s.between}>
          <Text style={{ fontSize: 17, letterSpacing: 1, color: colors.white }}>
            sana / club
          </Text>
          <Icon name="sparkles" color={colors.lime} size={30} />
        </View>
        <Text
          style={{
            fontSize: 27,
            lineHeight: 35,
            fontWeight: '500',
            color: colors.white,
            marginTop: 24,
          }}
        >
          Здоровье ближе.{'\n'}Каждый месяц.
        </Text>
        <Text style={{ color: '#DBE9DF', fontSize: 13, lineHeight: 21 }}>
          Одна подписка — специальные цены на консультации и лабораторные
          исследования.
        </Text>
      </Card>
      <DemoNote text="Выбор тарифа работает в деморежиме. Деньги не списываются, реальная подписка не оформляется." />
      {plans.map((plan) => (
        <Card
          key={plan.id}
          style={
            planId === plan.id
              ? { borderColor: colors.primary, borderWidth: 2 }
              : undefined
          }
        >
          <View style={s.between}>
            <Text style={s.eyebrow}>{plan.caption}</Text>
            {planId === plan.id && <Badge text="ВЫБРАН В ДЕМО" />}
          </View>
          <Text style={s.cardTitle}>{plan.name}</Text>
          <Text style={[s.price, { fontSize: 34 }]}>
            {money(plan.price)}
            <Text
              style={{ fontSize: 14, fontWeight: '400', color: colors.muted }}
            >
              {' '}
              / месяц
            </Text>
          </Text>
          <View style={s.divider} />
          {plan.features.map((feature) => (
            <View key={feature} style={s.row}>
              <Icon name="checkmark-circle-outline" size={19} />
              <Text style={[s.body, { flex: 1 }]}>{feature}</Text>
            </View>
          ))}
          <Button
            title={
              planId === plan.id
                ? 'Выбран в демо'
                : `Попробовать ${plan.id === 'family' ? 'Family' : 'Individual'}`
            }
            disabled={planId === plan.id}
            onPress={() => selectPlan(plan.id)}
            secondary={plan.id === 'family'}
          />
        </Card>
      ))}
      {planId && (
        <Button
          title="Продолжить без Club"
          secondary
          onPress={() => selectPlan(null)}
        />
      )}
      <Text style={s.body}>
        Консультации и анализы оплачиваются отдельно. Состав семьи, условия
        подписки и список партнёров будут уточнены перед запуском.
      </Text>
    </Screen>
  );
}
