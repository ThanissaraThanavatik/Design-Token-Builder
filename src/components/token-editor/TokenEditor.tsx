import { Search, Undo2, Redo2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useBrandStore } from '@/store/brandStore';
import { useTokenStore } from '@/store/tokenStore';
import { useUIStore } from '@/store/uiStore';
import { TokenList } from './TokenList';
import { Button } from '@/components/ui/button';

export function TokenEditor() {
  const { brands, activeBrandId } = useBrandStore();
  const { selectedCollectionId, undo, redo, historyIndex, history } = useTokenStore();
  const { searchQuery, setSearchQuery } = useUIStore();

  const brand = brands.find((b) => b.id === activeBrandId);
  const collections = brand?.collections ?? [];
  const collection = collections.find((c) => c.id === selectedCollectionId) ?? collections[0];

  if (!brand) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No brand selected.
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a collection from the sidebar.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border shrink-0">
        <div className="relative flex-1 max-w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens..."
            className="pl-8 h-7 text-xs"
          />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={historyIndex <= 0}
            onClick={undo}
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={historyIndex >= history.length - 1}
            onClick={redo}
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <TokenList collection={collection} />
      </div>
    </div>
  );
}
