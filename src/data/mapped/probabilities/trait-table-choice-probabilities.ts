import type { MtRand } from "~/common/util/mt-rand";

/**
 * Represents the probabilities that random traits for specific equipment trait
 * slot indexes will pull from trait table 1 or trait table 2.
 */
export class TraitTableChoiceProbabilities {
  readonly #traitTable2ChoiceProbabilities: number[];

  constructor(traitTable2ChoiceProbabilities: number[]) {
    this.#traitTable2ChoiceProbabilities = traitTable2ChoiceProbabilities;
  }

  /** The trait table choice probabilities. */
  get traitTable2ChoiceProbabilities(): number[] {
    return [...this.#traitTable2ChoiceProbabilities];
  }

  /**
   * Each chance is rolled once, with the successful chances yielding trait
   * table 2, and the unsuccessful chances yielding trait table 1.
   *
   * @param rng The RNG engine
   * @returns The trait table choices
   */
  rollTraitTableChoices(rng: MtRand): ("table1" | "table2")[] {
    const choices = this.#traitTable2ChoiceProbabilities.map(
      (traitTable2ChoiceProbability) =>
        rng.randBoolean(traitTable2ChoiceProbability) ? "table2" : "table1",
    );

    return choices;
  }
}
