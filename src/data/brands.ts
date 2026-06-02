import type { Brand } from '@/types/brand';
import type { Collection } from '@/types/token';
import { shadcnCollection } from './shadcn-tokens';
import { brandingColorsCollection } from './branding-colors';
import { primitivesCollection } from './primitives';
import { twBorderRadiusCollection } from './tw-border-radius';
import { twBorderWidthCollection } from './tw-border-width';
import { twColorsCollection } from './tw-colors';
import { twFontCollection } from './tw-font';
import { twGapCollection } from './tw-gap';
import { twHeightCollection } from './tw-height';
import { twMarginCollection } from './tw-margin';
import { twMaxHeightCollection } from './tw-max-height';
import { twMaxWidthCollection } from './tw-max-width';
import { twOpacityCollection } from './tw-opacity';
import { twPaddingCollection } from './tw-padding';
import { twSpaceCollection } from './tw-space';
import { twStrokeWidthCollection } from './tw-stroke-width';
import { iconSizesCollection } from './icon-sizes';
import { iconColorsCollection } from './icon-colors';
import { pageLayoutCollection } from './page-layout';
import { LUCIDE_DEFAULT_ICONS } from './lucide-default-icons';

function cloneCollection(c: Collection, idSuffix: string): Collection {
  return {
    ...c,
    id: `${c.id}-${idSuffix}`,
    tokens: c.tokens.map((t) => ({ ...t, id: `${t.id}-${idSuffix}`, values: { ...t.values } })),
  };
}

// J-lek brand uses orange (#F1592A) primary + maroon (#67091D) secondary — both in one collection
function makeJlekShadcn(): Collection {
  const base = cloneCollection(shadcnCollection, 'j-lek');
  const patchMap: Record<string, { light: string; dark: string }> = {
    '--color-primary': { light: '#D34A1F', dark: '#D34A1F' },
    '--color-primary-foreground': { light: '#fafafa', dark: '#fafafa' },
    '--color-hover-primary': { light: '#B03A15', dark: '#B03A15' },
    '--color-ring': { light: '#D34A1F', dark: '#D34A1F' },
    '--color-sidebar-primary': { light: '#D34A1F', dark: '#D34A1F' },
    '--color-secondary': { light: '#67091D', dark: '#67091D' },
    '--color-secondary-foreground': { light: '#fafafa', dark: '#fafafa' },
    '--color-sidebar-ring': { light: '#FEF8F5', dark: '#7C2D12' },
    '--color-background': { light: '#F5F5DC', dark: '#1C0D10' },
    '--color-foreground': { light: '#1C0D10', dark: '#F5F5DC' },
    '--color-border': { light: '#E8E4D8', dark: '#29030A' },
    '--color-input': { light: '#E8E4D8', dark: '#29030A' },
  };
  base.tokens = base.tokens.map((t) => {
    const patch = patchMap[t.cssVariable];
    if (!patch) return t;
    return { ...t, values: { light: { raw: patch.light }, dark: { raw: patch.dark } } };
  });
  return base;
}

function makeJlekBranding(): Collection {
  const primaryScale: [string, string][] = [
    ['50', '#FEF8F5'], ['100', '#FDEBDB'], ['200', '#FCD2B5'],
    ['300', '#FAB68B'], ['400', '#F7925E'], ['500', '#F1592A'],
    ['600', '#D34A1F'], ['700', '#B03A15'], ['800', '#8C2A0D'], ['900', '#661C06'],
  ];
  const secondaryScale: [string, string][] = [
    ['50', '#F0E6E8'], ['100', '#D0B3B9'], ['200', '#B98E97'],
    ['300', '#995A68'], ['400', '#853A4A'], ['500', '#67091D'],
    ['600', '#520716'], ['700', '#3D0410'], ['800', '#29030A'], ['900', '#1A0206'],
  ];

  const primaryTokens = primaryScale.map(([step, hex]) => ({
    id: `brand-primary-${step}-j-lek`,
    name: `primary-${step}`,
    cssVariable: `--color-primary-${step}`,
    type: 'color' as const,
    values: { default: { raw: hex } },
    group: 'Primary',
    description: step === '600' ? 'J-lek brand primary orange (primary-600)' : undefined,
  }));

  const secondaryTokens = secondaryScale.map(([step, hex]) => ({
    id: `brand-secondary-${step}-j-lek`,
    name: `secondary-${step}`,
    cssVariable: `--color-secondary-${step}`,
    type: 'color' as const,
    values: { default: { raw: hex } },
    group: 'Secondary',
    description: step === '500' ? 'J-lek brand secondary maroon' : undefined,
  }));

  return {
    id: 'colors-branding-j-lek',
    name: 'colors/branding',
    prefix: '--color-',
    modes: ['default'],
    tokens: [...primaryTokens, ...secondaryTokens],
    namingConvention: {
      pattern: 'free',
      description: 'Brand color scales — groups (Primary, Secondary…) each use their own CSS prefix.',
    },
    sourceFile: 'colors-branding/global.css',
    description: 'J-lek brand color scales. Add groups via "New Group" button.',
  };
}

