import { View, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '@shared/theme';

type CardProps = ViewProps & {
  variant?: 'flat' | 'elevated' | 'outlined' | 'cream';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
};

export function Card({ variant = 'flat', padding = 'md', style, children, ...rest }: CardProps) {
  const { colors, radius, spacing, shadows } = useTheme();
  const padMap = { none: 0, sm: spacing[3], md: spacing[4], lg: spacing[6] };

  const variantStyle: ViewStyle =
    variant === 'elevated'
      ? { backgroundColor: colors.surface, ...shadows.md }
      : variant === 'outlined'
        ? { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }
        : variant === 'cream'
          ? { backgroundColor: colors.surfaceAlt }
          : { backgroundColor: colors.surface };

  return (
    <View
      {...rest}
      style={[{ borderRadius: radius.lg, padding: padMap[padding] }, variantStyle, style]}
    >
      {children}
    </View>
  );
}
