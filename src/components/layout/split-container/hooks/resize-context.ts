import { createContext } from 'react';
import type { ResizerContext } from '../../../../@types/components/layout';
import { noop } from '../../../../helpers/rest';

export const resizerContext = createContext<ResizerContext>({
  setSizes: noop,
  sizes: [],
});
