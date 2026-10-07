import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, Icon, type IconName } from '@/components/ui';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const tabs: {
    name: string;
    title: string;
    icon: IconName;
    active: IconName;
  }[] = [
    { name: 'index', title: 'Главная', icon: 'grid-outline', active: 'grid' },
    {
      name: 'doctors',
      title: 'Врачи',
      icon: 'medkit-outline',
      active: 'medkit',
    },
    { name: 'labs', title: 'Анализы', icon: 'flask-outline', active: 'flask' },
    {
      name: 'club',
      title: 'Club',
      icon: 'sparkles-outline',
      active: 'sparkles',
    },
    {
      name: 'profile',
      title: 'Профиль',
      icon: 'person-outline',
      active: 'person',
    },
  ];
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8B9890',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: colors.line,
          height: 62 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 4,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? tab.active : tab.icon}
                color={color}
                size={23}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
