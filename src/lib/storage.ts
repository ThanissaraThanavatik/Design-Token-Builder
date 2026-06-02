import type { Brand } from '@/types/brand';
import { downloadFile } from './utils';

export function exportBrandJSON(brand: Brand): void {
  const content = JSON.stringify({ dtbVersion: 1, brand }, null, 2);
  downloadFile(`${brand.slug}-tokens.json`, content, 'application/json');
}

export function parseBrandJSON(json: string): Brand | null {
  try {
    const parsed = JSON.parse(json);
    if (parsed.dtbVersion && parsed.brand) return parsed.brand as Brand;
    if (parsed.id && parsed.name && parsed.collections) return parsed as Brand;
    return null;
  } catch {
    return null;
  }
}
