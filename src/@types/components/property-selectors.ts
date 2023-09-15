import type { BasicComponentProps } from './common';
import type {
  MiewProperty,
  MiewPropertyType,
  DisplayColor,
  DisplayMaterial,
  DisplayMode,
  MiewPropertyOptionsManifest,
} from '../miew';

export type MiewPropertySelectorProps<T extends MiewPropertyType> =
  BasicComponentProps & {
    disabled?: boolean;
    value: MiewProperty<T> | undefined;
    onChange: (value: MiewProperty<T>) => void;
    onConfigure?: () => void;
    items: T[];
    titles: Record<T, string>;
    manifests: Record<T, MiewPropertyOptionsManifest>;
    displayFullName?: boolean;
    type?: 'button' | 'select';
  };

export type DefinedMiewPropertySelectorProps<T extends MiewPropertyType> = Omit<
  MiewPropertySelectorProps<T>,
  'items' | 'titles' | 'manifests'
>;

export type ModeSelectorProps = DefinedMiewPropertySelectorProps<DisplayMode>;
export type ColorerSelectorProps =
  DefinedMiewPropertySelectorProps<DisplayColor>;
export type MaterialSelectorProps =
  DefinedMiewPropertySelectorProps<DisplayMaterial>;
