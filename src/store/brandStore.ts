import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Brand, GoogleFont, BrandCustomIcon, BrandPlatform, ScreenBreakpoint } from '@/types/brand';
import type { Collection } from '@/types/token';
import { initialBrands } from '@/data/brands';
import { iconSizesCollection, iconColorsCollection } from '@/data';
import { LUCIDE_DEFAULT_ICONS } from '@/data/lucide-default-icons';

const SCALE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

interface BrandStore {
  brands: Brand[];
  activeBrandId: string;
  schemaVersion: number;
  orgFonts: GoogleFont[];

  setActiveBrand: (id: string) => void;
  addBrand: (brand: Brand) => void;
  duplicateBrand: (sourceId: string, newName: string, newId: string) => void;
  deleteBrand: (id: string) => void;
  updateBrandMeta: (id: string, patch: Partial<Omit<Brand, 'collections' | 'id'>>) => void;
  updateBrandCollections: (brandId: string, collections: Collection[]) => void;
  importBrand: (brand: Brand) => void;
  addOrgFont: (font: GoogleFont) => void;
  removeOrgFont: (family: string) => void;
  updateIconApproved: (brandId: string, library: string, names: string[]) => void;
  addCustomIcon: (brandId: string, icon: BrandCustomIcon) => void;
  removeCustomIcon: (brandId: string, iconId: string) => void;
  updateCustomIcon: (brandId: string, iconId: string, patch: Partial<BrandCustomIcon>) => void;
  addBrandPlatform: (brandId: string, platform: BrandPlatform) => void;
  updateBrandPlatform: (brandId: string, platformId: string, patch: Partial<BrandPlatform>) => void;
  removeBrandPlatform: (brandId: string, platformId: string) => void;
  addBreakpoint: (brandId: string, platformId: string, bp: ScreenBreakpoint) => void;
  updateBreakpoint: (brandId: string, platformId: string, bpId: string, patch: Partial<ScreenBreakpoint>) => void;
  removeBreakpoint: (brandId: string, platformId: string, bpId: string) => void;
  setPrimaryColorShade: (brandId: string, shade: string) => void;
  setSecondaryColorShade: (brandId: string, shade: string) => void;
}

