import { useEffect, useState } from 'react';
import type {
  SetContainerSizes,
  ContainerChildren,
  ContainerSizes,
} from '../../../../@types/miewer/layout';
import {
  childrenSizesHoldSameKeys,
  childrenSizesSetsEqual,
  getChildrenSizes,
  recoverSizesByKeys,
} from '../utilities';

export function useChildrenSize(
  children?: ContainerChildren,
): [ContainerSizes, SetContainerSizes] {
  const [sizes, setChildSizes] = useState<ContainerSizes>([]);
  useEffect(() => {
    const newSizes: ContainerSizes = getChildrenSizes(children);
    setChildSizes((current) => {
      const sameKeys = childrenSizesHoldSameKeys(newSizes, current);
      const recovered = sameKeys
        ? recoverSizesByKeys(newSizes, current)
        : newSizes;
      if (!childrenSizesSetsEqual(recovered, current)) {
        return recovered;
      }
      return current;
    });
  }, [children, setChildSizes]);
  return [sizes, setChildSizes];
}
