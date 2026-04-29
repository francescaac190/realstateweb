import { ActivityIndicator, Pressable, View, type PressableProps, type ViewStyle } from 'react-native';
import { useTheme } from '@shared/theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth,
  style,
  ...rest
}: ButtonProps) {
  const { colors, radius, spacing, palette } = useTheme();

  const heightBySize: Record<ButtonSize, number> = { sm: 36, md: 48, lg: 56 };
  const paddingBySize: Record<ButtonSize, number> = { sm: spacing[3], md: spacing[5], lg: spacing[6] };

  const palettes: Record<ButtonVariant, { bg: string; text: string; border: string; pressed: string }> = {
    primary: { bg: colors.accent, text: palette.creamBg, border: colors.accent, pressed: '#9C6D14' },
    secondary: { bg: 'transparent', text: colors.text, border: colors.borderStrong, pressed: colors.surfaceAlt },
    ghost: { bg: 'transparent', text: colors.accent, border: 'transparent', pressed: 'rgba(184,128,26,0.10)' },
    destructive: { bg: colors.danger, text: palette.creamBg, border: colors.danger, pressed: '#7C2A1F' },
  };
  const pal = palettes[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      disabled={isDisabled}
      {...rest}
      style={({ pressed }) => [
        {
          height: heightBySize[size],
          paddingHorizontal: paddingBySize[size],
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: pal.border,
          backgroundColor: pressed && !isDisabled ? pal.pressed : pal.bg,
          opacity: isDisabled ? 0.5 : 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          gap: spacing[2],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={pal.text} />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          <Text variant="bodyStrong" color={pal.text}>
            {label}
          </Text>
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
}
