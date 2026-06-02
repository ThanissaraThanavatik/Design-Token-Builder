import type { Brand, BrandPlatform } from '@/types/brand';
import type { Collection } from '@/types/token';
import { BREAKPOINT_MODES, isBreakpointMode } from '@/types/token';
import { PLATFORM_LABELS, PLATFORM_ICONS } from '@/data/platform-defaults';
import {
  DEVICE_SCREEN_SIZES,
  STD_BREAKPOINTS,
  SPACING_TOKENS,
  RESPONSIVE_SPACING_CONTEXT,
  PROJECT_TYPE_PADDING,
  type SpacingEntry,
} from '@/data/device-specs';

function getColorTokens(col: Collection) {
  return col.tokens.filter((t) => t.type === 'color');
}

function colorTable(
  tokens: ReturnType<typeof getColorTokens>,
  primaryShade?: string,
  secondaryShade?: string,
): string {
  if (tokens.length === 0) return '';
  const rows = tokens.map((t) => {
    const val = t.values['default']?.raw ?? t.values['light']?.raw ?? '';
    const shade = t.name.split('-').pop() ?? t.name;
    const role = shade === primaryShade ? '★ Primary'
      : shade === secondaryShade ? '◆ Secondary'
      : '';
    return `| ${shade} | \`${val}\` | ${role} | ████████ |`;
  });
  return `| Shade | Hex | Role | Swatch |\n|-------|-----|------|--------|\n${rows.join('\n')}`;
}

const ROUNDED_TW: Record<string, string> = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  full: 'rounded-full',
};

function fmtPx(val: number | undefined): string {
  return val !== undefined ? `${val}px` : '—';
}

function platformTargetsSection(platforms: BrandPlatform[]): string {
  if (platforms.length === 0) return '';
  const rows = platforms.map((p) => {
    const label = p.label ?? PLATFORM_LABELS[p.type];
    const bpNames = p.breakpoints.map((b) => b.name).join(', ') || '—';
    return `| ${PLATFORM_ICONS[p.type]} ${label} | ${p.type} | ${bpNames} |`;
  });
  return `\n## 🖥 Platform Targets\n\n| Platform | Type | Breakpoints |\n|----------|------|-------------|\n${rows.join('\n')}\n`;
}

function fmtContainer(v: number | 'fluid' | undefined): string {
  if (v === undefined) return '—';
  if (v === 'fluid') return 'fluid';
  return `${v}px`;
}

function screenBreakpointsSection(platforms: BrandPlatform[]): string {
  if (platforms.length === 0) return '';
  const sections = platforms.map((p) => {
    const label = p.label ?? PLATFORM_LABELS[p.type];
    if (p.breakpoints.length === 0) return `### ${PLATFORM_ICONS[p.type]} ${label}\n\nNo breakpoints configured.\n`;
    const hasContainer = p.breakpoints.some((b) => b.containerWidth !== undefined);
    const header = hasContainer
      ? `| Breakpoint | Min Width | Max Width | Columns | Margin | Gutter | Container |\n|-----------|-----------|-----------|---------|--------|--------|-----------|`
      : `| Breakpoint | Min Width | Max Width | Columns | Margin | Gutter |\n|-----------|-----------|-----------|---------|--------|--------|`;
    const rows = p.breakpoints.map((b) => {
      const note = b.note ? ` _(${b.note})_` : '';
      const base = `| ${b.name}${note} | ${fmtPx(b.minWidth)} | ${fmtPx(b.maxWidth)} | ${b.columns ?? '—'} | ${fmtPx(b.margin)} | ${fmtPx(b.gutter)} |`;
      return hasContainer ? `${base} ${fmtContainer(b.containerWidth)} |` : base;
    });
    return `### ${PLATFORM_ICONS[p.type]} ${label}\n\n${header}\n${rows.join('\n')}\n\n> Spacing base: **${p.spacingBase}pt** grid\n`;
  });
  return `\n## 📐 Screen Breakpoints\n\n${sections.join('\n')}\n`;
}

function twRange(tokenMin: number, tokenMax: number | undefined, prefix: string): string {
  if (tokenMax !== undefined && tokenMax !== tokenMin) {
    return `\`${prefix}${tokenMin}\` – \`${prefix}${tokenMax}\``;
  }
  return `\`${prefix}${tokenMin}\``;
}

function pxRange(entry: SpacingEntry): string {
  return entry.maxPx !== undefined ? `${entry.minPx}–${entry.maxPx}px` : `${entry.minPx}px`;
}

