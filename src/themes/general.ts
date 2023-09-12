import { create } from 'zustand';
import type { MiewerColor } from '../types/base';
import { useEffect } from 'react';
import { noop } from '../helpers/rest';

export const darkBackground: MiewerColor = 0x222222;
export const darkForeground: MiewerColor = 0xcacaca;
export const lightBackground: MiewerColor = 0xf0f0f0;
export const lightForeground: MiewerColor = 0x333333;

export type Theme = {
  readonly id: string;
};

export type PredefinedTheme = Theme & {
  readonly background: MiewerColor;
  readonly foreground: MiewerColor;
};

export type SystemTheme = Theme & {
  readonly dark: PredefinedTheme;
  readonly light: PredefinedTheme;
  readonly system: true;
};

const darkTheme: PredefinedTheme = {
  id: 'dark-theme',
  background: darkBackground,
  foreground: darkForeground,
};
const lightTheme: PredefinedTheme = {
  id: 'light-theme',
  background: lightBackground,
  foreground: lightForeground,
};
const systemTheme: SystemTheme = {
  id: 'system-theme',
  dark: darkTheme,
  light: lightTheme,
  system: true,
};

const defaultTheme: Theme = systemTheme;

export type ThemesStore = {
  themes: Theme[];
  theme: Theme;
  themeConfig: PredefinedTheme;
  setTheme: (theme: string | Theme) => void;
  updateThemeConfig: () => void;
};

function systemThemeIsDark(): boolean {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function isSystemTheme(theme: Theme): theme is SystemTheme {
  return theme && 'system' in theme && theme.system === true;
}

export function getThemeConfig(theme: Theme): PredefinedTheme {
  if (isSystemTheme(theme)) {
    return systemThemeIsDark() ? theme.dark : theme.light;
  }
  return theme as PredefinedTheme;
}

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
