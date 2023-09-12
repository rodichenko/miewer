import type { CSSProperties } from 'react';
import type {
  ContainerChildSize,
  ContainerSizes,
  LayoutSize,
  LayoutSizeInfo,
} from './types';

export function isFixedSize(size?: LayoutSize): boolean {
  return (
    size !== undefined &&
    (typeof size === 'number' || /^\d+(\.\d+)?px$/.test(size))
  );
}

export function isPercentSize(size?: LayoutSize): boolean {
  return typeof size === 'string' && /^\d+(\.\d+)?%/.test(size);
}

export function isFlexSize(size?: LayoutSize): boolean {
  return typeof size === 'string' && /^(\d+(\.\d+)?)?(\*|fr)/.test(size);
}

export function isLayoutSize(size: any): size is LayoutSize {
  return (
    (typeof size === 'number' || typeof size === 'string') &&
    (isFixedSize(size) || isPercentSize(size) || isFlexSize(size))
  );
}

export function getSizeInfo(size?: LayoutSize): LayoutSizeInfo {
  return {
    value: getSizeValuePart(size),
    fixed: isFixedSize(size),
    percent: isPercentSize(size),
    flex: isFlexSize(size),
    size,
  };
}

export function getSizeValuePart(size: LayoutSize | undefined): number {
  if (size === undefined) {
    return 0;
  }
  if (typeof size === 'number') {
    return size;
  }
  const e = /^(\d+(\.\d+)?)?(|px|%|\*|fr)/.exec(size);
  if (e?.[1]) {
    return Number(e[1]);
  }
  if (isFlexSize(size)) {
    return 1;
  }
  return 0;
}

export function getFixedSize(
  size: LayoutSize | undefined,
  totalSize: number,
  flexBase: number,
): number | undefined {
  if (size === undefined) {
    return undefined;
  }
  if (typeof size === 'number') {
    return size;
  }
  const getFirstRegExpGroup = (r: RegExp): number | undefined => {
    const e = r.exec(size);
    if (e?.[1] && !Number.isNaN(Number(e[1]))) {
      return Number(e[1]);
    }
    return undefined;
  };
  const getValue = (
    r: RegExp,
    fn?: (o: number) => number,
  ): number | undefined => {
    const value = getFirstRegExpGroup(r);
    if (value !== undefined) {
      return typeof fn === 'function' ? fn(value) : value;
    }
    return undefined;
  };
  return (
    getValue(/^(\d+(\.\d+)?)px$/) ??
    getValue(/^(\d+(\.\d+)?)%$/, (o) => totalSize * (o / 100.0)) ??
    getValue(/^(\d+(\.\d+)?)(\*|fr)$/, (o) => o * flexBase) ??
    (size === '*' ? flexBase : 0)
  );
}

export function parseGridSize(size?: LayoutSize, minSize?: number): string {
  const max = ((): string => {
    if (size === undefined) {
      return 'auto';
    }
    if (typeof size === 'number') {
      return `${size}px`;
    }
    if (size === 'auto') {
      return size;
    }
    if (size === '*') {
      return '1fr';
    }
    const e = /^(\d+(\.\d+)?)(fr|\*)$/i.exec(size);
    if (e?.[1]) {
      return `${e[1]}fr`;
    }
    if (/\d+(\.\d+)?%$/.test(size)) {
      return size;
    }
    return '1fr';
  })();
  const min = ((): string | undefined => {
    if (typeof minSize === 'number') {
      return `${minSize}px`;
    }
    return undefined;
  })();
  if (min && min !== max) {
    return `minmax(${minSize}px, ${max})`;
  }
  return max;
}

export function parseFlexSize(size?: LayoutSize, minSize?: number): string {
  if (size === undefined) {
    return 'auto';
  }
  if (typeof size === 'number') {
    return `${size}px`;
  }
  const minSizeConfig = minSize ? `${minSize}px` : 'auto';
  const e = /^(\d+(\.\d+)?)(fr|\*)$/i.exec(size);
  if (e?.[1]) {
    const grow = e[1];
    return `${grow} 1 ${minSizeConfig}`;
  }
  return `1 1 ${minSizeConfig}`;
}

export function getFlexStyle(
  childSize?: ContainerChildSize,
): CSSProperties | undefined {
  if (!childSize) {
    return undefined;
  }
  const { size, minSize } = childSize;
  return {
    flex: parseFlexSize(size, minSize),
  };
}

export function shallowCopySizes(sizes: ContainerSizes): ContainerSizes {
  return sizes.map((config) => ({
    key: config.key,
    index: config.index,
    size: config.size,
    minSize: config.minSize,
  }));
}

export function normalizeSizes(sizes: ContainerSizes, total: number): number[] {
  const flexes = sizes.reduce<number>(
    (r, s) => r + (isFlexSize(s.size) ? getSizeValuePart(s.size) : 0),
    0,
  );
  const flexTotal =
    total -
    sizes.reduce<number>(
      (r, s) => r + (getFixedSize(s.size, total, 0) ?? 0),
      0,
    );
  const flexBase = flexes === 0 ? 0 : flexTotal / flexes;
  return sizes.map((config) => getFixedSize(config.size, total, flexBase) ?? 0);
}