function tokenRange(entry: SpacingEntry): string {
  return entry.tokenMax !== undefined && entry.tokenMax !== entry.tokenMin
    ? `${entry.tokenMin}–${entry.tokenMax}`
    : String(entry.tokenMin);
}

function deviceScreenSpecSection(): string {
  const bpMap: Record<number, string> = {};
  for (const bp of STD_BREAKPOINTS) {
    bpMap[bp.minWidth] = bp.name;
  }
  function deviceBp(width: number): string {
    let result = 'xs';
    for (const bp of STD_BREAKPOINTS) {
      if (width >= bp.minWidth) result = bp.name;
    }
    return result;
  }
  const rows = DEVICE_SCREEN_SIZES.map(
    (d) => `| ${d.name} | ${d.width}px | ${deviceBp(d.width)} |`,
  );
  const bpRows = STD_BREAKPOINTS.map(
    (b) => `| ${b.name} | ${b.minWidth === 0 ? '0' : `${b.minWidth}px`}+ |`,
  );
  const tokenRows = SPACING_TOKENS.map(
    (t) => `| ${t.token} | ${t.px}px | \`p-${t.token}\` | \`m-${t.token}\` | \`gap-${t.token}\` | ${t.usage} |`,
  );
  return `\n## 📱 Device Screen Reference\n\n| Device | Width | Breakpoint |\n|--------|-------|------------|\n${rows.join('\n')}\n\n### Standard Breakpoints\n\n| Name | Min Width |\n|------|----------|\n${bpRows.join('\n')}\n\n### Spacing Token Scale (4pt base)\n\n| Token | px | tw/padding | tw/margin | tw/gap | Usage |\n|-------|-----|-----------|-----------|--------|-------|\n${tokenRows.join('\n')}\n`;
}

function responsiveSpacingSection(): string {
  const prefixMap: Record<string, { pad: string; margin: string; gap: string }> = {
    'Section spacing':   { pad: 'py', margin: 'my', gap: '—'   },
    'Container padding': { pad: 'px', margin: 'mx', gap: '—'   },
    'Card padding':      { pad: 'p',  margin: 'm',  gap: '—'   },
    'Gap':               { pad: '—',  margin: '—',  gap: 'gap' },
  };
  const rows = RESPONSIVE_SPACING_CONTEXT.map((row) => {
    const pfx = prefixMap[row.element] ?? { pad: 'p', margin: 'm', gap: 'gap' };
    function cell(e: SpacingEntry): string {
      const tw = pfx.pad !== '—' ? `\`${pfx.pad}-${e.tokenMin}\`` : `\`gap-${e.tokenMin}\``;
      return `${e.minPx}px · ${e.tokenMin} · ${tw}`;
    }
    return `| ${row.element} | ${cell(row.mobile)} | ${cell(row.tablet)} | ${cell(row.desktop)} |`;
  });
  return `\n## 📏 Responsive Spacing Context\n\n| Element | Mobile | Tablet | Desktop |\n|---------|--------|--------|----------|\n${rows.join('\n')}\n\n> Grid base: **4pt + 8pt hybrid** · Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96\n`;
}

function projectPaddingSection(platforms: BrandPlatform[]): string {
  if (platforms.length === 0) return '';
  const seen = new Set<string>();
  const sections: string[] = [];
  for (const p of platforms) {
    if (seen.has(p.type)) continue;
    seen.add(p.type);
    const entries = PROJECT_TYPE_PADDING[p.type];
    if (!entries || entries.length === 0) continue;
    const label = p.label ?? PLATFORM_LABELS[p.type];
    const rows = entries.map((e) => {
      const px = pxRange(e);
      const tok = tokenRange(e);
      const twPad = twRange(e.tokenMin, e.tokenMax, 'p-');
      const twMar = twRange(e.tokenMin, e.tokenMax, 'm-');
      const twGap = twRange(e.tokenMin, e.tokenMax, 'gap-');
      return `| ${e.element} | ${px} | ${tok} | ${twPad} | ${twMar} | ${twGap} |`;
    });
    sections.push(`### ${PLATFORM_ICONS[p.type]} ${label}\n\n| Element | px Range | Token | tw/padding | tw/margin | tw/gap |\n|---------|----------|-------|-----------|-----------|--------|\n${rows.join('\n')}\n`);
  }
  if (sections.length === 0) return '';
  return `\n## 🧱 Padding Guidelines\n\n${sections.join('\n')}\n`;
}

