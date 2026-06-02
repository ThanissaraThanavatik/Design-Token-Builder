import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Collection } from '@/types/token';

interface ImpactPanelProps {
  tokenId: string;
  collections: Collection[];
  impacted: Set<string>;
  onClose: () => void;
}

export function ImpactPanel({ tokenId, collections, impacted, onClose }: ImpactPanelProps) {
  function findToken(id: string) {
    for (const col of collections) {
      const t = col.tokens.find((t) => t.id === id);
      if (t) return { token: t, collectionName: col.name };
    }
    return null;
  }

  const selected = findToken(tokenId);
  const impactedList = [...impacted].map(findToken).filter(Boolean) as { token: { id: string; name: string; cssVariable: string }; collectionName: string }[];

  return (
    <div className="w-64 border-l border-border bg-card flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-sm font-medium">Impact Analysis</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {selected && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Selected token</p>
              <div className="rounded border border-primary/30 bg-primary/5 px-2 py-1.5">
                <p className="text-xs font-mono font-medium">{selected.token.name}</p>
                <p className="text-xs text-muted-foreground">{selected.collectionName}</p>
              </div>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground mb-2">
              {impactedList.length === 0
                ? 'No other tokens reference this token.'
                : `${impactedList.length} token${impactedList.length === 1 ? '' : 's'} will be affected:`}
            </p>
            {impactedList.map(({ token, collectionName }) => (
              <div key={token.id} className="rounded border border-border px-2 py-1.5 mb-1.5">
                <p className="text-xs font-mono">{token.name}</p>
                <p className="text-xs text-muted-foreground">{collectionName}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
