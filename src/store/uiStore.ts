import { create } from 'zustand';

export type ActivePanel = 'editor' | 'graph' | 'validation' | 'preview' | 'docs' | 'icons';
export type AppTheme = 'light' | 'dark' | 'system';

interface UIStore {
  activePanel: ActivePanel;
  appTheme: AppTheme;
  previewMode: 'light' | 'dark';
  sidebarCollapsed: boolean;
  graphHighlightedTokenId: string | null;
  searchQuery: string;
  filterType: string;
  brandManagerOpen: boolean;

  setActivePanel: (panel: ActivePanel) => void;
  setAppTheme: (theme: AppTheme) => void;
  setPreviewMode: (mode: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setGraphHighlight: (tokenId: string | null) => void;
  setSearchQuery: (q: string) => void;
  setFilterType: (type: string) => void;
  setBrandManagerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activePanel: 'editor',
  appTheme: 'system',
  previewMode: 'light',
  sidebarCollapsed: false,
  graphHighlightedTokenId: null,
  searchQuery: '',
  filterType: 'all',
  brandManagerOpen: false,

  setActivePanel: (panel) => set({ activePanel: panel }),
  setAppTheme: (theme) => set({ appTheme: theme }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setGraphHighlight: (tokenId) => set({ graphHighlightedTokenId: tokenId }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterType: (type) => set({ filterType: type }),
  setBrandManagerOpen: (open) => set({ brandManagerOpen: open }),
}));
