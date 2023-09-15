import { useCallback } from 'react';
import type {
  ChangeRepresentationCallback,
  Representation,
} from '../../../@types/miew';

export default function useChangeProperty(
  representation: Representation,
  repIndex: number,
  onEdit: ChangeRepresentationCallback,
) {
  return useCallback(
    (property: Partial<Representation>): void => {
      onEdit(repIndex, {
        ...representation,
        ...property,
      });
    },
    [onEdit, repIndex, representation],
  );
}
