import type { Miew } from 'miew';
import type { MiewOptionsExtended } from '../../@types/miew';

export async function initializeMiew(
  options: MiewOptionsExtended,
): Promise<Miew> | never {
  if (!options.container) {
    throw new Error('Error initializing miew: container is missing');
  }
  const module = await import('miew');
  const miew = new module.Miew(options);
  if (!miew.init()) {
    throw new Error('Error initializing Miew');
  }
  miew.run();
  return miew;
}
