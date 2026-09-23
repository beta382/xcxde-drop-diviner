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
   * occurs. If the enemy is under the effect of Heroic Tale, the rolled chest
   * quality is then upgraded by one rank (see `#upgradeChestQuality`), which
   * does not consume any additional RNG.
   *
   * @param rng The RNG engine
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @param heroicTale Whether the enemy is under the effect of Heroic Tale
   * @returns The chest quality, or null if no chest
   */
  rollChestQuality(
    rng: MtRand,
    treasureSensor: number,
    heroicTale: boolean,
  ): ChestQuality | null {
    const rolledChestQuality = ((): ChestQuality | null => {
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
    })();

    return heroicTale
      ? this.#upgradeChestQuality(rolledChestQuality)
      : rolledChestQuality;
  }

  /**
   * Gets the probability that exactly the given chest quality will be rolled.
   *
   * @param chestQuality The exact chest quality
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @param heroicTale Whether the enemy is under the effect of Heroic Tale
   * @returns The probability in [0, 1]
   */
  probabilityOfExactly(
    chestQuality: ChestQuality,
    treasureSensor: number,
    heroicTale: boolean,
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

    // The probability of each possible outcome of the sequential roll
    const rolledProbabilities: [ChestQuality | null, number][] = [
      ["gold", goldProbability],
      ["silver", (1 - goldProbability) * silverProbability],
      [
        "bronze",
        (1 - goldProbability) * (1 - silverProbability) * bronzeProbability,
      ],
      [
        null,
        (1 - goldProbability) *
          (1 - silverProbability) *
          (1 - bronzeProbability),
      ],
    ];

    // Multiple rolled outcomes may map to the same final chest quality under
    // Heroic Tale, e.g. rolling silver when gold is impossible
    return rolledProbabilities
      .filter(
        ([rolledChestQuality]) =>
          (heroicTale
            ? this.#upgradeChestQuality(rolledChestQuality)
            : rolledChestQuality) === chestQuality,
      )
      .reduce((acc, [, probability]) => acc + probability, 0);
  }

  /**
   * Upgrades the given chest quality by one rank, as the game does when the
   * enemy is under the effect of Heroic Tale. The upgrade only happens if the
   * next rank has a non-zero base probability; otherwise the chest quality is
   * left as-is.
   *
   * @param chestQuality The rolled chest quality, or null if no chest
   * @returns The upgraded chest quality, or null if still no chest
   */
  #upgradeChestQuality(chestQuality: ChestQuality | null): ChestQuality | null {
    switch (chestQuality) {
      case "gold":
        return "gold";
      case "silver":
        return this.#goldProbability > 0 ? "gold" : "silver";
      case "bronze":
        return this.#silverProbability > 0 ? "silver" : "bronze";
      case null:
        return this.#bronzeProbability > 0 ? "bronze" : null;
      default:
        return chestQuality satisfies never;
    }
  }
}
