import type { Miew, MiewOptions } from 'miew';
import type { MiewerSettings } from '../types/miewer';
import type { MiewBackgroundSetting, MiewSettings } from '../types/miew';

const emptySettings: MiewerSettings = {};

export async function initializeMiew(
  // eslint-disable-next-line @typescript-eslint/ban-types
  container: HTMLDivElement | null,
): Promise<Miew> | never {
  if (!container) {
    throw new Error('Error initializing miew: container is missing');
  }
  const module = await import('miew');
  return new module.Miew({
    container,
    settings: {
      axes: false,
      fps: false,
    },
  });
}

export function getMiewSettings(miewerSettings?: MiewerSettings): MiewSettings {
  const { background, ...rest } = miewerSettings ?? emptySettings;
  const bgSetting: MiewBackgroundSetting | undefined = (() => {
    if (!background) {
      return undefined;
    }

    if (typeof background === 'number') {
      return {
        color: background,
        transparent: false,
      };
    }

    return {
      color: background.color,
      transparent: background.transparent,
    };
  })();

  return {
    bg: bgSetting,
    ...rest,
  };
}

export type MiewOptionsFromUrlCallback = (search: string) => MiewOptions;

export type MiewOptionsInitializer = {
  fromURL: MiewOptionsFromUrlCallback;
};

export function getMiewOptionsFromUrl(
  initializer: MiewOptionsInitializer,
): MiewOptions {
  const { search } = document.location;
  return initializer.fromURL(search);
}
