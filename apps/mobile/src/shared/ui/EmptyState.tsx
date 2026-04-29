import { View, type ViewStyle } from 'react-native';
import { useTheme } from '@shared/theme';
import { Text } from './Text';
import { Button } from './Button';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
};

export function EmptyState({ title, description, icon, actionLabel, onAction, style }: EmptyStateProps) {
  const { spacing } = useTheme();
  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing[10],
          paddingHorizontal: spacing[6],
          gap: spacing[3],
        },
        style,
      ]}
    >
      {icon}
      <Text variant="title" align="center">
        {title}
      </Text>
      {description && (
        <Text variant="body" muted align="center">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button label={actionLabel} variant="secondary" onPress={onAction} style={{ marginTop: spacing[3] }} />
      )}
    </View>
  );
}
