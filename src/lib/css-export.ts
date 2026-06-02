import type { Brand, GoogleFont } from '@/types/brand';
import type { Collection, TokenMode, BreakpointMode } from '@/types/token';
import { BREAKPOINT_MODES, isBreakpointMode } from '@/types/token';
import { buildGoogleFontsUrl } from './google-fonts';

const BREAKPOINT_MEDIA: Record<BreakpointMode, string> = {
  xs:    '(max-width: 479px)',
  sm:    '(min-width: 480px) and (max-width: 767px)',
  md:    '(min-width: 768px) and (max-width: 1023px)',
  lg:    '(min-width: 1024px) and (max-width: 1279px)',
  xl:    '(min-width: 1280px) and (max-width: 1439px)',
  '2xl': '(min-width: 1440px) and (max-width: 1919px)',
  '3xl': '(min-width: 1920px)',
};

function generateIconCSS(icons: Brand['icons']): { theme: string; global: string } {
  const themeLines: string[] = [];
  const globalLines: string[] = [];

  if (!icons) return { theme: '', global: '' };

  if (icons.customIcons && icons.customIcons.length > 0) {
    themeLines.push(`  /* ═══ Custom Icons ${'═'.repeat(23)} */`);
    for (const icon of icons.customIcons) {
      const slug = icon.name || icon.id;
      themeLines.push(`  --icon-custom-${slug}: url("data:image/svg+xml,${encodeURIComponent(icon.svg)}");`);
    }
    themeLines.push('');
  }

  if (icons.libraries && icons.libraries.length > 0) {
    const materialStyles = new Set<string>();

    for (const lib of icons.libraries) {
      const slug = lib.platform
        ? lib.platform.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : lib.library.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      if (lib.library === 'Lucide Icons') {
        themeLines.push(`  /* Lucide Icons (${lib.platform || 'default'}) */`);
        themeLines.push(`  --icon-${slug}-stroke-width: ${lib.strokeWidth ?? 1.5};`);
        themeLines.push('');
      } else if (lib.library === 'Material Icons M3') {
        const style = (lib.style ?? 'Outlined').toLowerCase();
        themeLines.push(`  /* Material Symbols (${lib.platform || 'default'}) */`);
        themeLines.push(`  --icon-${slug}-style: ${style};`);
        themeLines.push(`  --icon-${slug}-fill: ${lib.fill ?? 0};`);
        themeLines.push(`  --icon-${slug}-weight: ${lib.weight ?? 400};`);
        themeLines.push(`  --icon-${slug}-grade: ${lib.grade ?? 0};`);
        themeLines.push(`  --icon-${slug}-optical-size: ${lib.opticalSize ?? 24};`);
        themeLines.push('');
        materialStyles.add(style);
      }
    }

    if (materialStyles.size > 0) {
      const selectors = [...materialStyles].map((s) => `.material-symbols-${s}`).join(',\n');
      const fill = icons.libraries.find((l) => l.library === 'Material Icons M3')?.fill ?? 0;
      const weight = icons.libraries.find((l) => l.library === 'Material Icons M3')?.weight ?? 400;
      const grade = icons.libraries.find((l) => l.library === 'Material Icons M3')?.grade ?? 0;
      const opsz = icons.libraries.find((l) => l.library === 'Material Icons M3')?.opticalSize ?? 24;
      globalLines.push(`/* Material Symbols — paste into your global CSS */`);
      globalLines.push(`${selectors} {`);
      globalLines.push(`  font-variation-settings:`);
      globalLines.push(`    'FILL' var(--icon-fill, ${fill}),`);
      globalLines.push(`    'wght' var(--icon-weight, ${weight}),`);
      globalLines.push(`    'GRAD' var(--icon-grade, ${grade}),`);
      globalLines.push(`    'opsz' var(--icon-optical-size, ${opsz});`);
      globalLines.push(`}`);
    }
  }

  return { theme: themeLines.join('\n'), global: globalLines.join('\n') };
}

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    acc[k] = acc[k] ? [...acc[k], item] : [item];
    return acc;
  }, {} as Record<string, T[]>);
}

