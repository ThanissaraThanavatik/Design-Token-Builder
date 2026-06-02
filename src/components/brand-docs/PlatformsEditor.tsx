import { useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BrandPlatform, ScreenBreakpoint, PlatformType } from '@/types/brand';
import {
  PLATFORM_LABELS,
  PLATFORM_ICONS,
  makeDefaultPlatform,
  makeRecommendedBreakpoints,
} from '@/data/platform-defaults';

const ALL_PLATFORM_TYPES: PlatformType[] = [
  'website',
  'web-app',
  'mobile-app',
  'line-oa',
  'dashboard',
  'other',
];

interface Props {
  platforms: BrandPlatform[];
  onAdd: (p: BrandPlatform) => void;
  onUpdate: (platformId: string, patch: Partial<BrandPlatform>) => void;
  onRemove: (platformId: string) => void;
  onAddBreakpoint: (platformId: string, bp: ScreenBreakpoint) => void;
  onUpdateBreakpoint: (platformId: string, bpId: string, patch: Partial<ScreenBreakpoint>) => void;
  onRemoveBreakpoint: (platformId: string, bpId: string) => void;
}

function numField(val: number | undefined): string {
  return val !== undefined ? String(val) : '';
}

function parseNum(s: string): number | undefined {
  const n = parseInt(s, 10);
  return isNaN(n) ? undefined : n;
}

function BreakpointRow({
  bp,
  onUpdate,
  onRemove,
}: {
  bp: ScreenBreakpoint;
  onUpdate: (patch: Partial<ScreenBreakpoint>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-[90px_64px_64px_48px_56px_56px_auto] gap-1.5 items-center">
      <Input
        className="h-6 text-xs font-mono px-1.5"
        value={bp.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        placeholder="name"
      />
      <Input
        className="h-6 text-xs font-mono px-1.5"
        value={numField(bp.minWidth)}
        onChange={(e) => onUpdate({ minWidth: parseNum(e.target.value) })}
        placeholder="—"
      />
      <Input
        className="h-6 text-xs font-mono px-1.5"
        value={numField(bp.maxWidth)}
        onChange={(e) => onUpdate({ maxWidth: parseNum(e.target.value) })}
        placeholder="—"
      />
      <Input
        className="h-6 text-xs font-mono px-1.5"
        value={numField(bp.columns)}
        onChange={(e) => onUpdate({ columns: parseNum(e.target.value) })}
        placeholder="—"
      />
      <Input
        className="h-6 text-xs font-mono px-1.5"
        value={numField(bp.margin)}
        onChange={(e) => onUpdate({ margin: parseNum(e.target.value) })}
        placeholder="—"
      />
      <Input
        className="h-6 text-xs font-mono px-1.5"
        value={numField(bp.gutter)}
        onChange={(e) => onUpdate({ gutter: parseNum(e.target.value) })}
        placeholder="—"
      />
      <Button
        size="icon"
        variant="ghost"
        className="size-6 hover:text-destructive shrink-0"
        onClick={onRemove}
      >
        <Trash2 className="size-3" />
      </Button>
    </div>
  );
}

function PlatformCard({
  platform,
  onUpdate,
  onRemove,
  onAddBreakpoint,
  onUpdateBreakpoint,
  onRemoveBreakpoint,
}: {
  platform: BrandPlatform;
  onUpdate: (patch: Partial<BrandPlatform>) => void;
  onRemove: () => void;
  onAddBreakpoint: (bp: ScreenBreakpoint) => void;
  onUpdateBreakpoint: (bpId: string, patch: Partial<ScreenBreakpoint>) => void;
  onRemoveBreakpoint: (bpId: string) => void;
}) {
  const icon = PLATFORM_ICONS[platform.type];
  const label = platform.label ?? PLATFORM_LABELS[platform.type];

  function addEmptyRow() {
    onAddBreakpoint({
      id: Math.random().toString(36).slice(2),
      name: '',
      columns: 12,
      margin: 16,
      gutter: 16,
    });
  }

  function loadRecommended() {
    onUpdate({ breakpoints: makeRecommendedBreakpoints(platform.type) });
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none">{icon}</span>
          <Input
            className="h-6 text-xs font-medium bg-transparent border-transparent hover:border-border focus:border-border px-1.5 min-w-0 w-auto"
            value={label}
            onChange={(e) => onUpdate({ label: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 gap-1 text-xs text-muted-foreground hover:text-foreground px-2"
            onClick={loadRecommended}
          >
            <RefreshCw className="size-3" />
            Load recommended
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-6 hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>

      <div className="px-3 py-2 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Spacing base:</span>
          <Input
            className="h-6 text-xs font-mono w-14 px-1.5"
            value={numField(platform.spacingBase)}
            onChange={(e) => onUpdate({ spacingBase: parseNum(e.target.value) ?? 8 })}
          />
          <span className="text-xs text-muted-foreground">pt</span>
        </div>

        {platform.breakpoints.length > 0 && (
          <div className="space-y-1">
            <div className="grid grid-cols-[90px_64px_64px_48px_56px_56px_auto] gap-1.5 text-[10px] text-muted-foreground px-0.5">
              <span>Name</span>
              <span>Min px</span>
              <span>Max px</span>
              <span>Cols</span>
              <span>Margin</span>
              <span>Gutter</span>
              <span />
            </div>
            {platform.breakpoints.map((bp) => (
              <BreakpointRow
                key={bp.id}
                bp={bp}
                onUpdate={(patch) => onUpdateBreakpoint(bp.id, patch)}
                onRemove={() => onRemoveBreakpoint(bp.id)}
              />
            ))}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-6 mt-0.5"
          onClick={addEmptyRow}
        >
          <Plus className="size-3" />
          Add breakpoint
        </Button>
      </div>
    </div>
  );
}

export function PlatformsEditor({
  platforms,
  onAdd,
  onUpdate,
  onRemove,
  onAddBreakpoint,
  onUpdateBreakpoint,
  onRemoveBreakpoint,
}: Props) {
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  function addPlatform(type: PlatformType) {
    const defaults = makeDefaultPlatform(type);
    onAdd({
      id: Math.random().toString(36).slice(2),
      ...defaults,
    });
    setShowTypeMenu(false);
  }

  return (
    <div className="space-y-3">
      {platforms.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No platforms configured. Add a platform to specify screen breakpoints and spacing rules.
        </p>
      )}

      {platforms.map((platform) => (
        <PlatformCard
          key={platform.id}
          platform={platform}
          onUpdate={(patch) => onUpdate(platform.id, patch)}
          onRemove={() => onRemove(platform.id)}
          onAddBreakpoint={(bp) => onAddBreakpoint(platform.id, bp)}
          onUpdateBreakpoint={(bpId, patch) => onUpdateBreakpoint(platform.id, bpId, patch)}
          onRemoveBreakpoint={(bpId) => onRemoveBreakpoint(platform.id, bpId)}
        />
      ))}

      <div className="relative w-fit">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-7"
          onClick={() => setShowTypeMenu((v) => !v)}
        >
          <Plus className="size-3.5" />
          Add Platform
        </Button>
        {showTypeMenu && (
          <div className="absolute left-0 top-full mt-1 z-50 bg-popover border border-border rounded-md shadow-md py-1 min-w-[160px]">
            {ALL_PLATFORM_TYPES.map((type) => (
              <button
                key={type}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted/60 transition-colors text-left"
                onClick={() => addPlatform(type)}
              >
                <span>{PLATFORM_ICONS[type]}</span>
                <span>{PLATFORM_LABELS[type]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
