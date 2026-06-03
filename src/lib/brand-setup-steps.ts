import type { Brand } from '@/types/brand';
import type { Collection } from '@/types/token';

export function getBrandPrimaryColor(collections: Collection[]): string {
  for (const col of collections) {
    const t = col.tokens.find((t) => t.cssVariable === '--color-primary');
    const val = t?.values['light']?.raw ?? t?.values['default']?.raw;
    if (val && val.startsWith('#')) return val;
  }
  return '#888888';
}

export interface SetupStep {
  id: string;
  label: string;
  sectionId: string;
  required: boolean;
  done: boolean;
  description: string;
}

export function getBrandSetupSteps(brand: Brand): SetupStep[] {
  return [
    {
      id: 'colors',
      label: 'Colors',
      sectionId: 'section-colors',
      required: false,
      done: true,
      description: 'Primary scale generated. Review semantic color overrides for light/dark modes.',
    },
    {
      id: 'typography',
      label: 'Typography',
      sectionId: 'section-typography',
      required: true,
      done: !!brand.typography?.fontFamily,
      description: 'Choose your brand font and define the type scale (H1 → caption).',
    },
    {
      id: 'platforms',
      label: 'Platform & Screens',
      sectionId: 'section-platforms',
      required: true,
      done: (brand.platforms ?? []).length > 0,
      description: 'Set target platforms and responsive breakpoints for layout tokens.',
    },
    {
      id: 'rounded',
      label: 'Border Radius',
      sectionId: 'section-rounded',
      required: true,
      done: Object.keys(brand.rounded ?? {}).length > 0,
      description: 'Set corner style — sharp (2–4 px), soft (8–16 px), or pill-friendly (≥24 px).',
    },
    {
      id: 'shadows',
      label: 'Shadows',
      sectionId: 'section-shadows',
      required: false,
      done: Object.keys(brand.shadow ?? {}).length > 0,
      description: 'Define elevation levels: soft, hover, button, and glow variants.',
    },
    {
      id: 'icons',
      label: 'Icons',
      sectionId: 'section-icons',
      required: false,
      done:
        (brand.icons?.approvedIcons ?? []).some((a) => a.names.length > 0) ||
        (brand.icons?.libraries ?? []).length > 0,
      description: 'Select your icon library and curate the approved icon set.',
    },
    {
      id: 'assets',
      label: 'Brand Assets',
      sectionId: 'section-assets',
      required: false,
      done: !!(brand.assets?.logoFull || brand.assets?.logoMark || brand.assets?.logoWordmark),
      description: 'Upload logo variants (full, mark, wordmark) for documentation and handoff.',
    },
  ];
}

export function countIncompleteRequired(brand: Brand): number {
  return getBrandSetupSteps(brand).filter((s) => s.required && !s.done).length;
}
