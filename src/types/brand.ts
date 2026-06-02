import type { Collection } from './token';
export type { Collection } from './token';

export type PlatformType =
  | 'website'
  | 'web-app'
  | 'mobile-app'
  | 'line-oa'
  | 'dashboard'
  | 'other';

export interface ScreenBreakpoint {
  id: string;
  name: string;
  minWidth?: number;
  maxWidth?: number;
  columns?: number;
  margin?: number;
  gutter?: number;
  note?: string;
  containerWidth?: number | 'fluid';
}

export interface BrandPlatform {
  id: string;
  type: PlatformType;
  label?: string;
  breakpoints: ScreenBreakpoint[];
  spacingBase: number;
}

export interface GoogleFont {
  family: string;
  weights: number[];
  subsets?: string[];
}

export interface TypographySpec {
  fontSize: string;
  fontWeight: number | string;
  lineHeight: string;
  letterSpacing?: string;
}

export interface BrandIconLibrary {
  id: string;
  platform: string;
  library: 'Lucide Icons' | 'Material Icons M3' | 'Font Awesome' | 'Heroicons' | string;
  style?: 'Outlined' | 'Rounded' | 'Sharp' | 'Filled';
  fill?: 0 | 1;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: -25 | 0 | 200;
  opticalSize?: 20 | 24 | 40 | 48;
  strokeWidth?: 1 | 1.5 | 2 | 2.5 | 3;
}

export interface BrandCustomIcon {
  id: string;
  name: string;
  svg: string;
  group?: string;
}

export interface BrandApprovedIcons {
  library: string;
  names: string[];
}

export interface BrandAssets {
  logoFull?: string;
  logoMark?: string;
  logoWordmark?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  assets: BrandAssets;
  collections: Collection[];
  primaryColorScaleId: string;
  primaryColorShade?: string;
  secondaryColorShade?: string;
  typography?: {
    fontFamily: string;
    h1?: TypographySpec;
    h2?: TypographySpec;
    h3?: TypographySpec;
    body?: TypographySpec;
    label?: TypographySpec;
    caption?: TypographySpec;
  };
  rounded?: Record<string, string>;
  spacing?: Record<string, string>;
  shadow?: Record<string, string>;
  motion?: Record<string, string>;
  icons?: {
    libraries?: BrandIconLibrary[];
    customIcons?: BrandCustomIcon[];
    approvedIcons?: BrandApprovedIcons[];
  };
  overview?: string;
  platforms?: BrandPlatform[];
  createdAt: string;
  updatedAt: string;
}
