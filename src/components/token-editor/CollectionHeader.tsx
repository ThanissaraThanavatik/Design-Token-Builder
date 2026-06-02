import { Plus, Sun, Moon, Layers, Wand2, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Collection, BreakpointMode, TokenMode } from '@/types/token';
import { BREAKPOINT_MODES, isBreakpointMode } from '@/types/token';
import { useTokenStore } from '@/store/tokenStore';
import { generateId } from '@/lib/utils';
import { ColorGeneratorDialog } from './ColorGeneratorDialog';
import { cn } from '@/lib/utils';

interface CollectionHeaderProps {
  collection: Collection;
  showDark: boolean;
  onToggleDark: () => void;
  activeBreakpoint: BreakpointMode | null;
  onBreakpointChange: (bp: BreakpointMode | null) => void;
}

const COLOR_SCALE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

export function CollectionHeader({ collection, showDark, onToggleDark, activeBreakpoint, onBreakpointChange }: CollectionHeaderProps) {
  const { addToken, addTokensBatch, setCollectionModes } = useTokenStore();
  const [mode, setMode] = useState<'idle' | 'add-token' | 'add-group'>('idle');
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupPrefix, setGroupPrefix] = useState('');
  const [scaleType, setScaleType] = useState<'scale' | 'single'>('scale');

  const hasDarkMode = collection.modes.includes('dark');
  const hasBreakpoints = collection.modes.some(isBreakpointMode);
  const tokenMode = hasDarkMode ? 'light' : 'default';

  function toggleResponsive() {
    if (hasBreakpoints) {
      if (!confirm('Disable responsive values? This will remove all breakpoint values from this collection.')) return;
      const themeModes = collection.modes.filter((m) => !isBreakpointMode(m)) as TokenMode[];
      setCollectionModes(collection.id, themeModes);
      onBreakpointChange(null);
    } else {
      const allModes: TokenMode[] = [...(collection.modes.filter(m => !isBreakpointMode(m))), ...BREAKPOINT_MODES];
      setCollectionModes(collection.id, allModes);
    }
  }

  function handleAddToken() {
    if (!newName.trim()) return;
    const name = newName.trim();
    const cssVar = `${collection.prefix}${name}`;
    addToken(collection.id, {
      id: generateId('token'),
      name,
      cssVariable: cssVar,
      type: 'color',
      values: { [tokenMode]: { raw: '#000000' } },
    });
    setNewName('');
    setMode('idle');
  }

  function handleGroupNameChange(val: string) {
    setGroupName(val);
    if (!groupPrefix || groupPrefix === `--color-${groupName.toLowerCase().replace(/\s+/g, '-')}-`) {
      setGroupPrefix(`--color-${val.toLowerCase().replace(/\s+/g, '-')}-`);
    }
  }

  function handleCreateGroup() {
    if (!groupName.trim() || !groupPrefix.trim()) return;
    const name = groupName.trim();
    const prefix = groupPrefix.trim().endsWith('-') ? groupPrefix.trim() : `${groupPrefix.trim()}-`;

    if (scaleType === 'scale') {
      const tokens = COLOR_SCALE_STEPS.map((step) => ({
        id: generateId('token'),
        name: `${name.toLowerCase()}-${step}`,
        cssVariable: `${prefix}${step}`,
        type: 'color' as const,
        values: { [tokenMode]: { raw: '#000000' } },
        group: name,
      }));
      addTokensBatch(collection.id, tokens);
    } else {
      addToken(collection.id, {
        id: generateId('token'),
        name: name.toLowerCase(),
        cssVariable: `${prefix}default`,
        type: 'color',
        values: { [tokenMode]: { raw: '#000000' } },
        group: name,
      });
    }

    setGroupName('');
    setGroupPrefix('');
    setScaleType('scale');
    setMode('idle');
  }

  return (
    <div className="border-b border-border bg-muted/30">
      {/* Main header row */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-semibold text-sm">{collection.name}</h2>
            <Badge variant="secondary" className="text-xs font-mono shrink-0">{collection.prefix}*</Badge>
            <span className="text-xs text-muted-foreground">{collection.tokens.length} tokens</span>
            {collection.sourceFile && (
              <span className="text-xs text-muted-foreground hidden sm:inline truncate">— {collection.sourceFile}</span>
            )}
          </div>
          {collection.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{collection.description}</p>
          )}
        </div>

        {hasDarkMode && (
          <button
            onClick={onToggleDark}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border hover:bg-muted transition-colors shrink-0"
          >
            {showDark ? <Moon className="size-3" /> : <Sun className="size-3" />}
            {showDark ? 'Dark' : 'Light'}
          </button>
        )}

        <button
          onClick={toggleResponsive}
          className={cn(
            'flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors shrink-0',
            hasBreakpoints
              ? 'border-blue-500/50 text-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
              : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted',
          )}
          title={hasBreakpoints ? 'Disable responsive breakpoint values' : 'Enable responsive breakpoint values'}
        >
          <Smartphone className="size-3" />
          Responsive
        </button>

        {mode === 'idle' && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => setGeneratorOpen(true)}>
              <Wand2 className="size-3" />
              Generate Scale
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => setMode('add-group')}>
              <Layers className="size-3" />
              New Group
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => setMode('add-token')}>
              <Plus className="size-3" />
              Add Token
            </Button>
          </div>
        )}

        {mode === 'add-token' && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-muted-foreground">{collection.prefix}</span>
            <Input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddToken();
                if (e.key === 'Escape') { setMode('idle'); setNewName(''); }
              }}
              placeholder="token-name"
              className="h-7 text-xs w-32 font-mono"
            />
            <Button size="sm" className="h-7 text-xs" onClick={handleAddToken}>Add</Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setMode('idle'); setNewName(''); }}>Cancel</Button>
          </div>
        )}
      </div>

      {/* Breakpoint selector pills */}
      {hasBreakpoints && (
        <div className="px-4 py-2 border-t border-border/50 flex items-center gap-1.5 bg-blue-500/5">
          <span className="text-xs text-blue-400 shrink-0">Breakpoint:</span>
          {BREAKPOINT_MODES.map((bp) => (
            <button
              key={bp}
              onClick={() => onBreakpointChange(activeBreakpoint === bp ? null : bp)}
              className={cn(
                'px-2 py-0.5 rounded text-xs font-mono transition-colors border',
                activeBreakpoint === bp
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-border text-muted-foreground hover:border-blue-400 hover:text-blue-400',
              )}
            >
              {bp}
            </button>
          ))}
          {activeBreakpoint && (
            <span className="text-xs text-muted-foreground ml-1">
              — editing {activeBreakpoint} values
            </span>
          )}
        </div>
      )}

      {/* New Group inline form */}
      {mode === 'add-group' && (
        <div className="px-4 py-3 border-t border-border bg-background space-y-3">
          <p className="text-xs font-medium">New Color Group</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Group Name</Label>
              <Input
                autoFocus
                value={groupName}
                onChange={(e) => handleGroupNameChange(e.target.value)}
                placeholder="Accent"
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">CSS Prefix</Label>
              <Input
                value={groupPrefix}
                onChange={(e) => setGroupPrefix(e.target.value)}
                placeholder="--color-accent-"
                className="h-7 text-xs font-mono"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Tokens:</span>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="radio"
                checked={scaleType === 'scale'}
                onChange={() => setScaleType('scale')}
                className="accent-primary"
              />
              Color Scale (50–950, 11 steps)
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="radio"
                checked={scaleType === 'single'}
                onChange={() => setScaleType('single')}
                className="accent-primary"
              />
              Single token
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || !groupPrefix.trim()}
            >
              Create Group
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => { setMode('idle'); setGroupName(''); setGroupPrefix(''); }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <ColorGeneratorDialog
        open={generatorOpen}
        onClose={() => setGeneratorOpen(false)}
        collection={collection}
      />
    </div>
  );
}
