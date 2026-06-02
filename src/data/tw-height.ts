import type { Collection } from '@/types/token';
import { spacingScale } from './tw-spacing-shared';

const extra: [string, string][] = [
  ['px', '1px'], ['auto', 'auto'], ['full', '100%'], ['screen', '100vh'],
  ['svh', '100svh'], ['dvh', '100dvh'],
];

export const twHeightCollection: Collection = {
  id: 'tw-height',
  name: 'tw/height',
  prefix: '--height-',
  modes: ['default'],
  tokens: [...spacingScale, ...extra].map(([name, val]) => ({
    id: `height-${name}`, name, cssVariable: `--height-${name}`,
    type: 'dimension' as const, values: { default: { raw: val } },
  })),
  namingConvention: {
    pattern: 'numeric-scale',
    description: 'Height tokens. Names are spacing scale keys or: px, auto, full, screen.',
  },
  sourceFile: 'tw-height/globals.css',
};
