import type { Collection } from '@/types/token';

const steps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

export const twOpacityCollection: Collection = {
  id: 'tw-opacity',
  name: 'tw/opacity',
  prefix: '--opacity-',
  modes: ['default'],
  tokens: steps.map((n) => ({
    id: `opacity-${n}`,
    name: String(n),
    cssVariable: `--opacity-${n}`,
    type: 'number' as const,
    values: { default: { raw: String(n / 100) } },
  })),
  namingConvention: {
    pattern: 'numeric-scale',
    allowedNames: steps.map(String),
    description: 'Opacity tokens. Names are integers 0–100 (multiples of 5).',
  },
  sourceFile: 'tw-opacity/globals.css',
};
