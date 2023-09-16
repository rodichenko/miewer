import { create } from 'zustand';
import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';
import type { MapToken, SeedToken } from 'antd/es/theme/interface';
import type { Theme, ThemesStore } from '../@types/themes';
import type { PredefinedTheme } from '../@types/themes';
import { getThemeConfig, isSystemTheme } from '../themes/utilities';
import { darkTheme, lightTheme, systemTheme } from '../themes';
import { useEffect, useMemo } from 'react';
import { noop } from '../helpers/rest';
import { colorValueToString } from '../helpers/colors';

const defaultTheme = darkTheme;

function readThemeFromLocalStorage(): string {
  return localStorage.getItem('miewer-theme') ?? defaultTheme.id;
}

function writeThemeToLocalStorage(id: string) {
  localStorage.setItem('miewer-theme', id);
}

const themes = [darkTheme, lightTheme, systemTheme];
const defaultLocalStorageThemeId: string = readThemeFromLocalStorage();
const savedTheme =
  themes.find((theme) => theme.id === defaultLocalStorageThemeId) ??
  defaultTheme;

export const useThemesStore = create<ThemesStore>((set) => ({
  themes,
  theme: savedTheme,
  themeConfig: getThemeConfig(savedTheme),
  setTheme(theme: string | Theme) {
    set((state) => {
      if (typeof theme === 'string') {
        const aTheme = state.themes.find((o) => o.id === theme);
        if (aTheme) {
          writeThemeToLocalStorage(aTheme.id);
          return {
            theme: aTheme,
            themeConfig: getThemeConfig(aTheme),
          };
        }
        return {};
      }
      return {
        theme,
        themeConfig: getThemeConfig(theme),
      };
    });
  },
  updateThemeConfig() {
    set((state) => ({
      themeConfig: getThemeConfig(state.theme),
    }));
  },
}));

export function useThemes() {
  const theme = useThemesStore((state) => state.theme);
  const updateThemeConfig = useThemesStore((state) => state.updateThemeConfig);
  const themeId = useThemesStore((state) => state.themeConfig.id);
  useEffect(() => {
    document.body.classList.add(themeId);
    return () => {
      document.body.classList.remove(themeId);
    };
  }, [themeId]);
  useEffect(() => {
    if (isSystemTheme(theme)) {
      const applyTheme = () => {
        updateThemeConfig();
      };
      if (window.matchMedia) {
        const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
        if (matchMedia && typeof matchMedia.addEventListener === 'function') {
          matchMedia.addEventListener('change', applyTheme);
          return () => {
            matchMedia.removeEventListener('changed', applyTheme);
          };
        }
        if (matchMedia && typeof matchMedia.addListener === 'function') {
          // IE support
          matchMedia.addListener(applyTheme);
          return () => {
            matchMedia.removeListener(applyTheme);
          };
        }
      }
    }
    return noop;
  }, [theme, updateThemeConfig]);
}

export function useThemeConfig(): PredefinedTheme {
  return useThemesStore((store) => store.themeConfig);
}

function dropDownDarkAlgorithm(seedToken: SeedToken): MapToken {
  const mapToken = antdTheme.darkAlgorithm(seedToken);
  mapToken.colorPrimary = mapToken.colorText;
  mapToken.colorPrimaryBg = mapToken.colorFillTertiary;
  mapToken.colorPrimaryBgHover = mapToken.colorFillSecondary;
  return mapToken;
}

export function useAntdThemes(): ThemeConfig {
  const themeConfig = useThemeConfig();
  return useMemo<ThemeConfig>(
    () => ({
      algorithm: themeConfig.dark
        ? [antdTheme.darkAlgorithm]
        : [antdTheme.defaultAlgorithm],
      token: {
        borderRadiusOuter: 0,
        borderRadius: 0,
        colorError: colorValueToString(themeConfig.error),
        fontFamily: themeConfig.fontFamily,
        fontSize: themeConfig.fontSize,
      },
      components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Dropdown: {
          algorithm: themeConfig.dark
            ? [dropDownDarkAlgorithm]
            : [antdTheme.defaultAlgorithm],
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Select: {
          algorithm: themeConfig.dark
            ? [dropDownDarkAlgorithm]
            : [antdTheme.defaultAlgorithm],
        },
      },
    }),
    [themeConfig, antdTheme],
  );
}
