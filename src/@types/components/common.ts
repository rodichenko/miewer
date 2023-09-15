import type { CSSProperties, FocusEventHandler, ReactNode } from 'react';

export type BasicComponentProps = {
  className?: string;
  style?: CSSProperties;
};

export type BasicParentComponentProps<C = ReactNode> = BasicComponentProps & {
  children?: C;
};

export type ModalProps = BasicComponentProps & {
  title?: string;
  visible: boolean;
  onClose: () => void;
};

export type EnsureElementOptions = {
  tag: string;
  parent: HTMLElement;
  classNames: string[];
};

export type FocusableProps = {
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
};
