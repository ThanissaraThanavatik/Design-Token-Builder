import { useState } from 'react';
import { Copy, Trash2, CopyPlus, ChevronDown } from 'lucide-react';
import { cn, copyToClipboard } from '@/lib/utils';
import type { Token, TokenMode, BreakpointMode } from '@/types/token';
import { useTokenStore } from '@/store/tokenStore';
import { useBrandStore } from '@/store/brandStore';
import { TokenValueCell } from './TokenValueCell';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface TokenRowProps {
  token: Token;
  collectionId: string;
  showDark: boolean;
  hasDarkMode: boolean;
  activeBreakpoint: BreakpointMode | null;
}

export function TokenRow({ token, collectionId, showDark, hasDarkMode, activeBreakpoint }: TokenRowProps) {
  const { updateTokenName, deleteToken, duplicateToken } = useTokenStore();
  const { activeBrandId, setPrimaryColorShade, setSecondaryColorShade } = useBrandStore();
  const [editingName, setEditingName] = useState(false);

  const isPrimaryToken = collectionId.startsWith('colors-branding') && /^--color-primary-\d+$/.test(token.cssVariable);
  const isSecondaryToken = collectionId.startsWith('colors-branding') && /^--color-secondary-\d+$/.test(token.cssVariable);
  const isBrandingToken = isPrimaryToken || isSecondaryToken;
  const role: 'primary' | 'secondary' | null = token.description
    ? (isPrimaryToken ? 'primary' : 'secondary')
    : null;
  const [nameDraft, setNameDraft] = useState(token.name);
  const [hovered, setHovered] = useState(false);

  const lightMode: TokenMode = 'light';
  const darkMode: TokenMode = 'dark';
  const defaultMode: TokenMode = 'default';

  function commitName() {
    if (nameDraft && nameDraft !== token.name) {
      const newCssVar = token.cssVariable.replace(token.name, nameDraft);
      updateTokenName(collectionId, token.id, nameDraft, newCssVar);
    }
    setEditingName(false);
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 border-b border-border/50 group transition-colors text-sm',
        hovered ? 'bg-muted/50' : 'hover:bg-muted/30',
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Name */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {editingName ? (
          <Input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitName();
              if (e.key === 'Escape') { setNameDraft(token.name); setEditingName(false); }
            }}
            className="h-6 text-xs font-mono px-1.5 py-0 max-w-48"
          />
        ) : (
          <button
            className="font-mono text-xs text-foreground truncate hover:text-primary transition-colors text-left"
            onClick={() => { setNameDraft(token.name); setEditingName(true); }}
            title={token.cssVariable}
          >
            {token.name}
          </button>
        )}
        {token.description && (
          <span className="text-xs text-muted-foreground truncate hidden group-hover:inline">{token.description}</span>
        )}
      </div>

      {/* Light / Default value */}
      <div className="w-40 shrink-0">
        <TokenValueCell
          token={token}
          collectionId={collectionId}
          mode={hasDarkMode ? lightMode : defaultMode}
        />
      </div>

      {/* Dark value (only if collection has dark mode) */}
      {hasDarkMode && showDark && (
        <div className="w-40 shrink-0">
          <TokenValueCell token={token} collectionId={collectionId} mode={darkMode} />
        </div>
      )}

      {/* Breakpoint value (when a breakpoint is active) */}
      {activeBreakpoint && (
        <div className="w-40 shrink-0 ring-1 ring-blue-500/30 rounded">
          <TokenValueCell token={token} collectionId={collectionId} mode={activeBreakpoint} />
        </div>
      )}

      {/* Type badge */}
      <Badge variant="outline" className="text-xs hidden group-hover:flex shrink-0 font-mono">
        {token.type}
      </Badge>

      {/* Actions */}
      <div className={cn('flex items-center gap-1 shrink-0 transition-opacity', hovered ? 'opacity-100' : 'opacity-0')}>
        {isBrandingToken && (
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              'flex items-center gap-0.5 h-6 px-1.5 rounded text-xs font-semibold transition-colors',
              role === 'primary'
                ? 'bg-primary/10 text-primary'
                : role === 'secondary'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                  : 'text-muted-foreground hover:bg-muted',
            )}>
              {role === 'primary' ? 'P' : role === 'secondary' ? 'S' : '·'}
              <ChevronDown className="size-2.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              {isPrimaryToken && (
                <DropdownMenuItem onClick={() => {
                  const shade = token.cssVariable.replace('--color-primary-', '');
                  setPrimaryColorShade(activeBrandId, shade);
                }}>
                  {role === 'primary' ? '★ Current Primary' : '★ Set as Primary'}
                </DropdownMenuItem>
              )}
              {isSecondaryToken && (
                <DropdownMenuItem onClick={() => {
                  const shade = token.cssVariable.replace('--color-secondary-', '');
                  setSecondaryColorShade(activeBrandId, shade);
                }}>
                  {role === 'secondary' ? '◆ Current Secondary' : '◆ Set as Secondary'}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <button
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Copy CSS variable"
          onClick={() => copyToClipboard(token.cssVariable)}
        >
          <Copy className="size-3.5" />
        </button>
        <button
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Duplicate"
          onClick={() => duplicateToken(collectionId, token.id)}
        >
          <CopyPlus className="size-3.5" />
        </button>
        <button
          className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
          title="Delete"
          onClick={() => deleteToken(collectionId, token.id)}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
