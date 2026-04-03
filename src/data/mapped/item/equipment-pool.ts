import type { MtRand } from "~/common/util/mt-rand";
import type { EnemyDropInfo } from "~/data/mapped/chest/drop-info.types";
import type { EquipmentTemplate } from "~/data/mapped/item/equipment";
import type { CharacterClass } from "~/data/mapped/party/character-class";

export type EquipmentPoolType =
  | "ground-weapon"
  | "ground-armor"
  | "skell-weapon"
  | "skell-armor";

/**
 * Represents a pool of random Equipment that enemies may drop. A specific
 * Equipment Pool designated by its type (i.e. ground/skell + melee/ranged), and
 * each equipment pool is subdivided into enemy level ranges, then a pool
 * number, and finally specific equipment templates.
 */
export class EquipmentPool {
  // indexed as levelRangeId, poolId, item
  readonly #equipmentTemplates: EquipmentTemplate[][][];
  readonly #equipmentPoolType: EquipmentPoolType;

  readonly #levelRangeSize: number;

  constructor(
    equipmentTemplates: EquipmentTemplate[][][],
    equipmentPoolType: EquipmentPoolType,
  ) {
    this.#equipmentTemplates = equipmentTemplates;
    this.#equipmentPoolType = equipmentPoolType;

    this.#levelRangeSize =
      equipmentPoolType === "ground-weapon" ||
      equipmentPoolType === "ground-armor"
        ? 5
        : 10;
  }

  /**
   * Gets all Equipment Templates that this Equipment Pool can drop for the
   * given parameters.
   *
   * @param enemyDropInfo Enemy-specific drop information
   * @returns The deduplicated set of Equipment Templates
   */
  getDroppableEquipment(enemyDropInfo: EnemyDropInfo): EquipmentTemplate[] {
    const poolId = this.#getPoolId(enemyDropInfo);

    const baseLevelRangeId = this.#calculateLevelRangeId(enemyDropInfo.level);

    const levelRangeIds =
      baseLevelRangeId < this.#equipmentTemplates.length - 1
        ? [baseLevelRangeId, baseLevelRangeId + 1]
        : [baseLevelRangeId];

    const droppableEquipment: EquipmentTemplate[] = [];
    for (const levelRangeId of levelRangeIds) {
      if (poolId === "any") {
        droppableEquipment.push(
          ...this.#equipmentTemplates[levelRangeId].flat(),
        );
      } else {
        droppableEquipment.push(
          ...this.#equipmentTemplates[levelRangeId][poolId],
        );
      }
    }

    return [...new Set(droppableEquipment)];
  }

  /**
   * Randomly rolls an Equipment Template from this Equipment Pool.
   *
   * @param rng The RNG engine
   * @param crossClass The character class currently equipped by the player
   *   character
   * @param enemyDropInfo Enemy-specific drop information
   * @returns The rolled Equipment Template
   */
  rollEquipmentTemplate(
    rng: MtRand,
    crossClass: CharacterClass,
    enemyDropInfo: EnemyDropInfo,
  ): EquipmentTemplate {
    const poolId: number =
      (() => {
        if (this.#equipmentPoolType === "ground-weapon") {
          const biasRoll = rng.randInt(100);
          if (biasRoll < 50) {
            return rng.randBoolean(50)
              ? crossClass.meleeWeaponId
              : crossClass.rangedWeaponId;
          }
          // This impl assumes no extra party members, which would otherwise
          // test against biasRoll < 80
          else {
            return rng.randRange(1, 13);
          }
        }

        switch (this.#equipmentPoolType) {
          case "ground-armor":
            return enemyDropInfo.groundArmorPoolId;
          case "skell-weapon":
            return enemyDropInfo.skellWeaponPoolId;
          case "skell-armor":
            return enemyDropInfo.skellArmorPoolId;
          default:
            return this.#equipmentPoolType satisfies never;
        }
      })() - 1;

    const lvRangeId = Math.min(
      this.#calculateLevelRangeId(enemyDropInfo.level) +
        (rng.randBoolean(10) ? 1 : 0),
      this.#equipmentTemplates.length - 1,
    );

    const pool = this.#equipmentTemplates[lvRangeId][poolId];
    return pool[rng.randInt(pool.length)];
  }

  /**
   * Gets the probability that the given Equipment Template will be chosen from
   * this Equipment Pool.
   *
   * @param targetEquipmentTemplate The Equipment Template
   * @param crossClass The character class currently equipped by the player
   *   character
   * @param optimalParty Whether to assume the rest of the party exists and
   *   consits of effectively identical classes to crossClass
   * @param enemyDropInfo Enemy-specific drop information
   * @returns The probability in [0, 1]
   */
  probabilityOfEquipmentTemplate(
    targetEquipmentTemplate: EquipmentTemplate,
    crossClass: CharacterClass,
    optimalParty: boolean,
    enemyDropInfo: EnemyDropInfo,
  ): number {
    const getProbabilityInPool = (pool: EquipmentTemplate[]) => {
      return (pool.includes(targetEquipmentTemplate) ? 1 : 0) / pool.length;
    };

    const getPoolProbability = (
      levelRangeId: number,
      poolId: number | "any",
    ) => {
      if (poolId === "any") {
        const probabilitiesInPools =
          this.#equipmentTemplates[levelRangeId].map(getProbabilityInPool);

        const probabilityCrossDropped =
          0.5 * probabilitiesInPools[crossClass.meleeWeaponId - 1] +
          0.5 * probabilitiesInPools[crossClass.rangedWeaponId - 1];

        const probabilityRandomDropped =
          probabilitiesInPools.reduce(
            (acc, probability) => acc + probability,
            0,
          ) / probabilitiesInPools.length;

        const crossChoiceProbability = optimalParty ? 0.8 : 0.5;

        return (
          crossChoiceProbability * probabilityCrossDropped +
          (1 - crossChoiceProbability) * probabilityRandomDropped
        );
      }

      return getProbabilityInPool(
        this.#equipmentTemplates[levelRangeId][poolId],
      );
    };

    const poolId = this.#getPoolId(enemyDropInfo);

    const baseLevelRangeId = this.#calculateLevelRangeId(enemyDropInfo.level);
    const pool1Probability = getPoolProbability(baseLevelRangeId, poolId);

    if (baseLevelRangeId < this.#equipmentTemplates.length - 1) {
      const pool2Probability = getPoolProbability(baseLevelRangeId + 1, poolId);
      return 0.9 * pool1Probability + 0.1 * pool2Probability;
    } else {
      return pool1Probability;
    }
  }

  #getPoolId(enemyDropInfo: EnemyDropInfo) {
    switch (this.#equipmentPoolType) {
      case "ground-weapon":
        return "any";
      case "ground-armor":
        return enemyDropInfo.groundArmorPoolId - 1;
      case "skell-weapon":
        return enemyDropInfo.skellWeaponPoolId - 1;
      case "skell-armor":
        return enemyDropInfo.skellArmorPoolId - 1;
    }
  }

  #calculateLevelRangeId(level: number): number {
    return Math.min(
      this.#equipmentTemplates.length - 1,
      Math.floor((level - 1) / this.#levelRangeSize),
    );
  }
}
