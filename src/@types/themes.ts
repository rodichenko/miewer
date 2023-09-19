import type { MiewerColor } from './base';

export type Theme = {
  readonly id: string;
  readonly title: string;
};

export type PredefinedTheme = Theme & {
  readonly baseBackground: MiewerColor;
  readonly background: MiewerColor;
  readonly foreground: MiewerColor;
  readonly foregroundFaded: MiewerColor;
  readonly error: MiewerColor;
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly selectionBackground: MiewerColor;
  readonly selectionForeground: MiewerColor;
  readonly dark: boolean;
};

export type SystemTheme = Theme & {
  readonly dark: PredefinedTheme;
  readonly light: PredefinedTheme;
  readonly system: true;
};

export type ThemesStore = {
  themes: Theme[];
  theme: Theme;
  themeConfig: PredefinedTheme;
  setTheme: (theme: string | Theme) => void;
  updateThemeConfig: () => void;
};
