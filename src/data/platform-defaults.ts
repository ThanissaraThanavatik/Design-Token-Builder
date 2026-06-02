import type { PlatformType, BrandPlatform, ScreenBreakpoint } from '@/types/brand';

function bp(fields: Omit<ScreenBreakpoint, 'id'>): ScreenBreakpoint {
  return { id: Math.random().toString(36).slice(2), ...fields };
}

export const PLATFORM_LABELS: Record<PlatformType, string> = {
  'website': 'Website',
  'web-app': 'Web App',
  'mobile-app': 'Mobile App',
  'line-oa': 'Line OA',
  'dashboard': 'Dashboard',
  'other': 'Other',
};

export const PLATFORM_ICONS: Record<PlatformType, string> = {
  'website': '🌐',
  'web-app': '💻',
  'mobile-app': '📱',
  'line-oa': '💬',
  'dashboard': '📊',
  'other': '⚙️',
};

export const DEFAULT_BREAKPOINTS: Record<PlatformType, Omit<ScreenBreakpoint, 'id'>[]> = {
  'website': [
    { name: 'xs',  maxWidth: 479,  columns: 4,  margin: 16, gutter: 16 },
    { name: 'sm',  minWidth: 480,  maxWidth: 767,  columns: 4,  margin: 16, gutter: 16 },
    { name: 'md',  minWidth: 768,  maxWidth: 1023, columns: 8,  margin: 24, gutter: 24, containerWidth: 720  },
    { name: 'lg',  minWidth: 1024, maxWidth: 1279, columns: 12, margin: 32, gutter: 24, containerWidth: 960  },
    { name: 'xl',  minWidth: 1280, maxWidth: 1439, columns: 12, margin: 48, gutter: 24, containerWidth: 1140 },
    { name: '2xl', minWidth: 1440, maxWidth: 1919, columns: 12, margin: 64, gutter: 24, containerWidth: 1320 },
    { name: '3xl', minWidth: 1920, columns: 12, margin: 80, gutter: 24 },
  ],
  'web-app': [
    { name: 'xs',  maxWidth: 479,  columns: 4,  margin: 16, gutter: 16 },
    { name: 'sm',  minWidth: 480,  maxWidth: 767,  columns: 4,  margin: 16, gutter: 16 },
    { name: 'md',  minWidth: 768,  maxWidth: 1023, columns: 8,  margin: 24, gutter: 24 },
    { name: 'lg',  minWidth: 1024, maxWidth: 1279, columns: 12, margin: 32, gutter: 24 },
    { name: 'xl',  minWidth: 1280, maxWidth: 1439, columns: 12, margin: 48, gutter: 24 },
    { name: '2xl', minWidth: 1440, maxWidth: 1919, columns: 12, margin: 64, gutter: 24 },
    { name: '3xl', minWidth: 1920, columns: 12, margin: 80, gutter: 24 },
  ],
  'mobile-app': [
    { name: 'S',      maxWidth: 374,  columns: 4, margin: 16, gutter: 16, note: 'Mobile S (320px)' },
    { name: 'M',      minWidth: 375,  maxWidth: 429, columns: 4, margin: 16, gutter: 16, note: 'Mobile M (375px)' },
    { name: 'L',      minWidth: 430,  maxWidth: 767, columns: 4, margin: 16, gutter: 16, note: 'Mobile L (430px)' },
    { name: 'Tablet', minWidth: 768,  columns: 8, margin: 24, gutter: 24, note: 'Tablet Portrait (768px)' },
  ],
  'line-oa': [
    { name: 'Mobile', minWidth: 360, maxWidth: 430, columns: 4, margin: 12, gutter: 12, note: 'Compact mobile only' },
  ],
  'dashboard': [
    { name: 'Desktop', minWidth: 1024, maxWidth: 1439, columns: 12, margin: 24, gutter: 16, containerWidth: 'fluid' },
    { name: 'Wide',    minWidth: 1440, maxWidth: 1919, columns: 12, margin: 40, gutter: 24, containerWidth: 1440   },
    { name: 'Full',    minWidth: 1920, columns: 12, margin: 64, gutter: 24, containerWidth: 1600 },
  ],
  'other': [
    { name: 'Default', columns: 12, margin: 16, gutter: 16 },
  ],
};

export function makeDefaultPlatform(type: PlatformType): Omit<BrandPlatform, 'id'> {
  return {
    type,
    spacingBase: 8,
    breakpoints: DEFAULT_BREAKPOINTS[type].map(bp),
  };
}

export function makeRecommendedBreakpoints(type: PlatformType): ScreenBreakpoint[] {
  return DEFAULT_BREAKPOINTS[type].map(bp);
}
