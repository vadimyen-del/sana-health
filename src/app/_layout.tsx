import { useEffect } from 'react';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { useHealthStore } from '@/stores/health-store';
import { Button, colors, Loading, Screen, s } from '@/components/ui';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaProvider>
      <Screen title="Попробуем ещё раз">
        <Text style={s.body}>
          Не удалось открыть экран. Ваши сохранённые демоданные останутся на
          устройстве.
        </Text>
        <Button title="Повторить" onPress={retry} />
      </Screen>
    </SafeAreaProvider>
  );
}
export default function Layout() {
  const hydrated = useHealthStore((state) => state.hydrated);
  useEffect(() => {
    void useHealthStore.getState().hydrate();
  }, []);
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        {hydrated ? (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          />
        ) : (
          <Loading />
        )}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
