import type {
  MiewOptionsExtended,
  MiewOptionsFromUrlCallback,
} from '../../@types/miew';
import { clonePropertyOptions } from './property-options';
import type { QueryStringEntry } from '../../@types/rest';
import { getQueryStringEntries, getQueryStringFromEntries } from '../rest';

const representationNameQueryKeyRegExp = /^r\.n\.(\d+)$/i;

const ignoredKeys = /^(bg\.color)$/i;

export function filterIgnoredKeys(
  entries: QueryStringEntry[],
): QueryStringEntry[] {
  return entries.filter((entry) => !ignoredKeys.test(entry.key));
}

export function getRepresentationNamesFromEntries(
  entries: QueryStringEntry[],
): {
  names: Array<string | undefined>;
  filteredEntries: QueryStringEntry[];
} {
  const repsNames = entries.filter((entry) =>
    representationNameQueryKeyRegExp.test(entry.key),
  );
  const filtered = entries.filter(
    (entry) => !representationNameQueryKeyRegExp.test(entry.key),
  );
  const names: string[] = [];
  repsNames.forEach((repNameEntry) => {
    const e = representationNameQueryKeyRegExp.exec(repNameEntry.key);
    if (e?.[1]) {
      names[Number(e?.[1])] = repNameEntry.value;
    }
  });
  return {
    names,
    filteredEntries: filtered,
  };
}

export function getSearchRequestFromEntries(entries: QueryStringEntry[]): {
  search: string | undefined;
  filteredEntries: QueryStringEntry[];
} {
  const search = entries.find((o) => /^search$/i.test(o.key));
  const filteredEntries = entries.filter((o) => !/^search$/i.test(o.key));
  return {
    search: search ? search.value : undefined,
    filteredEntries,
  };
}

export function appendRepresentationNamesToEntries(
  entries: QueryStringEntry[],
  names: Array<string | undefined>,
): QueryStringEntry[] {
  const result: QueryStringEntry[] = [];
  names.forEach((name, index) => {
    if (name) {
      result.push({
        key: `r.n.${index}`,
        value: name,
      });
    }
  });
  return result.concat(entries.slice());
}

export function getMiewOptionsFromUrl(
  fromUrl: MiewOptionsFromUrlCallback,
): MiewOptionsExtended {
  const entries = getQueryStringEntries();
  const { names, filteredEntries: filteredAfterNames } =
    getRepresentationNamesFromEntries(entries);
  const { search, filteredEntries } =
    getSearchRequestFromEntries(filteredAfterNames);
  const filteredQuery = getQueryStringFromEntries(
    filterIgnoredKeys(filteredEntries),
    'v',
    representationNameQueryKeyRegExp,
  );
  const options = clonePropertyOptions(fromUrl(filteredQuery));
  options.searchRequest = search;
  const { reps, ...rest } = options;
  if (reps) {
    for (let r = 0; r < Math.min(reps.length, names.length); r += 1) {
      reps[r].name = names[r];
    }
  }
  return {
    ...rest,
    reps,
  };
}

export function appendRepresentationsNamesToUrl(
  url: string,
  representationsNames?: Array<string | undefined>,
): string {
  try {
    const urlObject = new URL(url);
    urlObject.search = getQueryStringFromEntries(
      filterIgnoredKeys(
        appendRepresentationNamesToEntries(
          getQueryStringEntries(urlObject.search),
          representationsNames ?? [],
        ),
      ),
      'v',
      representationNameQueryKeyRegExp,
    );
    return urlObject.href;
  } catch (error) {
    if (error instanceof Error) {
      console.warn(error.message);
    } else {
      console.warn(error);
    }
  }
  return '';
}
