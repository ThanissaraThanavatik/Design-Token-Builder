import type { Brand } from '@/types/brand';
import type { DTCGFile, DTCGGroup, DTCGTokenValue } from '@/types/export';
import { BREAKPOINT_MODES } from '@/types/token';

function inferDTCGType(value: string): DTCGTokenValue['$type'] {
  if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl') || value.startsWith('oklch')) return 'color';
  if (value.endsWith('px') || value.endsWith('rem') || value.endsWith('em') || value.endsWith('%')) return 'dimension';
  if (!isNaN(Number(value))) return 'number';
  return 'string';
}

export function generateJSON(brand: Brand): string {
  const file: DTCGFile = {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    $metadata: {
      name: `${brand.name} Design Tokens`,
      brand: brand.name,
      primaryColorShade: brand.primaryColorShade ?? null,
      secondaryColorShade: brand.secondaryColorShade ?? null,
      generatedAt: new Date().toISOString(),
      generatedBy: 'Design Token Builder',
    },
  };

  for (const col of brand.collections) {
    const colKey = col.name.replace(/[^a-zA-Z0-9]/g, '_');
    const group: DTCGGroup = {};

    for (const token of col.tokens) {
      const lightVal = token.values['light'] ?? token.values['default'];
      const darkVal = token.values['dark'];
      if (!lightVal) continue;

      const entry: DTCGTokenValue = {
        $value: lightVal.raw,
        $type: token.type === 'color' ? 'color' : token.type === 'dimension' ? 'dimension' : token.type === 'number' ? 'number' : inferDTCGType(lightVal.raw),
      };

      if (token.description) entry.$description = token.description;

      const bpValues: Record<string, string> = {};
      for (const bp of BREAKPOINT_MODES) {
        if (token.values[bp]) bpValues[bp] = token.values[bp]!.raw;
      }
      const hasBpValues = Object.keys(bpValues).length > 0;

      if (darkVal || hasBpValues) {
        entry.$extensions = {
          'design-token-builder': {
            ...(darkVal ? { darkValue: darkVal.raw } : {}),
            ...(hasBpValues ? { breakpointValues: bpValues } : {}),
            figmaCollection: col.sourceFile ?? col.name,
          },
        };
      }

      const nameParts = token.name.replace(/\./g, '_').split('-');
      let current: DTCGGroup = group;
      for (let i = 0; i < nameParts.length - 1; i++) {
        const part = nameParts[i];
        if (!current[part] || typeof (current[part] as DTCGTokenValue).$value !== 'undefined') {
          current[part] = {};
        }
        current = current[part] as DTCGGroup;
      }
      current[nameParts[nameParts.length - 1]] = entry;
    }

    file[colKey] = group;
  }

  return JSON.stringify(file, null, 2);
}
