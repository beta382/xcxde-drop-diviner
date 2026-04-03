import type { MtRand } from "~/common/util/mt-rand";
import type { Affix } from "~/data/mapped/affix/affix";
import type {
  ChestDropInfo,
  EnemyDropInfo,
} from "~/data/mapped/chest/drop-info.types";
import type { ItemDropTable } from "~/data/mapped/chest/item-drop-table";
import type { MaterialDropTable } from "~/data/mapped/chest/material-drop-table";
import type { EquipmentTemplate } from "~/data/mapped/item/equipment";
import type { Item } from "~/data/mapped/item/item";
import type { CharacterClass } from "~/data/mapped/party/character-class";
import type {
  ChestQuality,
  ChestQualityProbabilities,
  NonMaterialChestQuality,
} from "~/data/mapped/probabilities/chest-quality-probabilities";

/** Represents everything that an appendage chest of any quality can drop */
export class DropTable {
  // The tables may actually be undefined, but only when they have zero
  // probability of being rolled. Access should be guarded on this predicate.
  readonly #materialTable: MaterialDropTable;
  readonly #silverChestDropTable: ItemDropTable;
  readonly #goldChestDropTable: ItemDropTable;
  readonly #chestQualityProbabilities: ChestQualityProbabilities;

  constructor(
    materialTable: MaterialDropTable,
    silverChestDropTable: ItemDropTable,
    goldChestDropTable: ItemDropTable,
    chestQualityProbabilities: ChestQualityProbabilities,
  ) {
    this.#materialTable = materialTable;
    this.#silverChestDropTable = silverChestDropTable;
    this.#goldChestDropTable = goldChestDropTable;
    this.#chestQualityProbabilities = chestQualityProbabilities;
  }

