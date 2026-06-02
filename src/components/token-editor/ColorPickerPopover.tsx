import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ColorPickerPopoverProps {
  value: string;
  onChange: (hex: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ColorPickerPopover({ value, onChange, disabled, className }: ColorPickerPopoverProps) {
  const [inputVal, setInputVal] = useState(value);

  useEffect(() => { setInputVal(value); }, [value]);

  const isHex = /^#[0-9a-fA-F]{3,6}$/.test(value);
  const displayColor = isHex ? value : '#888888';

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
    setInputVal(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v) || /^#[0-9a-fA-F]{3}$/.test(v)) {
      onChange(v);
    }
  }

  return (
    <Popover>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          'size-6 rounded border border-border shrink-0 focus:outline-none focus:ring-2 focus:ring-ring transition-transform hover:scale-110',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        style={{ backgroundColor: displayColor }}
        title={value}
      />
      <PopoverContent className="w-auto p-3 space-y-2">
        <HexColorPicker color={displayColor} onChange={(hex) => { setInputVal(hex); onChange(hex); }} />
        <Input
          value={inputVal}
          onChange={handleInputChange}
          className="h-7 text-xs font-mono"
          placeholder="#000000"
          maxLength={7}
        />
      </PopoverContent>
    </Popover>
  );
}
