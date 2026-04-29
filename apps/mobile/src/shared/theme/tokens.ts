export const palette = {
  carbon: '#1C1816',
  amber: '#B8801A',
  goldSoft: '#D9A44A',
  creamGold: '#F3E6C6',
  creamBg: '#F5F1EA',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const colors = {
  bg: palette.creamBg,
  surface: palette.white,
  surfaceAlt: palette.creamGold,
  text: palette.carbon,
  textMuted: '#5C534B',
  textInverse: palette.creamBg,
  accent: palette.amber,
  accentSoft: palette.goldSoft,
  border: '#E5DED1',
  borderStrong: '#CFC4AE',
  success: '#3F7D58',
  warning: '#B8801A',
  danger: '#A33A2A',
  overlay: 'rgba(28,24,22,0.55)',
} as const;

export const fonts = {
  serif: 'PlayfairDisplay_600SemiBold',
  serifBold: 'PlayfairDisplay_700Bold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemibold: 'Inter_600SemiBold',
  mono: 'SpaceMono',
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 34,
  '4xl': 44,
  '5xl': 56,
} as const;

export const lineHeights = {
  tight: 1.15,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const spacing = {
  px: 1,
  '0_5': 2,
  '1': 4,
  '1_5': 6,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
  '20': 80,
  '24': 96,
} as const;

export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  '2xl': 32,
  pill: 999,
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  sm: {
    shadowColor: palette.carbon,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: palette.carbon,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  lg: {
    shadowColor: palette.carbon,
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
} as const;

export const motion = {
  fast: 150,
  base: 220,
  slow: 360,
} as const;

export const tokens = {
  palette,
  colors,
  fonts,
  fontSizes,
  lineHeights,
  spacing,
  radius,
  shadows,
  motion,
} as const;

export type Tokens = typeof tokens;
export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type FontSizeToken = keyof typeof fontSizes;
