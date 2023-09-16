import type { MiewerColor } from '../base';
import type { Miew, MiewOptions } from 'miew';
import type {
  MiewPropertyOptions,
  MiewPropertyConfig,
  MiewProperty,
  MiewPropertyOptionManifest,
  MiewPropertyOptionNamedManifest,
  MiewPropertyColorOptionManifest,
  MiewPropertyOptionsManifest,
  MiewPropertyOptionType,
} from './base';
import { MiewPropertyOptionKind } from './base';
import type { Colorer } from './display-color';
import type { Mode } from './display-mode';
import type { Material } from './display-material';
import {
  DisplayColor,
  displayColorNames,
  displayColorOptionsManifests,
  displayColors,
} from './display-color';
import {
  DisplayMode,
  displayModeNames,
  displayModesOptionsManifests,
  displayModes,
} from './display-mode';
import {
  DisplayMaterial,
  displayMaterialNames,
  displayMaterialOptionsManifests,
  displayMaterials,
} from './display-material';

export { DisplayColor, DisplayMode, DisplayMaterial };

export type MiewBackgroundSetting = {
  color: MiewerColor;
  transparent?: boolean;
};

export enum MiewShadowType {
  random = 'random',
  basic = 'basic',
  pcf = 'pcf',
}

export type MiewShadowSetting = {
  on: boolean;
  type?: MiewShadowType;
  radius?: number;
};

export enum Palette {
  jm = 'JM',
  jmol = 'JMOL',
}

export type MiewSettings = {
  bg?: MiewBackgroundSetting;
  palette?: Palette;
  shadow?: MiewShadowSetting;
  ao?: boolean;
  aromatic?: boolean;
  autobuild?: boolean;
  autoRotation?: number;
  autoRotationAxisFixed?: boolean;
  axes?: boolean;
  colorers?: Record<any, any>;
  editing?: boolean;
  fbxprec?: number;
  fox?: boolean;
  fogFarFactor?: number;
  fogNearFactor?: number;
  fps?: boolean;
  fxaa?: boolean;
  interpolateViews?: boolean;
  maxfps?: number;
  modes?: Record<any, any>;
  outline?: boolean;
  pick?: string;
  picking?: boolean;
  singleUnit?: boolean;
  stereo?: string;
  suspendRender?: boolean;
  translationSpeed?: number;
  transparency?: string;
  zooming?: boolean;
  zSprite?: boolean;
};
export type TextModeOptions = {
  colors: boolean;
  adjustColor: boolean;
};
export type Representation = {
  name?: string | undefined;
  selector?: string;
  mode?: Mode;
  colorer?: Colorer;
  material?: Material;
};
export type MiewOptionsExtended = MiewOptions & {
  source?: string;
  reps?: Representation[];
  settings?: MiewSettings;
  view?: string;
  preset?: string;
};
export type MiewOptionsFromUrlCallback = (
  search: string,
) => MiewOptionsExtended;
export type MiewOptionsToCodeGenerator = () => string;
export type MiewOptionsInitializer = {
  fromURL: MiewOptionsFromUrlCallback;
};
export type AddRepresentationCallback = (
  representation: Representation,
) => void;
export type ChangeRepresentationCallback = (
  index: number,
  representation: Representation,
) => void;
export type RemoveRepresentationCallback = (index: number) => void;
export type ModifyRepresentationsCallback = (
  representations: Representation[],
) => void;
export type SetMiewSourceCallback = (source: string) => void;
export type SetMiewOptionsCallback = (options: MiewOptionsExtended) => void;
export type SetMiewBackgroundCallback = (color: MiewerColor) => void;
export type SetMiewCallback = (miew: Miew) => void;
export type SetErrorCallback = (error: string | undefined) => void;
export type CreateRepresentationCallback = () => Representation;

export type MiewStoreData = {
  miew: Miew | undefined;
  error: string | undefined;
  optionsInitializer: MiewOptionsInitializer | undefined;
  options: MiewOptionsExtended;
};

export type MiewStoreActions = {
  setMiew: SetMiewCallback;
  setError: SetErrorCallback;
  setSource: SetMiewSourceCallback;
  setOptions: SetMiewOptionsCallback;
  setBackground: SetMiewBackgroundCallback;
  addRepresentation: AddRepresentationCallback;
  changeRepresentation: ChangeRepresentationCallback;
  changeRepresentations: ModifyRepresentationsCallback;
  removeRepresentation: RemoveRepresentationCallback;
};

export type MiewStore = MiewStoreData & MiewStoreActions;

export type MiewPropertyType = DisplayColor | DisplayMode | DisplayMaterial;

export type ItemCallback<T> = (item: T) => void;
export type ItemIterator<T> = (callback: ItemCallback<T>) => void;

export type Element = {
  number: number;
  name: string;
  fullName: string;
  weight: number;
  radius: number;
  radiusBonding: number;
  hydrogenValency: number[];
};

export type Position = {
  x: number;
  y: number;
  z: number;
};

export type Atom = {
  name: string;
  serial: string;
  location: number;
  residue: Residue;
  element: Element;
  position: Position;
};

export type ResidueType = {
  _name: string;
  _fullName: string;
  letterCode: string;
  getName(): string;
};

export type Residue = {
  getChain(): Chain;
  getMolecule(): Molecule;
  getType(): ResidueType;
  getSequence(): string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  getICode(): string;
};

export type Chain = {
  forEachResidue: ItemIterator<ResidueType>;
  getName(): string;
  getComplex(): Complex;
  getResidueCount(): number;
};

export type Molecule = {
  name: string;
  complex: Complex;
  forEachResidue: ItemIterator<ResidueType>;
};

export type PickEventObject = {
  atom?: Atom;
  residue?: Residue;
  molecule?: Molecule;
  chain?: Chain;
};

export enum MiewEntityType {
  atom = 'atom',
  residue = 'residue',
  molecule = 'molecule',
  chain = 'chain',
}

export type MiewAtom = {
  type: MiewEntityType.atom;
  entity: Atom;
};

export type MiewResidue = {
  type: MiewEntityType.residue;
  entity: Residue;
};

export type MiewChain = {
  type: MiewEntityType.chain;
  entity: Chain;
};

export type MiewMolecule = {
  type: MiewEntityType.molecule;
  entity: Molecule;
};

export type MiewEntity = MiewAtom | MiewResidue | MiewChain | MiewMolecule;

export type PickEvent = {
  obj?: PickEventObject;
};

export type Complex = {
  getChainNames(): string[];
};

export type ComplexVisual = {
  getSelectionCount(): number;
  getComplex(): Complex;
};

export type MiewSelectionStore = {
  lastPick: MiewEntity | undefined;
  selectedAtomsCount: number;
  setLastPick(entity: MiewEntity | undefined): void;
  setSelectedAtomsCount(count: number): void;
};

export {
  displayColors,
  displayMaterials,
  displayModes,
  displayColorNames,
  displayMaterialNames,
  displayModeNames,
  displayColorOptionsManifests,
  displayMaterialOptionsManifests,
  displayModesOptionsManifests,
  MiewPropertyOptionKind,
};

export type {
  Colorer,
  Material,
  Mode,
  MiewProperty,
  MiewPropertyConfig,
  MiewPropertyOptions,
  MiewPropertyOptionManifest,
  MiewPropertyColorOptionManifest,
  MiewPropertyOptionNamedManifest,
  MiewPropertyOptionsManifest,
  MiewPropertyOptionType,
};
