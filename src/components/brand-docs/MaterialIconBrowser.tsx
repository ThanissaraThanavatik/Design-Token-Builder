import { useState, useEffect, useMemo } from 'react';
import { Star, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MATERIAL_SYMBOLS } from '@/data/material-symbols-list';

type MaterialStyle = 'outlined' | 'rounded' | 'sharp' | 'filled';

const FONT_CLASS: Record<MaterialStyle, string> = {
  outlined: 'material-symbols-outlined',
  rounded: 'material-symbols-rounded',
  sharp: 'material-symbols-sharp',
  filled: 'material-symbols-outlined', // filled is an axis value, not a separate family
};

function loadMaterialFont(style: MaterialStyle) {
  const family =
    style === 'rounded' ? 'Material+Symbols+Rounded'
    : style === 'sharp' ? 'Material+Symbols+Sharp'
    : 'Material+Symbols+Outlined';
  const id = `gf-material-${style}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family}:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200`;
  document.head.appendChild(link);
}

const MAX_VISIBLE = 240;

interface MaterialIconBrowserProps {
  style?: MaterialStyle;
  approvedNames: string[];
  onToggleApproved: (name: string) => void;
}

export function MaterialIconBrowser({ style = 'outlined', approvedNames, onToggleApproved }: MaterialIconBrowserProps) {
  const [query, setQuery] = useState('');
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const approvedSet = useMemo(() => new Set(approvedNames), [approvedNames]);

  useEffect(() => {
    loadMaterialFont(style);
  }, [style]);

  const filtered = useMemo(() => {
    let names = MATERIAL_SYMBOLS;
    if (query.trim()) {
      const q = query.toLowerCase().replace(/ /g, '_');
      names = names.filter((n) => n.includes(q));
    }
    if (showApprovedOnly) {
      names = names.filter((n) => approvedSet.has(n));
    }
    return names;
  }, [query, showApprovedOnly, approvedSet]);

  const visible = filtered.slice(0, MAX_VISIBLE);
  const overflow = filtered.length - visible.length;
  const fontClass = FONT_CLASS[style];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <Input
          className="h-8 text-xs flex-1"
          placeholder="Search icons…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex items-center gap-1.5 shrink-0">
          <Switch size="sm" checked={showApprovedOnly} onCheckedChange={setShowApprovedOnly} />
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            Approved only ({approvedNames.length})
          </Label>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {visible.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No icons found.</p>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-1.5">
                {visible.map((name) => {
                  const isApproved = approvedSet.has(name);
                  return (
                    <button
                      key={name}
                      className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all text-center hover:bg-muted/50 ${isApproved ? 'border-primary/40 bg-primary/5' : 'border-transparent'}`}
                      onClick={() => onToggleApproved(name)}
                      title={name}
                    >
                      <div className="relative size-8 flex items-center justify-center">
                        <span
                          className={fontClass}
                          style={{ fontSize: 22, lineHeight: 1, userSelect: 'none' }}
                        >
                          {name}
                        </span>
                        {isApproved && (
                          <Star className="absolute -top-1 -right-1 size-3 fill-primary text-primary" />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground leading-tight break-all line-clamp-2 w-full">
                        {name.replace(/_/g, ' ')}
                      </span>
                    </button>
                  );
                })}
              </div>
              {overflow > 0 && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Showing {MAX_VISIBLE} of {filtered.length} — refine your search to see more
                </p>
              )}
            </>
          )}
        </div>
      </ScrollArea>
      <div className="px-4 py-2 border-t border-border shrink-0 flex items-center gap-2">
        <p className="text-xs text-muted-foreground flex-1">
          {approvedNames.length > 0
            ? `${approvedNames.length} icon${approvedNames.length !== 1 ? 's' : ''} approved for this brand`
            : 'Click icons to mark them as approved for this brand'}
        </p>
        {approvedNames.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-xs text-muted-foreground"
            onClick={() => {
              navigator.clipboard.writeText(approvedNames.join(', '));
              toast.success('Copied icon names');
            }}
          >
            <Copy className="size-3 mr-1" />
            Copy names
          </Button>
        )}
      </div>
    </div>
  );
}
