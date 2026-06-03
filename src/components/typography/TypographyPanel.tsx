import { Library, FileText, Layers, BookOpen } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FontLibraryTab } from './FontLibraryTab';
import { TypeSpecsTab } from './TypeSpecsTab';
import { TokenTypographyTab } from './TokenTypographyTab';
import { TipsTab } from './TipsTab';

export function TypographyPanel() {
  const { brands, activeBrandId } = useBrandStore();
  const brand = brands.find((b) => b.id === activeBrandId);

  return (
    <Tabs defaultValue="library" className="flex flex-col h-full">
      <div className="px-4 py-2 border-b border-border bg-card shrink-0 flex items-center gap-3">
        <TabsList variant="default">
          <TabsTrigger value="library">
            <Library className="size-3.5" />
            Font Library
          </TabsTrigger>
          <TabsTrigger value="specs">
            <FileText className="size-3.5" />
            Type Specs
          </TabsTrigger>
          <TabsTrigger value="tokens">
            <Layers className="size-3.5" />
            Token Preview
          </TabsTrigger>
          <TabsTrigger value="guide">
            <BookOpen className="size-3.5" />
            Guide
          </TabsTrigger>
        </TabsList>
        {brand && (
          <span className="ml-auto text-xs text-muted-foreground">{brand.name}</span>
        )}
      </div>

      <TabsContent value="library" className="flex-1 min-h-0 m-0 overflow-hidden flex flex-col">
        <FontLibraryTab />
      </TabsContent>
      <TabsContent value="specs" className="flex-1 min-h-0 m-0 overflow-hidden flex flex-col">
        <TypeSpecsTab />
      </TabsContent>
      <TabsContent value="tokens" className="flex-1 min-h-0 m-0 overflow-hidden flex flex-col">
        <TokenTypographyTab />
      </TabsContent>
      <TabsContent value="guide" className="flex-1 min-h-0 m-0 overflow-hidden flex flex-col">
        <TipsTab />
      </TabsContent>
    </Tabs>
  );
}
