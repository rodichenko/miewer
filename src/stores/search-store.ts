import { create } from 'zustand';
import type { SearchStore } from '../@types/search';

export const useSearchStore = create<SearchStore>((set) => ({
  search: undefined,
  urlSearchRequest: undefined,
  setSearch(search: string | undefined) {
    set(() => ({ search }));
  },
  setUrlSearchRequest(urlSearchRequest: string | undefined) {
    set(() => ({ urlSearchRequest }));
  },
}));
