import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ColorPickerPopover } from './ColorPickerPopover';
import { FontPicker } from '@/components/brand-docs/FontPicker';
import { extractFontFamily, extractFallback, formatFontFamily } from '@/lib/google-fonts';
import { cn, isColorValue } from '@/lib/utils';
import type { Token, TokenMode } from '@/types/token';
import { useTokenStore } from '@/store/tokenStore';

interface TokenValueCellProps {
  token: Token;
  collectionId: string;
  mode: TokenMode;
  className?: string;
}

export function TokenValueCell({ token, collectionId, mode, className }: TokenValueCellProps) {
  const { updateTokenValue } = useTokenStore();
  const val = token.values[mode];
  const rawValue = val?.raw ?? '';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(rawValue);

  const isColor = token.type === 'color' || isColorValue(rawValue);
  const isRef = rawValue.startsWith('var(--');
  const isFontFamily = token.type === 'string' && token.group === 'Font Family';

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

  return (
    <div className={cn('flex items-center gap-2 min-w-0', className)}>
      {isColor && !isRef && (
        <ColorPickerPopover
          value={rawValue}
          onChange={(hex) => updateTokenValue(collectionId, token.id, mode, hex)}
        />
      )}
      {isRef && (
        <span className="size-6 rounded border border-dashed border-border shrink-0 flex items-center justify-center text-xs text-muted-foreground">
          ↗
        </span>
      )}
      {isFontFamily && !isRef ? (
        <FontPicker
          value={extractFontFamily(rawValue)}
          onChange={(family) => {
            if (!family) return;
            const fallback = extractFallback(rawValue);
            updateTokenValue(collectionId, token.id, mode, formatFontFamily(family, fallback));
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
