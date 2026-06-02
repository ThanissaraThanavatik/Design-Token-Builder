import { useState } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBrandStore } from '@/store/brandStore';
import { loadGoogleFonts } from '@/lib/google-fonts';
import { cn } from '@/lib/utils';

interface FontPickerProps {
  value: string;
  onChange: (family: string) => void;
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  const { orgFonts, addOrgFont } = useBrandStore();
  const [open, setOpen] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [newFamily, setNewFamily] = useState('');

  function handleAddFont() {
    const family = newFamily.trim();
    if (!family) return;
    const font = { family, weights: [400, 500, 600, 700] };
    addOrgFont(font);
    loadGoogleFonts([...orgFonts, font]);
    setNewFamily('');
    setAddMode(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-expanded={open}
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'h-7 w-full justify-between text-xs font-normal px-2',
        )}
      >
        <span style={{ fontFamily: value ? `'${value}', sans-serif` : undefined }}>
          {value || 'Select font…'}
        </span>
        <ChevronsUpDown className="size-3 opacity-50 shrink-0 ml-1" />
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search fonts…" className="h-8 text-xs" />
          <CommandList>
            <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
              No fonts found
            </CommandEmpty>
            <CommandGroup>
              {orgFonts.map((font) => (
                <CommandItem
                  key={font.family}
                  value={font.family}
                  onSelect={() => {
                    onChange(font.family === value ? '' : font.family);
                    setOpen(false);
                  }}
                  className="text-xs gap-2"
                >
                  <Check
                    className={cn(
                      'size-3 shrink-0',
                      value === font.family ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span style={{ fontFamily: `'${font.family}', sans-serif` }}>
                    {font.family}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {addMode ? (
                <div className="flex gap-1 p-1">
                  <Input
                    className="h-7 text-xs flex-1"
                    placeholder="Font name…"
                    value={newFamily}
                    onChange={(e) => setNewFamily(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFont();
                      if (e.key === 'Escape') { setAddMode(false); setNewFamily(''); }
                    }}
                    autoFocus
                  />
                  <Button size="sm" className="h-7 text-xs px-2 shrink-0" onClick={handleAddFont}>
                    Add
                  </Button>
                </div>
              ) : (
                <CommandItem
                  onSelect={() => setAddMode(true)}
                  className="text-xs text-muted-foreground gap-2"
                >
                  <Plus className="size-3 shrink-0" />
                  Add Google Font to library
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
