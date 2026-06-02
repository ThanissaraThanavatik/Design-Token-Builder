import type { Collection, Token } from '@/types/token';

const scale: [string, string][] = [
  ['50', '#fef5fc'],
  ['100', '#fee9fc'],
  ['200', '#fbd3f5'],
  ['300', '#f7b0e8'],
  ['400', '#f181d9'],
  ['500', '#e550c5'],
  ['600', '#c930a4'],
  ['700', '#a62584'],
  ['800', '#942375'],
  ['900', '#701f59'],
  ['950', '#4a0837'],
];

const tokens: Token[] = scale.map(([step, hex]) => ({
  id: `brand-primary-${step}`,
  name: `primary-${step}`,
  cssVariable: `--color-primary-${step}`,
  type: 'color',
  values: { default: { raw: hex } },
  group: 'Primary',
  description: step === '800' ? '12victory brand primary magenta' : undefined,
}));

export const brandingColorsCollection: Collection = {
  id: 'colors-branding',
  name: 'colors/branding',
  prefix: '--color-primary-',
  modes: ['default'],
  tokens,
  namingConvention: {
    pattern: 'numeric-scale',
    allowedNames: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
    description: 'Brand color scale — names must be one of the standard shade steps (50–950).',
  },
  sourceFile: 'colors-branding/global.css',
  description: '12victory primary magenta color scale (Figma: colors/branding collection)',
};