export const useBrandStore = create<BrandStore>()(
  persist(
    (set, get) => ({
      brands: initialBrands,
      activeBrandId: initialBrands[0].id,
      schemaVersion: 1,
      orgFonts: [
        { family: 'Noto Sans', weights: [400, 500, 600, 700] },
        { family: 'IBM Plex Sans Thai', weights: [400, 500, 600, 700] },
      ],

      setActiveBrand: (id) => set({ activeBrandId: id }),

      addBrand: (brand) =>
        set((s) => ({ brands: [...s.brands, brand] })),

      duplicateBrand: (sourceId, newName, newId) => {
        const source = get().brands.find((b) => b.id === sourceId);
        if (!source) return;
        const now = new Date().toISOString();
        const copy: Brand = {
          ...structuredClone(source),
          id: newId,
          name: newName,
          slug: newName.toLowerCase().replace(/\s+/g, '-'),
          createdAt: now,
          updatedAt: now,
          collections: structuredClone(source.collections).map((c) => ({
            ...c,
            id: `${c.id}-${newId}`,
            tokens: c.tokens.map((t) => ({ ...t, id: `${t.id}-${newId}` })),
          })),
        };
        set((s) => ({ brands: [...s.brands, copy] }));
      },

      deleteBrand: (id) =>
        set((s) => {
          const remaining = s.brands.filter((b) => b.id !== id);
          return {
            brands: remaining,
            activeBrandId: s.activeBrandId === id
              ? (remaining[0]?.id ?? '')
              : s.activeBrandId,
          };
        }),

      updateBrandMeta: (id, patch) =>
        set((s) => ({
          brands: s.brands.map((b) =>
            b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b,
          ),
        })),

      updateBrandCollections: (brandId, collections) =>
        set((s) => ({
          brands: s.brands.map((b) =>
            b.id === brandId
              ? { ...b, collections, updatedAt: new Date().toISOString() }
              : b,
          ),
        })),

      importBrand: (brand) =>
        set((s) => {
          const exists = s.brands.find((b) => b.id === brand.id);
          if (exists) {
            return { brands: s.brands.map((b) => (b.id === brand.id ? brand : b)) };
          }
          return { brands: [...s.brands, brand] };
        }),

      addOrgFont: (font) =>
        set((s) => ({
          orgFonts: s.orgFonts.find((f) => f.family === font.family)
            ? s.orgFonts
            : [...s.orgFonts, font],
        })),

      removeOrgFont: (family) =>
        set((s) => ({
          orgFonts: s.orgFonts.filter((f) => f.family !== family),
        })),

      updateIconApproved: (brandId, library, names) =>
        set((s) => ({
          brands: s.brands.map((b) => {
            if (b.id !== brandId) return b;
            const existing = b.icons?.approvedIcons ?? [];
            const updated = existing.some((a) => a.library === library)
              ? existing.map((a) => a.library === library ? { library, names } : a)
              : [...existing, { library, names }];
            return { ...b, icons: { ...b.icons, approvedIcons: updated }, updatedAt: new Date().toISOString() };
          }),
        })),

      addCustomIcon: (brandId, icon) =>
        set((s) => ({
          brands: s.brands.map((b) =>
            b.id !== brandId ? b : {
              ...b,
              icons: { ...b.icons, customIcons: [...(b.icons?.customIcons ?? []), icon] },
              updatedAt: new Date().toISOString(),
            },
          ),
        })),

      removeCustomIcon: (brandId, iconId) =>
        set((s) => ({
          brands: s.brands.map((b) =>
            b.id !== brandId ? b : {
              ...b,
              icons: { ...b.icons, customIcons: (b.icons?.customIcons ?? []).filter((i) => i.id !== iconId) },
              updatedAt: new Date().toISOString(),
            },
          ),
        })),

      updateCustomIcon: (brandId, iconId, patch) =>
        set((s) => ({
          brands: s.brands.map((b) =>
            b.id !== brandId ? b : {
              ...b,
              icons: {
                ...b.icons,
                customIcons: (b.icons?.customIcons ?? []).map((i) => i.id === iconId ? { ...i, ...patch } : i),
              },
              updatedAt: new Date().toISOString(),
            },
          ),
        })),

      addBrandPlatform: (brandId, platform) =>
        set((s) => ({
          brands: s.brands.map((b) =>
            b.id !== brandId ? b : {
              ...b,
              platforms: [...(b.platforms ?? []), platform],
              updatedAt: new Date().toISOString(),
            },
          ),
        })),

      updateBrandPlatform: (brandId, platformId, patch) =>
        set((s) => ({
          brands: s.brands.map((b) =>
            b.id !== brandId ? b : {
              ...b,
              platforms: (b.platforms ?? []).map((p) => p.id === platformId ? { ...p, ...patch } : p),
              updatedAt: new Date().toISOString(),
            },
          ),
        })),

      removeBrandPlatform: (brandId, platformId) =>
        set((s) => ({
          brands: s.brands.map((b) =>
            b.id !== brandId ? b : {
              ...b,
              platforms: (b.platforms ?? []).filter((p) => p.id !== platformId),
              updatedAt: new Date().toISOString(),
            },
          ),
        })),

      addBreakpoint: (brandId, platformId, bp) =>
        set((s) => ({
          brands: s.brands.map((b) =>
            b.id !== brandId ? b : {
              ...b,
              platforms: (b.platforms ?? []).map((p) =>
                p.id !== platformId ? p : { ...p, breakpoints: [...p.breakpoints, bp] },
              ),
              updatedAt: new Date().toISOString(),
            },
          ),
        })),

      updateBreakpoint: (brandId, platformId, bpId, patch) =>
        set((s) => ({
          brands: s.brands.map((b) =>
            b.id !== brandId ? b : {
              ...b,
              platforms: (b.platforms ?? []).map((p) =>
                p.id !== platformId ? p : {
                  ...p,
                  breakpoints: p.breakpoints.map((bp) => bp.id === bpId ? { ...bp, ...patch } : bp),
                },
              ),
              updatedAt: new Date().toISOString(),
            },
          ),
        })),

      removeBreakpoint: (brandId, platformId, bpId) =>
        set((s) => ({
          brands: s.brands.map((b) =>
            b.id !== brandId ? b : {
              ...b,
              platforms: (b.platforms ?? []).map((p) =>
                p.id !== platformId ? p : {
                  ...p,
                  breakpoints: p.breakpoints.filter((bp) => bp.id !== bpId),
                },
              ),
              updatedAt: new Date().toISOString(),
            },
          ),
        })),

      setPrimaryColorShade: (brandId, shade) =>
        set((s) => ({
          brands: s.brands.map((b) => {
            if (b.id !== brandId) return b;
            const nextShade = SCALE_STEPS[SCALE_STEPS.indexOf(shade) + 1] ?? shade;
            const brandingColl = b.collections.find((c) => c.id.startsWith('colors-branding'));
            const primaryHex = brandingColl?.tokens.find((t) => t.cssVariable === `--color-primary-${shade}`)?.values?.default?.raw;
            const hoverHex = brandingColl?.tokens.find((t) => t.cssVariable === `--color-primary-${nextShade}`)?.values?.default?.raw;
            if (!primaryHex || !hoverHex) return b;

            const updatedCollections = b.collections.map((c) => {
              if (brandingColl && c.id === brandingColl.id) {
                const badge = brandingColl.tokens.find((t) => t.description)?.description ?? 'Brand primary color';
                return {
                  ...c,
                  tokens: c.tokens.map((t) => ({
                    ...t,
                    description: t.cssVariable === `--color-primary-${shade}` ? badge : undefined,
                  })),
                };
              }
              if (c.id.startsWith('shadcn-ui')) {
                return {
                  ...c,
                  tokens: c.tokens.map((t) => {
                    if (t.cssVariable === '--color-primary')
                      return { ...t, values: { light: { raw: primaryHex }, dark: { raw: primaryHex } } };
                    if (t.cssVariable === '--color-hover-primary')
                      return { ...t, values: { light: { raw: hoverHex }, dark: { raw: hoverHex } } };
                    if (t.cssVariable === '--color-ring')
                      return { ...t, values: { light: { raw: primaryHex }, dark: { raw: primaryHex } } };
                    if (t.cssVariable === '--color-sidebar-primary')
                      return { ...t, values: { light: { raw: primaryHex }, dark: { raw: primaryHex } } };
                    return t;
                  }),
                };
              }
              return c;
            });

            return { ...b, primaryColorShade: shade, collections: updatedCollections, updatedAt: new Date().toISOString() };
          }),
        })),

      setSecondaryColorShade: (brandId, shade) =>
        set((s) => ({
          brands: s.brands.map((b) => {
            if (b.id !== brandId) return b;
            const brandingColl = b.collections.find((c) => c.id.startsWith('colors-branding'));
            const secondaryHex = brandingColl?.tokens.find((t) => t.cssVariable === `--color-secondary-${shade}`)?.values?.default?.raw;
            if (!secondaryHex) return b;

            const updatedCollections = b.collections.map((c) => {
              if (brandingColl && c.id === brandingColl.id) {
                const badge = brandingColl.tokens.find((t) => t.cssVariable?.startsWith('--color-secondary-') && t.description)?.description ?? 'Brand secondary color';
                return {
                  ...c,
                  tokens: c.tokens.map((t) => ({
                    ...t,
                    description: t.cssVariable?.startsWith('--color-secondary-')
                      ? (t.cssVariable === `--color-secondary-${shade}` ? badge : undefined)
                      : t.description,
                  })),
                };
              }
              if (c.id.startsWith('shadcn-ui')) {
                return {
                  ...c,
                  tokens: c.tokens.map((t) => {
                    if (t.cssVariable === '--color-secondary')
                      return { ...t, values: { light: { raw: secondaryHex }, dark: { raw: secondaryHex } } };
                    if (t.cssVariable === '--color-secondary-foreground')
                      return { ...t, values: { light: { raw: '#fafafa' }, dark: { raw: '#fafafa' } } };
                    return t;
                  }),
                };
              }
              return c;
            });

            return { ...b, secondaryColorShade: shade, collections: updatedCollections, updatedAt: new Date().toISOString() };
          }),
        })),
    }),
    {
      name: 'dtb-v3',
      version: 8,
      migrate: (state: unknown, version: number) => {
        const s = state as { brands: Brand[]; activeBrandId: string; schemaVersion: number; orgFonts: GoogleFont[] };
        if (version < 4) {
          s.brands = s.brands.map((brand) => {
            const hasIconSizes = brand.collections.some((c) => c.id.startsWith('icons-sizes'));
            const hasIconColors = brand.collections.some((c) => c.id.startsWith('icons-colors'));
            const suffix = brand.id;
            const extras: Collection[] = [];
            if (!hasIconSizes) {
              extras.push({
                ...structuredClone(iconSizesCollection),
                id: `icons-sizes-${suffix}`,
                tokens: iconSizesCollection.tokens.map((t) => ({ ...structuredClone(t), id: `${t.id}-${suffix}` })),
              });
            }
            if (!hasIconColors) {
              extras.push({
                ...structuredClone(iconColorsCollection),
                id: `icons-colors-${suffix}`,
                tokens: iconColorsCollection.tokens.map((t) => ({ ...structuredClone(t), id: `${t.id}-${suffix}` })),
              });
            }
            if (extras.length === 0) return brand;
            return { ...brand, collections: [...brand.collections, ...extras] };
          });
        }
        if (version < 5) {
          // Standardise primary-600 as the semantic primary, primary-800 as hover, for all brands
          s.brands = s.brands.map((brand) => {
            const brandingColl = brand.collections.find((c) => c.id.startsWith('colors-branding'));
            const p600 = brandingColl?.tokens.find((t) => t.cssVariable === '--color-primary-600')?.values?.default?.raw;
            const p800 = brandingColl?.tokens.find((t) => t.cssVariable === '--color-primary-800')?.values?.default?.raw;

            return {
              ...brand,
              collections: brand.collections.map((c) => {
                // Move "brand primary" description badge to primary-600
                if (brandingColl && c.id === brandingColl.id) {
                  return {
                    ...c,
                    tokens: c.tokens.map((t) => {
                      if (t.cssVariable === '--color-primary-600') {
                        const existing = brandingColl.tokens.find(
                          (bt) => bt.cssVariable !== '--color-primary-600' && bt.description,
                        );
                        return { ...t, description: existing?.description ?? t.description };
                      }
                      if (t.description && t.cssVariable !== '--color-primary-600') {
                        return { ...t, description: undefined };
                      }
                      return t;
                    }),
                  };
                }
                // Update semantic primary color values in shadcn-ui collection
                if (c.id.startsWith('shadcn-ui') && p600 && p800) {
                  return {
                    ...c,
                    tokens: c.tokens.map((t) => {
                      if (t.cssVariable === '--color-primary')
                        return { ...t, values: { light: { raw: p600 }, dark: { raw: p600 } } };
                      if (t.cssVariable === '--color-hover-primary')
                        return { ...t, values: { light: { raw: p800 }, dark: { raw: p800 } } };
                      if (t.cssVariable === '--color-ring')
                        return { ...t, values: { light: { raw: p600 }, dark: { raw: p600 } } };
                      if (t.cssVariable === '--color-sidebar-primary')
                        return { ...t, values: { light: { raw: p600 }, dark: { raw: p600 } } };
                      return t;
                    }),
                  };
                }
                return c;
              }),
            };
          });
        }
        if (version < 6) {
          s.brands = s.brands.map((brand) => {
            // Determine the correct primary shade per brand
            const targetShade = brand.id === '12victory' ? '800'
              : brand.id === 'j-lek' ? '600'
              : (brand as Brand & { primaryColorShade?: string }).primaryColorShade ?? '600';
            const nextShade = SCALE_STEPS[SCALE_STEPS.indexOf(targetShade) + 1] ?? targetShade;

            const brandingColl = brand.collections.find((c) => c.id.startsWith('colors-branding'));
            const primaryHex = brandingColl?.tokens.find((t) => t.cssVariable === `--color-primary-${targetShade}`)?.values?.default?.raw;
            const hoverHex = brandingColl?.tokens.find((t) => t.cssVariable === `--color-primary-${nextShade}`)?.values?.default?.raw;

            const updatedCollections = brand.collections.map((c) => {
              if (brandingColl && c.id === brandingColl.id) {
                const badge = brandingColl.tokens.find((t) => t.description)?.description;
                return {
                  ...c,
                  tokens: c.tokens.map((t) => ({
                    ...t,
                    description: t.cssVariable === `--color-primary-${targetShade}` ? badge : undefined,
                  })),
                };
              }
              if (c.id.startsWith('shadcn-ui') && primaryHex && hoverHex) {
                return {
                  ...c,
                  tokens: c.tokens.map((t) => {
                    if (t.cssVariable === '--color-primary')
                      return { ...t, values: { light: { raw: primaryHex }, dark: { raw: primaryHex } } };
                    if (t.cssVariable === '--color-hover-primary')
                      return { ...t, values: { light: { raw: hoverHex }, dark: { raw: hoverHex } } };
                    if (t.cssVariable === '--color-ring')
                      return { ...t, values: { light: { raw: primaryHex }, dark: { raw: primaryHex } } };
                    if (t.cssVariable === '--color-sidebar-primary')
                      return { ...t, values: { light: { raw: primaryHex }, dark: { raw: primaryHex } } };
                    return t;
                  }),
                };
              }
              return c;
            });

            return { ...brand, primaryColorShade: targetShade, collections: updatedCollections };
          });
        }
        if (version < 7) {
          s.brands = s.brands.map((brand) => {
            if (brand.id !== 'j-lek') return brand;
            const brandingColl = brand.collections.find((c) => c.id.startsWith('colors-branding'));
            const secondaryHex = brandingColl?.tokens.find((t) => t.cssVariable === '--color-secondary-500')?.values?.default?.raw ?? '#67091D';

            const updatedCollections = brand.collections.map((c) => {
              if (brandingColl && c.id === brandingColl.id) {
                return {
                  ...c,
                  tokens: c.tokens.map((t) => ({
                    ...t,
                    description: t.cssVariable === '--color-secondary-500'
                      ? 'J-lek brand secondary maroon'
                      : t.cssVariable?.startsWith('--color-secondary-') ? undefined : t.description,
                  })),
                };
              }
              if (c.id.startsWith('shadcn-ui')) {
                return {
                  ...c,
                  tokens: c.tokens.map((t) => {
                    if (t.cssVariable === '--color-secondary')
                      return { ...t, values: { light: { raw: secondaryHex }, dark: { raw: secondaryHex } } };
                    if (t.cssVariable === '--color-secondary-foreground')
                      return { ...t, values: { light: { raw: '#fafafa' }, dark: { raw: '#fafafa' } } };
                    return t;
                  }),
                };
              }
              return c;
            });

            return { ...brand, secondaryColorShade: '500', collections: updatedCollections };
          });
        }
        if (version < 8) {
          s.brands = s.brands.map((brand) => {
            const existingLucide = brand.icons?.approvedIcons?.find(
              (a) => a.library === 'Lucide Icons',
            );
            if (existingLucide?.names?.length) return brand;
            const otherApproved = brand.icons?.approvedIcons?.filter(
              (a) => a.library !== 'Lucide Icons',
            ) ?? [];
            return {
              ...brand,
              icons: {
                ...brand.icons,
                approvedIcons: [...otherApproved, { library: 'Lucide Icons', names: LUCIDE_DEFAULT_ICONS }],
              },
            };
          });
        }
        return s;
      },
    },
  ),
);
