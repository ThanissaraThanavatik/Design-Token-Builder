import { useState, useEffect, useMemo, memo } from 'react';
import { Star, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — lucide-react ships this but doesn't export types for it
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const ALL_NAMES: string[] = Object.keys(dynamicIconImports as Record<string, unknown>).sort();

function toPascalCase(name: string): string {
  return name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

const IconCell = memo(function IconCell({
  name,
  approved,
  onToggle,
}: {
  name: string;
  approved: boolean;
  onToggle: () => void;
}) {
  const [Icon, setIcon] = useState<LucideIcon | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    const imp = (dynamicIconImports as Record<string, () => Promise<{ default: LucideIcon }>>)[name];
    if (imp) {
      imp().then((mod) => { if (alive) setIcon(() => mod.default); });
    }
    return () => { alive = false; };
  }, [name]);

  function copyImport(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(`import { ${toPascalCase(name)} } from 'lucide-react';`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all text-center hover:bg-muted/50 ${approved ? 'border-primary/40 bg-primary/5' : 'border-transparent'}`}
      onClick={onToggle}
      title={name}
    >
      <div className="relative size-8 flex items-center justify-center">
        {Icon ? (
          <Icon size={20} className="text-foreground/80" />
        ) : (
          <div className="w-5 h-5 bg-muted animate-pulse rounded" />
        )}
        {approved && (
          <Star className="absolute -top-1 -right-1 size-3 fill-primary text-primary" />
        )}
      </div>
      <span className="text-[10px] text-muted-foreground leading-tight break-all line-clamp-2 w-full">{name}</span>
      <button
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 rounded bg-background border border-border"
        onClick={copyImport}
        title="Copy import"
      >
        {copied ? <Check className="size-2.5 text-green-500" /> : <Copy className="size-2.5" />}
      </button>
    </button>
  );
});

const ITEMS_PER_PAGE = 200;

interface LucideIconBrowserProps {
  approvedNames: string[];
  onToggleApproved: (name: string) => void;
}

export function LucideIconBrowser({ approvedNames, onToggleApproved }: LucideIconBrowserProps) {
  const [query, setQuery] = useState('');
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const [page, setPage] = useState(0);
  const approvedSet = useMemo(() => new Set(approvedNames), [approvedNames]);

  const filtered = useMemo(() => {
    let names = ALL_NAMES;
    if (query.trim()) {
      const q = query.toLowerCase();
      names = names.filter((n) => n.includes(q));
    }
    if (showApprovedOnly) {
      names = names.filter((n) => approvedSet.has(n));
    }
    return names;
  }, [query, showApprovedOnly, approvedSet]);

  useEffect(() => { setPage(0); }, [query, showApprovedOnly]);

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const visible = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

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
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4">
          {visible.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No icons found.</p>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-1.5">
                {visible.map((name) => (
                  <IconCell
                    key={name}
                    name={name}
                    approved={approvedSet.has(name)}
                    onToggle={() => onToggleApproved(name)}
                  />
                ))}
              </div>
              {pageCount > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Page {page + 1} of {pageCount}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    disabled={page >= pageCount - 1}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
      <div className="px-4 py-2 border-t border-border shrink-0 flex items-center gap-2">
        <p className="text-xs text-muted-foreground flex-1">
          {approvedNames.length > 0
            ? `${approvedNames.length} icon${approvedNames.length !== 1 ? 's' : ''} approved for this brand`
            : 'Click icons to approve them for this brand'}
        </p>
        {approvedNames.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-xs text-muted-foreground"
            onClick={() => {
              navigator.clipboard.writeText(
                `import { ${approvedNames.map(toPascalCase).join(', ')} } from 'lucide-react';`,
              );
              toast.success('Copied bulk import');
            }}
          >
            <Copy className="size-3 mr-1" />
            Copy all imports
          </Button>
        )}
      </div>
    </div>
  );
}
