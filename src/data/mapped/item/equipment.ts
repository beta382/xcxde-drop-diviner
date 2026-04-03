import { Permutation } from "js-combinatorics";
import type { ExtractStrict } from "type-fest";
import type { MtRand } from "~/common/util/mt-rand";
import { groundAffixes, skellAffixes } from "~/data/mapped/affix";
import type { Affix } from "~/data/mapped/affix/affix";
import type {
  TraitProbability,
  TraitTable,
} from "~/data/mapped/affix/trait-table";
import { Item, type ItemType } from "~/data/mapped/item/item";
import {
  goldTraitTableChoiceProbabilities,
  silverTraitTableChoiceProbabilities,
} from "~/data/mapped/probabilities";
import type { AffixSlotCountProbabilities } from "~/data/mapped/probabilities/affix-slot-count-probabilities";
import type { NonMaterialChestQuality } from "~/data/mapped/probabilities/chest-quality-probabilities";

export type EquipmentType = ExtractStrict<
  ItemType,
  | "ground-armor-head"
  | "ground-armor-body"
  | "ground-armor-arm-r"
  | "ground-armor-arm-l"
  | "ground-armor-legs"
  | "ground-weapon-ranged"
  | "ground-weapon-melee"
  | "skell-armor-head"
  | "skell-armor-body"
  | "skell-armor-arm-r"
  | "skell-armor-arm-l"
  | "skell-armor-legs"
  | "skell-weapon-sidearm"
  | "skell-weapon-back"
  | "skell-weapon-shoulder"
  | "skell-weapon-arm"
  | "skell-weapon-spare"
>;

type TraitRollProbability = {
  traitRoll: Affix[];
  probability: number;
};

type DeduplicatedTraitProbability = {
  deduplicatedTraitId: string;
  probability: number;
};

/** Represents a template for dropable items that have traits and augments. */
export class EquipmentTemplate extends Item {
  readonly #traitTable1: TraitTable;
  readonly #traitTable2: TraitTable;
  readonly #silverTraitCountProbabilities: AffixSlotCountProbabilities;
  readonly #goldTraitCountProbabilities: AffixSlotCountProbabilities;
  readonly #silverAugmentCountProbabilities: AffixSlotCountProbabilities;
  readonly #goldAugmentCountProbabilities: AffixSlotCountProbabilities;

  #silverTraitRollProbabilitiesCache?: TraitRollProbability[];
  #goldTraitRollProbabilitiesCache?: TraitRollProbability[];

  constructor(
    id: number,
    nameId: number,
    type: EquipmentType,
    traitTable1: TraitTable,
    traitTable2: TraitTable,
    silverTraitCountProbabilities: AffixSlotCountProbabilities,
    goldTraitCountProbabilities: AffixSlotCountProbabilities,
    silverAugmentCountProbabilities: AffixSlotCountProbabilities,
    goldAugmentCountProbabilities: AffixSlotCountProbabilities,
  ) {
    super(id, nameId, type);
    this.#traitTable1 = traitTable1;
    this.#traitTable2 = traitTable2;
    this.#silverTraitCountProbabilities = silverTraitCountProbabilities;
    this.#goldTraitCountProbabilities = goldTraitCountProbabilities;
    this.#silverAugmentCountProbabilities = silverAugmentCountProbabilities;
    this.#goldAugmentCountProbabilities = goldAugmentCountProbabilities;
  }

