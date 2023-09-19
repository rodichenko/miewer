import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { produce } from 'immer';
import type { Miew } from 'miew';
import type {
  ChangeRepresentationCallback,
  MiewOptionsToCodeGenerator,
  MiewStore,
  PickEvent,
  RemoveRepresentationCallback,
} from '../@types/miew';
import type {
  MiewOptionsInitializer,
  MiewOptionsExtended,
  Representation,
  CreateRepresentationCallback,
  AddRepresentationCallback,
  MiewProxy as MiewProxyType,
} from '../@types/miew';
import type { MiewerColor } from '../@types/base';
import { useThemeConfig } from './themes-store';
import {
  cloneRepresentation,
  getMiewRepresentations,
  createDefaultRepresentation,
} from '../helpers/miew/representations';
import { clonePropertyOptions } from '../helpers/miew/property-options';
import { noop } from '../helpers/rest';
import MiewProxy from '../helpers/miew-proxy';
import {
  getMiewOptionsFromUrl,
  appendRepresentationsNamesToUrl,
} from '../helpers/miew/options';
import {
  useMiewSelectionStore,
  useUrlRequestedSearch,
} from './miew-selection-store';
import {
  getSelectedAtomsCount,
  getSelectedResidues,
} from '../helpers/miew/selection';
import { getEntityFromPickEvent } from '../helpers/miew/entity';
import { getChainSequences } from '../helpers/miew/sequences';
import { useMoleculeStructureStore } from './miew-molecule-structure-store';
import { useSearchStore } from './search-store';

export const useMiewStore = create<MiewStore>((set) => ({
  miew: undefined,
  miewProxy: undefined,
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
  setMiewProxy(miewProxy: MiewProxyType | undefined): void {
    set(() => ({
      miewProxy,
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
        store.options.source = source;
      }),
    );
  },
  setOptions(options: MiewOptionsExtended): void {
    set(
      produce((store: MiewStore) => {
        const currentSettings = store.options.settings;
        store.options = clonePropertyOptions(options);
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
            current[c].selector === result[c].selector
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
  return useCallback(
    (representation?: Representation): Representation => {
      const newRepresentation = representation ?? createDefaultRepresentation();
      callback(newRepresentation);
      return newRepresentation;
    },
    [callback],
  );
}

/**
 * Uses Miewer theme (sets Miew background color)
 */
export function useSynchronizeMiewBackgroundWithTheme() {
  const theme = useThemeConfig();
  const { setBackground } = useMiewStore();
  useEffect(() => {
    setBackground(theme.background);
  }, [theme, setBackground]);
}

/**
 * Uses miew options from url
 */
function useSynchronizedUrlOptions(): void {
  const fromUrl = useMiewStore((state) => state.optionsInitializer?.fromURL);
  const { setOptions } = useMiewStore();
  const { setUrlSearchRequest } = useSearchStore();
  useEffect(() => {
    if (fromUrl) {
      const options = getMiewOptionsFromUrl(fromUrl);
      if (options.searchRequest) {
        setUrlSearchRequest(options.searchRequest);
        delete options.searchRequest;
      }
      if (options.load) {
        options.source = options.load;
        setOptions(options);
      } else {
        setOptions({
          load: '1CRN',
          preset: 'macro',
        });
      }
    }
  }, [fromUrl, getMiewOptionsFromUrl, setOptions, setUrlSearchRequest]);
}

/**
 * Listens Miew events (loading, building representations)
 */
function useMiewEvents() {
  const { miew } = useMiewStore();
  const { setData } = useMiewSelectionStore();
  const { changeRepresentations, setSource } = useMiewStore();
  const { setChains } = useMoleculeStructureStore();
  useUrlRequestedSearch();
  useEffect(() => {
    if (miew) {
      const onMiewLoading = (event: { source: string }) => {
        setSource(event.source);
      };
      const onMiewBuildingDone = () => {
        setChains(getChainSequences(miew));
        changeRepresentations(getMiewRepresentations(miew));
      };
      const onMiewPick = (event: PickEvent): void => {
        setData({
          selectedAtomsCount: getSelectedAtomsCount(miew),
          lastPick: getEntityFromPickEvent(event),
          selectedResidues: getSelectedResidues(miew),
        });
      };
      const onMiewRepresentationsChanged = () => {
        setChains(getChainSequences(miew));
      };
      miew.addEventListener('loading', onMiewLoading);
      miew.addEventListener('buildingDone', onMiewBuildingDone);
      miew.addEventListener('newpick', onMiewPick);
      miew.addEventListener('repChanged', onMiewRepresentationsChanged);
      miew.addEventListener('repAdded', onMiewRepresentationsChanged);
      miew.addEventListener('repRemoved', onMiewRepresentationsChanged);
      return () => {
        miew.removeEventListener('loading', onMiewLoading);
        miew.removeEventListener('buildingDone', onMiewBuildingDone);
        miew.removeEventListener('newpick', onMiewPick);
        miew.removeEventListener('repChanged', onMiewRepresentationsChanged);
        miew.removeEventListener('repAdded', onMiewRepresentationsChanged);
        miew.removeEventListener('repRemoved', onMiewRepresentationsChanged);
      };
    }
    return noop;
  }, [miew, setSource, changeRepresentations, setData]);
}

/**
 * Applies options set by user via Miewer UI
 */
function useSynchronizedUserOptions() {
  const { miew, miewProxy: proxy, setMiewProxy: setProxy } = useMiewStore();
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

function useSynchronizedSelection() {
  const { selector, setSelectedAtomsCount } = useMiewSelectionStore();
  const miew = useMiew();
  useEffect(() => {
    if (miew) {
      miew.select(selector, false);
      setSelectedAtomsCount(getSelectedAtomsCount(miew));
    }
  }, [selector, miew, setSelectedAtomsCount]);
}

export function useSynchronizedMiewOptions(): MiewOptionsExtended {
  // --- Synchronizing global Miewer theme ---
  useSynchronizeMiewBackgroundWithTheme();
  // -----------------------------------------
  // --- Synchronizing events from router  ---
  useSynchronizedUrlOptions();
  // -----------------------------------------
  // --- Synchronizing events from miew ------
  // (in case of manipulating the miew options
  // via miew-cli, items selection etc.)
  useMiewEvents();
  // -----------------------------------------
  // ----- Synchronizing Miewer options ------
  // (changing miew settings via Miewer UI)
  useSynchronizedUserOptions();
  // -----------------------------------------
  // ------- Synchronizing selection ---------
  useSynchronizedSelection();
  return useMiewOptions();
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

export function useRepresentationNames(): Array<string | undefined> {
  const options = useMiewOptions();
  const { reps } = options;
  const cached = useMemo(
    () => (reps ?? []).map((rep) => rep.name ?? '').join('\n'),
    [reps],
  );
  return useMemo(
    () => cached.split('\n').map((o) => (o.length ? o : undefined)),
    [cached],
  );
}

export function useUrlGenerator(): MiewOptionsToCodeGenerator {
  const miew = useMiew();
  const names = useRepresentationNames();
  return useCallback((): string => {
    if (miew) {
      return appendRepresentationsNamesToUrl(
        miew.getURL({ settings: false, view: true, compact: false }),
        names,
      );
    }
    return '';
  }, [miew, names, appendRepresentationsNamesToUrl]);
}

export function useScriptGenerator(): MiewOptionsToCodeGenerator {
  const miew = useMiew();
  return useCallback(
    (): string =>
      miew?.getScript({ settings: false, view: true, compact: false }) ?? '',
    [miew],
  );
}
