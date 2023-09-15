import type { MiewerColor } from '../base';
import type {
  MiewProperty,
  MiewPropertyOptions,
  MiewPropertyOptionsManifest,
} from './base';
import { MiewPropertyOptionKind } from './base';

export enum DisplayColor {
  element = 'EL',
  residueType = 'RT',
  sequence = 'SQ',
  chain = 'CH',
  secondaryStructure = 'SS',
  uniform = 'UN',
  conditional = 'CO',
  conformation = 'CF',
  temperature = 'TM',
  occupancy = 'OC',
  hydrophobicity = 'HY',
  molecule = 'MO',
  carbon = 'CB',
}

export type ElementColorOptions = {
  carbon?: -1 | MiewerColor;
};

export const element: MiewPropertyOptionsManifest<ElementColorOptions> = {
  carbon: {
    default: -1,
    kind: MiewPropertyOptionKind.color,
  },
};

export type UniformColorOptions = {
  color: MiewerColor;
};

export const uniform: MiewPropertyOptionsManifest<UniformColorOptions> = {
  color: {
    required: true,
    default: 0xffffff,
    main: true,
    kind: MiewPropertyOptionKind.color,
  },
};

export type ConditionalColorOptions = {
  subset: string;
  color: MiewerColor;
  baseColor: MiewerColor;
};

export const conditional: MiewPropertyOptionsManifest<ConditionalColorOptions> =
  {
    subset: {
      default: 'charged',
      kind: MiewPropertyOptionKind.string,
    },
    color: {
      default: 0xff0000,
      kind: MiewPropertyOptionKind.color,
    },
    baseColor: {
      default: 0x000000,
      kind: MiewPropertyOptionKind.color,
      title: 'base color',
    },
  };

export type CarbonColorOptions = {
  color: MiewerColor;
};

export const carbon: MiewPropertyOptionsManifest<CarbonColorOptions> = {
  color: {
    default: 0x909090,
    kind: MiewPropertyOptionKind.color,
  },
};

export type Colorer<Options extends MiewPropertyOptions = MiewPropertyOptions> =
  MiewProperty<DisplayColor, Options>;

export const displayColorNames = {
  [DisplayColor.element]: 'Element',
  [DisplayColor.residueType]: 'Residue type',
  [DisplayColor.sequence]: 'Sequence',
  [DisplayColor.chain]: 'Chain',
  [DisplayColor.secondaryStructure]: 'Secondary structure',
  [DisplayColor.uniform]: 'Uniform',
  [DisplayColor.conditional]: 'Conditional',
  [DisplayColor.conformation]: 'Conformation',
  [DisplayColor.temperature]: 'Temperature',
  [DisplayColor.occupancy]: 'Occupancy',
  [DisplayColor.hydrophobicity]: 'Hydrophobicity',
  [DisplayColor.molecule]: 'Molecule',
  [DisplayColor.carbon]: 'Carbon',
};

export const displayColorOptionsManifests: Record<
  DisplayColor,
  MiewPropertyOptionsManifest
> = {
  [DisplayColor.element]: element,
  [DisplayColor.residueType]: {},
  [DisplayColor.sequence]: {},
  [DisplayColor.chain]: {},
  [DisplayColor.secondaryStructure]: {},
  [DisplayColor.uniform]: uniform,
  [DisplayColor.conditional]: conditional,
  [DisplayColor.conformation]: {},
  [DisplayColor.temperature]: {},
  [DisplayColor.occupancy]: {},
  [DisplayColor.hydrophobicity]: {},
  [DisplayColor.molecule]: {},
  [DisplayColor.carbon]: carbon,
};

export const displayColors: DisplayColor[] = Object.values(DisplayColor);
