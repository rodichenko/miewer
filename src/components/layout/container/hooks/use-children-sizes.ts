import { useCallback, useEffect, useState } from 'react';
import type {
  SetContainerSizes,
  ContainerChildren,
  ContainerSizes,
  LayoutSize,
} from '../../../../@types/components/layout';
import {
  childrenSizesHoldSameKeys,
  childrenSizesSetsEqual,
  getChildrenSizes,
  recoverSizesByKeys,
} from '../utilities';

export function useChildrenSize(
  children?: ContainerChildren,
  defaultSize?: LayoutSize,
): [ContainerSizes, ContainerChildren | undefined, SetContainerSizes] {
  const [data, setData] = useState<{
    sizes: ContainerSizes;
    children: ContainerChildren | undefined;
  }>({
    sizes: getChildrenSizes(children, defaultSize),
    children,
  });
  const setChildSizes = useCallback(
    (newSizes: ContainerSizes) => {
      setData((current) => ({
        sizes: newSizes,
        children: current.children,
      }));
    },
    [setData],
  );
  const { sizes, children: synchronizedChildren } = data;
  useEffect(() => {
    const newSizes: ContainerSizes = getChildrenSizes(children, defaultSize);
    setData((current) => {
      const sameKeys = childrenSizesHoldSameKeys(newSizes, current.sizes);
      const recovered = sameKeys
        ? recoverSizesByKeys(newSizes, current.sizes)
        : newSizes;
      if (!childrenSizesSetsEqual(recovered, current.sizes)) {
        return {
          sizes: recovered,
          children,
        };
      }
      return {
        sizes: current.sizes,
        children,
      };
    });
  }, [children, defaultSize, setData]);
  return [sizes, synchronizedChildren, setChildSizes];
}
