import { View, type ViewStyle } from 'react-native';
import { Image, type ImageStyle } from 'expo-image';
import { useTheme } from '@shared/theme';
import { Text } from './Text';

type AvatarProps = {
  source?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle | ImageStyle;
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

export function Avatar({ source, name, size = 40, style }: AvatarProps) {
  const { colors, palette } = useTheme();

  if (source) {
    return (
      <Image
        source={source}
        style={[
          { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surfaceAlt },
          style as ImageStyle,
        ]}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.accentSoft,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style as ViewStyle,
      ]}
    >
      <Text variant="bodyStrong" color={palette.carbon}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
