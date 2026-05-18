/**
 * Jose Decorando Encantando - Theme Configuration
 * Professional color palette based on brand identity
 */

import { Platform } from 'react-native';

// Brand Colors - Inspired by Jose Decorando Encantando logo
export const BRAND = {
  primary: '#FF3B4A',      // Red (festive, energetic)
  secondary: '#0052CC',    // Blue (trust, professional)
  accent: '#7C3AED',       // Purple (creativity, elegance)
  gold: '#F59E0B',         // Gold/Amber (celebration, premium)
  success: '#10B981',      // Green (positive, growth)
  warning: '#F59E0B',      // Amber
  error: '#EF4444',        // Red
};

export const Colors = {
  light: {
    text: '#1F2937',        // Dark gray
    textSecondary: '#6B7280', // Medium gray
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    tint: BRAND.primary,
    icon: BRAND.secondary,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: BRAND.primary,
    border: '#E5E7EB',
    success: BRAND.success,
    error: BRAND.error,
  },
  dark: {
    text: '#F3F4F6',        // Light gray
    textSecondary: '#D1D5DB',
    background: '#111827',
    backgroundSecondary: '#1F2937',
    tint: BRAND.gold,
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: BRAND.gold,
    border: '#374151',
    success: '#6EE7B7',
    error: '#F87171',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
