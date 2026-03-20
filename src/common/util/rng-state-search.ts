import { FixedSizeQueue } from "~/common/util/fixed-size-queue";
import type { MtRand } from "~/common/util/mt-rand";

/**
 * Tests whether the given rng engine contains a targetSequence starting within
 * its next searchDepth advances, returning the current stateIndex of the rng
 * engine after the found targetSequence.
 *
 * This function uses a rolling hash to optimize search speed. You may
 * optionally provide the targetSequenceHash (via createSequenceHash) to avoid
 * re-creating it for multiple searches for the same sequence; it will be
 * created for you otherwise.
 *
 * If the target sequence is empty, true is returned with no actions taken.
 * Otherwise, if searchDepth is 0, false is returned with no actions taken.
 *
 * This function advances the given rng engine. If the target sequence was
 * found, its stateIndex will be one after the end of the target sequence.
 * Otherwise, its stateIndex will be its initial stateIndex plus the length of
 * the target sequence plus searchDepth minus 1.
 *
 * @param rng The rng engine (mutated)
 * @param searchDepth The number of advances to test within
 * @param generateNextValue A function with which to generate values from the
 *   rng engine
 * @param targetSequence The target sequence
 * @param targetSequenceHash (optional) the pre-computed target sequence hash
 * @returns True if the target sequence was found, false otherwise
 */
export function searchRngForSequence(
  rng: MtRand,
  searchDepth: number,
  generateNextValue: (rng: MtRand) => number,
  targetSequence: number[],
  targetSequenceHash?: number,
): boolean {
  if (targetSequence.length === 0) {
    return true;
  }

  if (searchDepth === 0) {
    return false;
  }

  if (targetSequenceHash === undefined) {
    targetSequenceHash = createSequenceHash(targetSequence);
  }

  const initialRngValues = new Array<number>(targetSequence.length);
  for (let i = 0; i < targetSequence.length; i++) {
    const rngVal = generateNextValue(rng);
    initialRngValues[i] = rngVal;
  }

  const rngValueQueue = FixedSizeQueue.of(initialRngValues);
  let rngValueHash = createSequenceHash(initialRngValues);

  let i = 0;
  while (true) {
    if (
      targetSequenceHash === rngValueHash &&
      arrayEquals(targetSequence, rngValueQueue.array)
    ) {
      return true;
    }

    i++;
    if (i >= searchDepth) {
      break;
    }

    const nextRngValue = generateNextValue(rng);
    const oldRngValue = rngValueQueue.shiftAndPush(nextRngValue);
    rngValueHash = alterSequenceHash(
      rngValueHash,
      targetSequence.length,
      oldRngValue,
      nextRngValue,
    );
  }

  return false;
}

export function createSequenceHash(sequence: number[]): number {
  let sequenceHash = 0;
  for (const element of sequence) {
    sequenceHash = alterSequenceHash(sequenceHash, sequence.length, 0, element);
  }

  return sequenceHash;
}

function alterSequenceHash(
  oldSequenceHash: number,
  sequenceSize: number,
  oldValue: number,
  nextValue: number,
) {
  return rol(oldSequenceHash ^ rol(oldValue, sequenceSize) ^ nextValue, 1);
}

function rol(x: number, shift: number) {
  return (x << shift) | (x >>> -shift);
}

function arrayEquals(lhs: number[], rhs: number[]): boolean {
  if (lhs === rhs) {
    return true;
  }

  if (lhs.length != rhs.length) {
    return false;
  }

  for (let i = 0; i < lhs.length; i++) {
    if (lhs[i] !== rhs[i]) {
      return false;
    }
  }

  return true;
}