  /**
   * All traits Equipment from this template can potentially roll.
   *
   * Note that these are NOT dedupliated.
   */
  get traits(): Affix[] {
    return [...this.#traitTable1.traits, ...this.#traitTable2.traits];
  }

  /**
   * Randomly rolls a piece of Equipment from this template.
   *
   * @param rng The RNG engine
   * @param chestQuality The quality of the chest dropping this Equipment
   * @returns The rolled Equipment
   */
  rollEquipment(rng: MtRand, chestQuality: NonMaterialChestQuality): Equipment {
    // Traits
    const traitCountProbabilities =
      chestQuality === "gold"
        ? this.#goldTraitCountProbabilities
        : this.#silverTraitCountProbabilities;

    const traitCount = traitCountProbabilities.rollNumAffixSlots(rng);

    const traitTableChoiceProbabilities =
      chestQuality === "gold"
        ? goldTraitTableChoiceProbabilities[traitCount]
        : silverTraitTableChoiceProbabilities[traitCount];

    const traitTableChoices =
      traitTableChoiceProbabilities.rollTraitTableChoices(rng);

    const traits: Affix[] = [];
    const pickedTraits = new Set<number>();
    for (let i = 0; i < traitCount; i++) {
      const traitTable =
        traitTableChoices[i] === "table2"
          ? this.#traitTable2
          : this.#traitTable1;
      traits[i] = traitTable.rollTrait(rng, pickedTraits);
    }

    // Augment slots
    const augmentCountProbabilities =
      chestQuality === "gold"
        ? this.#goldAugmentCountProbabilities
        : this.#silverAugmentCountProbabilities;

    const augmentSlots = augmentCountProbabilities.rollNumAffixSlots(rng);

    return new Equipment(
      this.id,
      this.nameId,
      this.type as EquipmentType,
      traits,
      augmentSlots,
    );
  }

  /**
   * Gets the probability that a satisfying Equipment will be rolled.
   *
   * An Equipment is considered satisfying if it contains all of the given
   * traits and has at least the number of augment slots.
   *
   * @param traits The traits that must be present
   * @param augmentSlots The minimum number of augment slots
   * @param chestQuality The quality of the chest dropping the equipment
   * @returns The probability in [0, 1]
   */
  probabilityOfSatisfying(
    traits: Affix[],
    augmentSlots: number,
    chestQuality: NonMaterialChestQuality,
  ): number {
    // Augment slots
    let augmentCountProbability = 0;
    const augmentCountProbabilities =
      chestQuality === "gold"
        ? this.#goldAugmentCountProbabilities
        : this.#silverAugmentCountProbabilities;

    for (let i = augmentSlots; i <= augmentCountProbabilities.length; i++) {
      augmentCountProbability +=
        augmentCountProbabilities.probabilityOfExactly(i);
    }

    if (augmentCountProbability === 0 || traits.length === 0) {
      return augmentCountProbability;
    }

    // Traits
    let traitRollProbability = 0;
    const traitRollProbabilities =
      this.#getTraitRollProbabilities(chestQuality);

    for (const { traitRoll, probability } of traitRollProbabilities) {
      let traitsInRoll = true;
      for (const trait of traits) {
        if (!traitRoll.includes(trait)) {
          traitsInRoll = false;
          break;
        }
      }

      if (traitsInRoll) {
        traitRollProbability += probability;
      }
    }

    return augmentCountProbability * traitRollProbability;
  }

  #getTraitRollProbabilities(
    chestQuality: NonMaterialChestQuality,
  ): TraitRollProbability[] {
    const deduplicateTraitProbabilities = (
      traitProbabilities: TraitProbability[],
      indexOffset: number = 0,
    ): DeduplicatedTraitProbability[] => {
      return traitProbabilities.map((traitProbability, index) => ({
        deduplicatedTraitId:
          `${traitProbability.traitId.toString().padStart(4, "0")}:` +
          (index + indexOffset).toString(),
        probability: traitProbability.probability,
      }));
    };

    const getProbabilityAndExcludeTrait = (
      remainingTraitProbabilities: DeduplicatedTraitProbability[],
      deduplicatedTraitId: string,
    ): {
      nextRemainingTraitProbabilities: DeduplicatedTraitProbability[];
      probability: number;
    } => {
      // From https://xcancel.com/i/status/1933188846365077706
      const probability = (() => {
        let acc = 1;
        const probabilities: number[] = [];
        for (const baseProbability of remainingTraitProbabilities) {
          const currentProbability = baseProbability.probability / 100;
          probabilities.push(acc * currentProbability);
          acc *= 1 - currentProbability;
        }

        for (let i = 0; i < probabilities.length; i++) {
          probabilities[i] = probabilities[i] / (1 - acc);
        }

        return probabilities[
          remainingTraitProbabilities.findIndex(
            (traitProbability) =>
              traitProbability.deduplicatedTraitId === deduplicatedTraitId,
          )
        ];
      })();

      const traitId = +deduplicatedTraitId.slice(5);
      const nextRemainingTraitProbabilities =
        remainingTraitProbabilities.filter(
          (remainingTraitProbability) =>
            +remainingTraitProbability.deduplicatedTraitId.slice(5) !== traitId,
        );

      return { nextRemainingTraitProbabilities, probability };
    };

    switch (chestQuality) {
      case "silver":
        if (this.#silverTraitRollProbabilitiesCache) {
          return this.#silverTraitRollProbabilitiesCache;
        }
        break;
      case "gold":
        if (this.#goldTraitRollProbabilitiesCache) {
          return this.#goldTraitRollProbabilitiesCache;
        }
        break;
      default:
        return chestQuality satisfies never;
    }

    const allTraitIds = deduplicateTraitProbabilities([
      ...this.#traitTable1.traitProbabilities,
      ...this.#traitTable2.traitProbabilities,
    ]).map((traitProbability) => traitProbability.deduplicatedTraitId);

    const traitIdRollProbabilities: {
      traitIdRoll: number[];
      probability: number;
    }[] = [];
    for (let traitCount = 1; traitCount <= 3; traitCount++) {
      const traitCountProbability =
        chestQuality === "gold"
          ? this.#goldTraitCountProbabilities.probabilityOfExactly(traitCount)
          : this.#silverTraitCountProbabilities.probabilityOfExactly(
              traitCount,
            );

      for (const traitIdSet of new Permutation(allTraitIds, traitCount)) {
        if (new Set(traitIdSet).size !== traitIdSet.length) {
          traitIdRollProbabilities.push({
            traitIdRoll: traitIdSet.map((traitId) => +traitId.slice(0, 4)),
            probability: 0,
          });
        }

        const traitTableChoiceProbabilities =
          chestQuality === "gold"
            ? goldTraitTableChoiceProbabilities[traitCount]
            : silverTraitTableChoiceProbabilities[traitCount];

        let remainingTable1TraitProbabilities = deduplicateTraitProbabilities(
          this.#traitTable1.traitProbabilities,
        );
        let remainingTable2TraitProbabilities = deduplicateTraitProbabilities(
          this.#traitTable2.traitProbabilities,
          this.#traitTable1.traitProbabilities.length,
        );

        let rollProbability = 1;
        for (let traitSlot = 0; traitSlot < traitCount; traitSlot++) {
          const rolledTrait = traitIdSet[traitSlot];

          if (
            remainingTable1TraitProbabilities
              .map((traitProbability) => traitProbability.deduplicatedTraitId)
              .includes(rolledTrait)
          ) {
            // Table 1
            const { nextRemainingTraitProbabilities, probability } =
              getProbabilityAndExcludeTrait(
                remainingTable1TraitProbabilities,
                rolledTrait,
              );

            remainingTable1TraitProbabilities = nextRemainingTraitProbabilities;
            rollProbability *=
              (1 -
                traitTableChoiceProbabilities.traitTable2ChoiceProbabilities[
                  traitSlot
                ] /
                  100) *
              probability;

            if (rollProbability === 0) {
              break;
            }
          } else if (
            remainingTable2TraitProbabilities
              .map((traitProbability) => traitProbability.deduplicatedTraitId)
              .includes(rolledTrait)
          ) {
            // Table 2
            const { nextRemainingTraitProbabilities, probability } =
              getProbabilityAndExcludeTrait(
                remainingTable2TraitProbabilities,
                rolledTrait,
              );

            remainingTable2TraitProbabilities = nextRemainingTraitProbabilities;
            rollProbability *=
              (traitTableChoiceProbabilities.traitTable2ChoiceProbabilities[
                traitSlot
              ] /
                100) *
              probability;

            if (rollProbability === 0) {
              break;
            }
          } else {
            throw new RangeError(`rolledTrait=${rolledTrait} not found`);
          }
        }

        traitIdRollProbabilities.push({
          traitIdRoll: traitIdSet.map((traitId) => +traitId.slice(0, 4)),
          probability: rollProbability * traitCountProbability,
        });
      }
    }

