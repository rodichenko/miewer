import type { MiewerPanel } from './panels';

export type MiewerPanelsStore = {
  panels: Set<MiewerPanel>;
  setPanelVisible(panel: MiewerPanel, visible?: boolean): void;
};