  /**
   * Gets all Items that this Drop Table can drop for the given parameters.
   *
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @param sourceAppendageIndex The appendage index
   * @param enemyDropInfo Enemy-specific drop information
   * @returns The deduplicated set of Items
   */
  getDroppableItems(
    treasureSensor: number,
    sourceAppendageIndex: number,
    enemyDropInfo: EnemyDropInfo,
  ): Item[] {
    const droppableItems: Item[] = [];

    if (
      this.#chestQualityProbabilities.probabilityOfExactly(
        "bronze",
        treasureSensor,
      ) > 0
    ) {
      droppableItems.push(
        ...this.#materialTable.getDroppableMaterials(
          { quality: "bronze", sourceAppendageIndex },
          enemyDropInfo.level,
        ),
      );
    }

    if (
      this.#chestQualityProbabilities.probabilityOfExactly(
        "silver",
        treasureSensor,
      ) > 0
    ) {
      droppableItems.push(
        ...this.#silverChestDropTable.getDroppableItems(enemyDropInfo),
      );
      droppableItems.push(
        ...this.#materialTable.getDroppableMaterials(
          { quality: "silver", sourceAppendageIndex },
          enemyDropInfo.level,
        ),
      );
    }

    if (
      this.#chestQualityProbabilities.probabilityOfExactly(
        "gold",
        treasureSensor,
      ) > 0
    ) {
      droppableItems.push(
        ...this.#goldChestDropTable.getDroppableItems(enemyDropInfo),
      );
      droppableItems.push(
        ...this.#materialTable.getDroppableMaterials(
          { quality: "gold", sourceAppendageIndex },
          enemyDropInfo.level,
        ),
      );
    }

    return [...new Set(droppableItems)];
  }

  /**
   * Randomly rolls a chest quality for this drop.
   *
   * @param rng The RNG engine
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @returns The chest quality, or null if no chest
   */
  rollChestQuality(rng: MtRand, treasureSensor: number): ChestQuality | null {
    return this.#chestQualityProbabilities.rollChestQuality(
      rng,
      treasureSensor,
    );
  }

  /**
   * Randomly rolls items frops from this table.
   *
   * @param rng The RNG engine
   * @param crossClass The character class currently equipped by the player
   *   character
   * @param enemyDropInfo Enemy-specific drop information
   * @param chestDropInfo Chest-specific drop information
   * @returns The rolled items
   */
  rollItems(
    rng: MtRand,
    crossClass: CharacterClass,
    enemyDropInfo: EnemyDropInfo,
    chestDropInfo: ChestDropInfo,
  ): Item[] {
    const items: Item[] = [];

    switch (chestDropInfo.quality) {
      case "silver":
        items.push(
          ...this.#silverChestDropTable.rollItems(
            rng,
            crossClass,
            enemyDropInfo,
          ),
        );
        break;
      case "gold":
        items.push(
          ...this.#goldChestDropTable.rollItems(rng, crossClass, enemyDropInfo),
        );
        break;
    }

    items.push(
      ...this.#materialTable.rollMaterials(
        rng,
        chestDropInfo,
        enemyDropInfo.level,
      ),
    );

    return items;
  }

  /**
   * Gets the average number of times per drop that the given Item will be
   * dropped from this Drop Table.
   *
   * Material targetItems are not supported.
   *
   * @param targetItem The Item
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @param crossClass The character class currently equipped by the player
   *   character
   * @param optimalParty Whether to assume the rest of the party exists and
   *   consits of effectively identical classes to crossClass
   * @param enemyDropInfo Enemy-specific drop information
   * @returns The average number of times the given item will drop from this
   *   drop table
   */
  averageDropCountForItem(
    targetItem: Item,
    treasureSensor: number,
    crossClass: CharacterClass,
    optimalParty: boolean,
    enemyDropInfo: EnemyDropInfo,
  ): number {
    return (
      this.#averageChestDropCountForItem(
        targetItem,
        "silver",
        treasureSensor,
        crossClass,
        optimalParty,
        enemyDropInfo,
      ) +
      this.#averageChestDropCountForItem(
        targetItem,
        "gold",
        treasureSensor,
        crossClass,
        optimalParty,
        enemyDropInfo,
      )
    );
  }

  /**
   * Gets the average number of times per drop that a satisfying Equipment will
   * be dropped from this Drop Table.
   *
   * @param targetEquipmentTemplate The Equipment Template
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @param crossClass The character class currently equipped by the player
   *   character
   * @param optimalParty Whether to assume the rest of the party exists and
   *   consits of effectively identical classes to crossClass
   * @param enemyDropInfo Enemy-specific drop information
   * @param traits The traits that must be present
   * @param augmentSlots The minimum number of augment slots
   * @returns The average number of times a satisfying Equipment will drop from
   *   this Drop Table
   */
  averageDropCountForSatisfyingEquipment(
    targetEquipmentTemplate: EquipmentTemplate,
    treasureSensor: number,
    crossClass: CharacterClass,
    optimalParty: boolean,
    enemyDropInfo: EnemyDropInfo,
    traits: Affix[],
    augmentSlots: number,
  ): number {
    const silverAverageDropCount = this.#averageChestDropCountForItem(
      targetEquipmentTemplate,
      "silver",
      treasureSensor,
      crossClass,
      optimalParty,
      enemyDropInfo,
    );
    const goldAverageDropCount = this.#averageChestDropCountForItem(
      targetEquipmentTemplate,
      "gold",
      treasureSensor,
      crossClass,
      optimalParty,
      enemyDropInfo,
    );

    return (
      silverAverageDropCount *
        targetEquipmentTemplate.probabilityOfSatisfying(
          traits,
          augmentSlots,
          "silver",
        ) +
      goldAverageDropCount *
        targetEquipmentTemplate.probabilityOfSatisfying(
          traits,
          augmentSlots,
          "gold",
        )
    );
  }

  #averageChestDropCountForItem(
    targetItem: Item,
    chestQuality: NonMaterialChestQuality,
    treasureSensor: number,
    crossClass: CharacterClass,
    optimalParty: boolean,
    enemyDropInfo: EnemyDropInfo,
  ): number {
    const chestProbability =
      this.#chestQualityProbabilities.probabilityOfExactly(
        chestQuality,
        treasureSensor,
      );

    const chestDropCount =
      chestProbability > 0
        ? (() => {
            switch (chestQuality) {
              case "silver":
                return this.#silverChestDropTable.averageDropCountForItem(
                  targetItem,
                  crossClass,
                  optimalParty,
                  enemyDropInfo,
                );
              case "gold":
                return this.#goldChestDropTable.averageDropCountForItem(
                  targetItem,
                  crossClass,
                  optimalParty,
                  enemyDropInfo,
                );
              default:
                return chestQuality satisfies never;
            }
          })()
        : 0;

    return chestProbability * chestDropCount;
  }
}
