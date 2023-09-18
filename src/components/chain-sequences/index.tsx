import React from 'react';
import classNames from 'classnames';
import type { ChainSequencesProps } from '../../@types/components/chain-sequences';
import { useMoleculeStructureStore } from '../../stores/miew-molecule-structure-store';
import ChainSequence from '../chain-sequence';

export function useShowChainSequences(): boolean {
  return useMoleculeStructureStore().chainNames.length > 0;
}

function ChainSequences(props: ChainSequencesProps) {
  const { className, chainClassName, style, chainStyle, type } = props;
  const { chainNames } = useMoleculeStructureStore();
  return (
    <div className={classNames('chain-sequences', className)} style={style}>
      {chainNames.map((chainName) => (
        <ChainSequence
          key={chainName}
          chain={chainName}
          className={chainClassName}
          style={chainStyle}
          type={type}
        />
      ))}
    </div>
  );
}

export default ChainSequences;
