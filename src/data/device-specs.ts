export const DEVICE_SCREEN_SIZES = [
  { name: 'Mobile S',         width: 320  },
  { name: 'Mobile M',         width: 375  },
  { name: 'Mobile L',         width: 430  },
  { name: 'Tablet Portrait',  width: 768  },
  { name: 'Tablet Landscape', width: 1024 },
  { name: 'Laptop',           width: 1280 },
  { name: 'Desktop',          width: 1440 },
  { name: 'Large Monitor',    width: 1920 },
] as const;

export const STD_BREAKPOINTS = [
  { name: 'xs',  minWidth: 0    },
  { name: 'sm',  minWidth: 480  },
  { name: 'md',  minWidth: 768  },
  { name: 'lg',  minWidth: 1024 },
  { name: 'xl',  minWidth: 1280 },
  { name: '2xl', minWidth: 1440 },
  { name: '3xl', minWidth: 1920 },
] as const;

export const SPACING_TOKENS = [
  { token: 0,  px: 0,  usage: 'reset'             },
  { token: 1,  px: 4,  usage: 'micro spacing'      },
  { token: 2,  px: 8,  usage: 'icon/button gap'    },
  { token: 3,  px: 12, usage: 'compact UI'         },
  { token: 4,  px: 16, usage: 'default spacing'    },
  { token: 5,  px: 20, usage: 'comfortable spacing' },
  { token: 6,  px: 24, usage: 'section/component'  },
  { token: 8,  px: 32, usage: 'large separation'   },
  { token: 10, px: 40, usage: 'hero/card'          },
  { token: 12, px: 48, usage: 'layout section'     },
  { token: 16, px: 64, usage: 'desktop spacing'    },
  { token: 20, px: 80, usage: 'page spacing'       },
  { token: 24, px: 96, usage: 'large layout'       },
] as const;

// px → token number (4pt base scale)
export const PX_TO_TOKEN: Record<number, number> = {
  0: 0, 4: 1, 8: 2, 12: 3, 16: 4, 20: 5, 24: 6,
  32: 8, 40: 10, 48: 12, 64: 16, 80: 20, 96: 24,
};

// derive TW utility class — token = px/4 (Tailwind 1u = 4px)
export function twToken(px: number): number {
  return px / 4;
}

export const CONTAINER_WIDTHS: Record<string, Record<string, number | 'fluid'>> = {
  website:   { md: 720, lg: 960, xl: 1140, '2xl': 1320 },
  dashboard: { lg: 'fluid', xl: 'fluid', '2xl': 1440, '3xl': 1600 },
};

export interface SpacingEntry {
  element: string;
  minPx: number;
  maxPx?: number;
  tokenMin: number;
  tokenMax?: number;
}

export const RESPONSIVE_SPACING_CONTEXT: Array<{
  element: string;
  mobile: SpacingEntry;
  tablet: SpacingEntry;
  desktop: SpacingEntry;
}> = [
  {
    element: 'Section spacing',
    mobile:  { element: 'Section spacing',   minPx: 48, tokenMin: 12 },
    tablet:  { element: 'Section spacing',   minPx: 64, tokenMin: 16 },
    desktop: { element: 'Section spacing',   minPx: 96, tokenMin: 24 },
  },
  {
    element: 'Container padding',
    mobile:  { element: 'Container padding', minPx: 16, tokenMin: 4 },
    tablet:  { element: 'Container padding', minPx: 24, tokenMin: 6 },
    desktop: { element: 'Container padding', minPx: 32, tokenMin: 8 },
  },
  {
    element: 'Card padding',
    mobile:  { element: 'Card padding', minPx: 16, tokenMin: 4 },
    tablet:  { element: 'Card padding', minPx: 20, tokenMin: 5 },
    desktop: { element: 'Card padding', minPx: 24, tokenMin: 6 },
  },
  {
    element: 'Gap',
    mobile:  { element: 'Gap', minPx: 12, tokenMin: 3 },
    tablet:  { element: 'Gap', minPx: 16, tokenMin: 4 },
    desktop: { element: 'Gap', minPx: 24, tokenMin: 6 },
  },
];

export const PROJECT_TYPE_PADDING: Record<string, SpacingEntry[]> = {
  website: [
    { element: 'Section vertical',   minPx: 80, maxPx: 160, tokenMin: 20, tokenMax: 40 },
    { element: 'Container padding',  minPx: 24, maxPx: 48,  tokenMin: 6,  tokenMax: 12 },
    { element: 'Card padding',       minPx: 24, maxPx: 32,  tokenMin: 6,  tokenMax: 8  },
    { element: 'Gap between blocks', minPx: 32, maxPx: 64,  tokenMin: 8,  tokenMax: 16 },
  ],
  'web-app': [
    { element: 'Page padding',       minPx: 24,             tokenMin: 6              },
    { element: 'Card padding',       minPx: 16, maxPx: 24,  tokenMin: 4,  tokenMax: 6 },
    { element: 'Form gap',           minPx: 16,             tokenMin: 4              },
    { element: 'Table cell padding', minPx: 12, maxPx: 16,  tokenMin: 3,  tokenMax: 4 },
    { element: 'Sidebar padding',    minPx: 16, maxPx: 24,  tokenMin: 4,  tokenMax: 6 },
  ],
  dashboard: [
    { element: 'Page padding',       minPx: 16, maxPx: 24,  tokenMin: 4,  tokenMax: 6  },
    { element: 'Table row height',   minPx: 40, maxPx: 48,  tokenMin: 10, tokenMax: 12 },
    { element: 'Card padding',       minPx: 16,             tokenMin: 4               },
    { element: 'Form gap',           minPx: 12, maxPx: 16,  tokenMin: 3,  tokenMax: 4  },
    { element: 'Toolbar gap',        minPx: 8,  maxPx: 12,  tokenMin: 2,  tokenMax: 3  },
  ],
  'mobile-app': [
    { element: 'Page padding',      minPx: 16, maxPx: 20, tokenMin: 4, tokenMax: 5 },
    { element: 'Card padding',      minPx: 16,            tokenMin: 4              },
    { element: 'Button padding',    minPx: 12, maxPx: 16, tokenMin: 3, tokenMax: 4 },
    { element: 'List item padding', minPx: 12, maxPx: 16, tokenMin: 3, tokenMax: 4 },
    { element: 'Section gap',       minPx: 24, maxPx: 32, tokenMin: 6, tokenMax: 8 },
  ],
  'line-oa': [
    { element: 'Page padding',        minPx: 12, maxPx: 16, tokenMin: 3, tokenMax: 4 },
    { element: 'Bubble/Card padding', minPx: 12, maxPx: 16, tokenMin: 3, tokenMax: 4 },
    { element: 'Button padding',      minPx: 8,  maxPx: 12, tokenMin: 2, tokenMax: 3 },
    { element: 'List item padding',   minPx: 12,            tokenMin: 3              },
    { element: 'Gap',                 minPx: 8,  maxPx: 12, tokenMin: 2, tokenMax: 3 },
  ],
  other: [
    { element: 'Page padding', minPx: 16, maxPx: 24, tokenMin: 4, tokenMax: 6 },
    { element: 'Card padding', minPx: 16,            tokenMin: 4              },
    { element: 'Gap',          minPx: 12, maxPx: 16, tokenMin: 3, tokenMax: 4 },
  ],
};
