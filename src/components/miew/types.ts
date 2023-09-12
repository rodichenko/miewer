import type { Miew } from 'miew';

export type MiewStore = {
  miew: Miew | undefined;
  error: string | undefined;
  setMiew(miew: Miew): void;
  setError(error: string | undefined): void;
};
