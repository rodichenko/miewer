import type { ReactNode, ReactElement, Key } from 'react';
import type { BasicParentComponentProps } from './common';

export type LayoutSize = 'auto' | string | number;

export type LayoutSizeInfo = {
  value: number;
  fixed: boolean;
  percent: boolean;
  flex: boolean;
  auto: boolean;
  size?: LayoutSize;
};

export type ContainerChildLayoutProps = {
  size?: LayoutSize;
  minSize?: number;
  stretch?: boolean; // Alias for `size="*"`
};

export type ContainerChildSize = ContainerChildLayoutProps & {
  key?: Key;
  index: number;
};

export type CommonLayoutProps<C = ReactNode> = BasicParentComponentProps<C> &
  ContainerChildLayoutProps;

export type ContainerDirection = 'horizontal' | 'vertical';

export type FlexType =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around';

export type ContainerProps = CommonLayoutProps<ContainerChildren> & {
  direction?: ContainerDirection;
  grid?: boolean;
  flex?: boolean | FlexType;
  gridSizes?: ContainerSizes;
  defaultChildSize?: LayoutSize;
};

export type ContainerChild<P extends CommonLayoutProps = CommonLayoutProps> =
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
  previousId: number;
  nextId: number;
  grid: HTMLElement;
  dividers: Set<number>;
  calculatedSizes: number[];
  calculatedMinSizes: number[];
  sizes: ContainerSizes;
  sizesInfo: LayoutSizeInfo[];
  initialSizes: ContainerSizes;
};

export type GetDirectionSize = (element: HTMLElement) => number;
