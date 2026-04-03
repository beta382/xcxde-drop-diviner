import { Combination } from "js-combinatorics";
import type { MtRand } from "~/common/util/mt-rand";

/** Represents Trait/Augment count probabilities. */
export class AffixSlotCountProbabilities {
  readonly #probabilities: number[];

  constructor(probabilities: number[]) {
    this.#probabilities = probabilities;
  }

  get length() {
    return this.#probabilities.length;
  }

  /**
   * Each chance is rolled once, and the number of chances that succeed is the
   * number of affix slots the gear will receive.
   *
   * @param rng The RNG engine
   * @returns The number of affix slots
   */
  rollNumAffixSlots(rng: MtRand): number {
    let count = 0;
    for (const probability of this.#probabilities) {
      if (rng.randBoolean(probability)) {
        count++;
      }
    }

    return count;
  }

  /**
   * Gets the probability that exactly the given number of affix slots will be
   * rolled.
   *
   * @param count The exact number of affix slots
   * @returns The probability in [0, 1]
   */
  probabilityOfExactly(count: number): number {
    let sum = 0;
    for (const combination of new Combination(
      this.#probabilities.map((_, i) => i),
      count,
    )) {
      const prod = this.#probabilities.reduce(
        (acc, probability, i) =>
          acc *
          (combination.includes(i) ? probability / 100 : 1 - probability / 100),
        1,
      );

      sum += prod;
    }

    return sum;
  }
}
