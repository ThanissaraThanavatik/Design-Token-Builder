import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ColorPickerPopover } from './ColorPickerPopover';
import { FontPicker } from '@/components/brand-docs/FontPicker';
import type { FontTokenOption } from '@/components/brand-docs/FontPicker';
import { extractFontFamily, extractFallback, formatFontFamily } from '@/lib/google-fonts';
import { cn, isColorValue } from '@/lib/utils';
import type { Token, TokenMode } from '@/types/token';
import { useTokenStore } from '@/store/tokenStore';
import { useBrandStore } from '@/store/brandStore';

interface TokenValueCellProps {
  token: Token;
  collectionId: string;
  mode: TokenMode;
  className?: string;
}

export function TokenValueCell({ token, collectionId, mode, className }: TokenValueCellProps) {
  const { updateTokenValue } = useTokenStore();
  const { brands, activeBrandId } = useBrandStore();
  const val = token.values[mode];
  const rawValue = val?.raw ?? '';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(rawValue);

  const isColor = token.type === 'color' || isColorValue(rawValue);
  const isRef = rawValue.startsWith('var(--');
  const isFontFamily = token.type === 'string' && token.group === 'Font Family';

  // Collect font-family tokens from the active brand for token-to-token references
  const fontTokenOptions: FontTokenOption[] = isFontFamily
    ? (brands.find((b) => b.id === activeBrandId)?.collections ?? [])
        .flatMap((col) => col.tokens)
        .filter((t) => t.group === 'Font Family' && t.id !== token.id)
        .map((t) => {
          const firstVal = Object.values(t.values)[0]?.raw ?? '';
          return {
            label: t.name,
            cssVar: `var(${t.cssVariable})`,
            previewFamily: extractFontFamily(firstVal),
          };
        })
    : [];

  function commitEdit() {
    if (draft !== rawValue) {
      updateTokenValue(collectionId, token.id, mode, draft);
    }
    setEditing(false);
  }

  if (!val) {
    return (
      <div className={cn('flex items-center gap-2 text-muted-foreground text-xs italic', className)}>
        —
      </div>
    );
  }

  // Derive the value to pass to FontPicker (plain name or var reference)
  const fontPickerValue = isFontFamily
    ? (isRef ? rawValue : extractFontFamily(rawValue))
    : '';

  return (
    <div className={cn('flex items-center gap-2 min-w-0', className)}>
      {isColor && !isRef && (
        <ColorPickerPopover
          value={rawValue}
          onChange={(hex) => updateTokenValue(collectionId, token.id, mode, hex)}
        />
      )}
      {isRef && !isFontFamily && (
        <span className="size-6 rounded border border-dashed border-border shrink-0 flex items-center justify-center text-xs text-muted-foreground">
          ↗
        </span>
      )}
      {isFontFamily ? (
        <FontPicker
          value={fontPickerValue}
          tokenOptions={fontTokenOptions}
          onChange={(picked) => {
            if (!picked) return;
            if (picked.startsWith('var(--')) {
              // Token reference — store as-is
              updateTokenValue(collectionId, token.id, mode, picked);
            } else {
              // Direct font name — preserve the generic fallback
              const fallback = isRef ? 'sans-serif' : extractFallback(rawValue);
              updateTokenValue(collectionId, token.id, mode, formatFontFamily(picked, fallback));
            }
          }}
        />
      ) : editing ? (
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit();
            if (e.key === 'Escape') { setDraft(rawValue); setEditing(false); }
          }}
          className="h-6 text-xs font-mono px-1.5 py-0"
        />
      ) : (
        <button
          onClick={() => { setDraft(rawValue); setEditing(true); }}
          className="text-xs font-mono text-left truncate hover:text-foreground text-muted-foreground transition-colors min-w-0"
          title={rawValue}
        >
          {rawValue || <span className="italic opacity-50">empty</span>}
        </button>
      )}
    </div>
  );
}
