import type { ReactNode, ReactElement, Key } from 'react';
import type { BasicParentComponentProps } from './common';

export type LayoutSize = string | number;

export type LayoutSizeInfo = {
  value: number;
  fixed: boolean;
  percent: boolean;
  flex: boolean;
  size?: LayoutSize;
};

export type ContainerChildProps = {
  size?: LayoutSize;
  minSize?: number;
};

export type ContainerChildSize = ContainerChildProps & {
  key?: Key;
  index: number;
};

export type CommonLayoutProps<C = ReactNode> = BasicParentComponentProps<C> &
  ContainerChildProps;

export type ContainerDirection = 'horizontal' | 'vertical';

export type ContainerProps = CommonLayoutProps<ContainerChildren> & {
  direction?: ContainerDirection;
  grid?: boolean;
  gridSizes?: ContainerSizes;
};

export type ContainerChild<P = any> =
  | boolean
  | ReactElement<P>
  | undefined
  // eslint-disable-next-line @typescript-eslint/ban-types
  | null;

export type ContainerChildren = ContainerChild | ContainerChild[];

export type ContainerSizes = ContainerChildSize[];
export type SetContainerSizes = (sizes: ContainerSizes) => void;
export type PanelProps = CommonLayoutProps & {
  bordered?: boolean;
  noPadding?: boolean;
  transparent?: boolean;
};

export type ResizerContext = {
  sizes: ContainerSizes;
  setSizes: SetContainerSizes;
};

export type DividerDragStartCallback = (divider: HTMLElement) => boolean;
export type DividerDragCallback = (divider: HTMLElement, delta: number) => void;
export type DividerDragFinishCallback = (divider: HTMLElement) => void;

export type DividerCallbacks = {
  onDragStart: DividerDragStartCallback;
  onDrag: DividerDragCallback;
  onDragFinish: DividerDragFinishCallback;
};

export type ResizeSession = {
  previousSize: number;
  previousMinSize: number;
  previousId: number;
  nextSize: number;
  nextMinSize: number;
  nextId: number;
  grid: HTMLElement;
  sizes: ContainerSizes;
  initialSizes: ContainerSizes;
};

export type GetDirectionSize = (element: HTMLElement) => number;
