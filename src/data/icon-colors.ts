import type { Collection } from '@/types/token';

const entries: [string, string][] = [
  ['default', 'var(--color-foreground)'],
  ['muted', 'var(--color-muted-foreground)'],
  ['primary', 'var(--color-primary)'],
  ['danger', 'var(--color-destructive)'],
];

export const iconColorsCollection: Collection = {
  id: 'icons-colors',
  name: 'Icons / Colors',
  prefix: '--icon-',
  modes: ['default'],
  tokens: entries.map(([name, val]) => ({
    id: `icon-color-${name}`,
    name,
    cssVariable: `--icon-${name}`,
    type: 'reference',
    values: { default: { raw: val } },
    description: `Semantic icon color — references ${val}`,
  })),
  namingConvention: {
    pattern: 'free',
    description: 'Semantic icon color tokens. Values should be CSS variable references (var(--color-*)).',
  },
};
