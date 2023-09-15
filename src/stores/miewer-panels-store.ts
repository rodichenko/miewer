import { useCallback } from 'react';
import { create } from 'zustand';
import type { MiewerPanelsStore } from '../@types/components/panels';
import { MiewerPanel } from '../@types/components/panels';

export const useMiewerPanelsStore = create<MiewerPanelsStore>((set) => ({
  panels: new Set<MiewerPanel>([MiewerPanel.representations]),
  setPanelVisible(panel: MiewerPanel, visible?: boolean): void {
    set((store) => ({
      panels: new Set<MiewerPanel>(
        [...store.panels]
          .filter((p) => p !== panel)
          .concat(visible === undefined || visible ? [panel] : []),
      ),
    }));
  },
  togglePanel(panel: MiewerPanel): void {
    set((store) => {
      const visible = store.panels.has(panel);
      if (visible) {
        // Hide panel
        return {
          panels: new Set<MiewerPanel>(
            [...store.panels].filter((p) => p !== panel),
          ),
        };
      }
      // Show panel
      return {
        panels: new Set<MiewerPanel>([...store.panels].concat(panel)),
      };
    });
  },
}));

export function usePanelVisible(panel: MiewerPanel): boolean {
  return useMiewerPanelsStore((store) => store.panels).has(panel);
}

export function isTerminalVisible(): boolean {
  return usePanelVisible(MiewerPanel.terminal);
}

export function isRepresentationsVisible(): boolean {
  return usePanelVisible(MiewerPanel.representations);
}

export function useTogglePanel(panel: MiewerPanel): () => void {
  const togglePanel = useMiewerPanelsStore((store) => store.togglePanel);
  return useCallback((): void => {
    togglePanel(panel);
  }, [togglePanel, panel]);
}

export function useToggleTerminal(): () => void {
  return useTogglePanel(MiewerPanel.terminal);
}

export function useToggleRepresentations(): () => void {
  return useTogglePanel(MiewerPanel.representations);
}