function spacingGridSection(platforms: BrandPlatform[], spacing: Record<string, string>): string {
  const base = platforms.length > 0 ? (platforms[0].spacingBase ?? 8) : 8;
  const spacingEntries = Object.entries(spacing).filter(([k]) => k !== 'max-width');
  if (spacingEntries.length === 0 && platforms.length === 0) return '';
  const rows = spacingEntries.map(([token, val]) => {
    const px = parseInt(val);
    if (isNaN(px)) return `| ${token} | ${val} | — | — |`;
    const onGrid = px % base === 0;
    const units = px / base;
    const nearest = onGrid ? null : Math.round(px / base) * base;
    const status = onGrid ? `✅ ${units}u` : `⚠️ ${(px / base).toFixed(1)}u`;
    const rec = onGrid ? '—' : (nearest ? `${nearest}px (${nearest / base}u)` : '—');
    return `| ${token} | ${val} | ${status} | ${rec} |`;
  });
  const tableSection = rows.length > 0
    ? `| Token | Value | On-Grid | Recommended |\n|-------|-------|---------|-------------|\n${rows.join('\n')}\n`
    : '';
  return `\n## 📏 Spacing System (${base}pt Grid)\n\nBase unit: **${base}px**. All spacing, padding, and gap values should be multiples of ${base}.\n\n${tableSection}`;
}

function responsiveTokenValuesSection(collections: Collection[]): string {
  const responsiveCols = collections.filter((c) => c.modes.some(isBreakpointMode));
  if (responsiveCols.length === 0) return '';

  const bpHeader = BREAKPOINT_MODES.map((b) => ` ${b} `).join('|');
  const bpSep = BREAKPOINT_MODES.map(() => '----').join('|');

  const sections = responsiveCols.map((col) => {
    const rows = col.tokens
      .filter((t) => BREAKPOINT_MODES.some((bp) => t.values[bp]))
      .map((t) => {
        const base = t.values['default']?.raw ?? t.values['light']?.raw ?? '—';
        const bpCells = BREAKPOINT_MODES.map((bp) => t.values[bp]?.raw ?? '—').join(' | ');
        return `| \`${t.cssVariable}\` | ${base} | ${bpCells} |`;
      });
    if (rows.length === 0) return '';
    return `### ${col.name}\n\n| Token | Default | ${bpHeader} |\n|-------|---------|${bpSep}|\n${rows.join('\n')}\n`;
  }).filter(Boolean);

  if (sections.length === 0) return '';
  return `\n## 📡 Responsive Token Values\n\n${sections.join('\n')}\n`;
}

