import type { Miew } from 'miew';
import type {
  Atom,
  Chain,
  ComplexVisual,
  Molecule,
  Residue,
} from '../../@types/miew';

export function getSelectedAtomsCount(miew: Miew): number {
  let count = 0;
  miew._forEachComplexVisual((complexVisual: ComplexVisual) => {
    count += complexVisual.getSelectionCount();
  });
  return count;
}

const whiteSpaceCode = 32;

export function getAtomPositionDescription(atom: Atom): string {
  const position = [
    atom.position.x.toFixed(2),
    atom.position.y.toFixed(2),
    atom.position.z.toFixed(2),
  ].join(', ');
  return `Coordinate: (${position})`;
}

export function getAtomDescription(atom: Atom): string {
  const { residue } = atom;
  const location =
    atom.location === whiteSpaceCode ? '' : String.fromCharCode(atom.location);
  return `${atom.element.fullName} #${atom.serial}${location}: \
      ${getResidueDescription(residue)}.${atom.name}`;
}

export function getResidueDescription(residue: Residue): string {
  const type = residue.getType();
  const sequence = residue.getSequence();
  const iCode = residue.getICode().trim();
  const chain = residue.getChain();
  return `${
    type._fullName
  }: ${chain.getName()}.${type.getName()}${sequence}${iCode}`;
}

export function getChainDescription(chain: Chain): string {
  return `chain: ${chain.getName()}`;
}

export function getMoleculeDescription(molecule: Molecule): string {
  return `molecule: ${molecule.name}`;
}
