import { create } from 'zustand';
import type { MiewEntity, MiewSelectionStore } from '../@types/miew';

export const useMiewSelectionStore = create<MiewSelectionStore>((set) => ({
  lastPick: undefined,
  selectedAtomsCount: 0,
  setLastPick(entity: MiewEntity | undefined) {
    set(() => ({ lastPick: entity }));
  },
  setSelectedAtomsCount(count: number): void {
    set(() => ({ selectedAtomsCount: count }));
  },
}));
