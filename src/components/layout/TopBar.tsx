import { Download, Moon, Sun, Monitor, Menu, Palette, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useBrandStore } from '@/store/brandStore';
import { useUIStore } from '@/store/uiStore';
import { useExportStore } from '@/store/exportStore';
import type { User } from '@/types/user';

interface TopBarProps {
  user: User;
  onSignOut: () => void;
}

export function TopBar({ user, onSignOut }: TopBarProps) {
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
          <DropdownMenuTrigger asChild>
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

        {/* User avatar menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold hover:opacity-80 transition-opacity">
              {user.initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-3 py-2">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="size-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
