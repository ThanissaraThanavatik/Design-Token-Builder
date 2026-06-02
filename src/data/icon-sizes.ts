import type { Collection } from '@/types/token';

const entries: [string, string][] = [
  ['xs', '12px'],
  ['sm', '16px'],
  ['md', '20px'],
  ['lg', '24px'],
  ['xl', '32px'],
];

export const iconSizesCollection: Collection = {
  id: 'icons-sizes',
  name: 'Icons / Sizes',
  prefix: '--icon-size-',
  modes: ['default'],
  tokens: entries.map(([name, val]) => ({
    id: `icon-size-${name}`,
    name,
    cssVariable: `--icon-size-${name}`,
    type: 'dimension',
    values: { default: { raw: val } },
  })),
  namingConvention: {
    pattern: 'kebab-case',
    allowedNames: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    description: 'Icon size tokens. Use --icon-size-md on icon components.',
  },
};
