import { createContext } from 'react';
import type { ResizerContext } from '../../../../@types/miewer/layout';
import { noop } from '../../../../helpers/rest';

export const resizerContext = createContext<ResizerContext>({
  setSizes: noop,
  sizes: [],
});
