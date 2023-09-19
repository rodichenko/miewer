import React from 'react';
import classNames from 'classnames';
import type { ChainSequenceProps } from '../../@types/components/chain-sequences';
import { useMoleculeStructureStore } from '../../stores/miew-molecule-structure-store';
import ChainSequenceCanvas from './canvas';

function ChainSequence(props: ChainSequenceProps) {
  const { className, style, ...rest } = props;
  const { chain } = rest;
  const chainSequence = useMoleculeStructureStore().getChain(chain);
  if (chainSequence) {
    return (
      <div className={classNames('chain-sequence', className)} style={style}>
        <ChainSequenceCanvas {...rest} />
      </div>
    );
  }
  return null;
}

export default ChainSequence;
