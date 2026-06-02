export type ThemeMode = 'light' | 'dark' | 'default';
export type BreakpointMode = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type TokenMode = ThemeMode | BreakpointMode;

export const BREAKPOINT_MODES: readonly BreakpointMode[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'default'] as const;

export function isBreakpointMode(m: TokenMode): m is BreakpointMode {
  return (BREAKPOINT_MODES as readonly string[]).includes(m);
}
export function isThemeMode(m: TokenMode): m is ThemeMode {
  return (THEME_MODES as readonly string[]).includes(m);
}

export type TokenType = 'color' | 'dimension' | 'number' | 'string' | 'reference';

export interface TokenValue {
  raw: string;
  resolved?: string;
}

export interface Token {
  id: string;
  name: string;
  cssVariable: string;
  type: TokenType;
  values: Partial<Record<TokenMode, TokenValue>>;
  description?: string;
  tags?: string[];
  figmaId?: string;
  group?: string;
}

export type NamingPatternType =
  | 'kebab-case'
  | 'slash-separated'
  | 'numeric-scale'
  | 'tw-utility'
  | 'free';

export interface NamingConvention {
  pattern: NamingPatternType;
  allowedPrefixes?: string[];
  allowedNames?: string[];
  segmentPattern?: string;
  description: string;
}

export interface Collection {
  id: string;
  name: string;
  prefix: string;
  modes: TokenMode[];
  tokens: Token[];
  namingConvention: NamingConvention;
  sourceFile?: string;
  description?: string;
}
