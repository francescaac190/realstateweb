import { View, type ViewStyle } from 'react-native';
import { useTheme } from '@shared/theme';
import { Text } from './Text';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  style?: ViewStyle;
};

export function Badge({ label, tone = 'neutral', style }: BadgeProps) {
  const { colors, radius, spacing, palette } = useTheme();

  const map: Record<BadgeTone, { bg: string; fg: string }> = {
    neutral: { bg: colors.surfaceAlt, fg: colors.text },
    accent: { bg: colors.accent, fg: palette.creamBg },
    success: { bg: 'rgba(63,125,88,0.14)', fg: colors.success },
    warning: { bg: 'rgba(184,128,26,0.16)', fg: colors.warning },
    danger: { bg: 'rgba(163,58,42,0.14)', fg: colors.danger },
  };
  const m = map[tone];

  return (
    <View
      style={[
        {
          paddingHorizontal: spacing[2],
          paddingVertical: 2,
          borderRadius: radius.pill,
          backgroundColor: m.bg,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text variant="overline" color={m.fg}>
        {label}
      </Text>
    </View>
  );
}
