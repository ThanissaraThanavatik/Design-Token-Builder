import type { Brand } from '@/types/brand';
import type { TokenMode } from '@/types/token';

function extractVars(brand: Brand, mode: TokenMode) {
  const vars: Record<string, string> = {};
  for (const col of brand.collections) {
    if (!col.modes.includes(mode)) continue;
    for (const token of col.tokens) {
      const val = token.values[mode] ?? token.values['default'];
      if (val) vars[token.cssVariable] = val.raw;
    }
  }
  return vars;
}

export async function syncBrandsToStorybook(brands: Brand[]) {
  const snapshot = {
    brands: brands.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      vars: { ...extractVars(b, 'default'), ...extractVars(b, 'light') },
      darkVars: extractVars(b, 'dark'),
    })),
    syncedAt: new Date().toISOString(),
  };
  const res = await fetch('/api/storybook-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(snapshot),
  });
  if (!res.ok) throw new Error('Storybook sync failed');
}
