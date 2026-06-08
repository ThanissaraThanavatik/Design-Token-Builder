import { useRef, useState, useMemo } from 'react';
import { Pencil, Trash2, Plus, Check, X, Wand2 } from 'lucide-react';
import type { Collection, BreakpointMode } from '@/types/token';
import { isBreakpointMode } from '@/types/token';
import { TokenRow } from './TokenRow';
import { CollectionHeader } from './CollectionHeader';
import { ColorGeneratorDialog } from './ColorGeneratorDialog';
import { useUIStore } from '@/store/uiStore';
import { useTokenStore } from '@/store/tokenStore';
import { generateId } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TokenListProps {
  collection: Collection;
}

interface GroupHeaderProps {
  groupName: string;
  collectionId: string;
  tokenMode: 'light' | 'default';
  groupPrefix: string;
  collection: Collection;
  base500Hex?: string;
}

function GroupHeader({ groupName, collectionId, tokenMode, groupPrefix, collection, base500Hex }: GroupHeaderProps) {
  const { renameGroup, deleteGroup, addToken } = useTokenStore();
  const [hovered, setHovered] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState(groupName);
  const [addingToken, setAddingToken] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [generatorOpen, setGeneratorOpen] = useState(false);

  function commitRename() {
    const name = renameDraft.trim();
    if (name && name !== groupName) renameGroup(collectionId, groupName, name);
    setRenaming(false);
  }

  function handleDelete() {
    if (confirm(`Delete group "${groupName}" and all its tokens?`)) {
      deleteGroup(collectionId, groupName);
    }
  }

  function handleAddToGroup() {
    if (!newTokenName.trim()) return;
    const name = newTokenName.trim();
    addToken(collectionId, {
      id: generateId('token'),
      name: `${groupPrefix}${name}`,
      cssVariable: `--color-${groupPrefix.replace(/^--color-/, '')}${name}`,
      type: 'color',
      values: { [tokenMode]: { raw: '#000000' } },
      group: groupName,
    });
    setNewTokenName('');
    setAddingToken(false);
  }

  return (
    <div
      className="px-3 py-1 border-b border-border/50 sticky top-0 z-10 backdrop-blur-sm bg-muted/10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); }}
    >
      {renaming ? (
        <div className="flex items-center gap-1.5">
          <Input
            autoFocus
            value={renameDraft}
            onChange={(e) => setRenameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') { setRenameDraft(groupName); setRenaming(false); }
            }}
            className="h-6 text-xs font-semibold w-32 px-1.5"
          />
          <button className="p-0.5 hover:text-primary" onClick={commitRename}><Check className="size-3" /></button>
          <button className="p-0.5 hover:text-muted-foreground" onClick={() => { setRenameDraft(groupName); setRenaming(false); }}><X className="size-3" /></button>
        </div>
      ) : addingToken ? (
        <div className="flex items-center gap-1.5 py-0.5">
          <span className="text-xs font-semibold text-muted-foreground">{groupName}</span>
          <span className="text-xs font-mono text-muted-foreground">+</span>
          <Input
            autoFocus
            value={newTokenName}
            onChange={(e) => setNewTokenName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddToGroup();
              if (e.key === 'Escape') { setNewTokenName(''); setAddingToken(false); }
            }}
            placeholder="token-name"
            className="h-5 text-xs font-mono w-28 px-1.5 py-0"
          />
          <button className="p-0.5 hover:text-primary" onClick={handleAddToGroup}><Check className="size-3" /></button>
          <button className="p-0.5 hover:text-muted-foreground" onClick={() => { setNewTokenName(''); setAddingToken(false); }}><X className="size-3" /></button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-muted-foreground flex-1">{groupName}</span>
            <div className={cn('flex items-center gap-0.5 transition-opacity', hovered ? 'opacity-100' : 'opacity-0')}>
              <button
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"
                title="Regenerate scale with Color Generator"
                onClick={() => setGeneratorOpen(true)}
              >
                <Wand2 className="size-3" />
              </button>
              <button
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Add token to group"
                onClick={() => setAddingToken(true)}
              >
                <Plus className="size-3" />
              </button>
              <button
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Rename group"
                onClick={() => { setRenameDraft(groupName); setRenaming(true); }}
              >
                <Pencil className="size-3" />
              </button>
              <button
                className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                title="Delete group"
                onClick={handleDelete}
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          </div>
          <ColorGeneratorDialog
            open={generatorOpen}
            onClose={() => setGeneratorOpen(false)}
            collection={collection}
            initialGroupName={groupName}
            initialBaseHex={base500Hex ?? '#6200ee'}
          />
        </>
      )}
    </div>
  );
}

