import { router } from 'expo-router';
import { Empty, Screen } from '@/components/ui';
export default function NotFound() {
  return (
    <Screen title="Страница не найдена">
      <Empty
        title="Вернёмся к здоровью"
        detail="Эта ссылка больше не ведёт на экран приложения."
        action="На главную"
        onPress={() => router.replace('/')}
      />
    </Screen>
  );
}