export function generateDesignMD(brand: Brand): string {
  const iconSizesCol = brand.collections.find((c) => c.id.startsWith('icons-sizes'));
  const iconSizes = iconSizesCol
    ? Object.fromEntries(iconSizesCol.tokens.map((t) => [t.name, t.values['default']?.raw ?? '']))
    : {};
  const shadcn = brand.collections.find((c) => c.id.startsWith('shadcn'));
  const branding = brand.collections.find((c) => c.id.startsWith('colors-branding'));

  const allBrandingColors = getColorTokens(branding ?? { tokens: [], id: '', name: '', prefix: '', modes: ['default'], namingConvention: { pattern: 'free', description: '' } });

  // Group tokens by their group field; fallback to single "Primary" group
  const groupMap: Record<string, ReturnType<typeof getColorTokens>> = {};
  for (const t of allBrandingColors) {
    const g = t.group ?? 'Primary';
    groupMap[g] = groupMap[g] ? [...groupMap[g], t] : [t];
  }
  const primaryScale = groupMap['Primary'] ?? allBrandingColors;
  const secondaryScale = groupMap['Secondary'] ?? [];
  const extraGroups = Object.entries(groupMap).filter(([g]) => g !== 'Primary' && g !== 'Secondary');

  const ICON_PACKAGES: Record<string, string> = {
    'Lucide Icons': 'lucide-react',
    'Material Icons M3': 'material_design_icons_flutter / @material-symbols',
    'Font Awesome': '@fortawesome/react-fontawesome',
    'Heroicons': '@heroicons/react',
  };

  const typo = brand.typography;
  const rounded = brand.rounded ?? {};
  const spacing = brand.spacing ?? {};
  const shadow = brand.shadow ?? {};
  const motion = brand.motion ?? {};

  const colorVars: Record<string, string> = {};
  if (shadcn) {
    for (const t of shadcn.tokens) {
      colorVars[t.name] = t.values['light']?.raw ?? t.values['default']?.raw ?? '';
    }
  }

  function logoSrc(src: string): string {
    return src.startsWith('data:') ? '[embedded]' : src;
  }

  const hasAnyLogo = brand.assets.logoFull || brand.assets.logoMark || brand.assets.logoWordmark;

  const frontmatter = {
    name: brand.name,
    logo: hasAnyLogo
      ? {
          ...(brand.assets.logoFull ? { full: logoSrc(brand.assets.logoFull) } : {}),
          ...(brand.assets.logoMark ? { mark: logoSrc(brand.assets.logoMark) } : {}),
          ...(brand.assets.logoWordmark ? { wordmark: logoSrc(brand.assets.logoWordmark) } : {}),
          alt: brand.name,
        }
      : undefined,
    colors: {
      primary: Object.fromEntries(
        primaryScale.map((t) => [t.name.split('-').pop()!, t.values['default']?.raw ?? '']),
      ),
      ...(brand.primaryColorShade ? { primary_shade: brand.primaryColorShade } : {}),
      ...(brand.secondaryColorShade ? { secondary_shade: brand.secondaryColorShade } : {}),
      ...(secondaryScale.length > 0
        ? {
            secondary: Object.fromEntries(
              secondaryScale.map((t) => [t.name.split('-').pop()!, t.values['default']?.raw ?? '']),
            ),
          }
        : {}),
      ...Object.fromEntries(
        extraGroups.map(([g, tokens]) => [
          g.toLowerCase(),
          Object.fromEntries(tokens.map((t) => [t.name.split('-').pop()!, t.values['default']?.raw ?? ''])),
        ]),
      ),
      accent: colorVars['accent'] ?? '',
      'text-main': colorVars['foreground'] ?? '',
      'text-muted': colorVars['muted-foreground'] ?? '',
      background: colorVars['background'] ?? '',
      foreground: colorVars['foreground'] ?? '',
      border: colorVars['border'] ?? '',
    },
    typography: typo
      ? {
          font: typo.fontFamily,
          h1: typo.h1,
          h2: typo.h2,
          h3: typo.h3,
          body: typo.body,
          label: typo.label,
          caption: typo.caption,
        }
      : undefined,
    rounded,
    spacing,
    shadow,
    motion,
  };

  const yamlLines: string[] = [];
  function toYaml(obj: Record<string, unknown>, indent = 0): void {
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined || v === null) continue;
      const pad = '  '.repeat(indent);
      if (typeof v === 'object' && !Array.isArray(v)) {
        yamlLines.push(`${pad}${k}:`);
        toYaml(v as Record<string, unknown>, indent + 1);
      } else {
        yamlLines.push(`${pad}${k}: ${JSON.stringify(v)}`);
      }
    }
  }
  toYaml(frontmatter as Record<string, unknown>);

  const roundedTable = Object.entries(rounded)
    .map(([token, val]) => {
      const twClass = ROUNDED_TW[token] ?? `rounded-[${val}]`;
      return `| ${token.toUpperCase()} | ${val} | \`${twClass}\` |`;
    })
    .join('\n');

  const spacingTable = Object.entries(spacing)
    .filter(([token]) => token !== 'max-width')
    .map(([token, val]) => {
      const px = parseInt(val);
      const rem = isNaN(px) ? val : `${px / 16}rem`;
      return `| ${token}x / ${token}r | ${val} | ${rem} | — |`;
    })
    .join('\n');

  const shadowDesc = Object.entries(shadow)
    .map(([k, v]) => `- **${k.charAt(0).toUpperCase() + k.slice(1)}:** ${v}`)
    .join('\n');

  const motionDesc = Object.entries(motion)
    .map(([k, v]) => `- **${k.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} (${v}):**`)
    .join('\n');

  const secondarySection = secondaryScale.length > 0
    ? `\n### Secondary Scale\n\n${colorTable(secondaryScale, undefined, brand.secondaryColorShade)}\n`
    : '';

  const extraGroupSections = extraGroups.map(([g, tokens]) =>
    `\n### ${g} Scale\n\n${colorTable(tokens)}\n`,
  ).join('');

  return `---
${yamlLines.join('\n')}
---

## Overview

${brand.overview ?? `${brand.name} is a brand with a consistent design system.`}

## Logo

${(() => {
    const rows = [
      brand.assets.logoFull ? `| Full | \`${logoSrc(brand.assets.logoFull)}\` | Header, footer, auth pages, OG images |` : null,
      brand.assets.logoMark ? `| Mark | \`${logoSrc(brand.assets.logoMark)}\` | App icon, favicon, small spaces |` : null,
      brand.assets.logoWordmark ? `| Wordmark | \`${logoSrc(brand.assets.logoWordmark)}\` | Text-only contexts |` : null,
    ].filter(Boolean);
    return rows.length > 0
      ? `| Variant | File | Usage |\n|---------|------|-------|\n${rows.join('\n')}`
      : 'No logo assets configured.';
  })()}