const BREAKPOINT_MIN_LABEL: Record<BreakpointMode, string> = {
  xs: 'xs', sm: 'sm · 480', md: 'md · 768', lg: 'lg · 1024',
  xl: 'xl · 1280', '2xl': '2xl · 1440', '3xl': '3xl · 1920',
};

export function TokenList({ collection }: TokenListProps) {
  const { searchQuery, previewMode, setPreviewMode } = useUIStore();
  const parentRef = useRef<HTMLDivElement>(null);
  const [activeBreakpoint, setActiveBreakpoint] = useState<BreakpointMode | null>(null);

  const hasDarkMode = collection.modes.includes('dark');
  const showDark = hasDarkMode && previewMode === 'dark';
  const hasBreakpoints = collection.modes.some(isBreakpointMode);
  const tokenMode: 'light' | 'default' = hasDarkMode ? 'light' : 'default';

  // Reset active breakpoint if breakpoints disabled
  if (activeBreakpoint && !hasBreakpoints) {
    setActiveBreakpoint(null);
  }

  const filteredTokens = useMemo(() => {
    if (!searchQuery) return collection.tokens;
    const q = searchQuery.toLowerCase();
    return collection.tokens.filter(
      (t) => t.name.toLowerCase().includes(q) || t.cssVariable.toLowerCase().includes(q),
    );
  }, [collection.tokens, searchQuery]);

  const groupedEntries = useMemo(() => {
    const groups: Record<string, typeof filteredTokens> = {};
    for (const t of filteredTokens) {
      const g = t.group ?? '—';
      groups[g] = groups[g] ? [...groups[g], t] : [t];
    }
    return Object.entries(groups);
  }, [filteredTokens]);

  function inferGroupPrefix(groupTokens: typeof filteredTokens): string {
    const first = groupTokens[0];
    if (!first) return collection.prefix;
    const parts = first.cssVariable.split('-');
    parts.pop();
    return parts.join('-') + '-';
  }

  function inferBase500Hex(groupTokens: typeof filteredTokens): string | undefined {
    const t500 = groupTokens.find((t) => t.cssVariable.endsWith('-500'));
    return t500?.values['default']?.raw ?? t500?.values['light']?.raw;
  }

  return (
    <div className="flex flex-col h-full">
      <CollectionHeader
        collection={collection}
        showDark={showDark}
        onToggleDark={() => setPreviewMode(previewMode === 'dark' ? 'light' : 'dark')}
        activeBreakpoint={activeBreakpoint}
        onBreakpointChange={setActiveBreakpoint}
      />

      {/* Column headers */}
      <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-muted-foreground border-b border-border bg-muted/20 shrink-0">
        <div className="flex-1">Name</div>
        <div className="w-40 shrink-0">{hasDarkMode ? 'Light' : 'Value'}</div>
        {hasDarkMode && showDark && <div className="w-40 shrink-0">Dark</div>}
        {activeBreakpoint && (
          <div className="w-40 shrink-0 text-blue-500">{BREAKPOINT_MIN_LABEL[activeBreakpoint]}</div>
        )}
        <div className="w-24 shrink-0" />
      </div>

      <div ref={parentRef} className="flex-1 overflow-auto">
        {groupedEntries.map(([groupName, tokens]) => (
          <div key={groupName}>
            {groupName !== '—' ? (
              <GroupHeader
                groupName={groupName}
                collectionId={collection.id}
                tokenMode={tokenMode}
                groupPrefix={inferGroupPrefix(tokens)}
                collection={collection}
                base500Hex={inferBase500Hex(tokens)}
              />
            ) : null}
            {tokens.map((token) => (
              <TokenRow
                key={token.id}
                token={token}
                collectionId={collection.id}
                showDark={showDark}
                hasDarkMode={hasDarkMode}
                activeBreakpoint={activeBreakpoint}
              />
            ))}
          </div>
        ))}
        {filteredTokens.length === 0 && (
          <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
            No tokens match your search.
          </div>
        )}
      </div>
    </div>
  );
}
