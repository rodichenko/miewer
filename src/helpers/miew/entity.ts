import type {
  MiewAtom,
  MiewChain,
  MiewEntity,
  MiewMolecule,
  MiewResidue,
  PickEvent,
} from '../../@types/miew';
import { MiewEntityType } from '../../@types/miew';

export function isMiewAtom(entity: MiewEntity): entity is MiewAtom {
  return entity.type === MiewEntityType.atom;
}

export function isMiewResidue(entity: MiewEntity): entity is MiewResidue {
  return entity.type === MiewEntityType.residue;
}

export function isMiewChain(entity: MiewEntity): entity is MiewChain {
  return entity.type === MiewEntityType.chain;
}

export function isMiewMolecule(entity: MiewEntity): entity is MiewMolecule {
  return entity.type === MiewEntityType.molecule;
}

export function getEntityFromPickEvent(
  event: PickEvent,
): MiewEntity | undefined {
  if (event.obj?.atom) {
    return {
      type: MiewEntityType.atom,
      entity: event.obj.atom,
    };
  }
  if (event.obj?.residue) {
    return {
      type: MiewEntityType.residue,
      entity: event.obj.residue,
    };
  }
  if (event.obj?.chain) {
    return {
      type: MiewEntityType.chain,
      entity: event.obj.chain,
    };
  }
  if (event.obj?.molecule) {
    return {
      type: MiewEntityType.molecule,
      entity: event.obj.molecule,
    };
  }
  return undefined;
}
