import { cn } from '@/lib/utils';
import { useBrandStore } from '@/store/brandStore';
import { useTokenStore } from '@/store/tokenStore';
import { useUIStore } from '@/store/uiStore';
import { ChevronRight, Plus, MoreHorizontal, Pencil, Trash2, Check, X } from 'lucide-react';
import type { Collection } from '@/types/token';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const COLLECTION_ORDER = [
  'shadcn', 'colors-branding-secondary', 'colors-branding', 'tokens',
  'tw-border-radius', 'tw-border-width', 'tw-colors', 'tw-font',
  'tw-gap', 'tw-height', 'tw-margin', 'tw-max-height', 'tw-max-width',
  'tw-opacity', 'tw-padding', 'tw-space', 'tw-stroke-width',
];

function sortCollections(collections: Collection[]) {
  return [...collections].sort((a, b) => {
    const ai = COLLECTION_ORDER.findIndex((k) => a.id.includes(k));
    const bi = COLLECTION_ORDER.findIndex((k) => b.id.includes(k));
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function getBrandPrimaryColor(collections: Collection[]): string {
  for (const col of collections) {
    const t = col.tokens.find((t) => t.cssVariable === '--color-primary');
    const val = t?.values['light']?.raw ?? t?.values['default']?.raw;
    if (val && val.startsWith('#')) return val;
  }
  return '#888888';
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function Sidebar() {
  const { brands, activeBrandId, setActiveBrand, updateBrandMeta, deleteBrand } = useBrandStore();
  const { selectedCollectionId, selectCollection } = useTokenStore();
  const { sidebarCollapsed, setActivePanel, setBrandManagerOpen } = useUIStore();
  const [brandsExpanded, setBrandsExpanded] = useState(true);
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [editingBrandName, setEditingBrandName] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  function startRename(id: string, name: string) {
    setOpenMenuId(null);
    setEditingBrandId(id);
    setEditingBrandName(name);
  }

  function confirmRename() {
    if (!editingBrandId || !editingBrandName.trim()) return;
    updateBrandMeta(editingBrandId, { name: editingBrandName.trim(), slug: toSlug(editingBrandName.trim()) });
    setEditingBrandId(null);
    setEditingBrandName('');
  }

  function cancelRename() {
    setEditingBrandId(null);
    setEditingBrandName('');
  }

  const brand = brands.find((b) => b.id === activeBrandId);

  if (sidebarCollapsed) return null;

  const sortedCollections = brand ? sortCollections(brand.collections) : [];

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col">
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-1">
          {/* BRANDS */}
          <button
            className="flex items-center gap-1 w-full text-left px-1 py-0.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
            onClick={() => setBrandsExpanded((v) => !v)}
          >
            <ChevronRight className={cn('size-3 transition-transform', brandsExpanded && 'rotate-90')} />
            Brand
          </button>
          {brandsExpanded && brands.map((b) => {
            const brandColor = getBrandPrimaryColor(b.collections);
            const isEditing = editingBrandId === b.id;
            const menuOpen = openMenuId === b.id;
            return (
              <div key={b.id} className="relative group">
                {isEditing ? (
                  <div className="flex items-center gap-1 px-2 py-1">
                    <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: brandColor }} />
                    <Input
                      autoFocus
                      value={editingBrandName}
                      onChange={(e) => setEditingBrandName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmRename();
                        if (e.key === 'Escape') cancelRename();
                      }}
                      className="flex-1 h-6 text-xs px-1.5"
                    />
                    <button
                      onClick={confirmRename}
                      disabled={!editingBrandName.trim()}
                      className="size-5 flex items-center justify-center rounded hover:text-green-600 disabled:opacity-40"
                    >
                      <Check className="size-3" />
                    </button>
                    <button onClick={cancelRename} className="size-5 flex items-center justify-center rounded hover:text-muted-foreground">
                      <X className="size-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => { setActiveBrand(b.id); setOpenMenuId(null); }}
                      className={cn(
                        'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-left transition-colors pr-7',
                        b.id === activeBrandId
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: brandColor }} />
                      <span className="truncate">{b.name}</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(menuOpen ? null : b.id); }}
                      className={cn(
                        'absolute right-1 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded hover:bg-muted transition-opacity text-muted-foreground',
                        menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                      )}
                    >
                      <MoreHorizontal className="size-3" />
                    </button>
                    {menuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                        <div className="absolute right-0 top-full z-50 mt-0.5 w-36 rounded-md border border-border bg-popover shadow-md py-1">
                          <button
                            onClick={() => startRename(b.id, b.name)}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted text-left"
                          >
                            <Pencil className="size-3" /> Rename
                          </button>
                          {brands.length > 1 && (
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                if (confirm(`Delete "${b.name}"? This cannot be undone.`)) deleteBrand(b.id);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted text-left text-destructive"
                            >
                              <Trash2 className="size-3" /> Delete
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}

          <div className="h-px bg-border my-2" />

          {/* COLLECTIONS */}
          <button
            className="flex items-center gap-1 w-full text-left px-1 py-0.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
            onClick={() => setCollectionsExpanded((v) => !v)}
          >
            <ChevronRight className={cn('size-3 transition-transform', collectionsExpanded && 'rotate-90')} />
            Collections
          </button>
          {collectionsExpanded && sortedCollections.map((col) => (
            <button
              key={col.id}
              onClick={() => {
                selectCollection(col.id);
                setActivePanel('editor');
              }}
              className={cn(
                'flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm text-left transition-colors group',
                col.id === selectedCollectionId
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <span className="truncate">{col.name}</span>
              <span className="text-xs tabular-nums opacity-50 group-hover:opacity-100">
                {col.tokens.length}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5 text-xs"
          onClick={() => setBrandManagerOpen(true)}
        >
          <Plus className="size-3" />
          Manage Brands
        </Button>
      </div>
    </aside>
  );
}
