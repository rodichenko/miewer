export enum MiewerPanel {
  terminal = 'terminal',
  presentations = 'presentations',
}

export type MiewerPanelsStore = {
  panels: Set<MiewerPanel>;
  setPanelVisible(panel: MiewerPanel, visible?: boolean): void;
};
