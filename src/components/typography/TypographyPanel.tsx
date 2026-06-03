import { useState } from 'react';
import { Library, FileText, Layers, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBrandStore } from '@/store/brandStore';
import { FontLibraryTab } from './FontLibraryTab';
import { TypeSpecsTab } from './TypeSpecsTab';
import { TokenTypographyTab } from './TokenTypographyTab';
import { TipsTab } from './TipsTab';

type Tab = 'library' | 'specs' | 'tokens' | 'guide';

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'library', label: 'Font Library', icon: Library },
  { id: 'specs', label: 'Type Specs', icon: FileText },
  { id: 'tokens', label: 'Token Preview', icon: Layers },
  { id: 'guide', label: 'Guide', icon: BookOpen },
];

export function TypographyPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('library');
  const { brands, activeBrandId } = useBrandStore();
  const brand = brands.find((b) => b.id === activeBrandId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 border-b border-border px-4 bg-card shrink-0">
        {brand && (
          <span className="text-xs text-muted-foreground mr-2 shrink-0">{brand.name}</span>
        )}
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2.5 text-sm border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {activeTab === 'library' && <FontLibraryTab />}
        {activeTab === 'specs' && <TypeSpecsTab />}
        {activeTab === 'tokens' && <TokenTypographyTab />}
        {activeTab === 'guide' && <TipsTab />}
      </div>
    </div>
  );
}
