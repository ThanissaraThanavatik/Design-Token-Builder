import { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 500 * 1024; // 500 KB

interface LogoUploaderProps {
  label: string;
  hint: string;
  value?: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function LogoUploader({ label, hint, value, onChange, onClear }: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDataUrl = value?.startsWith('data:');
  const [urlDraft, setUrlDraft] = useState(isDataUrl ? '' : (value ?? ''));

  function handleFile(file: File) {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${label}: ไฟล์ใหญ่เกิน 500 KB — ลองบีบอัดก่อน หรือใช้ URL แทน`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
      setUrlDraft('');
    };
    reader.readAsDataURL(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  }

  function commitUrl() {
    const url = urlDraft.trim();
    if (url && url !== value) onChange(url);
  }

  return (
    <div className="flex items-start gap-3 py-2.5">
      {/* Preview */}
      <div
        className="size-12 shrink-0 rounded-md border border-border bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        title="Click or drag to upload"
      >
        {value ? (
          <img src={value} alt={label} className="size-full object-contain" />
        ) : (
          <ImageIcon className="size-5 text-muted-foreground/40" />
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-medium">{label}</span>
          <span className="text-[10px] text-muted-foreground">{hint}</span>
        </div>
        <div className="flex gap-1.5">
          <Input
            className="h-7 text-xs flex-1"
            placeholder="https://... หรือ drag & drop →"
            value={isDataUrl ? '[uploaded file]' : urlDraft}
            onChange={(e) => { if (!isDataUrl) setUrlDraft(e.target.value); }}
            onBlur={commitUrl}
            onKeyDown={(e) => { if (e.key === 'Enter') commitUrl(); }}
            readOnly={isDataUrl}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
          <Button
            size="icon"
            variant="outline"
            className="size-7 shrink-0"
            onClick={() => fileInputRef.current?.click()}
            title="Upload image"
          >
            <Upload className="size-3" />
          </Button>
          {value && (
            <Button
              size="icon"
              variant="ghost"
              className="size-7 shrink-0 hover:text-destructive"
              onClick={() => { onClear(); setUrlDraft(''); }}
              title="Remove"
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
