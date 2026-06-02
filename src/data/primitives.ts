import type { Collection, Token } from '@/types/token';

const integers: [string, string][] = [
  ['0', '0px'], ['1', '1px'], ['2', '2px'], ['3', '3px'], ['4', '4px'],
  ['5', '5px'], ['6', '6px'], ['8', '8px'], ['10', '10px'], ['12', '12px'],
  ['14', '14px'], ['15', '15px'], ['16', '16px'], ['18', '18px'], ['20', '20px'],
  ['24', '24px'], ['25', '25px'], ['28', '28px'], ['30', '30px'], ['32', '32px'],
  ['35', '35px'], ['36', '36px'], ['40', '40px'], ['44', '44px'], ['45', '45px'],
  ['48', '48px'], ['50', '50px'], ['55', '55px'], ['56', '56px'], ['60', '60px'],
  ['64', '64px'], ['65', '65px'], ['70', '70px'], ['72', '72px'], ['75', '75px'],
  ['80', '80px'], ['85', '85px'], ['90', '90px'], ['95', '95px'], ['96', '96px'],
  ['100', '100px'], ['112', '112px'], ['128', '128px'], ['144', '144px'],
  ['160', '160px'], ['176', '176px'], ['192', '192px'], ['200', '200px'],
  ['208', '208px'], ['224', '224px'], ['240', '240px'], ['256', '256px'],
  ['288', '288px'], ['300', '300px'], ['320', '320px'], ['384', '384px'],
  ['400', '400px'], ['448', '448px'], ['500', '500px'], ['512', '512px'],
  ['576', '576px'], ['600', '600px'], ['640', '640px'], ['672', '672px'],
  ['700', '700px'], ['768', '768px'], ['800', '800px'], ['896', '896px'],
  ['900', '900px'], ['1024', '1024px'], ['1152', '1152px'], ['1280', '1280px'],
  ['1536', '1536px'], ['9999', '9999px'],
];

const fractionals: [string, string][] = [
  ['0.5', '0.5px'], ['0.75', '0.75px'], ['1.25', '1.25px'], ['1.5', '1.5px'],
  ['1.75', '1.75px'], ['2.25', '2.25px'], ['2.5', '2.5px'], ['2.75', '2.75px'],
];

const tracking: [string, string][] = [
  ['tracking-tighter', '-0.8px'], ['tracking-tight', '-0.4px'],
  ['tracking-normal', '0px'], ['tracking-wide', '0.4px'],
  ['tracking-wider', '0.8px'], ['tracking-widest', '1.6px'],
];

const makeTokens = (
  entries: [string, string][],
  idPrefix: string,
  cssPrefix: string,
  group: string,
): Token[] =>
  entries.map(([name, val]) => ({
    id: `${idPrefix}-${name}`,
    name,
    cssVariable: `${cssPrefix}${name}`,
    type: 'dimension' as const,
    values: { default: { raw: val } },
    group,
  }));

const tokens: Token[] = [
  ...makeTokens(integers, 'token-int', '--token-', 'Integer Primitives'),
  ...makeTokens(fractionals, 'token-frac', '--token-', 'Fractional Primitives'),
  ...makeTokens(tracking, 'token', '--token-', 'Letter-Spacing Primitives'),
];

export const primitivesCollection: Collection = {
  id: 'tokens',
  name: 'tokens',
  prefix: '--token-',
  modes: ['default'],
  tokens,
  namingConvention: {
    pattern: 'kebab-case',
    description: 'Primitive tokens — raw numeric pixel values. Names are numbers or numeric descriptors.',
  },
  sourceFile: 'tokens/globals.css',
  description: 'Primitive layer — raw px values referenced by all other collections.',
};
