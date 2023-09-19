import type { PanelRootAction } from '../../@types/components/panels';
import { useMemo } from 'react';
import { useCreateMiewRepresentation } from '../../stores/miew-store';

export default function useRepresentationsActions(): PanelRootAction[] {
  const createRep = useCreateMiewRepresentation();
  return useMemo<PanelRootAction[]>(
    () => [
      {
        key: 'create-representation',
        onAction: createRep,
        title: 'Add layer',
      },
    ],
    [createRep],
  );
}
