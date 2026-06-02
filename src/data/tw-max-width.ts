import type { Collection } from '@/types/token';
import { spacingScale } from './tw-spacing-shared';

const named: [string, string][] = [
  ['none', 'none'], ['px', '1px'],
  ['xs', '320px'], ['sm', '384px'], ['md', '448px'], ['lg', '512px'],
  ['xl', '576px'], ['2xl', '672px'], ['3xl', '768px'], ['4xl', '896px'],
  ['5xl', '1024px'], ['6xl', '1152px'], ['7xl', '1280px'],
  ['screen-sm', '640px'], ['screen-md', '768px'], ['screen-lg', '1024px'],
  ['screen-xl', '1280px'], ['screen-2xl', '1536px'],
];

export const twMaxWidthCollection: Collection = {
  id: 'tw-max-width',
  name: 'tw/max-width',
  prefix: '--max-width-',
  modes: ['default'],
  tokens: [...spacingScale, ...named].map(([name, val]) => ({
    id: `max-width-${name}`, name, cssVariable: `--max-width-${name}`,
    type: 'dimension' as const, values: { default: { raw: val } },
  })),
  namingConvention: {
    pattern: 'numeric-scale',
    description: 'Max-width tokens. Names are spacing scale keys, named sizes (xs–7xl), or screen breakpoints.',
  },
  sourceFile: 'tw-max-width/globals.css',
};
