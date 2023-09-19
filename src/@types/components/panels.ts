import type { ReactNode, ComponentType, CSSProperties } from 'react';
import type { BasicComponentProps } from './common';
import type { CommonLayoutProps } from './layout';

export enum MiewerPanel {
  terminal = 'terminal',
  representations = 'representations',
  sequences = 'sequences',
}

export const miewerPanelNames: Record<MiewerPanel, string> = {
  [MiewerPanel.terminal]: 'Terminal',
  [MiewerPanel.representations]: 'Layers',
  [MiewerPanel.sequences]: 'Chain sequences',
};

export const miewerPanelShortNames: Record<MiewerPanel, string> = {
  [MiewerPanel.terminal]: 'Terminal',
  [MiewerPanel.representations]: 'Layers',
  [MiewerPanel.sequences]: 'Sequences',
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
  displayName?: boolean | 'short' | 'full';
};

export type PanelCloseCallback = () => void;
export type PanelActionCallback = () => void;
export type PanelActionDividerConfig = {
  type: 'divider';
};
export type PanelActionConfig = {
  key: string;
  icon?: ComponentType<BasicComponentProps>;
  title?: string;
  disabled?: boolean;
  checked?: boolean;
  onAction: PanelActionCallback;
};
export type PanelActionContainerConfig = {
  key: string;
  icon?: ComponentType<BasicComponentProps>;
  title: string;
  disabled?: boolean;
  actions: PanelActionItem[];
};
export type PanelActionItem =
  | PanelActionDividerConfig
  | PanelActionContainerConfig
  | PanelActionConfig;

export type PanelRootAction = PanelActionContainerConfig | PanelActionConfig;

export type PanelActionProps = BasicComponentProps & {
  action: PanelRootAction;
};
export type PanelProps = CommonLayoutProps & {
  title?: ReactNode;
  titleClassName?: string;
  titleStyle?: CSSProperties;
  onClose?: PanelCloseCallback;
  actions?: PanelRootAction[];
  bordered?: boolean;
  noPadding?: boolean;
  transparent?: boolean;
};

export type MiewerPanelProps = PanelProps & {
  panel: 'terminal' | 'representations' | 'sequences' | MiewerPanel;
};

export type MiewerHeaderProps = BasicComponentProps & {
  panelTogglesDisplayName?: boolean | 'short' | 'full';
};
