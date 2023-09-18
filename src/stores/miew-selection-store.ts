import { create } from 'zustand';
import type {
  MiewEntity,
  MiewSelectionStore,
  MiewSelectionData,
  Residue,
} from '../@types/miew';
import { arraysShallowEquals } from '../helpers/rest';
import { getSelectorFromSelectedResidues } from '../helpers/miew/selection';

export const useMiewSelectionStore = create<MiewSelectionStore>((set) => ({
  lastPick: undefined,
  selectedAtomsCount: 0,
  selectedResidues: [],
  selector: '',
  setLastPick(entity: MiewEntity | undefined) {
    set(() => ({ lastPick: entity }));
  },
  setSelectedAtomsCount(count: number): void {
    set(() => ({ selectedAtomsCount: count }));
  },
  setSelectedResidues(residues: Residue[]): void {
    set(() => ({
      selectedResidues: residues.slice(),
      selector: getSelectorFromSelectedResidues(residues),
    }));
  },
  setData(data: MiewSelectionData): void {
    set((current) => {
      const {
        lastPick = current.lastPick,
        selectedAtomsCount = current.selectedAtomsCount,
        selectedResidues = current.selectedResidues,
        selector = getSelectorFromSelectedResidues(selectedResidues),
      } = data;
      if (
        lastPick === current.lastPick &&
        selectedAtomsCount === current.selectedAtomsCount &&
        (selectedResidues === current.selectedResidues ||
          arraysShallowEquals(selectedResidues, current.selectedResidues)) &&
        selector === current.selector
      ) {
        return current;
      }
      return data;
    });
  },
}));
