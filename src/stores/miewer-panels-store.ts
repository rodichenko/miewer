import { useCallback } from 'react';
import { create } from 'zustand';
import type { MiewerPanelsStore } from '../@types/miewer/panels';
import { MiewerPanel } from '../@types/miewer/panels';

export const useMiewerPanelsStore = create<MiewerPanelsStore>((set) => ({
  panels: new Set<MiewerPanel>([MiewerPanel.terminal]),
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

export function isPresentationsVisible(): boolean {
  return isMiewerPanelVisible(MiewerPanel.presentations);
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
