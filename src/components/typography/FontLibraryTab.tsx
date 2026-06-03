import { useState } from 'react';
import { Trash2, Plus, Copy, Check, Link, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBrandStore } from '@/store/brandStore';
import { loadGoogleFonts, buildGoogleFontsUrl } from '@/lib/google-fonts';
import { copyToClipboard } from '@/lib/utils';
import { FontDetailPage } from './FontDetailPage';

const PANGRAM_LATIN = 'The quick brown fox jumps over the lazy dog';
const PANGRAM_THAI = 'ฟักทองใหญ่วางบนถาดไม้ — เส้นทางแห่งความสำเร็จ';

export function FontLibraryTab() {
  const { orgFonts, addOrgFont, removeOrgFont, brands } = useBrandStore();
  const [newFamily, setNewFamily] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string | null>(null);

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

  // ── Detail page drill-down ──
  if (selectedFont !== null) {
    const font = orgFonts.find((f) => f.family === selectedFont);
    if (font) {
      return (
        <FontDetailPage
          family={font.family}
          weights={font.weights}
          onBack={() => setSelectedFont(null)}
        />
      );
    }
  }

  // ── Library list ──
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-4 border-b border-border shrink-0 space-y-3">
        <div className="flex gap-2">
          <Input
            className="h-8 text-sm flex-1"
            placeholder="Google Font name (e.g. Prompt, Sarabun, Inter)"
            value={newFamily}
            onChange={(e) => setNewFamily(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
          <Button size="sm" variant="outline" className="h-8 gap-1.5 shrink-0" onClick={handleAdd}>
            <Plus className="size-3.5" />
            Add Font
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Type any{' '}
          <a
            href="https://fonts.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 underline underline-offset-2 hover:text-foreground"
          >
            Google Fonts <ExternalLink className="size-3" />
          </a>{' '}
          family name — it loads immediately.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {orgFonts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No fonts in library yet. Add a Google Font above.
          </p>
        )}

        {orgFonts.map((font) => {
          const usedBy = fontUsage[font.family] ?? [];
          const ff = `'${font.family}', sans-serif`;

          return (
            <div key={font.family} className="rounded-lg border border-border bg-card overflow-hidden">
              {/* Card — clickable to open detail */}
              <button
                className="w-full flex items-start justify-between gap-3 px-4 pt-4 pb-3 text-left hover:bg-muted/40 transition-colors"
                onClick={() => setSelectedFont(font.family)}
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="text-4xl font-medium leading-none" style={{ fontFamily: ff }}>
                    Aa
                  </p>
                  <p className="text-sm font-semibold text-foreground">{font.family}</p>
                  <p className="text-xs text-foreground truncate" style={{ fontFamily: ff }}>
                    {PANGRAM_LATIN}
                  </p>
                  <p className="text-xs text-muted-foreground truncate" style={{ fontFamily: ff }}>
                    {PANGRAM_THAI}
                  </p>
                  {usedBy.length > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      Used by: {usedBy.join(', ')}
                    </p>
                  )}
                </div>
                <ChevronRight className="size-4 text-muted-foreground mt-1 shrink-0" />
              </button>

              {/* Remove button */}
              <div className="flex justify-end px-3 py-2 border-t border-border bg-muted/20">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[11px] gap-1 text-muted-foreground hover:text-destructive"
                  onClick={() => removeOrgFont(font.family)}
                  disabled={usedBy.length > 0}
                  title={
                    usedBy.length > 0
                      ? `Cannot remove — in use by ${usedBy.join(', ')}`
                      : 'Remove font'
                  }
                >
                  <Trash2 className="size-3" />
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {googleFontsUrl && (
        <div className="p-4 border-t border-border shrink-0 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link className="size-3" />
            <span>Google Fonts import URL (auto-included in CSS export)</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0 rounded-md border border-border bg-muted/40 px-2 py-1.5">
              <p
                className="text-[10px] font-mono text-muted-foreground truncate"
                title={googleFontsUrl}
              >
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
        </div>
      )}
    </div>
  );
}
