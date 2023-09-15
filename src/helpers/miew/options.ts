import type { MiewOptionsExtended } from '../../@types/miew';
import { cloneRepresentation } from './representations';

export function cloneOptions(
  options: MiewOptionsExtended,
): MiewOptionsExtended {
  const { reps, ...rest } = options;
  return {
    ...rest,
    reps: reps ? reps.map(cloneRepresentation) : undefined,
  };
}
