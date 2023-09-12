import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { ContainerProps, ContainerSizes } from '../types';
import { useChildrenSize } from './use-children-sizes';
import { getDirection, getGridStyle, mergeStyles } from './utilities';

export function useContainerStyle(
  props: ContainerProps,
): [CSSProperties | undefined, ContainerSizes] {
  const { grid, style, children, gridSizes } = props;
  const [childrenSizes] = useChildrenSize(children ?? []);
  const sizes: ContainerSizes = gridSizes ?? childrenSizes;
  const direction = getDirection(props);
  return useMemo(() => {
    const mergedStyle = mergeStyles(
      grid ? getGridStyle(sizes, direction) : undefined,
      style,
    );
    return [mergedStyle, sizes];
  }, [style, direction, grid, sizes]);
}
