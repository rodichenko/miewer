import type {
  PredefinedTheme,
  SystemTheme,
  Theme,
} from '../@types/miewer/themes';

export function mapFontSize(fs: string | number): number {
  if (typeof fs === 'number') {
    return fs;
  }
  const e = /^(\d+)px$/.exec(fs);
  return Number(e?.[1] ?? '11');
}

export function systemThemeIsDark(): boolean {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

export function isSystemTheme(theme: Theme): theme is SystemTheme {
  return theme && 'system' in theme && theme.system === true;
}

export function getThemeConfig(theme: Theme): PredefinedTheme {
  if (isSystemTheme(theme)) {
    return systemThemeIsDark() ? theme.dark : theme.light;
  }
  return theme as PredefinedTheme;
}
