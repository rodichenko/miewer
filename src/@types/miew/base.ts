import type { MiewerColor } from '../base';

export type MiewPropertyOptionType = string | boolean | number;

export enum MiewPropertyOptionKind {
  string = 'string',
  boolean = 'boolean',
  number = 'number',
  color = 'color',
}

type MiewPropertyOptionBase<Kind extends MiewPropertyOptionKind> = {
  kind: Kind;
};

type MiewPropertyStringOption =
  MiewPropertyOptionBase<MiewPropertyOptionKind.string>;
type MiewPropertyBooleanOption =
  MiewPropertyOptionBase<MiewPropertyOptionKind.boolean>;
type MiewPropertyNumberOption =
  MiewPropertyOptionBase<MiewPropertyOptionKind.number>;
type MiewPropertyColorOption =
  MiewPropertyOptionBase<MiewPropertyOptionKind.color>;

type MiewPropertyOption<Type extends MiewPropertyOptionType> =
  Type extends string
    ? MiewPropertyStringOption
    : Type extends boolean
    ? MiewPropertyBooleanOption
    : Type extends number
    ? MiewPropertyNumberOption | MiewPropertyColorOption
    : MiewPropertyOptionBase<MiewPropertyOptionKind>;

export type MiewPropertyOptions = Record<string, MiewPropertyOptionType>;

export type MiewPropertyConfig<
  T,
  O extends MiewPropertyOptions = MiewPropertyOptions,
> = [T, O];

export type MiewProperty<
  T,
  O extends MiewPropertyOptions = MiewPropertyOptions,
> = T | MiewPropertyConfig<T, O>;

export type MiewPropertyOptionManifest<
  Type extends MiewPropertyOptionType = MiewPropertyOptionType,
> = MiewPropertyOption<Type> & {
  required?: boolean;
  default?: Type;
  main?: boolean;
  title?: string;
};

export type MiewPropertyColorOptionManifest =
  MiewPropertyOptionManifest<MiewerColor> & {
    kind: MiewPropertyOptionKind.color;
  };

export type MiewPropertyOptionNamedManifest<
  Options extends MiewPropertyOptions = MiewPropertyOptions,
  OptionType extends MiewPropertyOptionType = MiewPropertyOptionType,
  Manifest extends
    MiewPropertyOptionManifest<OptionType> = MiewPropertyOptionManifest<OptionType>,
  Name extends keyof Options = keyof Options,
> = Manifest & {
  name: Name;
};

export type MiewPropertyOptionsManifest<
  Options extends MiewPropertyOptions = MiewPropertyOptions,
> = {
  [Key in keyof Options]: MiewPropertyOptionManifest<Options[Key]>;
};
