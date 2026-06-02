import { useState } from 'react';
import { Trash2, Plus, Copy, Check, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBrandStore } from '@/store/brandStore';
import { loadGoogleFonts, buildGoogleFontsUrl } from '@/lib/google-fonts';
import { copyToClipboard } from '@/lib/utils';

export function FontLibraryManager() {
  const { orgFonts, addOrgFont, removeOrgFont, brands } = useBrandStore();
  const [newFamily, setNewFamily] = useState('');
  const [copied, setCopied] = useState(false);

  const fontUsage: Record<string, string[]> = {};
  for (const brand of brands) {
    const ff = brand.typography?.fontFamily;
    if (ff) {
      if (!fontUsage[ff]) fontUsage[ff] = [];
      fontUsage[ff].push(brand.name);
    }
  }

  function handleAdd() {
    const family = newFamily.trim();
    if (!family) return;
    const font = { family, weights: [400, 500, 600, 700] };
    addOrgFont(font);
    loadGoogleFonts([...orgFonts, font]);
    setNewFamily('');
  }

  function handleCopyUrl() {
    const url = buildGoogleFontsUrl(orgFonts);
    if (!url) return;
    copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const googleFontsUrl = buildGoogleFontsUrl(orgFonts);

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        {orgFonts.map((font) => {
          const usedBy = fontUsage[font.family] ?? [];
          return (
            <div
              key={font.family}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-medium truncate"
                  style={{ fontFamily: `'${font.family}', sans-serif` }}
                >
                  {font.family}
                </p>
                {usedBy.length > 0 && (
                  <p className="text-[10px] text-muted-foreground truncate">
                    Used by: {usedBy.join(', ')}
                  </p>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="size-6 shrink-0 hover:text-destructive"
                onClick={() => removeOrgFont(font.family)}
                disabled={usedBy.length > 0}
                title={
                  usedBy.length > 0
                    ? `Cannot remove — in use by ${usedBy.join(', ')}`
                    : 'Remove font'
                }
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          );
        })}
        {orgFonts.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-3">
            No fonts in library yet
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          className="h-7 text-xs flex-1"
          placeholder="Google Font name (e.g. Prompt)"
          value={newFamily}
          onChange={(e) => setNewFamily(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
        />
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1.5 shrink-0"
          onClick={handleAdd}
        >
          <Plus className="size-3" />
          Add
        </Button>
      </div>

      {googleFontsUrl && (
        <div className="space-y-1.5 pt-1 border-t border-border">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Link className="size-3" />
            <span>Google Fonts URL — ไม่ต้อง API Key, ใช้ได้เลยทันที</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0 rounded-md border border-border bg-muted/40 px-2 py-1.5">
              <p className="text-[10px] font-mono text-muted-foreground truncate" title={googleFontsUrl}>
                {googleFontsUrl}
              </p>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="size-7 shrink-0"
              onClick={handleCopyUrl}
              title="Copy URL"
            >
              {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            URL นี้จะถูกใส่ใน CSS export อัตโนมัติ (<code className="font-mono">@import url(...)</code>)
          </p>
        </div>
      )}
    </div>
  );
}
