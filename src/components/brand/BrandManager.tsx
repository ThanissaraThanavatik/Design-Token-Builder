import { useState } from 'react';
import { Plus, Copy, Trash2, Upload, Pencil, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBrandStore } from '@/store/brandStore';
import { generateId } from '@/lib/utils';
import { exportBrandJSON, parseBrandJSON } from '@/lib/storage';
import { generateColorScale } from '@/lib/color-generator';

interface BrandManagerProps {
  open: boolean;
  onClose: () => void;
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

const PREVIEW_STEPS = ['50', '200', '500', '700', '950'];

export function BrandManager({ open, onClose }: BrandManagerProps) {
  const {
    brands, activeBrandId,
    duplicateBrand, deleteBrand, setActiveBrand, importBrand,
    updateBrandMeta, updateBrandCollections,
    setPrimaryColorShade, setSecondaryColorShade,
  } = useBrandStore();

  const [newBrandName, setNewBrandName] = useState('');
  const [primaryHex, setPrimaryHex] = useState('#6200ee');
  const [hasSecondary, setHasSecondary] = useState(false);
  const [secondaryHex, setSecondaryHex] = useState('#03dac6');
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
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        title="Rename brand"
                        onClick={() => startRename(brand)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        title="Export JSON"
                        onClick={() => exportBrandJSON(brand)}
                      >
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
            {/* Brand Name */}
            <div className="space-y-1.5">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                autoFocus
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="My Brand"
                onKeyDown={(e) => e.key === 'Enter' && newBrandName.trim() && isValidHex(primaryHex) && handleCreate()}
              />
            </div>

            {/* Primary Color */}
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
                {PREVIEW_STEPS.map((step) => {
                  const entry = primaryScale.find((s) => s.step === step);
                  return (
                    <div key={step} className="flex-1 space-y-0.5">
                      <div className="h-6 rounded" style={{ backgroundColor: entry?.hex ?? '#888' }} title={`${step}: ${entry?.hex}`} />
                      <p className="text-[9px] text-muted-foreground text-center">{step}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Secondary Color (optional) */}
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
                    {PREVIEW_STEPS.map((step) => {
                      const entry = secondaryScale.find((s) => s.step === step);
                      return (
                        <div key={step} className="flex-1 space-y-0.5">
                          <div className="h-6 rounded" style={{ backgroundColor: entry?.hex ?? '#888' }} title={`${step}: ${entry?.hex}`} />
                          <p className="text-[9px] text-muted-foreground text-center">{step}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button variant="outline" onClick={() => { resetCreateForm(); setMode('list'); }} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                className="flex-1"
                disabled={!newBrandName.trim() || !isValidHex(primaryHex)}
              >
                Create Brand
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
