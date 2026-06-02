import type { GoogleFont } from '@/types/brand';

// "Noto Sans", sans-serif  →  Noto Sans
export function extractFontFamily(raw: string): string {
  const first = raw.split(',')[0].trim().replace(/^["']|["']$/g, '');
  return first;
}

// Noto Sans  +  sans-serif  →  "Noto Sans", sans-serif
export function formatFontFamily(family: string, fallback: string): string {
  return `"${family}", ${fallback}`;
}

// "Noto Sans", sans-serif  →  sans-serif
export function extractFallback(raw: string): string {
  const parts = raw.split(',').map((s) => s.trim());
  if (parts.length < 2) return 'sans-serif';
  const last = parts[parts.length - 1];
  const generics = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-monospace', 'ui-sans-serif'];
  return generics.some((g) => last.includes(g)) ? last : 'sans-serif';
}

export function buildGoogleFontsUrl(fonts: GoogleFont[]): string {
  const filtered = fonts.filter((f) => f.family.trim() && f.weights.length > 0);
  if (filtered.length === 0) return '';
  const families = filtered.map((f) => {
    const family = f.family.trim().replace(/ /g, '+');
    const weights = [...f.weights].sort((a, b) => a - b).join(';');
    return `family=${family}:wght@${weights}`;
  });
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

export function loadGoogleFonts(fonts: GoogleFont[]): void {
  const url = buildGoogleFontsUrl(fonts);
  if (!url) return;

  const existing = document.querySelector<HTMLLinkElement>('link[data-gf]');
  if (existing) {
    if (existing.href !== url) existing.href = url;
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.setAttribute('data-gf', 'true');
  document.head.appendChild(link);
}
