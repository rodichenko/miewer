import React from 'react';
import classNames from 'classnames';
import type { ChainSequenceProps } from '../../@types/components/chain-sequences';
import { useMoleculeStructureStore } from '../../stores/miew-molecule-structure-store';
import ChainSequenceCanvas from './canvas';

function ChainSequence(props: ChainSequenceProps) {
  const { chain, className, style, type } = props;
  const chainSequence = useMoleculeStructureStore().getChain(chain);
  if (chainSequence) {
    return (
      <div className={classNames('chain-sequence', className)} style={style}>
        <div>
          Chain <b>{chainSequence.chain.getName()}</b>
        </div>
        <ChainSequenceCanvas chain={chain} type={type} />
      </div>
    );
  }
  return null;
}

export default ChainSequence;
