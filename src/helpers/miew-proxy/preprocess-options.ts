import type { MiewOptionsExtended, Representation } from '../../@types/miew';
import { arraysEquals, getObjectsShallowDifferences } from '../rest';

export function removeRepresentationName(
  representation: Representation,
): Partial<Representation> {
  const { name, ...rest } = representation;
  return rest;
}

export function processRepresentations(
  representations: Representation[] | undefined,
): Array<Partial<Representation>> | undefined {
  if (!representations) {
    return undefined;
  }
  return representations.map(removeRepresentationName);
}

export function processOptions(
  options: Partial<MiewOptionsExtended>,
): Partial<MiewOptionsExtended> {
  const { reps, source, ...rest } = options;
  return {
    ...rest,
    reps: processRepresentations(reps),
  };
}

export function getOptionsDiffIgnoringRepresentationNames(
  original: Partial<MiewOptionsExtended>,
  comparing: Partial<MiewOptionsExtended>,
): Partial<MiewOptionsExtended> {
  const { reps: originalReps, ...processedOriginal } = processOptions(original);
  const { reps: comparingReps, ...processedComparing } =
    processOptions(comparing);
  const diff: Partial<MiewOptionsExtended> = getObjectsShallowDifferences(
    processedOriginal,
    processedComparing,
  );
  if (!arraysEquals(originalReps ?? [], comparingReps ?? [])) {
    diff.reps = comparingReps;
  }
  return diff;
}
