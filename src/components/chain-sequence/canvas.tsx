import React from 'react';
import type { ChainSequenceCanvasProps } from '../../@types/components/chain-sequences';
import {
  ChainSequenceAlignment,
  ChainSequenceRenderType,
} from '../../@types/components/chain-sequences';
import classNames from 'classnames';
import useRenderer from './use-renderer';
import { useMoleculeStructureStore } from '../../stores/miew-molecule-structure-store';
import { useThemeConfig } from '../../stores/themes-store';
import useRendererProp from './renderer/use-renderer-prop';
import { useMiewSelectionStore } from '../../stores/miew-selection-store';

function ChainSequenceCanvas(props: ChainSequenceCanvasProps) {
  const {
    className,
    style,
    chain,
    type = ChainSequenceRenderType.letter,
    alignment = ChainSequenceAlignment.left,
    pointerEventsDisabled = false,
    onEvent,
    useColorer = true,
  } = props;
  const [renderer, canvasRef] = useRenderer();
  const chainSequence = useMoleculeStructureStore().getChain(chain);
  const { selectedResidues, setSelectedResidues } = useMiewSelectionStore();
  const theme = useThemeConfig();
  useRendererProp(renderer, 'chain', chainSequence);
  useRendererProp(renderer, 'theme', theme);
  useRendererProp(renderer, 'renderType', type as ChainSequenceRenderType);
  useRendererProp(renderer, 'useColorer', useColorer);
  useRendererProp(renderer, 'alignment', alignment as ChainSequenceAlignment);
  useRendererProp(renderer, 'selectedResidues', selectedResidues);
  useRendererProp(renderer, 'selectionCallback', setSelectedResidues);
  useRendererProp(renderer, 'pointerEventsDisabled', pointerEventsDisabled);
  useRendererProp(renderer, 'pointerEventCallback', onEvent);
  return (
    <canvas
      ref={canvasRef}
      className={classNames(className, 'mw-chain-sequence-canvas')}
      style={style}></canvas>
  );
}

export default ChainSequenceCanvas;
