import type { BasicComponentProps } from './common';
import type { CSSProperties } from 'react';
import type {
  Representation,
  MiewProperty,
  MiewPropertyOptionsManifest,
  MiewPropertyType,
  MiewPropertyOptions,
  MiewPropertyOptionType,
  MiewPropertyOptionNamedManifest,
  DisplayColor,
  DisplayMaterial,
  DisplayMode,
  ChangeRepresentationCallback,
} from '../miew';

export type RepresentationProps = {
  repIndex: number;
  representation: Representation;
  disabled?: boolean;
  onRemove?: (index: number) => void;
  onEdit?: ChangeRepresentationCallback;
};

export type RepresentationItemProps = BasicComponentProps &
  RepresentationProps & {
    displayColorer?: boolean;
    displayMode?: boolean;
    displayMaterial?: boolean;
  };

export type SingleColorOptionProps<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
> = BasicComponentProps & {
  disabled?: boolean;
  value: MiewProperty<Type, Options> | undefined;
  onChange: (value: MiewProperty<Type, Options>) => void;
  manifests: Record<Type, MiewPropertyOptionsManifest>;
};

export type RepresentationFormProps = BasicComponentProps & RepresentationProps;

export type RepresentationFormModalProps = RepresentationFormProps & {
  visible: boolean;
  onClose: () => void;
};

export type ChangeRepresentationPropertyCallback<T> = (value: T) => void;

export type PropertyOptionProps<
  Type extends MiewPropertyType,
  OptionType extends MiewPropertyOptionType,
  Options extends MiewPropertyOptions,
> = BasicComponentProps & {
  disabled?: boolean;
  option: MiewPropertyOptionNamedManifest<Options, OptionType>;
  property: MiewProperty<Type, Options> | undefined;
  propertyManifest: MiewPropertyOptionsManifest<Options>;
  onChange?: ChangeRepresentationPropertyCallback<MiewProperty<Type, Options>>;
};

export type PropertyOptionsProps<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
> = BasicComponentProps & {
  optionClassName?: string;
  optionStyle?: CSSProperties;
  disabled?: boolean;
  property: MiewProperty<Type, Options> | undefined;
  manifests: Record<Type, MiewPropertyOptionsManifest>;
  onChange?: ChangeRepresentationPropertyCallback<MiewProperty<Type, Options>>;
};

export type DefinedPropertyOptionsProps<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
> = Omit<PropertyOptionsProps<Type, Options>, 'manifests'>;

export type ModeOptionsProps<Options extends MiewPropertyOptions> =
  DefinedPropertyOptionsProps<DisplayMode, Options>;
export type ColorerOptionsProps<Options extends MiewPropertyOptions> =
  DefinedPropertyOptionsProps<DisplayColor, Options>;
export type MaterialOptionsProps<Options extends MiewPropertyOptions> =
  DefinedPropertyOptionsProps<DisplayMaterial, Options>;
