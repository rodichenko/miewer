import React, { Children, type Key, type CSSProperties } from 'react';
import classNames from 'classnames';
import type {
  ContainerChild,
  ContainerChildren,
  ContainerChildSize,
  ContainerSizes,
  LayoutSize,
  ContainerProps,
  ContainerDirection,
} from '../../../@types/components/layout';
import type { BasicComponentProps } from '../../../@types/components/common';
import {
  shallowCopySizes,
  isLayoutSize,
  parseGridSize,
  getFlexStyle,
} from '../utilities';

export function childrenSizesHoldSameKeys(
  set1: ContainerSizes,
  set2: ContainerSizes,
): boolean {
  return !set1.some(
    (item1) =>
      Boolean(item1.key) &&
      !set2.find((item2) => Boolean(item2.key) && item1.key === item2.key),
  );
}

export function recoverSizesByKeys(
  sizes: ContainerSizes,
  original: ContainerSizes,
): ContainerSizes {
  const copy = shallowCopySizes(sizes);
  for (const size of copy) {
    const previous = original.find(
      (o) => Boolean(o.key) && Boolean(size.key) && o.key === size.key,
    );
    if (previous) {
      size.size = previous.size;
      size.minSize = previous.minSize;
    }
  }
  return copy;
}

export function childrenSizesSetsEqual(
  set1: ContainerSizes,
  set2: ContainerSizes,
): boolean {
  if (set1.length === set2.length) {
    for (let i = 0; i < set1.length; i += 1) {
      if (
        set1[i].size !== set2[i].size ||
        set1[i].minSize !== set2[i].minSize
      ) {
        return false;
      }
    }
    return true;
  }
  return false;
}

export function createChildSizeConfig(
  child: ContainerChild,
  index: number,
  minSize?: number,
): ContainerChildSize {
  let key: Key | undefined;
  let size: LayoutSize | undefined;
  let minSizeValue: number = minSize ?? 5;
  if (typeof child !== 'boolean' && child) {
    key = child.key ?? undefined;
    size = isLayoutSize(child.props.size)
      ? (child.props.size as LayoutSize)
      : child.props.flex
      ? '*'
      : undefined;
    minSizeValue =
      typeof child.props.minSize === 'number'
        ? Number(child.props.minSize)
        : minSizeValue;
  }
  return {
    key: key ?? `child-${index}`,
    index,
    size: size ?? 'auto',
    minSize: minSizeValue,
  };
}

export function getChildrenSizes(children: ContainerChildren): ContainerSizes {
  const sizes: ContainerSizes = [];
  Children.forEach(children, (child, index) => {
    sizes.push(createChildSizeConfig(child, index));
  });
  return sizes;
}

export type GetChildSizeConfig = (
  child: ContainerChild,
  index: number,
) => ContainerChildSize | undefined;

export function getChildSizeConfigByKey(
  sizes: ContainerSizes,
  key: Key | undefined,
): ContainerChildSize | undefined {
  return sizes.find((o) => Boolean(o.key) && Boolean(key) && o.key === key);
}

export function getChildSizeConfigGenerator(
  sizes: ContainerSizes,
): GetChildSizeConfig {
  return (child: ContainerChild, index: number) =>
    (child && typeof child !== 'boolean'
      ? getChildSizeConfigByKey(sizes, child.key ?? undefined)
      : undefined) ?? sizes[index];
}

export function getSizeGridIndex(size: ContainerChildSize): string {
  return typeof size.key === 'string'
    ? size.key
    : `child-${size.key ?? size.index}`;
}

export function getGridStyle(
  sizes: ContainerSizes,
  direction: ContainerDirection,
): CSSProperties | undefined {
  const template = sizes.map(
    (aSize) =>
      `[${getSizeGridIndex(aSize)}] ${parseGridSize(
        aSize.size,
        aSize.minSize,
      )}`,
  );
  switch (direction) {
    case 'vertical':
      return {
        gridTemplateRows: template.join(' '),
      };
    case 'horizontal':
      return {
        gridTemplateColumns: template.join(' '),
      };
    default:
      return undefined;
  }
}

export function setGridStyle(
  element: HTMLElement,
  sizes: ContainerSizes,
  direction: ContainerDirection,
): CSSProperties | undefined {
  const style = getGridStyle(sizes, direction);
  const { gridTemplateRows = '', gridTemplateColumns = '' } = style ?? {};
  element.style.gridTemplateRows = gridTemplateRows as string;
  element.style.gridTemplateColumns = gridTemplateColumns as string;
  return style;
}

export function getGridTemplateProperty(direction: ContainerDirection): string {
  switch (direction) {
    case 'horizontal':
      return 'gridColumn';
    case 'vertical':
    default:
      return 'gridRow';
  }
}

export function getDirection(props: {
  direction?: ContainerDirection;
}): ContainerDirection {
  const { direction = 'horizontal' } = props;
  return direction;
}

export function getContainerClassName(props: ContainerProps): string {
  const { className, grid } = props;
  return classNames(className, 'mw-container', getDirection(props), {
    'mw-grid': grid,
  });
}

export function mergeStyles(
  ...style: Array<CSSProperties | undefined>
): CSSProperties | undefined {
  const filtered = style.filter((aStyle) => aStyle !== undefined);
  if (filtered.length === 0) {
    return undefined;
  }
  if (filtered.length === 1) {
    return filtered[0];
  }
  const [a, b, ...rest] = filtered;
  return mergeStyles(
    {
      ...a,
      ...b,
    },
    ...rest,
  );
}

export function mapContainerChild<P extends BasicComponentProps>(
  child: ContainerChild<P>,
  props: ContainerProps,
  size: ContainerChildSize | undefined,
): ContainerChild<P> {
  const { grid } = props;
  const direction = getDirection(props);
  if (!child) {
    return null;
  }
  if (typeof child === 'boolean') {
    return child;
  }
  const { style, ...rest } = child.props;
  const modifiedStyle = ((): CSSProperties | undefined => {
    if (size) {
      if (grid) {
        return {
          ...(style ?? {}),
          [getGridTemplateProperty(direction)]: getSizeGridIndex(size),
        };
      }
      return {
        ...(style ?? {}),
        ...(getFlexStyle(size, direction) ?? {}),
      };
    }
    return style;
  })();
  return React.cloneElement(child, {
    ...(rest as Partial<P>),
    style: modifiedStyle,
  });
}
