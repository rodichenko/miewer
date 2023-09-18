import type { Miew } from 'miew';
import type {
  Complex,
  ComplexVisual,
  ChainSequence,
  ColorerInstance,
  Residue,
  SequenceItem,
} from '../../@types/miew';
import { isWater } from './entity';

export function getChainSequence(
  complex: Complex,
  chain: string,
  colorer: ColorerInstance | undefined,
): ChainSequence {
  const chainObject = complex.getChain(chain);
  const sequence: SequenceItem[] = [];
  chainObject.forEachResidue((residue: Residue) => {
    if (!isWater(residue)) {
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
        colorer,
        complex,
      });
    }
  });
  return {
    chain: chainObject,
    complex,
    sequence,
    colorer,
  };
}

export function getChainSequencesFromComplex(
  complex: Complex,
  colorer: ColorerInstance | undefined,
): ChainSequence[] {
  return complex
    .getChainNames()
    .map((chain) => getChainSequence(complex, chain, colorer));
}

export function getChainSequences(miew: Miew): ChainSequence[] {
  let result: ChainSequence[] = [];
  miew._forEachComplexVisual((complexVisual: ComplexVisual) => {
    result = result.concat(
      getChainSequencesFromComplex(
        complexVisual.getComplex(),
        complexVisual.repGet()?.colorer,
      ),
    );
  });
  return result;
}
