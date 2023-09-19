import { useCallback } from 'react';
import { create } from 'zustand';
import type { MiewerPanelsStore } from '../@types/components/panels';
import { MiewerPanel } from '../@types/components/panels';
import { createLocalSettings } from '../helpers/rest';

const { read, save } = createLocalSettings<MiewerPanel[]>('miewer-panels', [
  MiewerPanel.representations,
  MiewerPanel.sequences,
]);

export const useMiewerPanelsStore = create<MiewerPanelsStore>((set, get) => ({
  panels: new Set<MiewerPanel>(read()),
  setPanelVisible(panel: MiewerPanel, visible?: boolean): void {
    const panels = new Set<MiewerPanel>(
      [...get().panels]
        .filter((p) => p !== panel)
        .concat(visible === undefined || visible ? [panel] : []),
    );
    save([...panels]);
    set({ panels });
  },
  togglePanel(panel: MiewerPanel): void {
    const visible = get().panels.has(panel);
    get().setPanelVisible(panel, !visible);
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

export function useClosePanel(panel: MiewerPanel): () => void {
  const setPanelVisible = useMiewerPanelsStore(
    (store) => store.setPanelVisible,
  );
  return useCallback((): void => {
    setPanelVisible(panel, false);
  }, [setPanelVisible, panel]);
}
