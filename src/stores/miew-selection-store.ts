import { create } from 'zustand';
import type {
  MiewEntity,
  MiewSelectionStore,
  MiewSelectionData,
  Residue,
  SequenceItem,
} from '../@types/miew';
import { arraysShallowEquals } from '../helpers/rest';
import { getSelectorFromSelectedResidues } from '../helpers/miew/selection';
import { useCallback, useEffect } from 'react';
import { useMoleculeStructureStore } from './miew-molecule-structure-store';
import { useSearchStore } from './search-store';

export const useMiewSelectionStore = create<MiewSelectionStore>((set, get) => ({
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
  getSelectedResidues(): Residue[] {
    return get().selectedResidues;
  },
  setSelectedResidues(residues: Residue[]): void {
    set(() => ({
      selectedResidues: residues.slice(),
      selector: getSelectorFromSelectedResidues(residues),
    }));
  },
  getSelector(): string {
    return get().selector;
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

export function useSelectionByCodes(): (codes: string) => Residue[] {
  const { chains } = useMoleculeStructureStore();
  const { setSelectedResidues } = useMiewSelectionStore();
  return useCallback(
    (codes: string): Residue[] => {
      let all: SequenceItem[] = [];
      if (codes && codes.length > 0) {
        for (const chain of chains) {
          all = all.concat(chain.sequence);
        }
        const str = all.reduce<string>(
          (r, item) => r.concat(item.letterCode),
          '',
        );
        const searchResult = ((): Residue[] => {
          let result: Residue[] = [];
          try {
            const regExp = new RegExp(`(${codes})`, 'ig');
            let e = regExp.exec(str);
            while (e) {
              result = result.concat(
                all.slice(e.index, e.index + e[1].length).map((o) => o.residue),
              );
              e = regExp.exec(str);
            }
            return result;
          } catch (noopError) {
            // Noop
          }
          let idx = str.toUpperCase().indexOf(codes.toUpperCase());
          while (idx >= 0) {
            result = result.concat(
              all.slice(idx, idx + codes.length).map((o) => o.residue),
            );
            idx = str
              .toUpperCase()
              .indexOf(codes.toUpperCase(), idx + codes.length);
          }
          return result;
        })();
        setSelectedResidues(searchResult);
        return searchResult;
      }
      return [];
    },
    [chains, setSelectedResidues],
  );
}

export function useUrlRequestedSearch() {
  const { urlSearchRequest, setUrlSearchRequest } = useSearchStore();
  const { loaded } = useMoleculeStructureStore();
  const search = useSelectionByCodes();
  useEffect(() => {
    if (loaded && urlSearchRequest && urlSearchRequest.length > 0) {
      search(urlSearchRequest);
      setUrlSearchRequest(undefined);
    }
  }, [loaded, urlSearchRequest, search]);
}
