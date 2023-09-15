import variables from './index.scss';
import { stringToColorValue } from '../helpers/colors';
import type { PredefinedTheme, SystemTheme, Theme } from '../@types/themes';
import { mapFontSize } from './utilities';

const {
  fontFamily = 'verdana, sans-serif',
  fontSize = 11,
  darkBackground = '#222',
  darkForeground = '#cacaca',
  darkError = '#d13460',
  lightBackground = '#f0f0f0',
  lightForeground = '#333',
  lightError = '#d90f45',
} = variables || {};

export const darkTheme: PredefinedTheme = {
  id: 'dark-theme',
  background: stringToColorValue(darkBackground),
  foreground: stringToColorValue(darkForeground),
  error: stringToColorValue(darkError),
  fontFamily,
  fontSize: mapFontSize(fontSize),
  dark: true,
};
export const lightTheme: PredefinedTheme = {
  id: 'light-theme',
  background: stringToColorValue(lightBackground),
  foreground: stringToColorValue(lightForeground),
  error: stringToColorValue(lightError),
  fontFamily,
  fontSize: mapFontSize(fontSize),
  dark: false,
};
export const systemTheme: SystemTheme = {
  id: 'system-theme',
  dark: darkTheme,
  light: lightTheme,
  system: true,
};

export const defaultTheme: Theme = systemTheme;
