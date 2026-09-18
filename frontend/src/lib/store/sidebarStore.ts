import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  activeSection: string;
  toggle: () => void;
  toggleCollapse: () => void;
  open: () => void;
  close: () => void;
  setActiveSection: (section: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false, // mobile drawer closed by default
  isCollapsed: false, // desktop sidebar expanded
  activeSection: 'overview',
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  toggleCollapse: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setActiveSection: (section: string) => set({ activeSection: section }),
}));
