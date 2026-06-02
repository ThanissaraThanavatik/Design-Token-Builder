import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useBrandStore } from '@/store/brandStore';
import { useDependencyGraph } from '@/hooks/useDependencyGraph';
import { useValidation } from '@/hooks/useValidation';
import { cn } from '@/lib/utils';
import type { ValidationSeverity } from '@/types/graph';

type Filter = 'all' | ValidationSeverity;

const SEVERITY_ICON = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};
const SEVERITY_COLOR = {
  error: 'text-destructive',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export function ValidationPanel() {
  const { brands, activeBrandId } = useBrandStore();
  const brand = brands.find((b) => b.id === activeBrandId);
  const collections = brand?.collections ?? [];

  const { map } = useDependencyGraph(collections, null);
  const issues = useValidation(collections, map);
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? issues : issues.filter((i) => i.severity === filter)),
    [issues, filter],
  );

  const counts = useMemo(
    () => ({
      error: issues.filter((i) => i.severity === 'error').length,
      warning: issues.filter((i) => i.severity === 'warning').length,
      info: issues.filter((i) => i.severity === 'info').length,
    }),
    [issues],
  );

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all', label: `All (${issues.length})` },
    { id: 'error', label: `Errors (${counts.error})` },
    { id: 'warning', label: `Warnings (${counts.warning})` },
    { id: 'info', label: `Info (${counts.info})` },
  ];

  function findTokenName(tokenId: string) {
    for (const col of collections) {
      const t = col.tokens.find((t) => t.id === tokenId);
      if (t) return `${col.name}/${t.name}`;
    }
    return tokenId;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h2 className="font-semibold text-sm mb-3">Token Validation</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'px-2.5 py-1 rounded text-xs border transition-colors',
                filter === f.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
              <p className="text-sm">No {filter === 'all' ? '' : filter} issues found.</p>
            </div>
          )}
          {filtered.map((issue) => {
            const Icon = SEVERITY_ICON[issue.severity];
            return (
              <div key={issue.id} className="rounded-lg border border-border p-3 space-y-1.5">
                <div className="flex items-start gap-2">
                  <Icon className={cn('size-4 shrink-0 mt-0.5', SEVERITY_COLOR[issue.severity])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{issue.message}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-xs font-mono">{issue.rule}</Badge>
                      <span className="text-xs text-muted-foreground truncate">{findTokenName(issue.tokenId)}</span>
                    </div>
                    {issue.suggestedFix && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Suggested: <code className="bg-muted px-1 rounded font-mono">{issue.suggestedFix}</code>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
