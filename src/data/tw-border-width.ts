import type { Collection } from '@/types/token';

export const twBorderWidthCollection: Collection = {
  id: 'tw-border-width',
  name: 'tw/border-width',
  prefix: '--border-width-',
  modes: ['default'],
  tokens: [
    { id: 'border-0', name: '0', cssVariable: '--border-width-0', type: 'dimension', values: { default: { raw: '0px' } } },
    { id: 'border-1', name: '1', cssVariable: '--border-width', type: 'dimension', values: { default: { raw: '1px' } } },
    { id: 'border-2', name: '2', cssVariable: '--border-width-2', type: 'dimension', values: { default: { raw: '2px' } } },
    { id: 'border-4', name: '4', cssVariable: '--border-width-4', type: 'dimension', values: { default: { raw: '4px' } } },
    { id: 'border-8', name: '8', cssVariable: '--border-width-8', type: 'dimension', values: { default: { raw: '8px' } } },
  ],
  namingConvention: {
    pattern: 'numeric-scale',
    allowedNames: ['0', '1', '2', '4', '8'],
    description: 'Border width tokens. Names must be: 0, 1, 2, 4, or 8.',
  },
  sourceFile: 'tw-border-width/globals.css',
};
