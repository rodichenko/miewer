import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import type { ChainSequencesProps } from '../../@types/components/chain-sequences';
import { useMoleculeStructureStore } from '../../stores/miew-molecule-structure-store';
import ChainSequence from '../chain-sequence';
import type { Chain } from '../../@types/miew';
import { ChainSequenceEvent } from '../../@types/components/chain-sequences';
import { useChainSequencesConfig } from '../../stores/chain-sequences-config-store';

function ChainSequences(props: ChainSequencesProps) {
  const { className, chainClassName, style, chainStyle } = props;
  const { chainNames } = useMoleculeStructureStore();
  const { renderType, useColorer } = useChainSequencesConfig();
  const [activeEventsTarget, setActiveEventsTarget] = useState<
    string | undefined
  >(undefined);
  const onEvent = useCallback(
    (chain: Chain, event: ChainSequenceEvent) => {
      switch (event) {
        case ChainSequenceEvent.scrollFinish:
        case ChainSequenceEvent.selectionFinish:
          if (activeEventsTarget) {
            setActiveEventsTarget(undefined);
          }
          break;
        default:
          if (activeEventsTarget !== chain.getName()) {
            setActiveEventsTarget(chain.getName());
          }
          break;
      }
    },
    [activeEventsTarget, setActiveEventsTarget],
  );
  return (
    <div className={classNames('chain-sequences', className)} style={style}>
      {chainNames.map((chainName) => (
        <ChainSequence
          key={chainName}
          chain={chainName}
          className={classNames(
            chainClassName,
            'mw-row',
            'chain-sequence-block',
          )}
          style={chainStyle}
          onEvent={onEvent}
          type={renderType}
          useColorer={useColorer}
          pointerEventsDisabled={
            activeEventsTarget !== undefined && activeEventsTarget !== chainName
          }
        />
      ))}
    </div>
  );
}

export default ChainSequences;
