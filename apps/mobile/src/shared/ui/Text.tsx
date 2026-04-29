import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { useTheme } from '@shared/theme';

export type TextVariant =
  | 'display'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'overline'
  | 'mono';

type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  muted?: boolean;
};

export function Text({ variant = 'body', color, align, muted, style, ...rest }: TextProps) {
  const { colors, fonts, fontSizes, lineHeights } = useTheme();

  const base: TextStyle = (() => {
    switch (variant) {
      case 'display':
        return {
          fontFamily: fonts.serifBold,
          fontSize: fontSizes['4xl'],
          lineHeight: fontSizes['4xl'] * lineHeights.tight,
          letterSpacing: -0.5,
        };
      case 'title':
        return {
          fontFamily: fonts.serif,
          fontSize: fontSizes['2xl'],
          lineHeight: fontSizes['2xl'] * lineHeights.snug,
          letterSpacing: -0.2,
        };
      case 'subtitle':
        return {
          fontFamily: fonts.sansSemibold,
          fontSize: fontSizes.lg,
          lineHeight: fontSizes.lg * lineHeights.snug,
        };
      case 'bodyStrong':
        return {
          fontFamily: fonts.sansSemibold,
          fontSize: fontSizes.base,
          lineHeight: fontSizes.base * lineHeights.normal,
        };
      case 'caption':
        return {
          fontFamily: fonts.sans,
          fontSize: fontSizes.sm,
          lineHeight: fontSizes.sm * lineHeights.normal,
        };
      case 'overline':
        return {
          fontFamily: fonts.sansSemibold,
          fontSize: fontSizes.xs,
          lineHeight: fontSizes.xs * lineHeights.normal,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        };
      case 'mono':
        return {
          fontFamily: fonts.mono,
          fontSize: fontSizes.sm,
          lineHeight: fontSizes.sm * lineHeights.normal,
        };
      case 'body':
      default:
        return {
          fontFamily: fonts.sans,
          fontSize: fontSizes.base,
          lineHeight: fontSizes.base * lineHeights.normal,
        };
    }
  })();

  return (
    <RNText
      {...rest}
      style={[base, { color: color ?? (muted ? colors.textMuted : colors.text), textAlign: align }, style]}
    />
  );
}
