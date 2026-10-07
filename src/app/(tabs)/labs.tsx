import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  Badge,
  Button,
  Card,
  Chips,
  colors,
  DemoNote,
  Empty,
  Icon,
  Screen,
  SearchInput,
  s,
} from '@/components/ui';
import { money, searchLabs } from '@/lib/marketplace';

export default function Labs() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Все');
  const tests = searchLabs(query, category);
  return (
    <Screen title="Знать о себе больше" eyebrow="АНАЛИЗЫ">
      <Text style={s.body}>
        Лабораторные исследования по партнёрским ценам с SANA Club.
      </Text>
      <SearchInput
        value={query}
        onChangeText={setQuery}
        placeholder="Найти анализ"
      />
      <Chips
        options={['Все', 'Базовые', 'Витамины и минералы', 'Гормоны']}
        selected={category}
        onSelect={setCategory}
      />
      <DemoNote />
      {tests.map((test) => (
        <Card key={test.id}>
          <View style={s.between}>
            <View
              style={{
                backgroundColor: colors.light,
                padding: 12,
                borderRadius: 15,
              }}
            >
              <Icon name="flask-outline" />
            </View>
            <Badge
              text={`−${Math.round((1 - test.clubPrice / test.price) * 100)}% с Club`}
            />
          </View>
          <Text style={s.cardTitle}>{test.name}</Text>
          <Text style={s.body}>{test.turnaround} · Демо-лаборатория</Text>
          <View style={s.between}>
            <View style={{ gap: 4 }}>
              <Text style={s.price}>
                {money(test.clubPrice)}
                <Text style={{ fontSize: 12, fontWeight: '400' }}> с Club</Text>
              </Text>
              <Text style={s.oldPrice}>{money(test.price)}</Text>
            </View>
            <Button
              title="Подробнее"
              secondary
              small
              onPress={() =>
                router.push({ pathname: '/lab/[id]', params: { id: test.id } })
              }
            />
          </View>
        </Card>
      ))}
      {tests.length === 0 && (
        <Empty
          title="Анализ не найден"
          detail="Попробуйте другое название или категорию."
          action="Сбросить поиск"
          onPress={() => {
            setQuery('');
            setCategory('Все');
          }}
        />
      )}
    </Screen>
  );
}
