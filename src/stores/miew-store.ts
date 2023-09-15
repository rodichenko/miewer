import { useCallback, useEffect, useMemo, useState } from 'react';
import { create } from 'zustand';
import { produce } from 'immer';
import type { Miew } from 'miew';
import type {
  ChangeRepresentationCallback,
  MiewStore,
  RemoveRepresentationCallback,
} from '../@types/miew';
import type {
  MiewOptionsInitializer,
  MiewOptionsExtended,
  Representation,
  CreateRepresentationCallback,
  AddRepresentationCallback,
} from '../@types/miew';
import type { MiewerColor } from '../@types/base';
import { useThemeConfig } from './themes-store';
import {
  cloneRepresentation,
  getMiewRepresentations,
  getRepresentationHash,
  createDefaultRepresentation,
} from '../helpers/miew/representations';
import { cloneOptions } from '../helpers/miew/options';
import { noop } from '../helpers/rest';
import MiewProxy from '../helpers/miew-proxy';

export const useMiewStore = create<MiewStore>((set) => ({
  miew: undefined,
  error: undefined,
  options: {},
  optionsInitializer: undefined,
  setMiew(miew: Miew) {
    set(() => ({
      miew,
      optionsInitializer: (miew.constructor as any)
        .options as MiewOptionsInitializer,
    }));
  },
  setError(error: string | undefined) {
    set(() => ({
      error,
    }));
  },
  setSource(source: string): void {
    set(
      produce((store: MiewStore) => {
        store.options.load = source;
      }),
    );
  },
  setOptions(options: MiewOptionsExtended): void {
    set(
      produce((store: MiewStore) => {
        const currentSettings = store.options.settings;
        store.options = cloneOptions(options);
        if (!store.options.settings) {
          store.options.settings = currentSettings;
        } else if (currentSettings?.bg) {
          store.options.settings.bg = currentSettings.bg;
        }
      }),
    );
  },
  setBackground(background: MiewerColor): void {
    set(
      produce((store: MiewStore) => {
        store.options.settings = store.options.settings ?? {};
        store.options.settings.bg = {
          color: background,
        };
      }),
    );
  },
  addRepresentation(representation: Representation): void {
    set(
      produce((store: MiewStore) => {
        if (!store.options.reps) {
          store.options.reps = [];
        }
        store.options.reps.push(representation);
      }),
    );
  },
  changeRepresentation(index: number, representation: Representation): void {
    set(
      produce((store: MiewStore) => {
        if (!store.options.reps) {
          store.options.reps = [];
        }
        if (store.options.reps.length <= index) {
          store.options.reps.push(representation);
        } else {
          store.options.reps[index] = representation;
        }
      }),
    );
  },
  changeRepresentations(representations: Representation[]): void {
    set(
      produce((store: MiewStore) => {
        const result = representations.map(cloneRepresentation);
        const current = (store.options.reps ?? []).map(cloneRepresentation);
        let changed = current.length !== result.length;
        for (let c = 0; c < Math.max(current.length, result.length); c += 1) {
          if (
            current[c] &&
            result[c] &&
            getRepresentationHash(current[c]) ===
              getRepresentationHash(result[c])
          ) {
            result[c].name = current[c].name;
          } else {
            changed = true;
          }
        }
        if (changed) {
          store.options.reps = result;
        }
      }),
    );
  },
  removeRepresentation(index: number): void {
    set(
      produce((store: MiewStore) => {
        if (store.options.reps) {
          store.options.reps.splice(index, 1);
        }
      }),
    );
  },
}));

export function useMiew(): Miew | undefined {
  return useMiewStore((state) => state.miew);
}

function useMiewOptions(): MiewOptionsExtended {
  return useMiewStore().options;
}

export function useMiewRepresentations(): Representation[] {
  const { reps } = useMiewOptions();
  return useMemo(() => reps ?? [], [reps]);
}

export function useAddMiewRepresentation(): AddRepresentationCallback {
  return useMiewStore((store) => store.addRepresentation);
}

export function useChangeMiewRepresentation(): ChangeRepresentationCallback {
  return useMiewStore((store) => store.changeRepresentation);
}

export function useRemoveMiewRepresentation(): RemoveRepresentationCallback {
  return useMiewStore((store) => store.removeRepresentation);
}

export function useCreateMiewRepresentation(): CreateRepresentationCallback {
  const callback = useAddMiewRepresentation();
  return useCallback((): Representation => {
    const newRepresentation = createDefaultRepresentation();
    callback(newRepresentation);
    return newRepresentation;
  }, [callback]);
}

/**
 * Uses Miewer theme (sets Miew background color)
 */
function useSynchronizedThemeOptions() {
  const theme = useThemeConfig();
  const { setBackground } = useMiewStore();
  useEffect(() => {
    setBackground(theme.background);
  }, [theme, setBackground]);
}

/**
 * Uses options from url
 */
function useSynchronizedUrlOptions(): void {
  const fromUrl = useMiewStore((state) => state.optionsInitializer?.fromURL);
  const { setOptions } = useMiewStore();
  const { search } = window.location;
  useEffect(() => {
    if (fromUrl) {
      const options = cloneOptions(fromUrl(search));
      if (options.load) {
        setOptions(options);
      } else {
        setOptions({
          load: '1CRN',
          preset: 'macro',
        });
      }
    }
  }, [fromUrl, search, setOptions]);
}

/**
 * Listens Miew events (loading, building representations)
 */
function useSynchronizedMiewCliOptions() {
  const miew = useMiew();
  const { changeRepresentations } = useMiewStore();
  useEffect(() => {
    if (miew) {
      const onMiewBuildingDone = () => {
        changeRepresentations(getMiewRepresentations(miew));
      };
      miew.addEventListener('buildingDone', onMiewBuildingDone);
      return () => {
        miew.removeEventListener('buildingDone', onMiewBuildingDone);
      };
    }
    return noop;
  }, [miew]);
}

/**
 * Applies options set by user via Miewer UI
 */
function useSynchronizedUserOptions() {
  const miew = useMiew();
  const [proxy, setProxy] = useState<MiewProxy | undefined>(undefined);
  useEffect(() => {
    if (miew) {
      const aProxy = new MiewProxy(miew);
      setProxy(aProxy);
      return () => {
        setProxy(undefined);
        aProxy.dispose();
      };
    }
    return noop;
  }, [miew, setProxy]);
  const options = useMiewOptions();
  useEffect(() => {
    if (proxy) {
      proxy.requestOptions(options);
    }
    return noop;
  }, [proxy, options]);
}

export function useSynchronizedMiewOptions(): void {
  // --- Synchronizing global Miewer theme ---
  useSynchronizedThemeOptions();
  // -----------------------------------------
  // --- Synchronizing events from router  ---
  useSynchronizedUrlOptions();
  // -----------------------------------------
  // --- Synchronizing events from miew ------
  // (in case of manipulating the miew options
  // via miew-cli)
  useSynchronizedMiewCliOptions();
  // -----------------------------------------
  // ----- Synchronizing Miewer options ------
  // (changing miew settings via Miewer UI)
  useSynchronizedUserOptions();
}

export function useDisableMiewHotKeys(): () => void {
  const miew = useMiew();
  return useCallback(() => {
    if (miew) {
      miew.enableHotKeys(false);
    }
  }, [miew]);
}

export function useEnableMiewHotKeys(): () => void {
  const miew = useMiew();
  return useCallback(() => {
    if (miew) {
      miew.enableHotKeys(true);
    }
  }, [miew]);
}
