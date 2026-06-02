import type { Collection } from '@/types/token';

const strokes: [string, string][] = [
  ['0.5', '0.5'], ['0.75', '0.75'], ['1', '1'], ['1.25', '1.25'],
  ['1.5', '1.5'], ['1.75', '1.75'], ['2', '2'], ['2.25', '2.25'],
  ['2.5', '2.5'], ['2.75', '2.75'], ['3', '3'],
];

export const twStrokeWidthCollection: Collection = {
  id: 'tw-stroke-width',
  name: 'tw/stroke-width',
  prefix: '--stroke-width-',
  modes: ['default'],
  tokens: strokes.map(([name, val]) => ({
    id: `stroke-width-${name}`, name, cssVariable: `--stroke-width-${name}`,
    type: 'number' as const, values: { default: { raw: val } },
  })),
  namingConvention: {
    pattern: 'numeric-scale',
    description: 'SVG stroke-width tokens. Unitless values 0.5–3 in 0.25 steps.',
  },
  sourceFile: 'tw-stroke-width/globals.css',
};
