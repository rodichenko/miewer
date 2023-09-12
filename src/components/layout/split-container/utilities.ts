import type { ContainerSizes } from '../types';
import { normalizeSizes, shallowCopySizes, getSizeInfo } from '../utilities';
import { getGreatestCommonDivisor } from '../../../helpers/rest';
import type { GetDirectionSize, ResizeSession } from './types';

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
  if (
    parentElement &&
    isIndex(previousIdx) &&
    isIndex(nextIdx) &&
    parentElement.children.length > Number(previousIdx) &&
    parentElement.children.length > Number(nextIdx) &&
    parentElement.children[Number(previousIdx)] instanceof HTMLElement &&
    parentElement.children[Number(nextIdx)] instanceof HTMLElement
  ) {
    const previous = parentElement.children[Number(previousIdx)] as HTMLElement;
    const next = parentElement.children[Number(nextIdx)] as HTMLElement;
    const previousConfig = sizes[Number(previousIdx)];
    const nextConfig = sizes[Number(nextIdx)];
    return {
      previousSize: getSize(previous),
      previousMinSize:
        (previousConfig ? previousConfig.minSize : undefined) ?? 50,
      previousId: Number(previousIdx),
      nextSize: getSize(next),
      nextMinSize: (nextConfig ? nextConfig.minSize : undefined) ?? 50,
      nextId: Number(nextIdx),
      grid: parentElement,
      sizes: shallowCopySizes(sizes),
      initialSizes: shallowCopySizes(sizes),
    };
  }
  return undefined;
}

export function getResizeSessionSizesAfterDrag(
  session: ResizeSession,
  delta: number,
): ContainerSizes {
  let { previousSize, nextSize } = session;
  const total = previousSize + nextSize;
  previousSize = Math.max(session.previousMinSize, previousSize + delta);
  nextSize = Math.max(session.nextMinSize, total - previousSize);
  previousSize = Math.max(session.previousMinSize, total - nextSize);
  const newSizes = shallowCopySizes(session.sizes);
  newSizes[session.previousId].size = previousSize;
  newSizes[session.nextId].size = nextSize;
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