## Colors

### Primary Scale

${colorTable(primaryScale, brand.primaryColorShade)}
${secondarySection}${extraGroupSections}
### Other Palette Colors

${shadcn ? getColorTokens(shadcn).filter((t) => t.group && t.group !== 'Chart').slice(0, 10).map((t) => `- **${t.name}:** \`${t.values['light']?.raw ?? ''}\``).join('\n') : ''}

## Typography

Font: **${typo?.fontFamily ?? 'System UI'}**

| Style | Size | Weight | Line Height |
|-------|------|--------|-------------|
${typo?.h1 ? `| H1 | ${typo.h1.fontSize} | ${typo.h1.fontWeight} | ${typo.h1.lineHeight} |` : ''}
${typo?.h2 ? `| H2 | ${typo.h2.fontSize} | ${typo.h2.fontWeight} | ${typo.h2.lineHeight} |` : ''}
${typo?.h3 ? `| H3 | ${typo.h3.fontSize} | ${typo.h3.fontWeight} | ${typo.h3.lineHeight} |` : ''}
${typo?.body ? `| Body | ${typo.body.fontSize} | ${typo.body.fontWeight} | ${typo.body.lineHeight} |` : ''}
${typo?.label ? `| Label | ${typo.label.fontSize} | ${typo.label.fontWeight} | ${typo.label.lineHeight} |` : ''}
${typo?.caption ? `| Caption | ${typo.caption.fontSize} | ${typo.caption.fontWeight} | ${typo.caption.lineHeight} |` : ''}

## Icons
${brand.icons?.libraries && brand.icons.libraries.length > 0 ? `
### Libraries by Platform

| Platform | Library | Style | Fill | Weight | Stroke Width | Package |
|----------|---------|-------|------|--------|--------------|---------|
${brand.icons.libraries.map((lib) => {
  const pkg = ICON_PACKAGES[lib.library] ?? lib.library.toLowerCase().replace(/ /g, '-');
  const style = lib.style ?? (lib.library === 'Material Icons M3' ? 'Outlined' : '—');
  const fill = lib.fill !== undefined ? String(lib.fill) : '—';
  const weight = lib.weight !== undefined ? String(lib.weight) : '—';
  const sw = lib.strokeWidth !== undefined ? String(lib.strokeWidth) : '—';
  return `| ${lib.platform || '—'} | ${lib.library} | ${style} | ${fill} | ${weight} | ${sw} | \`${pkg}\` |`;
}).join('\n')}
` : '\nNo icon libraries configured.\n'}${Object.keys(iconSizes).length > 0 ? `
### Icon Size Scale

| Name | Size |
|------|------|
${Object.entries(iconSizes).map(([name, size]) => `| ${name} | ${size} |`).join('\n')}
` : ''}${(() => {
  const approved = brand.icons?.approvedIcons ?? [];
  if (approved.length === 0) return '';
  const sections = approved
    .filter((a) => a.names.length > 0)
    .map((a) => `\n### Approved Icons — ${a.library}\n\n${a.names.join(', ')}\n`);
  return sections.length > 0 ? sections.join('') : '';
})()}${brand.icons?.customIcons && brand.icons.customIcons.length > 0 ? `
### Custom Icons

| Name | CSS Variable |
|------|-------------|
${brand.icons.customIcons.map((i) => `| ${i.name} | \`--icon-custom-${i.name}\` |`).join('\n')}

> Use \`color: var(--icon-default)\` to apply semantic brand color to custom icons.
` : ''}
## Rounded Corners

| Token | Value | Tailwind Class |
|-------|-------|----------------|
${roundedTable}

## Spacing

| Token | Value (px) | Value (rem) | Usage |
|-------|-----------|-------------|-------|
${spacingTable}
${spacing['max-width'] ? `\n**Max Width:** \`${spacing['max-width']}\`\n` : ''}
## Shadows

${shadowDesc}

## Motion

${motionDesc}
${platformTargetsSection(brand.platforms ?? [])}${screenBreakpointsSection(brand.platforms ?? [])}${spacingGridSection(brand.platforms ?? [], spacing)}${responsiveTokenValuesSection(brand.collections)}${deviceScreenSpecSection()}${responsiveSpacingSection()}${projectPaddingSection(brand.platforms ?? [])}`;

}
