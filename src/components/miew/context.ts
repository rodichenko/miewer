import { create } from 'zustand';
import type { Miew } from 'miew';
import type { MiewStore } from './types';

export const useMiewStore = create<MiewStore>((set) => ({
  miew: undefined,
  error: undefined,
  setMiew(miew: Miew) {
    set(() => ({
      miew,
    }));
  },
  setError(error: string | undefined) {
    set(() => ({
      error,
    }));
  },
}));

export function useMiew(): Miew | undefined {
  return useMiewStore((state) => state.miew);
}
