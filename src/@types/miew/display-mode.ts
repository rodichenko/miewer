import type {
  MiewProperty,
  MiewPropertyOptions,
  MiewPropertyOptionsManifest,
} from './base';
import { DisplayColor } from './display-color';

export enum DisplayMode {
  lines = 'LN',
  licorice = 'LC',
  ballsAndSticks = 'BS',
  vanDerWaals = 'VW',
  solventAccessibleSurface = 'SA',
  solventExcludedSurface = 'SE',
  quickSurface = 'QS',
  contactSurface = 'CS',
  trace = 'TR',
  tube = 'TU',
  cartoon = 'CA',
  text = 'TX',
  volumeDensity = 'VD',
}

export type Mode<Options extends MiewPropertyOptions = MiewPropertyOptions> =
  MiewProperty<DisplayMode>;

export const displayModeNames: Record<DisplayMode, string> = {
  [DisplayMode.lines]: 'Lines',
  [DisplayMode.licorice]: 'Licorice',
  [DisplayMode.ballsAndSticks]: 'Balls and sticks',
  [DisplayMode.vanDerWaals]: 'Van der Waals',
  [DisplayMode.solventAccessibleSurface]: 'Solvent accessible surface',
  [DisplayMode.solventExcludedSurface]: 'Solvent excluded surface',
  [DisplayMode.quickSurface]: 'Quick surface',
  [DisplayMode.contactSurface]: 'Contact surface',
  [DisplayMode.trace]: 'Trace',
  [DisplayMode.tube]: 'Tube',
  [DisplayMode.cartoon]: 'Cartoon',
  [DisplayMode.text]: 'Text',
  [DisplayMode.volumeDensity]: 'Volume density',
};

export const displayModesOptionsManifests: Record<
  DisplayMode,
  MiewPropertyOptionsManifest
> = {
  [DisplayMode.lines]: {},
  [DisplayMode.licorice]: {},
  [DisplayMode.ballsAndSticks]: {},
  [DisplayMode.vanDerWaals]: {},
  [DisplayMode.solventAccessibleSurface]: {},
  [DisplayMode.solventExcludedSurface]: {},
  [DisplayMode.quickSurface]: {},
  [DisplayMode.contactSurface]: {},
  [DisplayMode.trace]: {},
  [DisplayMode.tube]: {},
  [DisplayMode.cartoon]: {},
  [DisplayMode.text]: {},
  [DisplayMode.volumeDensity]: {},
};

export const displayModes: DisplayMode[] = Object.values(DisplayMode);
