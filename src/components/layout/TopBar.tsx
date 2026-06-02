import { Download, Moon, Sun, Monitor, Menu, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useBrandStore } from '@/store/brandStore';
import { useUIStore } from '@/store/uiStore';
import { useExportStore } from '@/store/exportStore';

export function TopBar() {
  const { brands, activeBrandId } = useBrandStore();
  const { appTheme, setAppTheme, toggleSidebar } = useUIStore();
  const { setExportDialogOpen } = useExportStore();
  const brand = brands.find((b) => b.id === activeBrandId);

  return (
    <header className="h-12 border-b border-border bg-card flex items-center gap-3 px-4 shrink-0">
      <Button variant="ghost" size="icon" className="size-8" onClick={toggleSidebar}>
        <Menu className="size-4" />
      </Button>

      <div className="flex items-center gap-2">
        <Palette className="size-4 text-primary" />
        <span className="font-semibold text-sm">Design Token Builder</span>
        {brand && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{brand.name}</span>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="size-8">
              {appTheme === 'light' ? <Sun className="size-4" /> : appTheme === 'dark' ? <Moon className="size-4" /> : <Monitor className="size-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setAppTheme('light')}><Sun className="size-4 mr-2" /> Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAppTheme('dark')}><Moon className="size-4 mr-2" /> Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAppTheme('system')}><Monitor className="size-4 mr-2" /> System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={() => setExportDialogOpen(true)} className="gap-2">
          <Download className="size-4" />
          Export
        </Button>
      </div>
    </header>
  );
}
