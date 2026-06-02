import type { Collection } from '@/types/token';
import { spacingScale } from './tw-spacing-shared';

export const twGapCollection: Collection = {
  id: 'tw-gap',
  name: 'tw/gap',
  prefix: '--gap-',
  modes: ['default'],
  tokens: spacingScale.map(([name, val]) => ({
    id: `gap-${name}`, name, cssVariable: `--gap-${name}`,
    type: 'dimension' as const, values: { default: { raw: val } },
  })),
  namingConvention: {
    pattern: 'numeric-scale',
    description: 'Gap tokens. Names are Tailwind spacing scale keys (0, 0.5, 1 … 96).',
  },
  sourceFile: 'tw-gap/globals.css',
};
