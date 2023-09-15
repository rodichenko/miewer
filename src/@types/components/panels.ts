import type { ReactNode, ComponentType } from 'react';
import type { BasicComponentProps } from './common';

export enum MiewerPanel {
  terminal = 'terminal',
  representations = 'representations',
}

export const miewerPanelNames: Record<MiewerPanel, string> = {
  [MiewerPanel.terminal]: 'Terminal',
  [MiewerPanel.representations]: 'Layers',
};

export type MiewerPanelsStore = {
  panels: Set<MiewerPanel>;
  setPanelVisible(panel: MiewerPanel, visible?: boolean): void;
  togglePanel(panel: MiewerPanel): void;
};

export type MiewerPanelIconsSet = {
  icon: ComponentType<BasicComponentProps>;
  iconOn: ComponentType<BasicComponentProps>;
  iconOff: ComponentType<BasicComponentProps>;
};

export type PanelToggleProps = BasicComponentProps & {
  panel: MiewerPanel;
  displayName?: boolean;
};
