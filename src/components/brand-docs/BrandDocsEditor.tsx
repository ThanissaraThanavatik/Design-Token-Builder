import { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Pencil, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBrandStore } from '@/store/brandStore';
import { useUIStore } from '@/store/uiStore';
import { useTokenStore } from '@/store/tokenStore';
import type { Brand } from '@/types/brand';
import type { Token } from '@/types/token';
import { FontPicker } from './FontPicker';
import { FontLibraryManager } from './FontLibraryManager';
import { LogoUploader } from './LogoUploader';
import { IconLibraryEditor } from './IconLibraryEditor';
import { PlatformsEditor } from './PlatformsEditor';
import { BrandSetupChecklist } from './BrandSetupChecklist';

type TypographySpec = NonNullable<Brand['typography']>['h1'];
type TypoKey = 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption';

function Section({ title, children, defaultOpen = true, id }: { title: string; children: React.ReactNode; defaultOpen?: boolean; id?: string }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/30 transition-colors text-sm font-medium text-left"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 pt-3 space-y-3">{children}</div>}
    </div>
  );
}

function KVTable({
  data,
  onChange,
  keyLabel = 'Token',
  valueLabel = 'Value',
}: {
  data: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  keyLabel?: string;
  valueLabel?: string;
}) {
  const entries = Object.entries(data);

  function update(idx: number, field: 'k' | 'v', val: string) {
    const next = [...entries];
    if (field === 'k') next[idx] = [val, next[idx][1]];
    else next[idx] = [next[idx][0], val];
    onChange(Object.fromEntries(next.filter(([k]) => k !== '')));
  }

  function remove(idx: number) {
    const next = entries.filter((_, i) => i !== idx);
    onChange(Object.fromEntries(next));
  }

  function add() {
    onChange({ ...data, '': '' });
  }

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs text-muted-foreground px-1">
        <span>{keyLabel}</span><span>{valueLabel}</span><span />
      </div>
      {entries.map(([k, v], idx) => (
        <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
          <Input
            className="h-7 text-xs font-mono"
            value={k}
            onChange={(e) => update(idx, 'k', e.target.value)}
          />
          <Input
            className="h-7 text-xs font-mono"
            value={v}
            onChange={(e) => update(idx, 'v', e.target.value)}
          />
          <Button
            size="icon"
            variant="ghost"
            className="size-7 hover:text-destructive shrink-0"
            onClick={() => remove(idx)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7 mt-1" onClick={add}>
        <Plus className="size-3.5" />
        Add row
      </Button>
    </div>
  );
}

function ColorStrip({ tokens, primaryCssVar }: { tokens: Token[]; primaryCssVar?: string }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {tokens.map((t) => {
        const hex = t.values['default']?.raw ?? t.values['light']?.raw ?? '';
        const shade = t.name.split('-').pop() ?? t.name;
        const isPrimary = primaryCssVar ? t.cssVariable === primaryCssVar : t.name.includes('500');
        return (
          <div
            key={t.id}
            className="flex flex-col items-center gap-1"
            title={`${shade}: ${hex}`}
          >
            <div
              className={`rounded-md border border-black/10 ${isPrimary ? 'w-10 h-10 ring-2 ring-offset-1 ring-primary/60' : 'w-8 h-8'}`}
              style={{ backgroundColor: hex }}
            />
            <span className="text-[10px] text-muted-foreground font-mono">{shade}</span>
          </div>
        );
      })}
    </div>
  );
}

const SEMANTIC_VARS = [
  { label: 'Background', cssVar: '--color-background' },
  { label: 'Foreground', cssVar: '--color-foreground' },
  { label: 'Accent', cssVar: '--color-accent' },
  { label: 'Text Muted', cssVar: '--color-muted-foreground' },
  { label: 'Border', cssVar: '--color-border' },
  { label: 'Primary', cssVar: '--color-primary' },
];

const TYPO_KEYS: TypoKey[] = ['h1', 'h2', 'h3', 'body', 'label', 'caption'];

export function BrandDocsEditor() {
  const {
    brands,
    activeBrandId,
    updateBrandMeta,
    addBrandPlatform,
    updateBrandPlatform,
    removeBrandPlatform,
    addBreakpoint,
    updateBreakpoint,
    removeBreakpoint,
  } = useBrandStore();
  const { setActivePanel } = useUIStore();
  const { selectCollection } = useTokenStore();
  const brand = brands.find((b) => b.id === activeBrandId);

  const save = useCallback(
    (patch: Partial<Omit<Brand, 'collections' | 'id'>>) => {
      updateBrandMeta(activeBrandId, patch);
    },
    [activeBrandId, updateBrandMeta],
  );

  if (!brand) return null;

  const typo = brand.typography ?? { fontFamily: '' };

  function updateTypoKey(key: TypoKey, field: keyof NonNullable<TypographySpec>, value: string) {
    const existing = typo[key] ?? {};
    save({
      typography: {
        ...typo,
        [key]: { ...existing, [field]: field === 'fontWeight' ? Number(value) || value : value },
      },
    });
  }

  // Color collections — single branding collection with multiple groups
  const brandingCol = brand.collections.find((c) => c.id.startsWith('colors-branding'));
  const shadcnCol = brand.collections.find((c) => c.id.startsWith('shadcn'));

  // Group tokens by group field; preserve insertion order
  const colorGroups = useMemo(() => {
    const colorTokens = (brandingCol?.tokens ?? []).filter((t) => t.type === 'color');
    const map = new Map<string, typeof colorTokens>();
    for (const t of colorTokens) {
      const g = t.group ?? 'Default';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(t);
    }
    return Array.from(map.entries());
  }, [brandingCol]);

  const semanticColorMap: Record<string, string> = {};
  if (shadcnCol) {
    for (const t of shadcnCol.tokens) {
      semanticColorMap[t.cssVariable] = t.values['light']?.raw ?? t.values['default']?.raw ?? '';
    }
  }

  function goEditColors(collectionId: string) {
    setActivePanel('editor');
    selectCollection(collectionId);
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">Brand Documentation</h2>
          <p className="text-xs text-muted-foreground">
            This data powers the <strong>DESIGN.md</strong> export used by WordPress and design teams.
            Token collections (CSS variables) are edited in the <strong>Editor</strong> tab.
          </p>
        </div>

        <BrandSetupChecklist
          brand={brand}
          onNavigate={(sectionId) => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Brand Assets */}
        <Section title="Brand Assets" id="section-assets">
          <div className="divide-y divide-border -my-1">
            <LogoUploader
              label="Full Logo"
              hint="Header, footer, OG images"
              value={brand.assets.logoFull}
              onChange={(v) => save({ assets: { ...brand.assets, logoFull: v } })}
              onClear={() => save({ assets: { ...brand.assets, logoFull: undefined } })}
            />
            <LogoUploader
              label="Logo Mark"
              hint="App icon, favicon"
              value={brand.assets.logoMark}
              onChange={(v) => save({ assets: { ...brand.assets, logoMark: v } })}
              onClear={() => save({ assets: { ...brand.assets, logoMark: undefined } })}
            />
            <LogoUploader
              label="Logo Wordmark"
              hint="Text-only variant"
              value={brand.assets.logoWordmark}
              onChange={(v) => save({ assets: { ...brand.assets, logoWordmark: v } })}
              onClear={() => save({ assets: { ...brand.assets, logoWordmark: undefined } })}
            />
          </div>
        </Section>

        {/* Colors */}
        <Section title="Colors" id="section-colors">
          <div className="space-y-4">
            {/* Dynamic groups from colors/branding collection */}
            {colorGroups.map(([groupLabel, tokens]) => {
              const gl = groupLabel.toLowerCase();
              const activeShade =
                gl === 'primary' ? brand.primaryColorShade
                : gl === 'secondary' ? brand.secondaryColorShade
                : undefined;
              const markedToken = activeShade
                ? tokens.find((t) => t.cssVariable.endsWith(`-${activeShade}`))
                : undefined;
              const primaryCssVar = (markedToken ?? tokens.find((t) => t.cssVariable.endsWith('-500')) ?? tokens[Math.floor(tokens.length / 2)])?.cssVariable;
              return (
                <div key={groupLabel} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{groupLabel} Scale</p>
                    {brandingCol && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 gap-1 text-xs text-muted-foreground hover:text-foreground px-2"
                        onClick={() => goEditColors(brandingCol.id)}
                      >
                        <Pencil className="size-3" />
                        Edit in Editor
                      </Button>
                    )}
                  </div>
                  <ColorStrip tokens={tokens} primaryCssVar={primaryCssVar} />
                </div>
              );
            })}

            {/* Semantic colors */}
            {shadcnCol && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Semantic Colors</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 gap-1 text-xs text-muted-foreground hover:text-foreground px-2"
                    onClick={() => goEditColors(shadcnCol.id)}
                  >
                    <Pencil className="size-3" />
                    Edit in Editor
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {SEMANTIC_VARS.map(({ label, cssVar }) => {
                    const hex = semanticColorMap[cssVar] ?? '';
                    if (!hex) return null;
                    return (
                      <div key={cssVar} className="flex items-center gap-2 min-w-[120px]">
                        <div
                          className="w-6 h-6 rounded-md border border-black/10 shrink-0"
                          style={{ backgroundColor: hex }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium leading-tight truncate">{label}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{hex}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Overview */}
        <Section title="Overview">
          <textarea
            className="w-full min-h-[80px] resize-y rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            value={brand.overview ?? ''}
            onChange={(e) => save({ overview: e.target.value })}
            placeholder="Brand description…"
          />
        </Section>

        {/* Font Library */}
        <Section title="Font Library">
          <FontLibraryManager />
        </Section>

        {/* Typography */}
        <Section title="Typography" id="section-typography">
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Font Family</Label>
              <FontPicker
                value={typo.fontFamily}
                onChange={(family) => save({ typography: { ...typo, fontFamily: family } })}
              />
            </div>
            <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] gap-2 text-xs text-muted-foreground px-1 mt-3">
              <span>Style</span><span>Size</span><span>Weight</span><span>Line Height</span><span>Letter Spacing</span>
            </div>
            {TYPO_KEYS.map((key) => {
              const spec = typo[key];
              return (
                <div key={key} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] gap-2 items-center">
                  <span className="text-xs font-medium text-muted-foreground uppercase">{key}</span>
                  <Input
                    className="h-7 text-xs font-mono"
                    value={spec?.fontSize ?? ''}
                    onChange={(e) => updateTypoKey(key, 'fontSize', e.target.value)}
                    placeholder="1rem"
                  />
                  <Input
                    className="h-7 text-xs font-mono"
                    value={spec?.fontWeight ?? ''}
                    onChange={(e) => updateTypoKey(key, 'fontWeight', e.target.value)}
                    placeholder="400"
                  />
                  <Input
                    className="h-7 text-xs font-mono"
                    value={spec?.lineHeight ?? ''}
                    onChange={(e) => updateTypoKey(key, 'lineHeight', e.target.value)}
                    placeholder="1.5"
                  />
                  <Input
                    className="h-7 text-xs font-mono"
                    value={spec?.letterSpacing ?? ''}
                    onChange={(e) => updateTypoKey(key, 'letterSpacing', e.target.value)}
                    placeholder="tight"
                  />
                </div>
              );
            })}
          </div>
        </Section>

        {/* Icons */}
        <Section title="Icons" defaultOpen={false} id="section-icons">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Libraries by Platform</p>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs h-7"
                onClick={() => setActivePanel('icons')}
              >
                <Library className="size-3.5" />
                Browse Icons
              </Button>
            </div>
            <IconLibraryEditor
              libraries={brand.icons?.libraries ?? []}
              onChange={(v) => save({ icons: { ...brand.icons, libraries: v } })}
            />
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">Icon Size Scale</p>
              {(() => {
                const col = brand.collections.find((c) => c.id.startsWith('icons-sizes'));
                return col ? (
                  <p className="text-xs text-muted-foreground">
                    Managed as tokens.{' '}
                    <button
                      className="underline hover:text-foreground transition-colors"
                      onClick={() => goEditColors(col.id)}
                    >
                      Edit in Icons / Sizes collection →
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">No icon sizes collection found.</p>
                );
              })()}
            </div>
          </div>
        </Section>

        {/* Rounded */}
        <Section title="Rounded Corners" defaultOpen={false} id="section-rounded">
          <KVTable
            data={brand.rounded ?? {}}
            onChange={(v) => save({ rounded: v })}
            keyLabel="Token (sm/md/lg…)"
            valueLabel="Value (px)"
          />
        </Section>

        {/* Spacing */}
        <Section title="Spacing" defaultOpen={false}>
          <KVTable
            data={brand.spacing ?? {}}
            onChange={(v) => save({ spacing: v })}
            keyLabel="Token (4/8/16…)"
            valueLabel="Value (4px/8px…)"
          />
        </Section>

        {/* Shadows */}
        <Section title="Shadows" defaultOpen={false} id="section-shadows">
          <KVTable
            data={brand.shadow ?? {}}
            onChange={(v) => save({ shadow: v })}
            keyLabel="Name (soft/hover…)"
            valueLabel="CSS shadow value"
          />
        </Section>

        {/* Motion */}
        <Section title="Motion" defaultOpen={false}>
          <KVTable
            data={brand.motion ?? {}}
            onChange={(v) => save({ motion: v })}
            keyLabel="Name"
            valueLabel="Duration / value"
          />
        </Section>

        {/* Platforms & Screens */}
        <Section title="Platforms & Screens" defaultOpen={false} id="section-platforms">
          <PlatformsEditor
            platforms={brand.platforms ?? []}
            onAdd={(p) => addBrandPlatform(brand.id, p)}
            onUpdate={(pid, patch) => updateBrandPlatform(brand.id, pid, patch)}
            onRemove={(pid) => removeBrandPlatform(brand.id, pid)}
            onAddBreakpoint={(pid, bp) => addBreakpoint(brand.id, pid, bp)}
            onUpdateBreakpoint={(pid, bpId, patch) => updateBreakpoint(brand.id, pid, bpId, patch)}
            onRemoveBreakpoint={(pid, bpId) => removeBreakpoint(brand.id, pid, bpId)}
          />
        </Section>
      </div>
    </ScrollArea>
  );
}
