import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useBrandStore } from '@/store/brandStore';
import type { BrandCustomIcon } from '@/types/brand';
import { LucideIconBrowser } from '@/components/brand-docs/LucideIconBrowser';
import { MaterialIconBrowser } from '@/components/brand-docs/MaterialIconBrowser';
import { CustomIconManager } from '@/components/brand-docs/CustomIconManager';

export function IconBrowserPanel() {
  const {
    brands,
    activeBrandId,
    updateIconApproved,
    addCustomIcon,
    removeCustomIcon,
    updateCustomIcon,
  } = useBrandStore();

  const brand = brands.find((b) => b.id === activeBrandId);
  const icons = brand?.icons ?? {};

  const lucideApproved = icons.approvedIcons?.find((a) => a.library === 'Lucide Icons')?.names ?? [];
  const materialApproved = icons.approvedIcons?.find((a) => a.library === 'Material Icons M3')?.names ?? [];
  const customCount = icons.customIcons?.length ?? 0;

  function toggleLucide(name: string) {
    const next = lucideApproved.includes(name)
      ? lucideApproved.filter((n) => n !== name)
      : [...lucideApproved, name];
    updateIconApproved(activeBrandId, 'Lucide Icons', next);
  }

  function toggleMaterial(name: string) {
    const next = materialApproved.includes(name)
      ? materialApproved.filter((n) => n !== name)
      : [...materialApproved, name];
    updateIconApproved(activeBrandId, 'Material Icons M3', next);
  }

  const materialStyle =
    (brand?.icons?.libraries
      ?.find((l) => l.library === 'Material Icons M3')
      ?.style?.toLowerCase() as 'outlined' | 'rounded' | 'sharp' | 'filled' | undefined) ?? 'outlined';

  if (!brand) return null;

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="lucide" className="flex flex-col h-full">
        {/* Tab bar */}
        <div className="px-4 py-2 border-b border-border bg-card shrink-0 flex items-center gap-3">
          <TabsList variant="default">
            <TabsTrigger value="lucide">
              Lucide Icons
              {lucideApproved.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full leading-none">
                  {lucideApproved.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="material">
              Material M3
              {materialApproved.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full leading-none">
                  {materialApproved.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="custom">
              Custom SVGs
              {customCount > 0 && (
                <span className="ml-1.5 text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full leading-none">
                  {customCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <span className="ml-auto text-xs text-muted-foreground">
            {brand.name}
          </span>
        </div>

        {/* Content */}
        <TabsContent value="lucide" className="flex-1 min-h-0 m-0">
          <LucideIconBrowser
            approvedNames={lucideApproved}
            onToggleApproved={toggleLucide}
          />
        </TabsContent>

        <TabsContent value="material" className="flex-1 min-h-0 m-0">
          <MaterialIconBrowser
            style={materialStyle}
            approvedNames={materialApproved}
            onToggleApproved={toggleMaterial}
          />
        </TabsContent>

        <TabsContent value="custom" className="flex-1 min-h-0 m-0">
          <CustomIconManager
            icons={icons.customIcons ?? []}
            onAdd={(icon: BrandCustomIcon) => addCustomIcon(activeBrandId, icon)}
            onRemove={(id: string) => removeCustomIcon(activeBrandId, id)}
            onRename={(id: string, name: string) => updateCustomIcon(activeBrandId, id, { name })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
