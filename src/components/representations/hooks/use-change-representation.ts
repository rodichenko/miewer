import { useCallback, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import type {
  ChangeRepresentationCallback,
  Representation,
  Colorer,
  Material,
  Mode,
} from '../../../@types/miew';
import type { ChangeRepresentationPropertyCallback } from '../../../@types/components/representations';
import useChangeProperty from './use-change-property';

export default function useChangeRepresentation(
  representation: Representation,
  repIndex: number,
  onEdit: ChangeRepresentationCallback,
): {
  changeName: ChangeRepresentationPropertyCallback<string>;
  changeNameEvent: ChangeRepresentationPropertyCallback<
    ChangeEvent<{ value: string }>
  >;
  changeSelector: ChangeRepresentationPropertyCallback<string>;
  changeSelectorEvent: ChangeRepresentationPropertyCallback<
    ChangeEvent<{ value: string }>
  >;
  changeMaterial: ChangeRepresentationPropertyCallback<Material>;
  changeMode: ChangeRepresentationPropertyCallback<Mode>;
  changeColorer: ChangeRepresentationPropertyCallback<Colorer>;
} {
  const onChangeProperty = useChangeProperty(representation, repIndex, onEdit);
  const changeName = useCallback(
    (name: string): void => {
      onChangeProperty({ name });
    },
    [onChangeProperty],
  );
  const changeNameEvent = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      onChangeProperty({ name: event.target.value });
    },
    [onChangeProperty],
  );
  const changeSelector = useCallback(
    (selector: string): void => {
      onChangeProperty({ selector });
    },
    [onChangeProperty],
  );
  const changeSelectorEvent = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      onChangeProperty({ selector: event.target.value });
    },
    [onChangeProperty],
  );
  const changeMode = useCallback(
    (mode: Mode): void => {
      onChangeProperty({ mode });
    },
    [onChangeProperty],
  );
  const changeColorer = useCallback(
    (colorer: Colorer): void => {
      onChangeProperty({ colorer });
    },
    [onChangeProperty],
  );
  const changeMaterial = useCallback(
    (material: Material): void => {
      onChangeProperty({ material });
    },
    [onChangeProperty],
  );
  return useMemo(
    () => ({
      changeName,
      changeNameEvent,
      changeSelector,
      changeSelectorEvent,
      changeMaterial,
      changeMode,
      changeColorer,
    }),
    [
      changeName,
      changeNameEvent,
      changeSelector,
      changeSelectorEvent,
      changeMaterial,
      changeMode,
      changeColorer,
    ],
  );
}