function renderCollection(col: Collection, mode: TokenMode): string {
  const lines: string[] = [];
  const tokens = col.tokens;

  const groups = groupBy(tokens, (t) => t.group ?? '');
  for (const [groupName, groupTokens] of Object.entries(groups)) {
    if (groupName) {
      lines.push(`  /* ── ${groupName} ${'─'.repeat(Math.max(0, 42 - groupName.length))} */`);
    }
    for (const token of groupTokens) {
      const val = token.values[mode] ?? token.values['default'];
      if (val) {
        lines.push(`  ${token.cssVariable}: ${val.raw};`);
      }
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}

export function generateCSS(brand: Brand, orgFonts?: GoogleFont[]): string {
  const now = new Date().toISOString().slice(0, 10);
  const fontUrl = orgFonts && orgFonts.length > 0 ? buildGoogleFontsUrl(orgFonts) : '';
  const primaryCol = brand.collections.find((c) => c.id.startsWith('colors-branding'));
  const primaryShade = brand.primaryColorShade;
  const primaryHex = primaryShade
    ? primaryCol?.tokens.find((t) => t.cssVariable === `--color-primary-${primaryShade}`)?.values?.default?.raw
    : undefined;
  const secondaryShade = brand.secondaryColorShade;
  const secondaryHex = secondaryShade
    ? primaryCol?.tokens.find((t) => t.cssVariable === `--color-secondary-${secondaryShade}`)?.values?.default?.raw
    : undefined;

  const parts: string[] = [
    `@import "tailwindcss";`,
    ...(fontUrl ? [`@import url("${fontUrl}");`] : []),
    ``,
    `/*`,
    `  Brand:     ${brand.name}`,
    `  Primary:   primary-${primaryShade ?? '?'}${primaryHex ? ` (${primaryHex})` : ''}`,
    ...(secondaryShade ? [`  Secondary: secondary-${secondaryShade}${secondaryHex ? ` (${secondaryHex})` : ''}`] : []),
    `  Generated: ${now} by Design Token Builder`,
    `*/`,
    ``,
    `@theme {`,
  ];

  for (const col of brand.collections) {
    if (col.modes.includes('default')) {
      parts.push(`  /* ═══ ${col.name} ${'═'.repeat(Math.max(0, 40 - col.name.length))} */`);
      parts.push(renderCollection(col, 'default'));
      parts.push('');
    }
    if (col.modes.includes('light')) {
      parts.push(`  /* ═══ ${col.name} (light) ${'═'.repeat(Math.max(0, 33 - col.name.length))} */`);
      parts.push(renderCollection(col, 'light'));
      parts.push('');
    }
  }

  const { theme: iconTheme, global: iconGlobal } = generateIconCSS(brand.icons);
  if (iconTheme) {
    parts.push(`  /* ═══ Icons ${'═'.repeat(31)} */`);
    parts.push(iconTheme);
  }

  parts.push(`}`);
  parts.push(``);

  if (iconGlobal) {
    parts.push(iconGlobal);
    parts.push('');
  }

  // Dark mode overrides — NOT inside @theme
  const darkCollections = brand.collections.filter((c) => c.modes.includes('dark'));
  if (darkCollections.length > 0) {
    parts.push(`/* Dark mode overrides — applied via .dark class */`);
    parts.push(`.dark {`);
    for (const col of darkCollections) {
      parts.push(`  /* ── ${col.name} ──────────────────────────── */`);
      parts.push(renderCollection(col, 'dark'));
      parts.push('');
    }
    parts.push(`}`);
  }

  // Breakpoint responsive overrides
  for (const bp of BREAKPOINT_MODES) {
    const bpCols = brand.collections.filter((c) => c.modes.some((m) => isBreakpointMode(m) && m === bp));
    if (bpCols.length === 0) continue;
    const lines: string[] = [];
    for (const col of bpCols) {
      for (const token of col.tokens) {
        const val = token.values[bp];
        if (val) lines.push(`    ${token.cssVariable}: ${val.raw};`);
      }
    }
    if (lines.length > 0) {
      parts.push(``);
      parts.push(`/* Breakpoint: ${bp} — @media ${BREAKPOINT_MEDIA[bp]} */`);
      parts.push(`@media ${BREAKPOINT_MEDIA[bp]} {`);
      parts.push(`  :root {`);
      parts.push(lines.join('\n'));
      parts.push(`  }`);
      parts.push(`}`);
    }
  }

  return parts.join('\n');
}
