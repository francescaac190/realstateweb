import { Pressable, View, type PressableProps, type ViewStyle } from 'react-native';
import { useTheme } from '@shared/theme';
import { Text } from './Text';

type ChipProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  selected?: boolean;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
};

export function Chip({ label, selected, leftIcon, disabled, style, ...rest }: ChipProps) {
  const { colors, radius, spacing } = useTheme();
  const isInteractive = !!rest.onPress;

  const content = (
    <View
      style={[
        {
          paddingHorizontal: spacing[3],
          height: 32,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[1],
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: selected ? colors.accent : colors.border,
          backgroundColor: selected ? colors.accent : 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {leftIcon}
      <Text variant="caption" color={selected ? colors.textInverse : colors.text}>
        {label}
      </Text>
    </View>
  );

  if (!isInteractive) return content;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected, disabled: !!disabled }} disabled={disabled} {...rest}>
      {content}
    </Pressable>
  );
}
