import type {
  Colorer,
  DisplayColor,
  DisplayMaterial,
  DisplayMode,
  Material,
  MiewProperty,
  MiewPropertyColorOptionManifest,
  MiewPropertyConfig,
  MiewPropertyOptionManifest,
  MiewPropertyOptionNamedManifest,
  MiewPropertyOptions,
  MiewPropertyOptionsManifest,
  MiewPropertyOptionType,
  MiewPropertyType,
  Mode,
} from '../../@types/miew';
import {
  displayColorOptionsManifests,
  displayMaterialOptionsManifests,
  displayModesOptionsManifests,
  MiewPropertyOptionKind,
} from '../../@types/miew';
import type { MiewerColor } from '../../@types/base';
import { objectsEquals } from '../rest';

export function isPropertyConfig<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
>(property: MiewProperty<Type>): property is MiewPropertyConfig<Type, Options> {
  return property && Array.isArray(property);
}

export function getPropertyOptions<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
>(property: MiewProperty<Type, Options>): Options | undefined {
  if (isPropertyConfig(property)) {
    return property[1];
  }
  return undefined;
}

export function serializePropertyOptions(
  propertyConfig: MiewPropertyOptions,
): string {
  return Object.entries(propertyConfig)
    .map(([prop, value]) => ({ prop, value }))
    .sort((a, b) => a.prop.localeCompare(b.prop))
    .map(({ prop, value }) => `${prop}:${value}`)
    .join('/');
}

export function getPropertyHash<Type extends MiewPropertyType>(
  property: MiewProperty<Type>,
): string {
  if (isPropertyConfig(property)) {
    return [property[0], serializePropertyOptions(property[1])].join('/');
  }
  return property.toString();
}

export function cloneProperty<Type extends MiewPropertyType>(
  property: MiewProperty<Type>,
): MiewProperty<Type> {
  if (isPropertyConfig(property)) {
    const config: MiewPropertyOptions = {
      ...(property[1] ?? {}),
    };
    return [property[0], config] as MiewPropertyConfig<Type>;
  }
  return property;
}

export function getPropertyValue<Type extends MiewPropertyType>(
  property: MiewProperty<Type>,
): Type {
  return isPropertyConfig(property) ? property[0] : property;
}

function initializeOptionIfRequired<Type extends MiewPropertyOptionType>(
  optionManifest: MiewPropertyOptionManifest<Type>,
): Type | undefined {
  if (optionManifest.required) {
    return optionManifest.default;
  }
  return undefined;
}

export function initializeMiewPropertyOptions<
  Options extends MiewPropertyOptions,
>(
  manifest: MiewPropertyOptionsManifest<Options>,
  allowEmpty = false,
): Options | undefined {
  const optionManifests = Object.entries(manifest ?? {}) as Array<
    [string, MiewPropertyOptionManifest]
  >;
  const options: Partial<Options> = optionManifests
    .map((entry) => {
      const [option, optionManifest] = entry;
      const value = initializeOptionIfRequired(optionManifest);
      if (value) {
        return {
          [option]: value,
        };
      }
      return false;
    })
    .filter(Boolean)
    .reduce<Partial<Options>>(
      (result, opt) => ({
        ...result,
        ...opt,
      }),
      {},
    );
  if (Object.keys(options).length === 0 && !allowEmpty) {
    return undefined;
  }
  return options as Options;
}

export function initializeMiewProperty<Type extends MiewPropertyType>(
  type: Type,
  optionsManifests: Record<Type, MiewPropertyOptionsManifest>,
): MiewProperty<Type> {
  const options = initializeMiewPropertyOptions(optionsManifests[type]);
  if (options) {
    return [type, options];
  }
  return type;
}

export function initializeColorer(type: DisplayColor): Colorer {
  return initializeMiewProperty(type, displayColorOptionsManifests);
}

export function initializeMode(type: DisplayMode): Mode {
  return initializeMiewProperty(type, displayModesOptionsManifests);
}

export function initializeMaterial(type: DisplayMaterial): Material {
  return initializeMiewProperty(type, displayMaterialOptionsManifests);
}

export function getPropertyManifest<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
>(
  property: MiewProperty<Type, Options>,
  manifests: Record<Type, MiewPropertyOptionsManifest>,
): MiewPropertyOptionsManifest<Options> | undefined {
  const value = getPropertyValue(property);
  return manifests[value] as MiewPropertyOptionsManifest<Options>;
}