    const traitRollProbabilities: TraitRollProbability[] =
      traitIdRollProbabilities.map((traitRollProbability) => {
        const equipmentType = this.type as EquipmentType;
        switch (equipmentType) {
          case "ground-armor-head":
          case "ground-armor-body":
          case "ground-armor-arm-r":
          case "ground-armor-arm-l":
          case "ground-armor-legs":
          case "ground-weapon-ranged":
          case "ground-weapon-melee":
            return {
              traitRoll: traitRollProbability.traitIdRoll.map(
                (traitIdRoll) => groundAffixes[traitIdRoll],
              ),
              probability: traitRollProbability.probability,
            };
          case "skell-armor-head":
          case "skell-armor-body":
          case "skell-armor-arm-r":
          case "skell-armor-arm-l":
          case "skell-armor-legs":
          case "skell-weapon-sidearm":
          case "skell-weapon-back":
          case "skell-weapon-shoulder":
          case "skell-weapon-arm":
          case "skell-weapon-spare":
            return {
              traitRoll: traitRollProbability.traitIdRoll.map(
                (traitIdRoll) => skellAffixes[traitIdRoll],
              ),
              probability: traitRollProbability.probability,
            };
          default:
            return equipmentType satisfies never;
        }
      });

    switch (chestQuality) {
      case "silver":
        this.#silverTraitRollProbabilitiesCache = traitRollProbabilities;
        break;
      case "gold":
        this.#goldTraitRollProbabilitiesCache = traitRollProbabilities;
        break;
      default:
        return chestQuality satisfies never;
    }

