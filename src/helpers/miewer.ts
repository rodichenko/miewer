import { DisplayColor, DisplayMode, Material } from '../@types/miew';
import type { Representation } from '../@types/miew';

export function createDefaultRepresentation(): Representation {
  return {
    selector: 'not hetatm',
    mode: DisplayMode.cartoon,
    colorer: DisplayColor.secondaryStructure,
    material: Material.softPlastic,
  };
}
