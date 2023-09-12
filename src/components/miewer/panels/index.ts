import { create } from 'zustand';
import type { MiewerPanelsStore } from './types';
import { MiewerPanel } from './panels';
import { useCallback } from 'react';

export const useMiewerPanelsStore = create<MiewerPanelsStore>((set) => ({
  panels: new Set<MiewerPanel>([MiewerPanel.presentations]),
  setPanelVisible(panel: MiewerPanel, visible?: boolean): void {
    set((store) => ({
      panels: new Set<MiewerPanel>(
        [...store.panels]
          .filter((p) => p !== panel)
          .concat(visible === undefined || visible ? [panel] : []),
      ),
    }));
  },
}));

export function isMiewerPanelVisible(panel: MiewerPanel): boolean {
  return useMiewerPanelsStore((store) => store.panels).has(panel);
}

export function isTerminalVisible(): boolean {
  return isMiewerPanelVisible(MiewerPanel.terminal);
}

export function useSetTerminalVisible(): (visible?: boolean) => void {
  const setPanelVisible = useMiewerPanelsStore(
    (store) => store.setPanelVisible,
  );
  return useCallback(
    (visible?: boolean): void => {
      setPanelVisible(MiewerPanel.terminal, visible);
    },
    [setPanelVisible],
  );
}

export { MiewerPanel };
