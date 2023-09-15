import { useEffect, useState } from 'react';
import type { MiewOptionsExtended } from '../../@types/miew';
import { useThemeConfig } from '../../stores/themes-store';

export default function useInitializationOptions(
  container?: HTMLDivElement,
): MiewOptionsExtended | undefined {
  const [initializationOptions, setInitializationOptions] = useState<
    MiewOptionsExtended | undefined
  >();
  const theme = useThemeConfig();
  useEffect(() => {
    if (
      container &&
      theme &&
      (!initializationOptions || initializationOptions.container !== container)
    ) {
      setInitializationOptions({
        container,
        settings: {
          bg: {
            color: theme.background,
          },
          axes: false,
          fps: false,
        },
      });
    }
  }, [container, theme, initializationOptions]);
  return initializationOptions;
}
