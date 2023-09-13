import { create } from 'zustand';
import type { Theme, ThemesStore } from '../@types/miewer/themes';
import type { PredefinedTheme } from '../@types/miewer/themes';
import { getThemeConfig, isSystemTheme } from '../themes/utilities';
import { darkTheme, defaultTheme, lightTheme, systemTheme } from '../themes';
import { useEffect } from 'react';
import { noop } from '../helpers/rest';

export const useThemesStore = create<ThemesStore>((set) => ({
  themes: [darkTheme, lightTheme, systemTheme],
  theme: defaultTheme,
  themeConfig: getThemeConfig(defaultTheme),
  setTheme(theme: string | Theme) {
    set((state) => {
      if (typeof theme === 'string') {
        const aTheme = state.themes.find((o) => o.id === theme);
        if (aTheme) {
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
