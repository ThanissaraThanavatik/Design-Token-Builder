import { create } from 'zustand';
import type { ExportFormat } from '@/types/export';

interface ExportStore {
  selectedFormats: ExportFormat[];
  isExporting: boolean;
  lastExportedAt: string | null;
  exportDialogOpen: boolean;

  toggleFormat: (format: ExportFormat) => void;
  selectAllFormats: () => void;
  setIsExporting: (v: boolean) => void;
  setLastExported: (at: string) => void;
  setExportDialogOpen: (open: boolean) => void;
}

const ALL_FORMATS: ExportFormat[] = ['css-tailwind', 'json-dtcg', 'design-md', 'swift', 'kotlin'];

export const useExportStore = create<ExportStore>((set) => ({
  selectedFormats: ['css-tailwind', 'json-dtcg'],
  isExporting: false,
  lastExportedAt: null,
  exportDialogOpen: false,

  toggleFormat: (format) =>
    set((s) => ({
      selectedFormats: s.selectedFormats.includes(format)
        ? s.selectedFormats.filter((f) => f !== format)
        : [...s.selectedFormats, format],
    })),

  selectAllFormats: () => set({ selectedFormats: ALL_FORMATS }),
  setIsExporting: (v) => set({ isExporting: v }),
  setLastExported: (at) => set({ lastExportedAt: at }),
  setExportDialogOpen: (open) => set({ exportDialogOpen: open }),
}));
