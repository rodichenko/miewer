import type {
  ContainerSizes,
  GetDirectionSize,
  ResizeSession,
} from '../../../@types/components/layout';
import { normalizeSizes, shallowCopySizes, getSizeInfo } from '../utilities';
import { getGreatestCommonDivisor } from '../../../helpers/rest';

function isIndex(o: any): boolean {
  return o !== undefined && !Number.isNaN(Number(o));
}

export function getResizeSession(
  divider: HTMLElement,
  sizes: ContainerSizes,
  getSize: GetDirectionSize,
): ResizeSession | undefined {
  const { parentElement } = divider;
  const previousIdx = divider.dataset.previous;
  const nextIdx = divider.dataset.next;
  const children: HTMLElement[] = [];
  const dividers = new Set<number>();
  if (!parentElement || !isIndex(previousIdx) || !isIndex(nextIdx)) {
    return undefined;
  }
  const { children: parentElementChildren } = parentElement;
  for (let i = 0; i < parentElementChildren.length; i += 1) {
    const child = parentElementChildren[i];
    if (!(child instanceof HTMLElement)) {
      return undefined;
    }
    children.push(child);
    if (child.dataset.divider) {
      dividers.add(i);
    }
  }
  if (
    children.length > Number(previousIdx) &&
    children.length > Number(nextIdx)
  ) {
    return {
      calculatedSizes: children.map(getSize),
      calculatedMinSizes: sizes.map(
        (config) => (config ? config.minSize : undefined) ?? 0,
      ),
      previousId: Number(previousIdx),
      nextId: Number(nextIdx),
      grid: parentElement,
      dividers,
      sizes: shallowCopySizes(sizes),
      sizesInfo: sizes.map((config) => getSizeInfo(config.size)),
      initialSizes: shallowCopySizes(sizes),
    };
  }
  return undefined;
}

export function findIndexOfElementToResize(
  session: ResizeSession,
  from: number,
  direction: number,
  checkSize: boolean,
): number | undefined {
  if (direction === 0) {
    return from;
  }
  const inc = Math.sign(direction);
  let index = from;
  const { calculatedSizes, calculatedMinSizes, sizesInfo } = session;
  const check = (idx: number) =>
    checkSize && calculatedSizes[idx] <= calculatedMinSizes[idx];
  while (session.dividers.has(index) || sizesInfo[index].auto || check(index)) {
    if (index >= calculatedSizes.length - 1 || index === 0) {
      return undefined;
    }
    index += inc;
  }
  return index;
}

export function getResizeSessionSizesAfterDrag(
  session: ResizeSession,
  delta: number,
): ContainerSizes {
  const { calculatedSizes, calculatedMinSizes } = session;
  const previousId = findIndexOfElementToResize(
    session,
    session.previousId,
    -1,
    delta < 0,
  );
  const nextId = findIndexOfElementToResize(
    session,
    session.nextId,
    1,
    delta > 0,
  );
  if (previousId === undefined || nextId === undefined) {
    return session.sizes;
  }
  let previousSize = calculatedSizes[previousId];
  let nextSize = calculatedSizes[nextId];
  const previousMinSize = calculatedMinSizes[previousId];
  const nextMinSize = calculatedMinSizes[nextId];
  const total = previousSize + nextSize;
  previousSize = Math.max(previousMinSize, previousSize + delta);
  nextSize = Math.max(nextMinSize, total - previousSize);
  previousSize = Math.max(previousMinSize, total - nextSize);
  const newSizes = shallowCopySizes(session.sizes);
  newSizes[previousId].size = previousSize;
  newSizes[nextId].size = nextSize;
  return newSizes;
}

export function getResizeSessionFinalSizes(
  session: ResizeSession,
  getSize: GetDirectionSize,
): ContainerSizes {
  const { sizes, initialSizes, grid } = session;
  const total = getSize(grid);
  const normalized = normalizeSizes(sizes, total);
  const flexSizes = initialSizes
    .map((config, idx) => (getSizeInfo(config.size).flex ? normalized[idx] : 0))
    .filter((o) => o > 0);
  const gcd = getGreatestCommonDivisor(...flexSizes);
  const result = initialSizes.map((config, idx) => {
    const info = getSizeInfo(config.size);
    if (info.percent) {
      return {
        ...config,
        size: `${Math.floor((normalized[idx] / total) * 100.0)}%`,
      };
    }
    if (info.flex) {
      return {
        ...config,
        size: `${Math.floor(normalized[idx] / gcd)}*`,
      };
    }
    if (info.fixed) {
      return {
        ...config,
        size: normalized[idx],
      };
    }
    return config;
  });
  return shallowCopySizes(result);
}
