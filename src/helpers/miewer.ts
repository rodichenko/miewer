import { useMemo } from 'react';

export function useSingleItem<T>(
  data: T[],
  selector?: (item: T) => boolean,
): T | undefined {
  return useMemo(() => {
    if (data.length === 1) {
      return data[0];
    }
    if (selector) {
      return data.filter(selector)[0];
    }
    return undefined;
  }, [data, selector]);
}