export function getOptionsForProperty<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
>(
  property: MiewProperty<Type, Options>,
  manifests: Record<Type, MiewPropertyOptionsManifest>,
): Array<MiewPropertyOptionNamedManifest<Options>> {
  const value = getPropertyValue(property);
  const manifest = manifests[value];
  const optionManifests = Object.entries(manifest ?? {});
  return optionManifests.map<MiewPropertyOptionNamedManifest<Options>>(
    ([name, m]) => ({
      ...m,
      name,
    }),
  );
}

export function getOptionsForColorer<Options extends MiewPropertyOptions>(
  colorer: Colorer<Options>,
): MiewPropertyOptionManifest[] {
  return getOptionsForProperty(colorer, displayColorOptionsManifests);
}

export function getOptionsForMode<Options extends MiewPropertyOptions>(
  mode: Mode<Options>,
): MiewPropertyOptionManifest[] {
  return getOptionsForProperty(mode, displayModesOptionsManifests);
}

export function getOptionsForMaterial<Options extends MiewPropertyOptions>(
  material: Material<Options>,
): MiewPropertyOptionManifest[] {
  return getOptionsForProperty(material, displayMaterialOptionsManifests);
}

export function isColorOptionManifest(
  manifest: MiewPropertyOptionManifest,
): manifest is MiewPropertyColorOptionManifest {
  return manifest && manifest.kind === MiewPropertyOptionKind.color;
}

export function getColorOptionsForProperty<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
>(
  property: MiewProperty<Type, Options>,
  manifests: Record<Type, MiewPropertyOptionsManifest>,
): Array<MiewPropertyOptionNamedManifest<Options, MiewerColor>> {
  return getOptionsForProperty(property, manifests).filter((m) =>
    isColorOptionManifest(m),
  ) as Array<MiewPropertyOptionNamedManifest<Options, MiewerColor>>;
}

export function getColorOptionsForColorer<Options extends MiewPropertyOptions>(
  colorer: Colorer<Options>,
): Array<MiewPropertyOptionNamedManifest<Options, MiewerColor>> {
  return getColorOptionsForProperty(colorer, displayColorOptionsManifests);
}

export function getColorOptionsForMode<Options extends MiewPropertyOptions>(
  mode: Mode<Options>,
): Array<MiewPropertyOptionNamedManifest<Options, MiewerColor>> {
  return getColorOptionsForProperty(mode, displayModesOptionsManifests);
}

export function getColorOptionsForMaterial<Options extends MiewPropertyOptions>(
  material: Material<Options>,
): Array<MiewPropertyOptionNamedManifest<Options, MiewerColor>> {
  return getColorOptionsForProperty(material, displayMaterialOptionsManifests);
}

export function getPropertyOptionValue<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
  OptionType extends MiewPropertyOptionType,
  OptionName extends keyof Options,
>(
  property: MiewProperty<Type, Options>,
  manifest: MiewPropertyOptionNamedManifest<
    Options,
    OptionType,
    MiewPropertyOptionManifest<OptionType>,
    OptionName
  >,
): OptionType | undefined {
  const options = getPropertyOptions(property);
  if (options) {
    return options[manifest.name] as unknown as OptionType;
  }
  return undefined;
}

export function setPropertyOptionValue<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
  OptionType extends MiewPropertyOptionType,
>(
  property: MiewProperty<Type, Options>,
  propertyManifest: MiewPropertyOptionsManifest<Options>,
  optionManifest: MiewPropertyOptionNamedManifest<
    Options,
    OptionType,
    MiewPropertyOptionManifest<OptionType>
  >,
  value: OptionType | undefined,
): MiewProperty<Type, Options> {
  let options = getPropertyOptions(property);
  if (!options && value !== undefined) {
    options = initializeMiewPropertyOptions(propertyManifest, true);
  }
  if (options) {
    return [
      getPropertyValue(property),
      {
        ...options,
        [optionManifest.name]: value,
      },
    ];
  }
  return property;
}

export function propertiesOptionsEqual<Type extends MiewPropertyOptions>(
  options1: Type | undefined,
  options2: Type | undefined,
): boolean {
  if (!options1 && !options2) {
    return true;
  }
  if (!options1 || !options2) {
    return false;
  }
  return objectsEquals(options1, options2);
}

export function propertiesEqual<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
>(
  property1: MiewProperty<Type, Options> | undefined,
  property2: MiewProperty<Type, Options> | undefined,
) {
  if (!property1 && !property2) {
    return true;
  }
  if (!property1 || !property2) {
    return false;
  }
  const p1 = getPropertyValue(property1);
  const p2 = getPropertyValue(property2);
  if (p1 !== p2) {
    return false;
  }
  const pOptions1 = getPropertyOptions(property1);
  const pOptions2 = getPropertyOptions(property2);
  return propertiesOptionsEqual(pOptions1, pOptions2);
}
