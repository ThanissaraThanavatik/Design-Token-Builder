import { Layers, Eye, FileText, Library, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore, type ActivePanel } from '@/store/uiStore';

const TABS: { id: ActivePanel; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
  { id: 'editor', label: 'Editor', icon: Layers },
  { id: 'docs', label: 'Brand Docs', icon: FileText, badge: 'WP' },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'icons', label: 'Icons', icon: Library },
];

export function PanelTabs() {
  const { activePanel, setActivePanel } = useUIStore();

  return (
    <div className="flex items-center gap-1 border-b border-border px-4 bg-card shrink-0">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2.5 text-sm border-b-2 transition-colors',
              activePanel === tab.id
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
            )}
          >
            <Icon className="size-4" />
            {tab.label}
            {tab.badge && (
              <span className="text-[10px] font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded leading-none">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
