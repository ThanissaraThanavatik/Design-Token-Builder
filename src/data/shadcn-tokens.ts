import type { Collection, Token } from '@/types/token';

const t = (
  id: string,
  name: string,
  cssVariable: string,
  light: string,
  dark: string,
  group?: string,
  description?: string,
): Token => ({
  id,
  name,
  cssVariable,
  type: 'color',
  values: {
    light: { raw: light },
    dark: { raw: dark },
  },
  group,
  description,
});

const tokens: Token[] = [
  // Base UI
  t('shadcn-background', 'background', '--color-background', '#ffffff', '#0a0a0a', 'Base UI', 'Page background'),
  t('shadcn-foreground', 'foreground', '--color-foreground', '#0a0a0a', '#fafafa', 'Base UI', 'Default text color'),
  t('shadcn-card', 'card', '--color-card', '#ffffff', '#0a0a0a', 'Base UI'),
  t('shadcn-card-foreground', 'card-foreground', '--color-card-foreground', '#0a0a0a', '#fafafa', 'Base UI'),
  t('shadcn-popover', 'popover', '--color-popover', '#ffffff', '#0a0a0a', 'Base UI'),
  t('shadcn-popover-foreground', 'popover-foreground', '--color-popover-foreground', '#0a0a0a', '#fafafa', 'Base UI'),
  t('shadcn-muted', 'muted', '--color-muted', '#f5f5f5', '#171717', 'Base UI'),
  t('shadcn-muted-foreground', 'muted-foreground', '--color-muted-foreground', '#737373', '#a3a3a3', 'Base UI'),
  t('shadcn-accent', 'accent', '--color-accent', '#f5f5f5', '#171717', 'Base UI'),
  t('shadcn-accent-foreground', 'accent-foreground', '--color-accent-foreground', '#171717', '#fafafa', 'Base UI'),
  t('shadcn-secondary', 'secondary', '--color-secondary', '#f5f5f5', '#171717', 'Base UI'),
  t('shadcn-secondary-foreground', 'secondary-foreground', '--color-secondary-foreground', '#0a0a0a', '#fafafa', 'Base UI'),
  t('shadcn-destructive', 'destructive', '--color-destructive', '#dc2626', '#ef4444', 'Base UI'),
  t('shadcn-border', 'border', '--color-border', '#e5e5e5', '#262626', 'Base UI'),
  t('shadcn-input', 'input', '--color-input', '#e5e5e5', '#262626', 'Base UI'),

  // Brand Primary (12victory Magenta)
  t('shadcn-primary', 'primary', '--color-primary', '#942375', '#942375', 'Brand — Primary', '12victory brand primary magenta'),
  t('shadcn-primary-foreground', 'primary-foreground', '--color-primary-foreground', '#fafafa', '#fafafa', 'Brand — Primary'),
  t('shadcn-hover-primary', 'hover-primary', '--color-hover-primary', '#701F59', '#701F59', 'Brand — Primary', 'Hover state for primary'),
  t('shadcn-ring', 'ring', '--color-ring', '#942375', '#942375', 'Brand — Primary', 'Focus ring color'),

  // Sidebar
  t('shadcn-sidebar', 'sidebar', '--color-sidebar', '#fafafa', '#0a0a0a', 'Sidebar'),
  t('shadcn-sidebar-foreground', 'sidebar-foreground', '--color-sidebar-foreground', '#0a0a0a', '#fafafa', 'Sidebar'),
  t('shadcn-sidebar-primary', 'sidebar-primary', '--color-sidebar-primary', '#942375', '#942375', 'Sidebar'),
  t('shadcn-sidebar-primary-foreground', 'sidebar-primary-foreground', '--color-sidebar-primary-foreground', '#fafafa', '#fafafa', 'Sidebar'),
  t('shadcn-sidebar-accent', 'sidebar-accent', '--color-sidebar-accent', '#f5f5f5', '#171717', 'Sidebar'),
  t('shadcn-sidebar-accent-foreground', 'sidebar-accent-foreground', '--color-sidebar-accent-foreground', '#171717', '#fafafa', 'Sidebar'),
  t('shadcn-sidebar-border', 'sidebar-border', '--color-sidebar-border', '#d4d4d4', '#262626', 'Sidebar'),
  t('shadcn-sidebar-ring', 'sidebar-ring', '--color-sidebar-ring', '#fef5fc', '#4a0837', 'Sidebar'),
  t('shadcn-sidebar-card', 'sidebar-card', '--color-sidebar-card', '#0000001a', '#ffffff1a', 'Sidebar'),

  // Semantic Status
  t('shadcn-success', 'success', '--color-success', '#16a34a', '#22c55e', 'Semantic — Status'),
  t('shadcn-hover-success', 'hover-success', '--color-hover-success', '#15803d', '#16a34a', 'Semantic — Status'),
  t('shadcn-info-strong', 'info-strong', '--color-info-strong', '#2563eb', '#3b82f6', 'Semantic — Status'),
  t('shadcn-info-muted', 'info-muted', '--color-info-muted', '#eff6ff', '#1e3a8a', 'Semantic — Status'),
  t('shadcn-warning-strong', 'warning-strong', '--color-warning-strong', '#eab308', '#facc15', 'Semantic — Status'),
  t('shadcn-warning-muted', 'warning-muted', '--color-warning-muted', '#fefce8', '#422006', 'Semantic — Status'),
  t('shadcn-neon-green', 'neon-green', '--color-neon-green', '#adfa1d', '#adfa1d', 'Semantic — Status'),

  // Background Muted (alpha)
  t('shadcn-bg-muted-40', 'bg-muted-40', '--color-bg-muted-40', '#f5f5f566', '#17171766', 'Background Muted', '40% opacity muted background'),
  t('shadcn-bg-muted-50', 'bg-muted-50', '--color-bg-muted-50', '#f5f5f580', '#17171780', 'Background Muted', '50% opacity muted background'),

  // Chart
  t('shadcn-chart-1', 'chart-1', '--color-chart-1', '#5eb1ef', '#5eb1ef', 'Chart'),
  t('shadcn-chart-2', 'chart-2', '--color-chart-2', '#0090ff', '#0090ff', 'Chart'),
  t('shadcn-chart-3', 'chart-3', '--color-chart-3', '#0588f0', '#0588f0', 'Chart'),
  t('shadcn-chart-4', 'chart-4', '--color-chart-4', '#0d74ce', '#0d74ce', 'Chart'),
  t('shadcn-chart-5', 'chart-5', '--color-chart-5', '#113264', '#60a5fa', 'Chart'),
];

export const shadcnCollection: Collection = {
  id: 'shadcn-ui',
  name: 'shadcn/ui',
  prefix: '--color-',
  modes: ['light', 'dark'],
  tokens,
  namingConvention: {
    pattern: 'kebab-case',
    allowedPrefixes: [
      'background', 'foreground', 'card', 'popover', 'primary', 'secondary',
      'muted', 'accent', 'destructive', 'border', 'input', 'ring', 'chart',
      'sidebar', 'success', 'info', 'warning', 'neon', 'hover', 'bg',
    ],
    description: 'Semantic UI tokens. Names must start with one of the allowed prefixes.',
  },
  sourceFile: '12victory-light-mode/global.css',
  description: 'shadcn/ui semantic color tokens — light and dark mode values for the 12victory brand',
};