    return traitRollProbabilities;
  }
}

/**
 * Represents a dropped item that has its specific traits and augment slot count
 * resolved.
 */
export class Equipment extends Item {
  readonly #traits: Affix[];
  readonly augmentSlots: number;

  constructor(
    id: number,
    nameId: number,
    equipmentType: EquipmentType,
    traits: Affix[],
    augmentSlots: number,
  ) {
    super(id, nameId, equipmentType);
    this.#traits = traits;
    this.augmentSlots = augmentSlots;
  }

  get traits() {
    return [...this.#traits];
  }

  /**
   * Determines whether this Equipment minimally satisfies the given
   * constraints.
   *
   * @param equipmentTemplate The EquipmentTemplate to match against
   * @param traits The traits that must be present
   * @param augmentSlots The minimum number of augment slots
   * @returns True if this Equipment minimally satisfies the given constraints,
   *   false otherwise
   */
  satisfies(
    equipmentTemplate: EquipmentTemplate,
    traits: Affix[],
    augmentSlots: number,
  ): boolean {
    if (
      !this.isSameItem(equipmentTemplate) ||
      this.augmentSlots < augmentSlots
    ) {
      return false;
    }

    for (const trait of traits) {
      if (!this.#traits.includes(trait)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Determines whether this Equipment exactly matches the given constraints.
   *
   * @param equipmentTemplate The EquipmentTemplate to match against
   * @param traits The traits that must exclusively be present, in order
   * @param augmentSlots The exact number of augment slots
   * @returns True if this Equipment exactly matches the given constraints,
   *   false otherwise
   */
  equals(
    equipmentTemplate: EquipmentTemplate,
    traits: Affix[],
    augmentSlots: number,
  ): boolean {
    if (
      !this.isSameItem(equipmentTemplate) ||
      this.#traits.length !== traits.length ||
      this.augmentSlots !== augmentSlots
    ) {
      return false;
    }

    for (let i = 0; i < this.#traits.length; i++) {
      if (this.#traits[i] !== traits[i]) {
        return false;
      }
    }

    return true;
  }
}
