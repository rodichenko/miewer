import { createContext } from 'react';
import type { ContainerSizes, SetContainerSizes } from '../../types';
import { noop } from '../../../../helpers/rest';

export type ResizerContext = {
  sizes: ContainerSizes;
  setSizes: SetContainerSizes;
};

export const resizerContext = createContext<ResizerContext>({
  setSizes: noop,
  sizes: [],
});
