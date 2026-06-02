import { useState } from 'react';
import { Trash2, Pencil, Check, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { BrandPlatform, ScreenBreakpoint, PlatformType } from '@/types/brand';
import {
  PLATFORM_LABELS,
  PLATFORM_ICONS,
  makeDefaultPlatform,
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

const COL_HEADER = 'grid grid-cols-[90px_52px_52px_40px_56px_52px_24px] gap-1.5';

function BreakpointDisplayRow({ bp }: { bp: ScreenBreakpoint }) {
  const dash = (v?: number) => v !== undefined ? String(v) : '—';
  return (
    <div className={cn(COL_HEADER, 'items-center text-xs font-mono')}>
      <span className="font-medium text-foreground">{bp.name}</span>
      <span className="text-muted-foreground">{dash(bp.minWidth)}</span>
      <span className="text-muted-foreground">{dash(bp.maxWidth)}</span>
      <span className="text-muted-foreground">{dash(bp.columns)}</span>
      <span className="text-foreground">{dash(bp.margin)}</span>
      <span className="text-foreground">{dash(bp.gutter)}</span>
      <span />
    </div>
  );
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
    <div className={cn(COL_HEADER, 'items-center')}>
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
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none">{icon}</span>
          <span className="text-xs font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            title={isEditing ? 'Done editing' : 'Edit breakpoints'}
            onClick={() => setIsEditing((v) => !v)}
          >
            {isEditing ? <Check className="size-3" /> : <Pencil className="size-3" />}
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

      {/* Card body */}
      <div className="px-3 py-2 space-y-2">
        {/* Spacing base — always editable */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Spacing base:</span>
          <Input
            className="h-6 text-xs font-mono w-14 px-1.5"
            value={numField(platform.spacingBase)}
            onChange={(e) => onUpdate({ spacingBase: parseNum(e.target.value) ?? 8 })}
          />
          <span className="text-xs text-muted-foreground">pt</span>
        </div>

        {/* Breakpoint table */}
        {platform.breakpoints.length > 0 && (
          <div className="space-y-1">
            <div className={cn(COL_HEADER, 'text-[10px] text-muted-foreground px-0.5')}>
              <span>Name</span>
              <span>Min px</span>
              <span>Max px</span>
              <span>Cols</span>
              <span>Margin</span>
              <span>Gutter</span>
              <span />
            </div>
            {platform.breakpoints.map((bp) =>
              isEditing ? (
                <BreakpointRow
                  key={bp.id}
                  bp={bp}
                  onUpdate={(patch) => onUpdateBreakpoint(bp.id, patch)}
                  onRemove={() => onRemoveBreakpoint(bp.id)}
                />
              ) : (
                <BreakpointDisplayRow key={bp.id} bp={bp} />
              ),
            )}
          </div>
        )}

        {/* Add breakpoint — only in edit mode */}
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-6 mt-0.5"
            onClick={addEmptyRow}
          >
            <Plus className="size-3" />
            Add breakpoint
          </Button>
        )}
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
  function addPlatform(type: PlatformType) {
    const defaults = makeDefaultPlatform(type);
    onAdd({
      id: Math.random().toString(36).slice(2),
      ...defaults,
    });
  }

  return (
    <div className="space-y-4">
      {/* Platform type selector */}
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Select the platforms you're designing for:</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_PLATFORM_TYPES.map((type) => {
            const isAdded = platforms.some((p) => p.type === type);
            return (
              <button
                key={type}
                disabled={isAdded}
                onClick={() => !isAdded && addPlatform(type)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors',
                  isAdded
                    ? 'bg-primary/10 border-primary/30 text-primary cursor-default'
                    : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer',
                )}
              >
                <span>{PLATFORM_ICONS[type]}</span>
                <span>{PLATFORM_LABELS[type]}</span>
                {isAdded && <CheckCircle2 className="size-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Platform cards */}
      {platforms.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No platforms configured yet. Select one above to see its default screen spec.
        </p>
      ) : (
        <div className="space-y-3">
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
        </div>
      )}
    </div>
  );
}
