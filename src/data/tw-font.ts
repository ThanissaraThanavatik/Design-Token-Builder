import type { Collection, Token } from '@/types/token';

const fontFamilies: Token[] = [
  { id: 'font-sans', name: 'sans', cssVariable: '--font-sans', type: 'string', values: { default: { raw: '"Noto Sans", sans-serif' } }, group: 'Font Family' },
  { id: 'font-mono', name: 'mono', cssVariable: '--font-mono', type: 'string', values: { default: { raw: '"Noto Sans", monospace' } }, group: 'Font Family' },
];

const fontSizes: [string, string][] = [
  ['xs', '12px'], ['sm', '14px'], ['base', '16px'], ['lg', '18px'], ['xl', '20px'],
  ['2xl', '24px'], ['3xl', '30px'], ['4xl', '36px'], ['5xl', '48px'],
  ['6xl', '60px'], ['7xl', '72px'], ['8xl', '96px'], ['9xl', '128px'],
];

const fontWeights: [string, string][] = [
  ['thin', '100'], ['extralight', '200'], ['light', '300'], ['normal', '400'],
  ['medium', '500'], ['semibold', '600'], ['bold', '700'], ['extrabold', '800'], ['black', '900'],
];

const lineHeights: [string, string][] = [
  ['3', '12px'], ['4', '16px'], ['5', '20px'], ['6', '24px'], ['7', '28px'],
  ['8', '32px'], ['9', '36px'], ['10', '40px'], ['12', '48px'],
  ['15', '60px'], ['18', '72px'], ['24', '96px'], ['32', '128px'],
];

const letterSpacings: [string, string][] = [
  ['tighter', '-0.8px'], ['tight', '-0.4px'], ['normal', '0px'],
  ['wide', '0.4px'], ['wider', '0.8px'], ['widest', '1.6px'],
];

const tokens: Token[] = [
  ...fontFamilies,
  ...fontSizes.map(([name, val]) => ({
    id: `text-${name}`, name: `text-${name}`, cssVariable: `--text-${name}`,
    type: 'dimension' as const, values: { default: { raw: val } }, group: 'Font Size',
  })),
  ...fontWeights.map(([name, val]) => ({
    id: `font-weight-${name}`, name: `font-weight-${name}`, cssVariable: `--font-weight-${name}`,
    type: 'number' as const, values: { default: { raw: val } }, group: 'Font Weight',
  })),
  ...lineHeights.map(([name, val]) => ({
    id: `leading-${name}`, name: `leading-${name}`, cssVariable: `--leading-${name}`,
    type: 'dimension' as const, values: { default: { raw: val } }, group: 'Line Height',
  })),
  ...letterSpacings.map(([name, val]) => ({
    id: `tracking-${name}`, name: `tracking-${name}`, cssVariable: `--tracking-${name}`,
    type: 'dimension' as const, values: { default: { raw: val } }, group: 'Letter Spacing',
  })),
];

export const twFontCollection: Collection = {
  id: 'tw-font',
  name: 'tw/font',
  prefix: '--font-',
  modes: ['default'],
  tokens,
  namingConvention: {
    pattern: 'kebab-case',
    allowedPrefixes: ['font-', 'text-', 'leading-', 'tracking-'],
    description: 'Typography tokens. Names must start with: font-, text-, leading-, or tracking-.',
  },
  sourceFile: 'tw-font/globals.css',
};
