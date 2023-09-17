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
  FlexType,
} from '../../../@types/components/layout';
import type { BasicComponentProps } from '../../../@types/components/common';
import { shallowCopySizes, parseGridSize, getFlexStyle } from '../utilities';
import SpaceContainer from './space-container';

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

export function extractChildSizeConfiguration(
  child: ContainerChild,
  defaultSize: LayoutSize = 'auto',
): { size: LayoutSize; minSize: number } {
  if (child && typeof child !== 'boolean') {
    if (child.type === SpaceContainer) {
      return { size: '*', minSize: 0 };
    }
    const { size, stretch, minSize } = child.props;
    if (size !== undefined) {
      return { size, minSize: minSize ?? 0 };
    }
    if (stretch) {
      return { size: '*', minSize: minSize ?? 0 };
    }
  }
  return { size: defaultSize, minSize: 5 };
}

export function createChildSizeConfig(
  child: ContainerChild,
  index: number,
  defaultSize: LayoutSize = 'auto',
): ContainerChildSize {
  let key: Key | undefined;
  if (typeof child !== 'boolean' && child) {
    key = child.key ?? undefined;
  }
  return {
    key: key ?? `child-${index}`,
    index,
    ...extractChildSizeConfiguration(child, defaultSize),
  };
}

export function getChildrenSizes(
  children: ContainerChildren,
  defaultSize?: LayoutSize,
): ContainerSizes {
  const sizes: ContainerSizes = [];
  Children.forEach(children, (child, index) => {
    sizes.push(createChildSizeConfig(child, index, defaultSize));
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

export function getContainerType(props: ContainerProps): {
  grid: boolean;
  flex: FlexType | boolean;
} {
  const { grid, flex } = props;
  if (grid === true) {
    return {
      grid: true,
      flex: false,
    };
  }
  return {
    grid: false,
    flex: flex ?? 'start',
  };
}

export function getContainerClassName(props: ContainerProps): string {
  const { className } = props;
  const { grid, flex } = getContainerType(props);
  return classNames(
    className,
    'mw-container',
    getDirection(props),
    {
      'mw-grid': grid,
      'mw-flex': flex,
    },
    flex && typeof flex !== 'boolean' ? `mw-flex-${flex}` : false,
  );
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
  const { grid } = getContainerType(props);
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
