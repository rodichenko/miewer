import type { Miew } from 'miew';
import type { Representation } from '../@types/miew';
import type { UniformColorer } from '../@types/miew';
import type { DisplayColor } from '../@types/miew';

export async function initializeMiew(
  // eslint-disable-next-line @typescript-eslint/ban-types
  container: HTMLDivElement | null,
): Promise<Miew> | never {
  if (!container) {
    throw new Error('Error initializing miew: container is missing');
  }
  const module = await import('miew');
  const miew = new module.Miew({
    container,
    settings: {
      axes: false,
      fps: false,
    },
  });
  if (!miew.init()) {
    throw new Error('Error initializing Miew');
  }
  miew.run();
  return miew;
}

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
    mode,
    colorer: Array.isArray(colorer)
      ? (colorer.slice() as UniformColorer)
      : colorer,
    material,
  };
}

export function getColorerHash(colorer: DisplayColor | UniformColorer): string {
  if (Array.isArray(colorer)) {
    return [colorer[0], colorer[1].color].join('/');
  }
  return colorer;
}

export function getRepresentationHash(representation: Representation) {
  const { selector, mode, colorer, material } = representation;
  return [selector, mode, getColorerHash(colorer), material].join('|');
}
