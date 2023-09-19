import type { CSSProperties } from 'react';
import type {
  ContainerChildSize,
  ContainerDirection,
  ContainerSizes,
  LayoutSize,
  LayoutSizeInfo,
} from '../../@types/components/layout';
import { isCssNumberValue, parseCssNumberValue } from '../../helpers/rest';

export function isFixedSize(size?: LayoutSize): boolean {
  return (
    size !== undefined &&
    (typeof size === 'number' || isCssNumberValue(size, 'px'))
  );
}

export function isPercentSize(size?: LayoutSize): boolean {
  return typeof size === 'string' && isCssNumberValue(size, '%');
}

export function isFlexSize(size?: LayoutSize): boolean {
  return (
    typeof size === 'string' &&
    (isCssNumberValue(size, '*', '%') || /^(\*|fr)$/i.test(size))
  );
}

export function isAutoSize(size?: LayoutSize): boolean {
  return typeof size === 'string' && /^auto$/i.test(size);
}

export function getSizeInfo(size?: LayoutSize): LayoutSizeInfo {
  return {
    value: getSizeValuePart(size),
    fixed: isFixedSize(size),
    percent: isPercentSize(size),
    flex: isFlexSize(size),
    auto: isAutoSize(size),
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
  if (!Number.isNaN(Number(size))) {
    return Number(size);
  }
  const value = parseCssNumberValue(size, 'px', '%', '*', 'fr');
  if (value !== undefined) {
    return value;
  }
  if (/^(\*|fr)$/i.test(size)) {
    return 1;
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
  const getValue = (
    units: string[],
    fn?: (o: number) => number,
  ): number | undefined => {
    const value = parseCssNumberValue(size, ...units);
    if (value !== undefined) {
      return typeof fn === 'function' ? fn(value) : value;
    }
    return undefined;
  };
  return (
    getValue(['px']) ??
    getValue(['%'], (o) => totalSize * (o / 100.0)) ??
    getValue(['*', 'fr'], (o) => o * flexBase) ??
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

export function getFlexStyle(
  childSize: ContainerChildSize,
  direction: ContainerDirection,
): CSSProperties | undefined {
  if (!childSize) {
    return undefined;
  }
  const { size, minSize } = childSize;
  if (typeof size === 'string') {
    const e = /^(\d+(\.\d+)?)?(fr|\*)$/i.exec(size);
    if (e) {
      const grow = e[1] ?? 1;
      const minSizeValue = minSize ? `${minSize}px` : 'auto';
      return { flex: `${grow} 1 ${minSizeValue}` };
    }
  }
  switch (direction) {
    case 'horizontal':
      return { width: size, minWidth: minSize };
    case 'vertical':
    default:
      return { height: size, minHeight: minSize };
  }
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
