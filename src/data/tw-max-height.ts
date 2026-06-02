import type { Collection } from '@/types/token';
import { spacingScale } from './tw-spacing-shared';

const extra: [string, string][] = [
  ['px', '1px'], ['none', 'none'], ['full', '100%'], ['screen', '100vh'],
];

export const twMaxHeightCollection: Collection = {
  id: 'tw-max-height',
  name: 'tw/max-height',
  prefix: '--max-height-',
  modes: ['default'],
  tokens: [...spacingScale, ...extra].map(([name, val]) => ({
    id: `max-height-${name}`, name, cssVariable: `--max-height-${name}`,
    type: 'dimension' as const, values: { default: { raw: val } },
  })),
  namingConvention: {
    pattern: 'numeric-scale',
    description: 'Max-height tokens. Names are spacing scale keys or: px, none, full, screen.',
  },
  sourceFile: 'tw-max-height/globals.css',
};
