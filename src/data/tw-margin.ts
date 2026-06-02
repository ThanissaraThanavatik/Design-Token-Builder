import type { Collection } from '@/types/token';
import { spacingScale } from './tw-spacing-shared';

const entries = [...spacingScale, ['px', '1px'] as [string, string]];

export const twMarginCollection: Collection = {
  id: 'tw-margin',
  name: 'tw/margin',
  prefix: '--margin-',
  modes: ['default'],
  tokens: entries.map(([name, val]) => ({
    id: `margin-${name}`, name, cssVariable: `--margin-${name}`,
    type: 'dimension' as const, values: { default: { raw: val } },
  })),
  namingConvention: {
    pattern: 'numeric-scale',
    description: 'Margin tokens. Names are Tailwind spacing scale keys.',
  },
  sourceFile: 'tw-margin/globals.css',
};
