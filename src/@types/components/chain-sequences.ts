import type { CSSProperties } from 'react';
import type { BasicComponentProps } from './common';
import type { Chain } from '../miew';

export enum ChainSequenceRenderType {
  letter = 'letter',
  name = 'name',
}

export enum ChainSequenceEvent {
  scroll = 'scroll',
  scrollStart = 'scroll-start',
  scrollFinish = 'scroll-finish',
  selection = 'selection',
  selectionStart = 'selection-start',
  selectionFinish = 'selection-finish',
}

export enum ChainSequenceAlignment {
  left = 'left',
  center = 'center',
  right = 'right',
}

export type ChainSequencePointerEventCallback = (
  chain: Chain,
  event: ChainSequenceEvent,
) => void;

export type ChainSequenceProps = BasicComponentProps & {
  chain: string;
  type?: 'letter' | 'name' | ChainSequenceRenderType;
  alignment?: 'left' | 'center' | 'right' | ChainSequenceAlignment;
  useColorer?: boolean;
  pointerEventsDisabled?: boolean;
  onEvent?: ChainSequencePointerEventCallback;
};

export type ChainSequenceCanvasProps = ChainSequenceProps;

export type ChainSequencesProps = BasicComponentProps & {
  chainClassName?: string;
  chainStyle?: CSSProperties;
};

export type ChainSequencesConfigData = {
  renderType: ChainSequenceRenderType;
  useColorer: boolean;
};

export type ChainSequencesConfigActions = {
  setRenderType(renderType: ChainSequenceRenderType): void;
  setUseColorer(useColorer: boolean): void;
  setConfig(config: Partial<ChainSequencesConfigData>): void;
};

export type ChainSequencesConfigStore = ChainSequencesConfigData &
  ChainSequencesConfigActions;
