import type ChainRenderer from './index';
import { useEffect } from 'react';

export default function useRendererProp<Property extends keyof ChainRenderer>(
  renderer: ChainRenderer | undefined,
  property: Property,
  value: ChainRenderer[Property],
): void {
  useEffect(() => {
    if (renderer) {
      renderer[property] = value;
    }
  }, [renderer, property, value]);
}
