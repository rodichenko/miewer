import { create } from 'zustand';
import type { ChainSequence, MiewMoleculeStructureStore } from '../@types/miew';

export const useMoleculeStructureStore = create<MiewMoleculeStructureStore>(
  (set, get) => ({
    chains: [],
    chainNames: [],
    setChains(chains: ChainSequence[]) {
      set(() => ({
        chains,
        chainNames: chains.map((chain) => chain.chain.getName()),
      }));
    },
    getChain(chain: string): ChainSequence | undefined {
      return get().chains.find((aChain) => aChain.chain.getName() === chain);
    },
  }),
);
