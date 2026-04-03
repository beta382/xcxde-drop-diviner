import type { ExtractStrict } from "type-fest";
import type { MtRand } from "~/common/util/mt-rand";

export type ChestQuality = "gold" | "silver" | "bronze";
export type MaterialChestQuality = ExtractStrict<ChestQuality, "bronze">;
export type NonMaterialChestQuality = ExtractStrict<
  ChestQuality,
  "gold" | "silver"
>;

/** Represents appendage chest quality probabilities */
export class ChestQualityProbabilities {
  readonly #goldProbability: number;
  readonly #silverProbability: number;
  readonly #bronzeProbability: number;

  constructor(
    goldProbability: number,
    silverProbability: number,
    bronzeProbability: number,
  ) {
    this.#goldProbability = goldProbability;
    this.#silverProbability = silverProbability;
    this.#bronzeProbability = bronzeProbability;
  }

  /**
   * Chances are rolled sequentially, from gold to bronze, until a success
   * occurs.
   *
   * @param rng The RNG engine
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @returns The chest quality, or null if no chest
   */
  rollChestQuality(rng: MtRand, treasureSensor: number): ChestQuality | null {
    if (
      rng.randBoolean(
        this.#goldProbability +
          (this.#goldProbability > 0 ? treasureSensor : 0),
      )
    ) {
      return "gold";
    }

    if (
      rng.randBoolean(
        this.#silverProbability +
          (this.#silverProbability > 0 ? treasureSensor : 0),
      )
    ) {
      return "silver";
    }

    if (
      rng.randBoolean(
        this.#bronzeProbability +
          (this.#bronzeProbability > 0 ? treasureSensor : 0),
      )
    ) {
      return "bronze";
    }

    return null;
  }

  /**
   * Gets the probability that exactly the given chest quality will be rolled.
   *
   * @param chestQuality The exact chest quality
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @returns The probability in [0, 1]
   */
  probabilityOfExactly(
    chestQuality: ChestQuality,
    treasureSensor: number,
  ): number {
    const goldProbability =
      this.#goldProbability > 0
        ? Math.min(this.#goldProbability + treasureSensor, 100) / 100
        : 0;
    const silverProbability =
      this.#silverProbability > 0
        ? Math.min(this.#silverProbability + treasureSensor, 100) / 100
        : 0;
    const bronzeProbability =
      this.#bronzeProbability > 0
        ? Math.min(this.#bronzeProbability + treasureSensor, 100) / 100
        : 0;

    switch (chestQuality) {
      case "bronze":
        return (
          (1 - goldProbability) * (1 - silverProbability) * bronzeProbability
        );
      case "silver":
        return (1 - goldProbability) * silverProbability;
      case "gold":
        return goldProbability;
      default:
        return chestQuality satisfies never;
    }
  }
}
