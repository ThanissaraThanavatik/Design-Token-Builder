import { useRef } from 'react';
import { Upload, Trash2, Copy, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import type { BrandCustomIcon } from '@/types/brand';

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function cleanSVG(raw: string): string {
  return raw
    .replace(/<\?xml[^?]*\?>/gi, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
}

function hasCurrentColor(svg: string): boolean {
  return /currentColor/i.test(svg);
}

interface CustomIconManagerProps {
  icons: BrandCustomIcon[];
  onAdd: (icon: BrandCustomIcon) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function CustomIconManager({ icons, onAdd, onRemove, onRename }: CustomIconManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      if (!file.name.endsWith('.svg')) {
        toast.error(`${file.name}: only SVG files are supported`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const raw = reader.result as string;
        const svg = cleanSVG(raw);
        const baseName = file.name.replace(/\.svg$/i, '');
        onAdd({
          id: crypto.randomUUID(),
          name: slugify(baseName),
          svg,
        });
      };
      reader.readAsText(file);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }

  function copyCssVar(icon: BrandCustomIcon) {
    navigator.clipboard.writeText(`var(--icon-custom-${icon.name})`);
    toast.success('Copied CSS variable');
  }

  function svgDataUrl(svg: string) {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Drop zone */}
      <div
        className="mx-4 mt-4 shrink-0 border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-all"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="size-6 text-muted-foreground/60" />
        <p className="text-xs text-muted-foreground text-center">
          Drop SVG files here or <span className="underline">browse</span>
        </p>
        <p className="text-[10px] text-muted-foreground/60">Multiple files supported · SVG only</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      {/* Gallery */}
      <ScrollArea className="flex-1 mt-3">
        {icons.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">No custom icons yet — upload SVG files above.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 px-4 pb-4">
            {icons.map((icon) => {
              const dynamic = hasCurrentColor(icon.svg);
              return (
                <div
                  key={icon.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-3 group"
                >
                  {/* Preview */}
                  <div className="size-12 flex items-center justify-center mx-auto rounded-md bg-muted/30 border border-border">
                    <img
                      src={svgDataUrl(icon.svg)}
                      alt={icon.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>

                  {/* Color warning */}
                  {!dynamic && (
                    <div className="flex items-start gap-1">
                      <AlertTriangle className="size-3 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-[10px] text-amber-600 leading-tight">
                        Hardcoded fill — won't follow brand colors
                      </span>
                    </div>
                  )}

                  {/* Name */}
                  <Input
                    className="h-6 text-[10px] font-mono px-1.5"
                    value={icon.name}
                    onChange={(e) => onRename(icon.id, slugify(e.target.value))}
                  />

                  {/* CSS var hint */}
                  <p className="text-[9px] text-muted-foreground font-mono truncate">
                    --icon-custom-{icon.name}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-6 shrink-0"
                      onClick={() => copyCssVar(icon)}
                      title="Copy CSS var"
                    >
                      <Copy className="size-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-6 shrink-0 hover:text-destructive ml-auto"
                      onClick={() => onRemove(icon.id)}
                      title="Remove"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {icons.length > 0 && (
        <div className="px-4 py-2 border-t border-border shrink-0">
          <p className="text-[10px] text-muted-foreground">
            {icons.length} custom icon{icons.length !== 1 ? 's' : ''} · Use{' '}
            <code className="font-mono bg-muted px-1 rounded">color: var(--icon-default)</code>{' '}
            to apply brand icon color
          </p>
        </div>
      )}
    </div>
  );
}
