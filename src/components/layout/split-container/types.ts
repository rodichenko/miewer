import type { ContainerSizes } from '../types';

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
