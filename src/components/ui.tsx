import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ColorValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

export const colors = {
  ink: '#173C36',
  muted: '#71817A',
  primary: '#246657',
  lime: '#D9ED9A',
  background: '#F6F7F2',
  white: '#FFFFFF',
  line: '#E5EAE2',
  light: '#ECF2E8',
  danger: '#A34136',
};
export type IconName = ComponentProps<typeof Ionicons>['name'];
export function Icon({
  name,
  size = 22,
  color = colors.primary,
}: {
  name: IconName;
  size?: number;
  color?: ColorValue;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}
export function Screen({
  children,
  title,
  eyebrow,
  back = false,
}: {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  back?: boolean;
}) {
  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.screen}
      >
        {back && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Назад"
            hitSlop={12}
            style={s.back}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace('/')
            }
          >
            <Icon name="arrow-back" />
            <Text style={s.label}>Назад</Text>
          </Pressable>
        )}
        {eyebrow && <Text style={s.eyebrow}>{eyebrow}</Text>}
        {title && (
          <Text accessibilityRole="header" style={s.title}>
            {title}
          </Text>
        )}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  icon,
  small = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: IconName;
  small?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondaryButton,
        small && s.smallButton,
        disabled && { opacity: 0.45 },
        pressed && { opacity: 0.75 },
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          color={secondary ? colors.primary : colors.white}
          size={19}
        />
      )}
      <Text style={[s.buttonText, secondary && { color: colors.primary }]}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Section({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={s.section}>
      <Text accessibilityRole="header" style={s.sectionTitle}>
        {title}
      </Text>
      {action && (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onPress}>
          <Text style={s.link}>{action} →</Text>
        </Pressable>
      )}
    </View>
  );
}
export function Badge({
  text,
  dark = false,
}: {
  text: string;
  dark?: boolean;
}) {
  return (
    <View style={[s.badge, dark && { backgroundColor: '#467767' }]}>
      <Text style={[s.badgeText, dark && { color: colors.white }]}>{text}</Text>
    </View>
  );
}
export function SearchInput({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View style={s.search}>
      <Icon name="search-outline" color={colors.muted} />
      <TextInput
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        value={value}
        onChangeText={onChangeText}
        style={s.input}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Очистить поиск"
          hitSlop={10}
          onPress={() => onChangeText('')}
        >
          <Icon name="close-circle" size={20} color={colors.muted} />
        </Pressable>
      )}
    </View>
  );
}
export function Chips({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.chips}
    >
      {options.map((option) => (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: selected === option }}
          key={option}
          onPress={() => onSelect(option)}
          style={[s.chip, selected === option && s.chipSelected]}
        >
          <Text
            style={[s.chipText, selected === option && { color: colors.white }]}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
export function Empty({
  title,
  detail,
  action,
  onPress,
}: {
  title: string;
  detail: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <Card style={{ alignItems: 'center', paddingVertical: 30 }}>
      <Icon name="leaf-outline" size={30} />
      <Text style={[s.cardTitle, { textAlign: 'center' }]}>{title}</Text>
      <Text style={[s.body, { textAlign: 'center' }]}>{detail}</Text>
      {action && onPress && (
        <Button title={action} onPress={onPress} secondary />
      )}
    </Card>
  );
}
export function DemoNote({
  text = 'Демо-каталог: врачи, клиники и цены вымышлены. Реальные услуги пока недоступны.',
}: {
  text?: string;
}) {
  return (
    <View style={s.note}>
      <Icon name="information-circle-outline" size={18} color={colors.muted} />
      <Text style={s.noteText}>{text}</Text>
    </View>
  );
}
export function Loading() {
  return (
    <SafeAreaView
      style={[
        s.safe,
        { alignItems: 'center', justifyContent: 'center', gap: 18 },
      ]}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={s.body}>Открываем SANA Health…</Text>
    </SafeAreaView>
  );
}
export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  screen: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -1.2,
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  card: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.white,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 25,
    letterSpacing: -0.4,
  },
  body: { fontSize: 14, lineHeight: 21, color: colors.muted },
  label: { fontSize: 14, color: colors.ink, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 19,
    borderRadius: 17,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButton: { backgroundColor: colors.light },
  smallButton: { minHeight: 44, paddingVertical: 11, paddingHorizontal: 15 },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: colors.ink,
    letterSpacing: -0.6,
    flexShrink: 1,
  },
  link: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.light,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  badgeText: { color: colors.primary, fontWeight: '600', fontSize: 11 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    gap: 10,
    minHeight: 56,
  },
  input: { flex: 1, color: colors.ink, fontSize: 15, minHeight: 54 },
  chips: { gap: 8, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.muted },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 3,
  },
  noteText: { fontSize: 11, lineHeight: 17, color: colors.muted, flex: 1 },
  price: {
    fontSize: 23,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.6,
  },
  oldPrice: {
    fontSize: 13,
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 3 },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minHeight: 38,
    gap: 8,
  },
  error: { fontSize: 14, lineHeight: 21, color: colors.danger },
});
