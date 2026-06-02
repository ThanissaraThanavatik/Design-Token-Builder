import { useState, useEffect, useMemo, useRef } from 'react';
import { X, Wand2 } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTokenStore } from '@/store/tokenStore';
import { generateColorScale, contrastRatio, wcagLabel } from '@/lib/color-generator';
import { getContrastColor, generateId, isValidHex } from '@/lib/utils';
import type { Collection } from '@/types/token';

interface Props {
  open: boolean;
  onClose: () => void;
  collection: Collection;
  initialGroupName?: string;
  initialBaseHex?: string;
}

function WcagBadge({ ratio }: { ratio: number }) {
  const label = wcagLabel(ratio);
  if (!label) return <span className="w-8" />;
  return (
    <span
      className={`text-[9px] font-bold px-1 py-0.5 rounded leading-none ${
        label === 'AAA'
          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
          : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
      }`}
    >
      {label}
    </span>
  );
}

export function ColorGeneratorDialog({ open, onClose, collection, initialGroupName = 'Primary', initialBaseHex = '#6200ee' }: Props) {
  const { deleteGroup, addTokensBatch } = useTokenStore();

  const [groupName, setGroupName] = useState(initialGroupName);
  const [baseHex, setBaseHex] = useState(initialBaseHex);
  const [hexInput, setHexInput] = useState(initialBaseHex);
  const [cssPrefix, setCssPrefix] = useState(() => `--color-${initialGroupName.toLowerCase().replace(/\s+/g, '-')}-`);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGroupName(initialGroupName);
    setBaseHex(initialBaseHex);
    setHexInput(initialBaseHex);
    setCssPrefix(`--color-${initialGroupName.toLowerCase().replace(/\s+/g, '-')}-`);
  }, [initialGroupName, initialBaseHex, open]);

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    function handler(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPicker]);

  const scale = useMemo(() => generateColorScale(baseHex), [baseHex]);

  const hasDarkMode = collection.modes.includes('dark');
  const tokenMode: 'light' | 'default' = hasDarkMode ? 'light' : 'default';

  function handleGroupNameChange(val: string) {
    setGroupName(val);
    // Only auto-sync prefix if it still matches the old auto-derived value
    const expected = `--color-${groupName.toLowerCase().replace(/\s+/g, '-')}-`;
    if (cssPrefix === expected) {
      setCssPrefix(`--color-${val.toLowerCase().replace(/\s+/g, '-')}-`);
    }
  }

  function handleHexInput(val: string) {
    setHexInput(val);
    if (isValidHex(val)) setBaseHex(val);
  }

  function handlePickerChange(hex: string) {
    setBaseHex(hex);
    setHexInput(hex);
  }

  function handleApply() {
    if (!groupName.trim() || scale.length === 0) return;
    const name = groupName.trim();
    const prefix = cssPrefix.trim().endsWith('-') ? cssPrefix.trim() : `${cssPrefix.trim()}-`;

    // Replace existing group tokens if the group exists
    const groupExists = collection.tokens.some((t) => t.group === name);
    if (groupExists) deleteGroup(collection.id, name);

    addTokensBatch(
      collection.id,
      scale.map(({ step, hex }) => ({
        id: generateId('token'),
        name: `${name.toLowerCase()}-${step}`,
        cssVariable: `${prefix}${step}`,
        type: 'color' as const,
        values: { [tokenMode]: { raw: hex } },
        group: name,
      })),
    );
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-[520px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Wand2 className="size-4 text-primary" />
            <span className="font-semibold text-sm">Color Scale Generator</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {/* Config */}
        <div className="px-5 py-3 border-b border-border space-y-3 shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Group Name</Label>
              <Input
                value={groupName}
                onChange={(e) => handleGroupNameChange(e.target.value)}
                placeholder="Primary"
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">CSS Prefix</Label>
              <Input
                value={cssPrefix}
                onChange={(e) => setCssPrefix(e.target.value)}
                placeholder="--color-primary-"
                className="h-7 text-xs font-mono"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs shrink-0">Base Color (500)</Label>
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setShowPicker((v) => !v)}
                className="w-7 h-7 rounded-md border border-border shadow-sm shrink-0 transition-shadow hover:shadow-md"
                style={{ backgroundColor: baseHex }}
                title="Pick color"
              />
              {showPicker && (
                <div className="absolute left-0 top-9 z-10 shadow-xl rounded-lg overflow-hidden border border-border">
                  <HexColorPicker color={baseHex} onChange={handlePickerChange} />
                </div>
              )}
            </div>
            <Input
              value={hexInput}
              onChange={(e) => handleHexInput(e.target.value)}
              placeholder="#6200ee"
              className="h-7 text-xs font-mono w-28"
              spellCheck={false}
            />
            <span className="text-xs text-muted-foreground ml-auto">vs ⬛ &nbsp;&nbsp; vs ⬜</span>
          </div>
        </div>

        {/* Scale preview */}
        <div className="flex-1 overflow-y-auto">
          {scale.map(({ step, hex }) => {
            const fg = getContrastColor(hex);
            const vsBlack = contrastRatio(hex, '#000000');
            const vsWhite = contrastRatio(hex, '#ffffff');
            const isBase = step === '500';
            return (
              <div key={step} className={`flex items-stretch border-b border-border/50 last:border-0 ${isBase ? 'ring-inset ring-1 ring-primary/40' : ''}`}>
                {/* Step label */}
                <div className="w-20 shrink-0 flex items-center px-3 py-1">
                  <span className={`text-xs font-mono ${isBase ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                    {groupName.toLowerCase() || 'color'}-{step}
                  </span>
                </div>

                {/* Swatch */}
                <div
                  className="flex-1 flex items-center px-3"
                  style={{ backgroundColor: hex, minHeight: '40px' }}
                >
                  <span className="text-[11px] font-mono" style={{ color: fg }}>
                    {hex.toUpperCase()}
                  </span>
                  {isBase && (
                    <span className="ml-2 text-[10px] font-semibold opacity-70" style={{ color: fg }}>base</span>
                  )}
                </div>

                {/* Contrast vs black */}
                <div className="w-20 shrink-0 flex items-center justify-end gap-1 px-2 border-l border-border/30">
                  <WcagBadge ratio={vsBlack} />
                  <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{vsBlack.toFixed(1)}</span>
                </div>

                {/* Contrast vs white */}
                <div className="w-20 shrink-0 flex items-center justify-end gap-1 px-2 border-l border-border/30">
                  <WcagBadge ratio={vsWhite} />
                  <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{vsWhite.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0 bg-muted/20">
          <p className="text-[10px] text-muted-foreground">
            {scale.length} shades · contrast vs ⬛ and vs ⬜
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={handleApply}
              disabled={!groupName.trim() || scale.length === 0}
            >
              <Wand2 className="size-3" />
              Apply to Collection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
