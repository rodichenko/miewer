import React from 'react';
import type { ChainSequenceProps } from '../../@types/components/chain-sequences';
import { ChainSequenceRenderType } from '../../@types/components/chain-sequences';
import classNames from 'classnames';
import useRenderer from './use-renderer';
import { useMoleculeStructureStore } from '../../stores/miew-molecule-structure-store';
import { useThemeConfig } from '../../stores/themes-store';
import useRendererProp from './renderer/use-renderer-prop';
import { useMiewSelectionStore } from '../../stores/miew-selection-store';

function ChainSequenceCanvas(props: ChainSequenceProps) {
  const {
    className,
    style,
    chain,
    type = ChainSequenceRenderType.letter,
  } = props;
  const [renderer, canvasRef] = useRenderer();
  const chainSequence = useMoleculeStructureStore().getChain(chain);
  const { selectedResidues, setSelectedResidues } = useMiewSelectionStore();
  const theme = useThemeConfig();
  useRendererProp(renderer, 'chain', chainSequence);
  useRendererProp(renderer, 'theme', theme);
  useRendererProp(renderer, 'renderType', type as ChainSequenceRenderType);
  useRendererProp(renderer, 'selectedResidues', selectedResidues);
  useRendererProp(renderer, 'selectionCallback', setSelectedResidues);
  return (
    <canvas
      ref={canvasRef}
      className={classNames(className, 'mw-chain-sequence-canvas')}
      style={style}></canvas>
  );
}

export default ChainSequenceCanvas;
