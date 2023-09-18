import type { QueryStringEntry } from '../@types/rest';

export function noop(): any {
  // Noop
}

export function asArray<T>(data: T | T[]): T[] {
  if (data !== undefined && Array.isArray(data)) {
    return data;
  }
  if (data !== undefined) {
    return [data];
  }
  return [];
}

export function asPlain<T>(data: T | T[]): T | undefined {
  if (data !== undefined && Array.isArray(data)) {
    return data[0];
  }
  if (data !== undefined) {
    return data;
  }
  return undefined;
}

export function getGreatestCommonDivisorEuclideanAlgorithm(
  a: number,
  b: number,
): number {
  // We're only processing integer numbers
  const t1 = Math.floor(a);
  const t2 = Math.floor(b);
  if (t1 <= 0 || t2 <= 0) {
    return 1;
  }
  // Euclidean algorithm, division-based version
  let min = Math.min(t1, t2);
  let max = Math.max(t1, t2);
  while (min !== 0) {
    const t = min;
    min = max % min;
    max = t;
  }
  return max;
}

export function getGreatestCommonDivisor(...number: number[]): number {
  if (number.length === 0) {
    return 1;
  }
  if (number.length === 1) {
    return number[0];
  }
  const [a, b, ...rest] = number;
  return getGreatestCommonDivisor(
    getGreatestCommonDivisorEuclideanAlgorithm(a, b),
    ...rest,
  );
}

export function getObjectsShallowDifferences<T extends Record<string, any>>(
  original: T,
  comparing: T,
): Partial<T> {
  const differences: Partial<T> = {};
  const keys: Array<keyof T> = Object.keys({ ...original, ...comparing });
  for (const key of keys) {
    if (original[key] !== comparing[key] && comparing[key] !== undefined) {
      differences[key] = comparing[key];
    }
  }
  return differences;
}

export function arraysEquals<T, U>(original: T[], comparing: U[]): boolean {
  if (original.length !== comparing.length) {
    return false;
  }
  for (let i = 0; i < original.length; i += 1) {
    if (!objectsEquals(original[i], comparing[i])) {
      return false;
    }
  }
  return true;
}

export function arraysShallowEquals<T, U>(
  original: T[],
  comparing: U[],
): boolean {
  if (original.length !== comparing.length) {
    return false;
  }
  for (let i = 0; i < original.length; i += 1) {
    if ((original[i] as any) !== (comparing[i] as any)) {
      return false;
    }
  }
  return true;
}

export function objectsEquals<T, U>(original: T, comparing: U): boolean {
  if (!original && !comparing) {
    return true;
  }
  if (!original || !comparing) {
    return false;
  }
  if (typeof original !== typeof comparing) {
    return false;
  }
  if (
    typeof original === 'string' ||
    typeof original === 'number' ||
    typeof original === 'boolean'
  ) {
    return (original as any) === (comparing as any);
  }
  if (Array.isArray(original) && Array.isArray(comparing)) {
    return arraysEquals(original, comparing);
  }
  if (typeof original === 'object' && typeof comparing === 'object') {
    const keysA = Object.keys(original);
    const keysB = Object.keys(comparing);
    const keys = ([] as string[]).concat(keysA).concat(keysB);
    for (const key of keys) {
      if (!(key in original) && key in comparing) {
        return false;
      }
      if (key in original && !(key in comparing)) {
        return false;
      }
      const a = original[key as keyof T];
      const b = comparing[key as keyof U];
      if (!objectsEquals(a, b)) {
        return false;
      }
    }
    return true;
  }
  return (original as any) !== (comparing as any);
}

export function getQueryStringEntries(search?: string): QueryStringEntry[] {
  const { search: locationSearch = '' } = document.location;
  const queryString = search ?? locationSearch;
  const query = queryString.startsWith('?')
    ? queryString.slice(1)
    : queryString;
  return query
    .split('&')
    .map((entryString) => entryString.split('='))
    .map(([key, ...value]) => ({
      key: decodeURIComponent(key),
      value: decodeURIComponent(value.join('=')),
    }));
}

function getQueryEntryString(
  entry: QueryStringEntry,
  encodeKey: boolean,
  encodeValue: boolean,
): string {
  const key = encodeKey ? encodeURIComponent(entry.key) : entry.key;
  const value = encodeValue ? encodeURIComponent(entry.value) : entry.value;
  return `${key}=${value}`;
}

function entryMatchesEncodeKey(
  entry: QueryStringEntry,
  encodeKey: string | RegExp,
): boolean {
  if (typeof encodeKey === 'string') {
    return entry.key === encodeKey;
  }
  return encodeKey.test(entry.key);
}

export function getQueryStringFromEntries(
  entries: QueryStringEntry[],
  ...encodeKeys: Array<string | RegExp>
): string {
  const query = entries
    .map((entry) =>
      getQueryEntryString(
        entry,
        false,
        encodeKeys.some((encodeKey) => entryMatchesEncodeKey(entry, encodeKey)),
      ),
    )
    .join('&');
  return query.length > 0 ? `?${query}` : '';
}

const escapeRegExpCharacters = [
  '.',
  '-',
  '+',
  '*',
  '?',
  '^',
  '$',
  '(',
  ')',
  '[',
  ']',
  '{',
  '}',
];

export function escapeRegExp(
  string: string,
  characters = escapeRegExpCharacters,
): string {
  let result = string;
  characters.forEach((character) => {
    result = result.replace(
      new RegExp('\\' + character, 'g'),
      `\\${character}`,
    );
  });
  return result;
}

export function getRangesFromNumberArray(
  array: number[],
): Array<[number, number]> {
  const result: Array<[number, number]> = [];
  const uniqueSorted = [...new Set(array)].sort((a, b) => a - b);
  for (const item of uniqueSorted) {
    if (result.length === 0) {
      result.push([item, item]);
    } else if (result[result.length - 1][1] < item - 1) {
      result.push([item, item]);
    } else {
      result[result.length - 1][1] = item;
    }
  }
  return result;
}
