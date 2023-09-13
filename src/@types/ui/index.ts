import type { CSSProperties, ReactNode } from 'react';

export type BasicComponentProps<C = ReactNode> = {
  className?: string;
  style?: CSSProperties;
  children?: C;
};

export type EnsureElementOptions = {
  tag: string;
  parent: HTMLElement;
  classNames: string[];
};
