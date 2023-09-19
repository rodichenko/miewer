import React from 'react';
import type { CommonLayoutProps } from '../../@types/components/layout';
import ChainSequences from './index';
import { MiewerPanel } from '../layout';
import useChainSequencesActions from './use-chain-sequences-actions';
import { useMoleculeStructureStore } from '../../stores/miew-molecule-structure-store';

export function useShowChainSequences(): boolean {
  return useMoleculeStructureStore().chainNames.length > 0;
}

function ChainSequencesPanel(props: CommonLayoutProps) {
  const chainSequencesActions = useChainSequencesActions();
  return (
    <MiewerPanel {...props} panel="sequences" actions={chainSequencesActions}>
      <ChainSequences />
    </MiewerPanel>
  );
}

export default ChainSequencesPanel;
