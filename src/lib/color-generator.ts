import { hexToRgb } from '@/lib/utils';

const SCALE_CONFIG = [
  { step: '50',  toward: 'white' as const, factor: 0.94 },
  { step: '100', toward: 'white' as const, factor: 0.84 },
  { step: '200', toward: 'white' as const, factor: 0.70 },
  { step: '300', toward: 'white' as const, factor: 0.52 },
  { step: '400', toward: 'white' as const, factor: 0.33 },
  { step: '500', toward: 'base'  as const, factor: 0    },
  { step: '600', toward: 'black' as const, factor: 0.18 },
  { step: '700', toward: 'black' as const, factor: 0.36 },
  { step: '800', toward: 'black' as const, factor: 0.54 },
  { step: '900', toward: 'black' as const, factor: 0.70 },
  { step: '950', toward: 'black' as const, factor: 0.80 },
];

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  const hn = h / 360, sn = s / 100, ln = l / 100;
  let r: number, g: number, b: number;
  if (sn === 0) {
    r = g = b = ln;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
    const p = 2 * ln - q;
    r = hue2rgb(p, q, hn + 1/3);
    g = hue2rgb(p, q, hn);
    b = hue2rgb(p, q, hn - 1/3);
  }
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateColorScale(baseHex: string): Array<{ step: string; hex: string }> {
  const rgb = hexToRgb(baseHex);
  if (!rgb) return [];
  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return SCALE_CONFIG.map(({ step, toward, factor }) => {
    let newL: number, newS: number;
    if (toward === 'base') {
      newL = l;
      newS = s;
    } else if (toward === 'white') {
      newL = l + (97 - l) * factor;
      newS = s * (1 - factor * 0.25);
    } else {
      newL = l * (1 - factor);
      newS = s;
    }
    return { step, hex: hslToHex(h, Math.max(0, Math.min(100, newS)), Math.max(0, Math.min(100, newL))) };
  });
}

function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const linearize = (c: number) => {
    const srgb = c / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b);
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function wcagLabel(ratio: number): 'AAA' | 'AA' | '' {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return '';
}