const jlekCollections: Collection[] = [
  cloneCollection(pageLayoutCollection, 'j-lek'),
  makeJlekShadcn(),
  makeJlekBranding(),
  cloneCollection(primitivesCollection, 'j-lek'),
  cloneCollection(twBorderRadiusCollection, 'j-lek'),
  cloneCollection(twBorderWidthCollection, 'j-lek'),
  cloneCollection(twColorsCollection, 'j-lek'),
  cloneCollection(twFontCollection, 'j-lek'),
  cloneCollection(twGapCollection, 'j-lek'),
  cloneCollection(twHeightCollection, 'j-lek'),
  cloneCollection(twMarginCollection, 'j-lek'),
  cloneCollection(twMaxHeightCollection, 'j-lek'),
  cloneCollection(twMaxWidthCollection, 'j-lek'),
  cloneCollection(twOpacityCollection, 'j-lek'),
  cloneCollection(twPaddingCollection, 'j-lek'),
  cloneCollection(twSpaceCollection, 'j-lek'),
  cloneCollection(twStrokeWidthCollection, 'j-lek'),
  cloneCollection(iconSizesCollection, 'j-lek'),
  cloneCollection(iconColorsCollection, 'j-lek'),
];

export const initialBrands: Brand[] = [
  {
    id: '12victory',
    name: '12victory',
    slug: 'twelve-victory',
    assets: {},
    collections: [
      pageLayoutCollection,
      shadcnCollection,
      brandingColorsCollection,
      primitivesCollection,
      twBorderRadiusCollection,
      twBorderWidthCollection,
      twColorsCollection,
      twFontCollection,
      twGapCollection,
      twHeightCollection,
      twMarginCollection,
      twMaxHeightCollection,
      twMaxWidthCollection,
      twOpacityCollection,
      twPaddingCollection,
      twSpaceCollection,
      twStrokeWidthCollection,
      iconSizesCollection,
      iconColorsCollection,
    ],
    primaryColorScaleId: 'colors-branding',
    primaryColorShade: '800',
    typography: {
      fontFamily: 'Noto Sans',
      h1: { fontSize: '3rem', fontWeight: 700, lineHeight: '1.1', letterSpacing: 'tight' },
      h2: { fontSize: '2.25rem', fontWeight: 600, lineHeight: '1.2', letterSpacing: 'tight' },
      h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: '1.3' },
      body: { fontSize: '1rem', fontWeight: 400, lineHeight: '1.625' },
    },
    rounded: { sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px' },
    spacing: { '4': '4px', '8': '8px', '16': '16px', '24': '24px', '32': '32px', '64': '64px' },
    shadow: {
      soft: '0 4px 20px -2px rgba(148, 35, 117, 0.1)',
      hover: '0 10px 25px -5px rgba(148, 35, 117, 0.15)',
      button: '0 4px 14px 0 rgba(148, 35, 117, 0.3)',
    },
    motion: { 'scroll-reveal': '700ms', float: '6s infinite', hover: '200ms' },
    icons: { approvedIcons: [{ library: 'Lucide Icons', names: LUCIDE_DEFAULT_ICONS }] },
    overview: '12victory is a magenta-forward brand with bold, modern aesthetics. Primary color is #942375.',
    createdAt: '2026-05-27T00:00:00.000Z',
    updatedAt: '2026-05-27T00:00:00.000Z',
  },
  {
    id: 'j-lek',
    name: 'J-lek',
    slug: 'j-lek',
    assets: { logoFull: '/branding/j-lek-logo.png' },
    collections: jlekCollections,
    primaryColorScaleId: 'colors-branding-j-lek',
    primaryColorShade: '600',
    secondaryColorShade: '500',
    typography: {
      fontFamily: 'IBM Plex Sans Thai',
      h1: { fontSize: '3rem', fontWeight: 700, lineHeight: '1.1', letterSpacing: 'tight' },
      h2: { fontSize: '2.25rem', fontWeight: 600, lineHeight: '1.2', letterSpacing: 'tight' },
      h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: '1.3' },
      body: { fontSize: '1rem', fontWeight: 400, lineHeight: '1.625' },
      label: { fontSize: '0.875rem', fontWeight: 500, lineHeight: '1.5' },
      caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: '1.5' },
    },
    rounded: { sm: '8px', md: '12px', lg: '16px', xl: '24px', full: '9999px' },
    spacing: {
      '4': '4px', '8': '8px', '16': '16px', '20': '20px', '24': '24px',
      '32': '32px', '40': '40px', '48': '48px', '64': '64px', '72': '72px',
      '80': '80px', '96': '96px', '128': '128px', '256': '256px', 'max-width': '1280px',
    },
    shadow: {
      soft: '0 4px 20px -2px rgba(241, 89, 42, 0.1)',
      hover: '0 10px 25px -5px rgba(241, 89, 42, 0.15), 0 8px 10px -6px rgba(241, 89, 42, 0.1)',
      button: '0 4px 14px 0 rgba(241, 89, 42, 0.3)',
      glow: '0 0 20px rgba(241, 89, 42, 0.5)',
    },
    motion: { 'scroll-reveal': '700ms', float: '6s infinite', hover: '200ms' },
    icons: { approvedIcons: [{ library: 'Lucide Icons', names: LUCIDE_DEFAULT_ICONS }] },
    overview: 'J-lek is a warm, bold brand built around a vivid orange identity with deep maroon accents and a cream backdrop.',
    createdAt: '2026-05-27T00:00:00.000Z',
    updatedAt: '2026-05-27T00:00:00.000Z',
  },
];
