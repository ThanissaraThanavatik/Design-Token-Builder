import { hexToRgb } from '@/lib/utils';

type Rgb = { r: number; g: number; b: number };

// Linear sRGB mix: pct is the weight of c2 (0–100), same as tinycolor.mix
function mixRgb(c1: Rgb, c2: Rgb, pct: number): Rgb {
  const w = pct / 100;
  return {
    r: Math.round(c1.r * (1 - w) + c2.r * w),
    g: Math.round(c1.g * (1 - w) + c2.g * w),
    b: Math.round(c1.b * (1 - w) + c2.b * w),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0,   g: 0,   b: 0   };

// Percentages reverse-engineered from Foundation: Color Generator (Material profile)
// Light steps: mix(WHITE, base, pct%) — verified bit-perfect against plugin output
const LIGHT_STEPS = [
  { step: '50',  pct: 10  },
  { step: '100', pct: 31  },
  { step: '200', pct: 46  },
  { step: '300', pct: 67  },
  { step: '400', pct: 80  },
  { step: '500', pct: 100 },
];

// Dark steps: mix(BLACK, base, pct%) — verified bit-perfect against plugin output
// 950 extrapolated by continuing the decay curve
const DARK_STEPS = [
  { step: '600', pct: 91 },
  { step: '700', pct: 71 },
  { step: '800', pct: 55 },
  { step: '900', pct: 42 },
  { step: '950', pct: 32 },
];

export function generateColorScale(baseHex: string): Array<{ step: string; hex: string }> {
  const base = hexToRgb(baseHex);
  if (!base) return [];
  return [
    ...LIGHT_STEPS.map(({ step, pct }) => ({ step, hex: rgbToHex(mixRgb(WHITE, base, pct)) })),
    ...DARK_STEPS.map(({ step, pct }) => ({ step, hex: rgbToHex(mixRgb(BLACK, base, pct)) })),
  ];
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
