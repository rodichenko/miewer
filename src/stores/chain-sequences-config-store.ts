import { create } from 'zustand';
import type {
  ChainSequencesConfigData,
  ChainSequencesConfigStore,
} from '../@types/components/chain-sequences';
import { ChainSequenceRenderType } from '../@types/components/chain-sequences';
import { createLocalSettings } from '../helpers/rest';

const { read, save } = createLocalSettings<ChainSequencesConfigData>(
  'miewer-chain-sequences-config',
  {
    renderType: ChainSequenceRenderType.letter,
    useColorer: true,
  },
);

const config = read();

export const useChainSequencesConfig = create<ChainSequencesConfigStore>(
  (set, get) => ({
    renderType: config.renderType,
    useColorer: config.useColorer,
    setRenderType(renderType: ChainSequenceRenderType): void {
      get().setConfig({
        renderType,
      });
    },
    setUseColorer(useColorer: boolean): void {
      get().setConfig({
        useColorer,
      });
    },
    setConfig(config: Partial<ChainSequencesConfigData>): void {
      set(() => config);
      save({
        renderType: get().renderType,
        useColorer: get().useColorer,
        ...config,
      });
    },
  }),
);
