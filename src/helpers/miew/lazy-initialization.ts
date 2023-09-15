import type { Miew } from 'miew';

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
