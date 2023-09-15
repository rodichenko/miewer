import type { Miew } from 'miew';
import type { Representation } from '../../@types/miew';
import { cloneProperty, getPropertyHash, propertiesEqual } from './properties';
import { DisplayColor, DisplayMaterial, DisplayMode } from '../../@types/miew';

export function getMiewRepresentations(miew: Miew): Representation[] {
  const count = miew.repCount(undefined) as number;
  const representations = [];
  for (let i = 0; i < count; i += 1) {
    const { selector, mode, material, colorer } = miew.rep(
      i,
      undefined,
    ) as Representation;
    representations.push({
      selector,
      mode,
      material,
      colorer,
    });
  }
  return representations;
}

export function cloneRepresentation(
  representation: Representation,
): Representation {
  const { name, selector, mode, colorer, material } = representation;
  return {
    name,
    selector,
    mode: mode ? cloneProperty(mode) : undefined,
    colorer: colorer ? cloneProperty(colorer) : undefined,
    material: material ? cloneProperty(material) : undefined,
  };
}

export function getRepresentationHash(representation: Representation) {
  const { selector, mode, colorer, material } = representation;
  return [
    selector,
    mode ? getPropertyHash(mode) : '',
    colorer ? getPropertyHash(colorer) : '',
    material ? getPropertyHash(material) : '',
  ].join('|');
}

export function createDefaultRepresentation(): Representation {
  return {
    selector: 'not hetatm',
    mode: DisplayMode.cartoon,
    colorer: DisplayColor.secondaryStructure,
    material: DisplayMaterial.softPlastic,
  };
}

export function representationsEqual(
  rep1: Representation,
  rep2: Representation,
): boolean {
  const {
    name: name1,
    selector: selector1,
    colorer: colorer1,
    material: material1,
    mode: mode1,
  } = rep1;
  const {
    name: name2,
    selector: selector2,
    colorer: colorer2,
    material: material2,
    mode: mode2,
  } = rep2;
  return (
    (name1 ?? '') === (name2 ?? '') &&
    (selector1 ?? '') === (selector2 ?? '') &&
    propertiesEqual(colorer1, colorer2) &&
    propertiesEqual(material1, material2) &&
    propertiesEqual(mode1, mode2)
  );
}
