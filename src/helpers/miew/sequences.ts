import type { Miew } from 'miew';
import type {
  Complex,
  ComplexVisual,
  ChainSequence,
  ColorerInstance,
  Residue,
  SequenceItem,
  RepresentationInstance,
} from '../../@types/miew';
import { isWater } from './entity';

export function getColorersForResidue(
  residue: Residue,
  representations: RepresentationInstance[],
): ColorerInstance[] {
  const hits: Set<number> = new Set<number>();
  residue.forEachAtom((atom) => {
    representations.forEach((representation, repIndex) => {
      if (
        representation.selector &&
        typeof representation.selector.includesAtom === 'function' &&
        representation.selector.includesAtom(atom)
      ) {
        hits.add(repIndex);
      }
    });
  });
  return [...hits]
    .map((repIndex) => representations[repIndex].colorer)
    .filter((colorer) => Boolean(colorer));
}

export function getChainSequence(
  complex: Complex,
  chain: string,
  representations: RepresentationInstance[],
): ChainSequence {
  const chainObject = complex.getChain(chain);
  const sequence: SequenceItem[] = [];
  chainObject.forEachResidue((residue: Residue) => {
    if (!isWater(residue)) {
      const anyColorer = getColorersForResidue(residue, representations).pop();
      let { letterCode } = residue.getType();
      if (letterCode.length === 0) {
        letterCode = '?';
      }
      sequence.push({
        residue,
        index: residue._index,
        code: residue.getType().getName(),
        letterCode,
        name: residue.getType()._fullName,
        colorer: anyColorer,
        complex,
      });
    }
  });
  return {
    chain: chainObject,
    complex,
    sequence,
  };
}

export function getChainSequencesFromComplex(
  complex: Complex,
  representations: RepresentationInstance[],
): ChainSequence[] {
  return complex
    .getChainNames()
    .map((chain) => getChainSequence(complex, chain, representations));
}

export function getChainSequences(miew: Miew): ChainSequence[] {
  let result: ChainSequence[] = [];
  miew._forEachComplexVisual((complexVisual: ComplexVisual) => {
    const representations: RepresentationInstance[] = [];
    for (let r = 0; r < complexVisual.repCount(); r += 1) {
      const rep = complexVisual.repGet(r);
      if (rep) {
        representations.push(rep);
      }
    }
    result = result.concat(
      getChainSequencesFromComplex(complexVisual.getComplex(), representations),
    );
  });
  return result;
}
