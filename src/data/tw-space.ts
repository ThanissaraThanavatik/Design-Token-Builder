import type { Collection } from '@/types/token';
import { spacingScale } from './tw-spacing-shared';

export const twSpaceCollection: Collection = {
  id: 'tw-space',
  name: 'tw/space',
  prefix: '--space-',
  modes: ['default'],
  tokens: spacingScale.map(([name, val]) => ({
    id: `space-${name}`, name, cssVariable: `--space-${name}`,
    type: 'dimension' as const, values: { default: { raw: val } },
  })),
  namingConvention: {
    pattern: 'numeric-scale',
    description: 'Space tokens (space-x-*, space-y-*). Names are Tailwind spacing scale keys.',
  },
  sourceFile: 'tw-space/globals.css',
};
