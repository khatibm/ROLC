// Tamim Diwan Design Tokens — Deep Green + Gold

export const colors = {
  // Primary
  primary: '#1B5E20',      // Deep forest green
  primaryLight: '#2E7D32', // Slightly lighter green
  primaryDark: '#0A3D0A',  // Darker green
  primarySurface: '#E8F5E9', // Light green background

  // Accent
  gold: '#B8860B',         // Dark golden rod
  goldLight: '#DAA520',    // Golden rod
  goldSurface: '#FFF8DC',  // Cornsilk

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey200: '#EEEEEE',
  grey300: '#E0E0E0',
  grey400: '#BDBDBD',
  grey500: '#9E9E9E',
  grey600: '#757575',
  grey700: '#616161',
  grey800: '#424242',
  grey900: '#212121',

  // Semantic
  success: '#2E7D32',
  warning: '#F57C00',
  error: '#C62828',
  info: '#1565C0',

  // Backgrounds
  background: '#F9FBF9',
  surface: '#FFFFFF',
  border: '#E0E0E0',

  // Text
  textPrimary: '#212121',
  textSecondary: '#616161',
  textHint: '#9E9E9E',
  textInverse: '#FFFFFF',
};

export const typography = {
  // Font families — system Arabic-friendly fonts
  fontRegular: 'System',
  fontBold: 'System',

  // Sizes
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,

  // Line heights
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const theme = { colors, typography, spacing, radius, shadows };
export default theme;
