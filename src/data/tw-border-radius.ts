import type { Collection } from '@/types/token';

const entries: [string, string][] = [
  ['none', '0px'], ['xs', '2px'], ['sm', '4px'], ['md', '6px'], ['lg', '8px'],
  ['xl', '12px'], ['2xl', '16px'], ['3xl', '24px'], ['4xl', '32px'], ['full', '9999px'],
];

export const twBorderRadiusCollection: Collection = {
  id: 'tw-border-radius',
  name: 'tw/border-radius',
  prefix: '--radius-',
  modes: ['default'],
  tokens: entries.map(([name, val]) => ({
    id: `radius-${name}`,
    name,
    cssVariable: `--radius-${name}`,
    type: 'dimension',
    values: { default: { raw: val } },
  })),
  namingConvention: {
    pattern: 'kebab-case',
    allowedNames: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'],
    description: 'Border radius tokens. Allowed names: none, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, full.',
  },
  sourceFile: 'tw-border-radius/globals.css',
};
