export enum MiewerPanel {
  terminal = 'terminal',
  representations = 'representations',
}

export type MiewerPanelsStore = {
  panels: Set<MiewerPanel>;
  setPanelVisible(panel: MiewerPanel, visible?: boolean): void;
  togglePanel(panel: MiewerPanel): void;
};
