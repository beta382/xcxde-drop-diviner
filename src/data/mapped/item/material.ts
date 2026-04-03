import type { ChestDropInfo } from "~/data/mapped/chest/drop-info.types";
import { Item } from "~/data/mapped/item/item";
import type { ChestMaterialDropProbabilities } from "~/data/mapped/probabilities/chest-material-drop-probabilities";

/** Represents an enemy material drop. */
export class Material extends Item {
  readonly #mainBodyBaseProbabilities: ChestMaterialDropProbabilities;
  readonly #appendageBaseProbabilities: ChestMaterialDropProbabilities;
  readonly #silverChestBonusProbability: number;
  readonly #goldChestBonusProbability: number;
  readonly #canDropFromAppendageIndex: boolean[];

  constructor(
    id: number,
    nameId: number,
    mainBodyBaseProbabilities: ChestMaterialDropProbabilities,
    appendageBaseProbabilities: ChestMaterialDropProbabilities,
    silverChestBonusProbability: number,
    goldChestBonusProbability: number,
    canDropFromAppendageIndex: boolean[],
  ) {
    super(id, nameId, "material");
    this.#mainBodyBaseProbabilities = mainBodyBaseProbabilities;
    this.#appendageBaseProbabilities = appendageBaseProbabilities;
    this.#silverChestBonusProbability = silverChestBonusProbability;
    this.#goldChestBonusProbability = goldChestBonusProbability;
    this.#canDropFromAppendageIndex = canDropFromAppendageIndex;
  }

  /**
   * Whether or not this material can drop from the given appendage index.
   *
   * Note that this method should not be subsumed into getDropProbability, since
   * this method exclusively indicates whether RNG should be rolled at all.
   *
   * @param appendageIndex The appendage index
   * @returns Whether or not this material can drop from the given appendage
   *   index
   */
  canDropFromAppendageIndex(appendageIndex: number): boolean {
    return this.#canDropFromAppendageIndex[appendageIndex];
  }

  /**
   * Gets the probability that this material will be dropped, given the enemy
   * level and the chest quality.
   *
   * @param chestDropInfo Chest-specific drop information
   * @param level The enemy level
   * @returns The probability in percentage points.
   */
  getDropProbability(chestDropInfo: ChestDropInfo, level: number): number {
    const baseProbability =
      chestDropInfo.sourceAppendageIndex === 0
        ? this.#mainBodyBaseProbabilities.getProbability(level)
        : this.#appendageBaseProbabilities.getProbability(level);
    const bonusProbability = (() => {
      switch (chestDropInfo.quality) {
        case "bronze":
          return 0;
        case "silver":
          return this.#silverChestBonusProbability;
        case "gold":
          return this.#goldChestBonusProbability;
        default:
          return chestDropInfo.quality satisfies never;
      }
    })();

    // Yes, this can and does overflow, yes, that's how the game works.
    return ((baseProbability + bonusProbability) << 24) >> 24;
  }
}
