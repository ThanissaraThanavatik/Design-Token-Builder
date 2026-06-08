import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import type { User } from '@/types/user';
import { PanelTabs } from './PanelTabs';
import { TokenEditor } from '@/components/token-editor/TokenEditor';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { BrandDocsEditor } from '@/components/brand-docs/BrandDocsEditor';
import { IconBrowserPanel } from '@/components/icons/IconBrowserPanel';
import { TypographyPanel } from '@/components/typography/TypographyPanel';
import { ExportDialog } from '@/components/export/ExportDialog';
import { BrandManager } from '@/components/brand/BrandManager';
import { Toaster } from '@/components/ui/sonner';
import { useUIStore } from '@/store/uiStore';
import { useTokenStore } from '@/store/tokenStore';
import { useBrandStore } from '@/store/brandStore';
import { loadGoogleFonts } from '@/lib/google-fonts';
import { cn } from '@/lib/utils';

interface AppShellProps {
  user: User;
  onSignOut: () => void;
}

export function AppShell({ user, onSignOut }: AppShellProps) {
  const { activePanel, appTheme, brandManagerOpen, setBrandManagerOpen } = useUIStore();
  const { undo, redo } = useTokenStore();
  const { orgFonts } = useBrandStore();

  useEffect(() => {
    loadGoogleFonts(orgFonts);
  }, [orgFonts]);

  useEffect(() => {
    const root = document.documentElement;
    if (appTheme === 'dark') {
      root.classList.add('dark');
    } else if (appTheme === 'light') {
      root.classList.remove('dark');
    } else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', mq.matches);
    }
  }, [appTheme]);

  // Keep previewMode in sync with the OS when appTheme='system',
  // correcting any stale persisted value and reacting to live OS changes.
  useEffect(() => {
    if (appTheme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => useUIStore.getState().setPreviewMode(mq.matches ? 'dark' : 'light');
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [appTheme]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className={cn('flex flex-col h-screen bg-background text-foreground overflow-hidden')}>
      <TopBar user={user} onSignOut={onSignOut} />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <PanelTabs />
          <div className="flex-1 min-h-0 overflow-hidden">
            {activePanel === 'editor' && <TokenEditor />}
            {activePanel === 'preview' && <PreviewPanel />}
            {activePanel === 'docs' && <BrandDocsEditor />}
            {activePanel === 'icons' && <IconBrowserPanel />}
            {activePanel === 'typography' && <TypographyPanel />}
          </div>
        </div>
      </div>
      <ExportDialog />
      <BrandManager open={brandManagerOpen} onClose={() => setBrandManagerOpen(false)} />
      <Toaster />
    </div>
  );
}
