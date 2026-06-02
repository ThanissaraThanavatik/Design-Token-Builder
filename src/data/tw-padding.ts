import type { Collection } from '@/types/token';
import { spacingScale } from './tw-spacing-shared';

const entries = [...spacingScale, ['px', '1px'] as [string, string]];

export const twPaddingCollection: Collection = {
  id: 'tw-padding',
  name: 'tw/padding',
  prefix: '--padding-',
  modes: ['default'],
  tokens: entries.map(([name, val]) => ({
    id: `padding-${name}`, name, cssVariable: `--padding-${name}`,
    type: 'dimension' as const, values: { default: { raw: val } },
  })),
  namingConvention: {
    pattern: 'numeric-scale',
    description: 'Padding tokens. Names are Tailwind spacing scale keys.',
  },
  sourceFile: 'tw-padding/globals.css',
};
