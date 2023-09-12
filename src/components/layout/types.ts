import type { ReactNode, ReactElement, Key } from 'react';
import type { BasicComponentProps } from '../../types/ui';

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

export type CommonLayoutProps<C = ReactNode> = BasicComponentProps<C> &
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
