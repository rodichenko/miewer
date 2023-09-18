import type { CSSProperties } from 'react';
import type { BasicComponentProps } from './common';

export enum ChainSequenceRenderType {
  letter = 'letter',
  name = 'name',
}

export type ChainSequenceProps = BasicComponentProps & {
  chain: string;
  type?: 'letter' | 'name';
};

export type ChainSequencesProps = BasicComponentProps & {
  chainClassName?: string;
  chainStyle?: CSSProperties;
  type?: 'letter' | 'name';
};
