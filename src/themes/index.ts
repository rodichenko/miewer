import { stringToColorValue } from '../helpers/colors';
import type { PredefinedTheme, SystemTheme } from '../@types/themes';
import { mapFontSize } from './utilities';
import variables from './index.scss';

const {
  fontFamily = 'verdana, sans-serif',
  fontSize = 11,
  darkBackgroundBase = '#111',
  darkBackground = '#222',
  darkForeground = '#cacaca',
  darkError = '#d13460',
  darkSelectionBackground = '#e78d04',
  darkSelectionForeground = '#222',
  lightBackgroundBase = '#e0e0e0',
  lightBackground = '#ededed',
  lightForeground = '#333',
  lightError = '#d90f45',
  lightSelectionBackground = '#e78d04',
  lightSelectionForeground = '#222',
} = variables || {};

export const darkTheme: PredefinedTheme = {
  id: 'dark-theme',
  title: 'Dark theme',
  baseBackground: stringToColorValue(darkBackgroundBase),
  background: stringToColorValue(darkBackground),
  foreground: stringToColorValue(darkForeground),
  selectionBackground: stringToColorValue(darkSelectionBackground),
  selectionForeground: stringToColorValue(darkSelectionForeground),
  error: stringToColorValue(darkError),
  fontFamily,
  fontSize: mapFontSize(fontSize),
  dark: true,
};
export const lightTheme: PredefinedTheme = {
  id: 'light-theme',
  title: 'Light theme',
  baseBackground: stringToColorValue(lightBackgroundBase),
  background: stringToColorValue(lightBackground),
  foreground: stringToColorValue(lightForeground),
  selectionBackground: stringToColorValue(lightSelectionBackground),
  selectionForeground: stringToColorValue(lightSelectionForeground),
  error: stringToColorValue(lightError),
  fontFamily,
  fontSize: mapFontSize(fontSize),
  dark: false,
};
export const systemTheme: SystemTheme = {
  id: 'system-theme',
  title: 'System theme',
  dark: darkTheme,
  light: lightTheme,
  system: true,
};
