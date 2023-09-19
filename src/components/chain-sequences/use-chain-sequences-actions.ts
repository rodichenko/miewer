import { useCallback, useMemo } from 'react';
import type { PanelRootAction } from '../../@types/components/panels';
import { useMiewSelectionStore } from '../../stores/miew-selection-store';
import { useCreateMiewRepresentation } from '../../stores/miew-store';
import { DisplayColor, DisplayMode } from '../../@types/miew';
import type { UniformColorOptions } from '../../@types/miew/display-color';
import { useChainSequencesConfig } from '../../stores/chain-sequences-config-store';
import { ChainSequenceRenderType } from '../../@types/components/chain-sequences';

export default function useChainSequencesActions(): PanelRootAction[] {
  const { getSelector, getSelectedResidues, setSelectedResidues } =
    useMiewSelectionStore();
  const hasSelection = getSelectedResidues().length > 0;
  const { setUseColorer, setRenderType, renderType, useColorer } =
    useChainSequencesConfig();
  const createRepresentation = useCreateMiewRepresentation();
  const clearSelection = useCallback(() => {
    setSelectedResidues([]);
  }, [setSelectedResidues]);
  const createLayerFromSelection = useCallback(() => {
    const selector = getSelector();
    if (selector) {
      createRepresentation({
        selector,
        name: 'Layer from selection',
        mode: DisplayMode.cartoon,
        colorer: [
          DisplayColor.uniform,
          { color: 0xff0000 } satisfies UniformColorOptions,
        ],
      });
      clearSelection();
    }
  }, [getSelector, createRepresentation, clearSelection]);
  return useMemo<PanelRootAction[]>(() => {
    const actions: PanelRootAction[] = [];
    actions.push({
      key: 'config',
      title: 'Appearance',
      actions: [
        {
          key: 'display-type-letter',
          title: 'Residue letter code',
          checked: renderType === ChainSequenceRenderType.letter,
          onAction() {
            setRenderType(ChainSequenceRenderType.letter);
          },
        },
        {
          key: 'display-type-name',
          title: 'Residue code',
          checked: renderType === ChainSequenceRenderType.name,
          onAction() {
            setRenderType(ChainSequenceRenderType.name);
          },
        },
        {
          type: 'divider',
        },
        {
          key: 'use-colorer',
          title: 'Use layer color',
          checked: useColorer,
          onAction() {
            setUseColorer(!useColorer);
          },
        },
      ],
    });
    actions.push({
      key: 'selection',
      title: 'Selection',
      disabled: !hasSelection,
      actions: [
        {
          key: 'add-layer-from-selection',
          title: 'Add layer from selection',
          onAction: createLayerFromSelection,
          disabled: !hasSelection,
        },
        {
          type: 'divider',
        },
        {
          key: 'clear-selection',
          title: 'Clear',
          onAction: clearSelection,
          disabled: !hasSelection,
        },
      ],
    });
    return actions;
  }, [
    hasSelection,
    createLayerFromSelection,
    clearSelection,
    useColorer,
    renderType,
    setRenderType,
    setUseColorer,
  ]);
}
