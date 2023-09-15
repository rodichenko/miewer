import type { MiewProperty } from './base';
import type { MiewPropertyOptions, MiewPropertyOptionsManifest } from './base';

export enum DisplayMaterial {
  diffuse = 'DF',
  softPlastic = 'SF',
  glossyPlastic = 'PL',
  metal = 'ME',
  transparent = 'TR',
  glass = 'GL',
  backdrop = 'BA',
  toon = 'TN',
  flat = 'FL',
}

export const displayMaterialNames = {
  [DisplayMaterial.diffuse]: 'Diffuse',
  [DisplayMaterial.softPlastic]: 'Soft plastic',
  [DisplayMaterial.glossyPlastic]: 'Glossy plastic',
  [DisplayMaterial.metal]: 'Metal',
  [DisplayMaterial.transparent]: 'Transparent',
  [DisplayMaterial.glass]: 'Glass',
  [DisplayMaterial.backdrop]: 'Backdrop',
  [DisplayMaterial.toon]: 'Toon',
  [DisplayMaterial.flat]: 'Flat',
};

export const displayMaterialOptionsManifests: Record<
  DisplayMaterial,
  MiewPropertyOptionsManifest
> = {
  [DisplayMaterial.diffuse]: {},
  [DisplayMaterial.softPlastic]: {},
  [DisplayMaterial.glossyPlastic]: {},
  [DisplayMaterial.metal]: {},
  [DisplayMaterial.transparent]: {},
  [DisplayMaterial.glass]: {},
  [DisplayMaterial.backdrop]: {},
  [DisplayMaterial.toon]: {},
  [DisplayMaterial.flat]: {},
};

export type Material<
  Options extends MiewPropertyOptions = MiewPropertyOptions,
> = MiewProperty<DisplayMaterial, Options>;

export const displayMaterials: DisplayMaterial[] =
  Object.values(DisplayMaterial);
