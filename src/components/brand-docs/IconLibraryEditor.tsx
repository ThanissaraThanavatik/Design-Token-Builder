import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BrandIconLibrary } from '@/types/brand';

const LIBRARIES = ['Lucide Icons', 'Material Icons M3', 'Font Awesome', 'Heroicons'] as const;
const MATERIAL_STYLES = ['Outlined', 'Rounded', 'Sharp', 'Filled'] as const;
const WEIGHTS = [100, 200, 300, 400, 500, 600, 700] as const;
const GRADES = [-25, 0, 200] as const;
const OPTICAL_SIZES = [20, 24, 40, 48] as const;
const STROKE_WIDTHS = [1, 1.5, 2, 2.5, 3] as const;

interface IconLibraryEditorProps {
  libraries: BrandIconLibrary[];
  onChange: (libs: BrandIconLibrary[]) => void;
}

function newEntry(): BrandIconLibrary {
  return { id: crypto.randomUUID(), platform: '', library: 'Lucide Icons', strokeWidth: 1.5 };
}

export function IconLibraryEditor({ libraries, onChange }: IconLibraryEditorProps) {
  function update(id: string, patch: Partial<BrandIconLibrary>) {
    onChange(libraries.map((lib) => lib.id === id ? { ...lib, ...patch } : lib));
  }

  function remove(id: string) {
    onChange(libraries.filter((lib) => lib.id !== id));
  }

  function handleLibraryChange(id: string, library: string) {
    update(id, {
      library,
      style: undefined,
      fill: undefined,
      weight: undefined,
      grade: undefined,
      opticalSize: undefined,
      strokeWidth: library === 'Lucide Icons' ? 1.5 : undefined,
    });
  }

  return (
    <div className="space-y-2.5">
      {libraries.map((lib) => {
        const isMaterial = lib.library === 'Material Icons M3';
        const isLucide = lib.library === 'Lucide Icons';

        return (
          <div key={lib.id} className="rounded-md border border-border p-3 space-y-2.5">
            {/* Platform + Library + Remove */}
            <div className="flex gap-2 items-center">
              <Input
                className="h-7 text-xs flex-1"
                placeholder="Platform (React, Flutter…)"
                value={lib.platform}
                onChange={(e) => update(lib.id, { platform: e.target.value })}
              />
              <Select value={lib.library} onValueChange={(v) => v && handleLibraryChange(lib.id, v)}>
                <SelectTrigger size="sm" className="w-[152px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIBRARIES.map((name) => (
                    <SelectItem key={name} value={name} className="text-xs">{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="icon"
                variant="ghost"
                className="size-7 shrink-0 hover:text-destructive"
                onClick={() => remove(lib.id)}
                title="Remove"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>

            {/* Lucide config */}
            {isLucide && (
              <div className="flex items-center gap-2 pl-1">
                <Label className="text-[10px] text-muted-foreground w-24 shrink-0">Stroke Width</Label>
                <Select
                  value={String(lib.strokeWidth ?? 1.5)}
                  onValueChange={(v) =>
                    update(lib.id, { strokeWidth: Number(v) as BrandIconLibrary['strokeWidth'] })
                  }
                >
                  <SelectTrigger size="sm" className="w-[72px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STROKE_WIDTHS.map((w) => (
                      <SelectItem key={w} value={String(w)} className="text-xs">{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Material M3 config */}
            {isMaterial && (
              <div className="space-y-2 pl-1">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] text-muted-foreground w-8 shrink-0">Style</Label>
                    <Select
                      value={lib.style ?? 'Outlined'}
                      onValueChange={(v) =>
                        update(lib.id, { style: v as BrandIconLibrary['style'] })
                      }
                    >
                      <SelectTrigger size="sm" className="w-[104px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MATERIAL_STYLES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] text-muted-foreground w-6 shrink-0">Fill</Label>
                    <Switch
                      size="sm"
                      checked={lib.fill === 1}
                      onCheckedChange={(v) => update(lib.id, { fill: v ? 1 : 0 })}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {lib.fill === 1 ? 'Solid' : 'Line'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] text-muted-foreground w-12 shrink-0">Weight</Label>
                    <Select
                      value={String(lib.weight ?? 400)}
                      onValueChange={(v) =>
                        update(lib.id, { weight: Number(v) as BrandIconLibrary['weight'] })
                      }
                    >
                      <SelectTrigger size="sm" className="w-[72px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WEIGHTS.map((w) => (
                          <SelectItem key={w} value={String(w)} className="text-xs">{w}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] text-muted-foreground w-8 shrink-0">Grade</Label>
                    <Select
                      value={String(lib.grade ?? 0)}
                      onValueChange={(v) =>
                        update(lib.id, { grade: Number(v) as BrandIconLibrary['grade'] })
                      }
                    >
                      <SelectTrigger size="sm" className="w-[72px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADES.map((g) => (
                          <SelectItem key={g} value={String(g)} className="text-xs">{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] text-muted-foreground w-16 shrink-0">Opt. Size</Label>
                    <Select
                      value={String(lib.opticalSize ?? 24)}
                      onValueChange={(v) =>
                        update(lib.id, { opticalSize: Number(v) as BrandIconLibrary['opticalSize'] })
                      }
                    >
                      <SelectTrigger size="sm" className="w-[72px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPTICAL_SIZES.map((s) => (
                          <SelectItem key={s} value={String(s)} className="text-xs">{s}px</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7" onClick={() => onChange([...libraries, newEntry()])}>
        <Plus className="size-3.5" />
        Add platform
      </Button>
    </div>
  );
}
