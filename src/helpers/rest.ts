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
