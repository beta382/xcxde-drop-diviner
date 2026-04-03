import type { MtRand } from "~/common/util/mt-rand";

/**
 * Represents the probability of a given number of items dropping from an enemy
 * appendage chest.
 */
export class ChestItemCountProbabilities {
  // In reverse order of count
  readonly #chestItemCountProbabilities: number[];

  constructor(chestItemCountProbabilities: number[]) {
    this.#chestItemCountProbabilities = chestItemCountProbabilities;
  }

  get maxItemCount() {
    return this.#chestItemCountProbabilities.length;
  }

  /**
   * Rolls each probability in sequence until a success to determine the number
   * of item drops in the chest.
   *
   * @param rng The RNG engine
   * @returns The chest item count
   */
  rollChestItemCount(rng: MtRand): number {
    for (let i = 0; i < this.maxItemCount; i++) {
      if (rng.randBoolean(this.#chestItemCountProbabilities[i])) {
        return this.maxItemCount - i;
      }
    }

    throw new RangeError(
      "ChestItemCountProbabilities rolled 0, which is impossible",
    );
  }

  /**
   * Gets the probability that exactly the given number of items will be dropped
   * from the chest.
   *
   * @param count The count
   * @returns The probability in [0, 1]
   */
  getProbabilityOfExactly(count: number) {
    let probability = 1;
    for (let i = 0; i < this.maxItemCount - count; i++) {
      probability *= 1 - this.#chestItemCountProbabilities[i] / 100;
    }

    return (
      probability *
      (this.#chestItemCountProbabilities[this.maxItemCount - count] / 100)
    );
  }
}
