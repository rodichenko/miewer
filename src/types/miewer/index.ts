import type { MiewerColor } from '../base';
import type {
  MiewBackgroundSetting,
  MiewSettings,
  DisplayColor,
  DisplayMode,
  Material,
} from '../miew';

export type MiewerSettings = MiewSettings & {
  background?: MiewerColor | MiewBackgroundSetting;
};

export type Representation = {
  displayMode: DisplayMode;
  displayColor: DisplayColor;
  material: Material;
};
