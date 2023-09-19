export type SearchStoreData = {
  search: string | undefined;
  urlSearchRequest: string | undefined;
};

export type SearchStoreActions = {
  setSearch(search: string | undefined): void;
  setUrlSearchRequest(urlSearchRequest: string | undefined): void;
};

export type SearchStore = SearchStoreData & SearchStoreActions;
