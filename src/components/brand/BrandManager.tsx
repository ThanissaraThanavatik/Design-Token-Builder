import { useState } from 'react';
import { Plus, Copy, Trash2, Upload, Pencil, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBrandStore } from '@/store/brandStore';
import { generateId, cn } from '@/lib/utils';
import { exportBrandJSON, parseBrandJSON } from '@/lib/storage';
import { generateColorScale } from '@/lib/color-generator';
import type { PlatformType } from '@/types/brand';
import {
  PLATFORM_LABELS,
  PLATFORM_ICONS,
  makeDefaultPlatform,
  DEFAULT_BREAKPOINTS,
} from '@/data/platform-defaults';
import { FontPicker } from '@/components/brand-docs/FontPicker';

const PANGRAM_LATIN = 'The quick brown fox jumps over the lazy dog';
const PANGRAM_THAI  = 'ฟักทองใหญ่วางบนถาดไม้ — เส้นทางแห่งความสำเร็จ';

interface BrandManagerProps {
  open: boolean;
  onClose: () => void;
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function formatWidth(min?: number, max?: number): string {
  if (min !== undefined && max !== undefined) return `${min}–${max}`;
  if (min !== undefined) return `≥ ${min}`;
  if (max !== undefined) return `≤ ${max}`;
  return '—';
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

const PREVIEW_STEPS = ['50', '200', '500', '700', '950'];

const ALL_PLATFORM_TYPES: PlatformType[] = [
  'website',
  'web-app',
  'mobile-app',
  'line-oa',
  'dashboard',
  'other',
];

type RadiusPreset = 'flat' | 'rounded' | 'smooth' | 'pill' | 'custom';

const DEFAULT_CUSTOM: Record<string, string> = {
  sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px',
};

const RADIUS_PRESETS: Record<Exclude<RadiusPreset, 'custom'>, {
  label: string;
  description: string;
  preview: string;
  branded: Record<string, string>;
  tokens: Record<string, string>;
}> = {
  flat: {
    label: 'Flat',
    description: 'Sharp corners — technical, precise',
    preview: '2px',
    branded: { sm: '2px', md: '4px', lg: '4px', xl: '6px', full: '9999px' },
    tokens: {
      none: '0px', xs: '1px', sm: '2px', md: '4px', lg: '4px',
      xl: '6px', '2xl': '8px', '3xl': '8px', '4xl': '8px', full: '9999px',
    },
  },
  rounded: {
    label: 'Rounded',
    description: 'Balanced corners — approachable, modern',
    preview: '8px',
    branded: { sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px' },
    tokens: {
      none: '0px', xs: '2px', sm: '4px', md: '6px', lg: '8px',
      xl: '12px', '2xl': '16px', '3xl': '20px', '4xl': '24px', full: '9999px',
    },
  },
  smooth: {
    label: 'Smooth',
    description: 'Generous corners — friendly, soft',
    preview: '16px',
    branded: { sm: '8px', md: '12px', lg: '16px', xl: '20px', full: '9999px' },
    tokens: {
      none: '0px', xs: '4px', sm: '8px', md: '12px', lg: '16px',
      xl: '20px', '2xl': '24px', '3xl': '32px', '4xl': '40px', full: '9999px',
    },
  },
  pill: {
    label: 'Pill',
    description: 'Very rounded — playful, bold',
    preview: '24px',
    branded: { sm: '16px', md: '24px', lg: '32px', xl: '40px', full: '9999px' },
    tokens: {
      none: '0px', xs: '8px', sm: '16px', md: '24px', lg: '32px',
      xl: '40px', '2xl': '48px', '3xl': '56px', '4xl': '64px', full: '9999px',
    },
  },
};

export function BrandManager({ open, onClose }: BrandManagerProps) {
  const {
    brands, activeBrandId,
    duplicateBrand, deleteBrand, setActiveBrand, importBrand,
    updateBrandMeta, updateBrandCollections,
    setPrimaryColorShade, setSecondaryColorShade,
    addBrandPlatform,
  } = useBrandStore();

  const [newBrandName, setNewBrandName] = useState('');
  const [primaryHex, setPrimaryHex] = useState('#6200ee');
  const [hasSecondary, setHasSecondary] = useState(false);
  const [secondaryHex, setSecondaryHex] = useState('#03dac6');
  const [fontFamily, setFontFamily] = useState('');
  const [radiusPreset, setRadiusPreset] = useState<RadiusPreset | null>(null);
  const [customBranded, setCustomBranded] = useState<Record<string, string>>(DEFAULT_CUSTOM);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([]);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const primaryScale = generateColorScale(primaryHex);
  const secondaryScale = generateColorScale(secondaryHex);

  function resetCreateForm() {
    setNewBrandName('');
    setPrimaryHex('#6200ee');
    setHasSecondary(false);
    setSecondaryHex('#03dac6');
    setFontFamily('');
    setRadiusPreset(null);
    setCustomBranded(DEFAULT_CUSTOM);
    setSelectedPlatforms([]);
    setStep(1);
  }

  function togglePlatform(type: PlatformType) {
    setSelectedPlatforms((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  function startRename(brand: { id: string; name: string }) {
    setEditingId(brand.id);
    setEditingName(brand.name);
  }

  function confirmRename() {
    if (!editingId || !editingName.trim()) return;
    updateBrandMeta(editingId, { name: editingName.trim(), slug: toSlug(editingName.trim()) });
    setEditingId(null);
    setEditingName('');
  }

  function cancelRename() {
    setEditingId(null);
    setEditingName('');
  }

  function handleCreate() {
    if (!newBrandName.trim() || !isValidHex(primaryHex)) return;
    const id = generateId('brand');

    duplicateBrand(activeBrandId, newBrandName.trim(), id);

    const newBrand = useBrandStore.getState().brands.find((b) => b.id === id);
    if (newBrand) {
      const brandingCol = newBrand.collections.find((c) => c.id.startsWith('colors-branding'));
      if (brandingCol) {
        const newPrimaryTokens = primaryScale.map(({ step, hex }) => ({
          id: generateId('token'),
          name: `primary-${step}`,
          cssVariable: `--color-primary-${step}`,
          type: 'color' as const,
          values: { default: { raw: hex } },
          group: 'Primary',
        }));

        let updatedTokens = brandingCol.tokens.filter((t) => t.group !== 'Primary');

        if (hasSecondary && isValidHex(secondaryHex)) {
          const newSecondaryTokens = secondaryScale.map(({ step, hex }) => ({
            id: generateId('token'),
            name: `secondary-${step}`,
            cssVariable: `--color-secondary-${step}`,
            type: 'color' as const,
            values: { default: { raw: hex } },
            group: 'Secondary',
          }));
          updatedTokens = [
            ...updatedTokens.filter((t) => t.group !== 'Secondary'),
            ...newPrimaryTokens,
            ...newSecondaryTokens,
          ];
        } else {
          updatedTokens = [...updatedTokens, ...newPrimaryTokens];
        }

        updateBrandCollections(id, newBrand.collections.map((c) =>
          c.id === brandingCol.id ? { ...c, tokens: updatedTokens } : c,
        ));
      }
    }

    // Reset wizard-step fields so skipped steps are truly empty, not inherited from template
    updateBrandMeta(id, { typography: { fontFamily: '' }, rounded: {}, platforms: [] });

    // Apply selected platform defaults
    selectedPlatforms.forEach((type) => {
      addBrandPlatform(id, {
        id: Math.random().toString(36).slice(2),
        ...makeDefaultPlatform(type),
      });
    });

    // Save font family
    if (fontFamily.trim()) {
      const currentTypo = useBrandStore.getState().brands.find(b => b.id === id)?.typography ?? { fontFamily: '' };
      updateBrandMeta(id, { typography: { ...currentTypo, fontFamily: fontFamily.trim() } });
    }

    // Save radius preset → brand.rounded metadata + tw-border-radius token collection
    if (radiusPreset) {
      const resolvedBranded =
        radiusPreset === 'custom' ? customBranded : RADIUS_PRESETS[radiusPreset].branded;
      const resolvedTokens =
        radiusPreset === 'custom' ? customBranded : RADIUS_PRESETS[radiusPreset].tokens;

      updateBrandMeta(id, { rounded: resolvedBranded });

      const freshBrand = useBrandStore.getState().brands.find(b => b.id === id);
      if (freshBrand) {
        const radiusCol = freshBrand.collections.find(c => c.id.startsWith('tw-border-radius'));
        if (radiusCol) {
          const updatedTokens = radiusCol.tokens.map(t => {
            const newVal = resolvedTokens[t.name];
            return newVal ? { ...t, values: { default: { raw: newVal } } } : t;
          });
          updateBrandCollections(id, freshBrand.collections.map(c =>
            c.id === radiusCol.id ? { ...c, tokens: updatedTokens } : c,
          ));
        }
      }
    }

    setActiveBrand(id);
    setPrimaryColorShade(id, '500');
    if (hasSecondary && isValidHex(secondaryHex)) setSecondaryColorShade(id, '500');

    resetCreateForm();
    setMode('list');
    onClose();
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const json = ev.target?.result as string;
        const brand = parseBrandJSON(json);
        if (brand) {
          importBrand(brand);
          setActiveBrand(brand.id);
          onClose();
        } else {
          alert('Invalid brand JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Brand Manager</DialogTitle>
        </DialogHeader>

        {mode === 'list' ? (
          <div className="space-y-3">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                {editingId === brand.id ? (
                  <>
                    <Input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmRename();
                        if (e.key === 'Escape') cancelRename();
                      }}
                      className="flex-1 h-7 text-sm"
                    />
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="size-7 hover:text-green-600" title="Confirm rename" onClick={confirmRename} disabled={!editingName.trim()}>
                        <Check className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-7" title="Cancel" onClick={cancelRename}>
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      className="flex-1 text-left"
                      onClick={() => { setActiveBrand(brand.id); onClose(); }}
                    >
                      <p className="font-medium text-sm">{brand.name}</p>
                      <p className="text-xs text-muted-foreground">{brand.collections.length} collections</p>
                    </button>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="size-7" title="Rename brand" onClick={() => startRename(brand)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-7" title="Export JSON" onClick={() => exportBrandJSON(brand)}>
                        <Upload className="size-3.5 rotate-180" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        title="Duplicate brand"
                        onClick={() => {
                          const id = generateId('brand');
                          duplicateBrand(brand.id, `${brand.name} Copy`, id);
                        }}
                      >
                        <Copy className="size-3.5" />
                      </Button>
                      {brands.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 hover:text-destructive"
                          title="Delete brand"
                          onClick={() => {
                            if (confirm(`Delete "${brand.name}"? This cannot be undone.`)) {
                              deleteBrand(brand.id);
                            }
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" className="flex-1 gap-1.5 text-sm" onClick={() => setMode('create')}>
                <Plus className="size-4" />
                New Brand
              </Button>
              <Button variant="outline" className="flex-1 gap-1.5 text-sm" onClick={handleImport}>
                <Upload className="size-4" />
                Import JSON
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step progress */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    step >= n ? 'bg-primary' : 'bg-muted',
                  )}
                />
              ))}
              <span className="text-[10px] text-muted-foreground ml-1 shrink-0">Step {step} of 4</span>
            </div>

            {/* Step 1 — Name + Colors */}
            {step === 1 && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input
                    id="brand-name"
                    autoFocus
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="My Brand"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newBrandName.trim() && isValidHex(primaryHex)) setStep(2);
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>
                    Primary Color <span className="text-destructive text-xs">required</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={isValidHex(primaryHex) ? primaryHex : '#6200ee'}
                      onChange={(e) => setPrimaryHex(e.target.value)}
                      className="h-8 w-8 rounded border border-border cursor-pointer p-0.5 bg-transparent shrink-0"
                    />
                    <Input
                      value={primaryHex}
                      onChange={(e) => {
                        const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setPrimaryHex(v);
                      }}
                      placeholder="#6200ee"
                      className="flex-1 h-8 font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-1">
                    {PREVIEW_STEPS.map((s) => {
                      const entry = primaryScale.find((e) => e.step === s);
                      return (
                        <div key={s} className="flex-1 space-y-0.5">
                          <div className="h-6 rounded" style={{ backgroundColor: entry?.hex ?? '#888' }} />
                          <p className="text-[9px] text-muted-foreground text-center">{s}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasSecondary}
                      onChange={(e) => setHasSecondary(e.target.checked)}
                      className="rounded"
                    />
                    Add Secondary Color <span className="text-xs text-muted-foreground">(optional)</span>
                  </label>
                  {hasSecondary && (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={isValidHex(secondaryHex) ? secondaryHex : '#03dac6'}
                          onChange={(e) => setSecondaryHex(e.target.value)}
                          className="h-8 w-8 rounded border border-border cursor-pointer p-0.5 bg-transparent shrink-0"
                        />
                        <Input
                          value={secondaryHex}
                          onChange={(e) => {
                            const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setSecondaryHex(v);
                          }}
                          placeholder="#03dac6"
                          className="flex-1 h-8 font-mono text-sm"
                        />
                      </div>
                      <div className="flex gap-1">
                        {PREVIEW_STEPS.map((s) => {
                          const entry = secondaryScale.find((e) => e.step === s);
                          return (
                            <div key={s} className="flex-1 space-y-0.5">
                              <div className="h-6 rounded" style={{ backgroundColor: entry?.hex ?? '#888' }} />
                              <p className="text-[9px] text-muted-foreground text-center">{s}</p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button variant="outline" onClick={() => { resetCreateForm(); setMode('list'); }} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    className="flex-1"
                    disabled={!newBrandName.trim() || !isValidHex(primaryHex)}
                  >
                    Next: Typography →
                  </Button>
                </div>
              </>
            )}

            {/* Step 2 — Typography */}
            {step === 2 && (
              <div className="space-y-3">
                <div>
                  <Label>Typography</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose your brand font. Refine the full type scale (H1 → caption) in Brand Docs.
                  </p>
                </div>

                <FontPicker value={fontFamily} onChange={setFontFamily} />

                {fontFamily ? (
                  <div
                    className="rounded-lg border border-border bg-muted/30 px-3 py-3 space-y-1.5"
                    style={{ fontFamily: `'${fontFamily}', sans-serif` }}
                  >
                    <p className="text-3xl font-medium leading-none tracking-tight">Aa</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{PANGRAM_LATIN}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{PANGRAM_THAI}</p>
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    You can skip this and set typography later in Brand Docs.
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">← Back</Button>
                  <Button
                    variant={fontFamily ? 'default' : 'outline'}
                    onClick={() => setStep(3)}
                    className="flex-1"
                  >
                    {fontFamily ? 'Next: Radius →' : 'Skip →'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 — Border Radius */}
            {step === 3 && (
              <div className="space-y-3">
                <div>
                  <Label>Border Radius</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sets your corner style across all components and applies values to the radius token scale.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(RADIUS_PRESETS) as [Exclude<RadiusPreset, 'custom'>, typeof RADIUS_PRESETS[Exclude<RadiusPreset, 'custom'>]][]).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => setRadiusPreset(radiusPreset === key ? null : key)}
                      className={cn(
                        'flex flex-col items-start gap-2 p-3 rounded-lg border text-left transition-colors',
                        radiusPreset === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50',
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 border-2',
                          radiusPreset === key ? 'bg-primary/20 border-primary/50' : 'bg-muted border-border',
                        )}
                        style={{ borderRadius: preset.preview }}
                      />
                      <div className="w-full">
                        <p className={cn('text-xs font-medium', radiusPreset === key ? 'text-primary' : '')}>
                          {preset.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight">{preset.description}</p>
                        <div className="grid grid-cols-5 gap-0.5 mt-2 pt-2 border-t border-border/40">
                          {Object.entries(preset.branded).map(([k, v]) => (
                            <div key={k} className="flex flex-col items-center gap-0.5">
                              <span className="text-[8px] text-muted-foreground uppercase tracking-wide">{k}</span>
                              <span className={cn('text-[9px] font-mono font-semibold', radiusPreset === key ? 'text-primary' : 'text-foreground')}>
                                {v === '9999px' ? '∞' : v.replace('px', '')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom option — full width */}
                <button
                  onClick={() => setRadiusPreset(radiusPreset === 'custom' ? null : 'custom')}
                  className={cn(
                    'w-full flex flex-col gap-2 p-3 rounded-lg border text-left transition-colors',
                    radiusPreset === 'custom'
                      ? 'border-primary bg-primary/5'
                      : 'border-dashed border-border hover:bg-muted/50',
                  )}
                >
                  <div>
                    <p className={cn('text-xs font-medium', radiusPreset === 'custom' ? 'text-primary' : '')}>
                      Custom
                    </p>
                    <p className="text-[10px] text-muted-foreground">Define exact pixel values for each size step.</p>
                  </div>
                  {radiusPreset === 'custom' && (
                    <div
                      className="grid grid-cols-5 gap-1.5 w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {Object.keys(DEFAULT_CUSTOM).map((key) => (
                        <div key={key} className="flex flex-col gap-1">
                          <span className="text-[8px] text-muted-foreground uppercase tracking-wide text-center">{key}</span>
                          <input
                            type="text"
                            value={customBranded[key] ?? ''}
                            onChange={(e) => setCustomBranded((prev) => ({ ...prev, [key]: e.target.value }))}
                            placeholder="8px"
                            className="h-7 w-full rounded-md border border-input bg-background px-1.5 text-center text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </button>

                <div className="flex gap-2 pt-1">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">← Back</Button>
                  <Button
                    variant={radiusPreset ? 'default' : 'outline'}
                    onClick={() => setStep(4)}
                    className="flex-1"
                  >
                    {radiusPreset ? 'Next: Platform →' : 'Skip →'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4 — Platform & Screens */}
            {step === 4 && (
              <div className="space-y-3">
                <div>
                  <Label>Platform & Screens</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select the platforms you're designing for. Breakpoints load with recommended defaults — adjust them in Brand Docs.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ALL_PLATFORM_TYPES.map((type) => {
                    const selected = selectedPlatforms.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => togglePlatform(type)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-colors',
                          selected
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                      >
                        <span>{PLATFORM_ICONS[type]}</span>
                        <span>{PLATFORM_LABELS[type]}</span>
                        {selected && <Check className="size-3" />}
                      </button>
                    );
                  })}
                </div>

                {selectedPlatforms.length > 0 && (
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
                    {selectedPlatforms.map((type) => (
                      <div key={type}>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 border-b border-border sticky top-0">
                          <span className="text-xs">{PLATFORM_ICONS[type]}</span>
                          <span className="text-xs font-medium">{PLATFORM_LABELS[type]}</span>
                        </div>
                        <table className="w-full text-[10px] font-mono">
                          <thead>
                            <tr className="text-muted-foreground border-b border-border/60">
                              <th className="text-left px-3 py-1 font-medium">Name</th>
                              <th className="text-right px-2 py-1 font-medium">Width (px)</th>
                              <th className="text-right px-2 py-1 font-medium">Cols</th>
                              <th className="text-right px-2 py-1 font-medium">Margin</th>
                              <th className="text-right px-3 py-1 font-medium">Gutter</th>
                            </tr>
                          </thead>
                          <tbody>
                            {DEFAULT_BREAKPOINTS[type].map((bp, i) => (
                              <tr key={i} className="border-b border-border/40 last:border-0">
                                <td className="px-3 py-1 font-sans font-medium text-foreground">{bp.name}</td>
                                <td className="px-2 py-1 text-right text-muted-foreground">{formatWidth(bp.minWidth, bp.maxWidth)}</td>
                                <td className="px-2 py-1 text-right text-muted-foreground">{bp.columns ?? '—'}</td>
                                <td className="px-2 py-1 text-right text-muted-foreground">{bp.margin ?? '—'}</td>
                                <td className="px-3 py-1 text-right text-muted-foreground">{bp.gutter ?? '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}

                {selectedPlatforms.length === 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    You can skip this and add platforms later in Brand Docs.
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">← Back</Button>
                  <Button
                    variant={selectedPlatforms.length > 0 ? 'default' : 'outline'}
                    onClick={handleCreate}
                    className="flex-1"
                  >
                    {selectedPlatforms.length > 0 ? 'Create Brand' : 'Skip & Create →'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
