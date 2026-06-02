import { useState } from 'react';
import { Download, Copy, Check, X, RefreshCw } from 'lucide-react';
import { syncBrandsToStorybook } from '@/lib/storybook-sync';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBrandStore } from '@/store/brandStore';
import { useExportStore } from '@/store/exportStore';
import { generateExport, downloadExport } from '@/hooks/useExport';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import type { ExportFormat } from '@/types/export';

const FORMATS: { id: ExportFormat; label: string; ext: string; audience: 'dev' | 'design' }[] = [
  { id: 'css-tailwind', label: 'CSS (Tailwind 4.0)', ext: '.css', audience: 'dev' },
  { id: 'json-dtcg', label: 'JSON (DTCG)', ext: '.json', audience: 'dev' },
  { id: 'swift', label: 'Swift', ext: '.swift', audience: 'dev' },
  { id: 'kotlin', label: 'Kotlin', ext: '.kt', audience: 'dev' },
  { id: 'design-md', label: 'DESIGN.md', ext: '.md', audience: 'design' },
];

const DEV_FORMATS = FORMATS.filter((f) => f.audience === 'dev');
const DESIGN_FORMATS = FORMATS.filter((f) => f.audience === 'design');

export function ExportDialog() {
  const { brands, activeBrandId, orgFonts } = useBrandStore();
  const { exportDialogOpen, setExportDialogOpen } = useExportStore();
  const brand = brands.find((b) => b.id === activeBrandId);
  const [activeTab, setActiveTab] = useState<ExportFormat>('css-tailwind');
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  if (!brand) return null;

  async function handleSync() {
    setSyncing(true);
    try {
      await syncBrandsToStorybook(brands);
      setSynced(true);
      setTimeout(() => setSynced(false), 2000);
    } catch {
      // silently ignore — Storybook may not be running
    } finally {
      setSyncing(false);
    }
  }

  const result = generateExport(brand, activeTab, orgFonts);

  function handleCopy() {
    copyToClipboard(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    downloadExport(brand!, activeTab, orgFonts);
  }

  function handleDownloadAll() {
    for (const fmt of FORMATS) {
      const r = generateExport(brand!, fmt.id, orgFonts);
      downloadFile(r.filename, r.content, r.mimeType);
    }
  }

  return (
    <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
      <DialogContent className="sm:max-w-5xl w-[90vw] h-[85vh] flex flex-col p-0" showCloseButton={false}>
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Export — {brand.name}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleSync} disabled={syncing} className="gap-1.5 text-xs">
                {synced ? <Check className="size-3.5" /> : <RefreshCw className={`size-3.5 ${syncing ? 'animate-spin' : ''}`} />}
                {synced ? 'Synced!' : syncing ? 'Syncing…' : 'Sync to Storybook'}
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownloadAll} className="gap-1.5 text-xs">
                <Download className="size-3.5" />
                Download All
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setExportDialogOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ExportFormat)} className="flex flex-col flex-1 min-h-0">
            <TabsList className="shrink-0 px-4 justify-start border-b border-border rounded-none h-auto py-0 gap-1 bg-transparent flex-wrap">
              <span className="text-[10px] text-muted-foreground font-medium px-1 py-2.5 self-center">Developers</span>
              {DEV_FORMATS.map((f) => (
                <TabsTrigger
                  key={f.id}
                  value={f.id}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-xs py-2.5"
                >
                  {f.label}
                </TabsTrigger>
              ))}
              <span className="w-px h-4 bg-border mx-1 self-center" />
              <span className="text-[10px] text-muted-foreground font-medium px-1 py-2.5 self-center">WordPress / Design</span>
              {DESIGN_FORMATS.map((f) => (
                <TabsTrigger
                  key={f.id}
                  value={f.id}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-xs py-2.5"
                >
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {FORMATS.map((f) => (
              <TabsContent key={f.id} value={f.id} className="flex-1 flex flex-col min-h-0 m-0">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border shrink-0">
                  <span className="text-xs text-muted-foreground flex-1">{result.filename}</span>
                  <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5 text-xs h-7">
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button size="sm" onClick={handleDownload} className="gap-1.5 text-xs h-7">
                    <Download className="size-3.5" />
                    Download
                  </Button>
                </div>
                <ScrollArea className="flex-1 min-h-0">
                  <pre className="p-4 text-xs font-mono leading-relaxed text-foreground whitespace-pre-wrap break-all">
                    {result.content}
                  </pre>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
