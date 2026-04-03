import { Combination } from "js-combinatorics";
import type { MtRand } from "~/common/util/mt-rand";
import type { EnemyDropInfo } from "~/data/mapped/chest/drop-info.types";
import { EquipmentTemplate } from "~/data/mapped/item/equipment";
import { EquipmentPool } from "~/data/mapped/item/equipment-pool";
import { Item } from "~/data/mapped/item/item";
import type { CharacterClass } from "~/data/mapped/party/character-class";
import { nonCrownChestItemCountProbabilities } from "~/data/mapped/probabilities";
import type { ChestItemCountProbabilities } from "~/data/mapped/probabilities/chest-item-count-probabilities";
import type { NonMaterialChestQuality } from "~/data/mapped/probabilities/chest-quality-probabilities";

export interface ItemDropProbability {
  readonly item: Item | EquipmentPool;
  readonly probability: number;
}

/** Represents all items that an appendage chest of given quality can drop */
export class ItemDropTable {
  readonly #itemDropProbabilities: ItemDropProbability[];
  readonly #chestQuality: NonMaterialChestQuality;
  readonly #chestItemCountProbabilities: ChestItemCountProbabilities;

  constructor(
    itemDropProbabilities: ItemDropProbability[],
    chestQuality: NonMaterialChestQuality,
  ) {
    this.#itemDropProbabilities = itemDropProbabilities;
    this.#chestQuality = chestQuality;

    this.#chestItemCountProbabilities = (() => {
      switch (chestQuality) {
        case "silver":
          return nonCrownChestItemCountProbabilities[2];
        case "gold":
          return nonCrownChestItemCountProbabilities[1];
        default:
          return chestQuality satisfies never;
      }
    })();
  }

  /**
   * Gets all Items that this Item Drop Table can drop for the given parameters.
   *
   * @param enemyDropInfo Enemy-specific drop information
   * @returns The deduplicated set of Items
   */
  getDroppableItems(enemyDropInfo: EnemyDropInfo): Item[] {
    const droppableItems: Item[] = [];

    for (const { item, probability } of this.#itemDropProbabilities) {
      if (
        probability === 0 ||
        (item instanceof Item &&
          (item.type === "holofigure" || item.type === "blueprint"))
      ) {
        continue;
      }

      if (item instanceof EquipmentPool) {
        droppableItems.push(...item.getDroppableEquipment(enemyDropInfo));
      } else {
        droppableItems.push(item);
      }
    }

    return [...new Set(droppableItems)];
  }

  /**
   * Randomly rolls item drops from this table.
   *
   * Resolves Equipment Pools into Equipment Templates, and Equipment Templates
   * into Equipment.
   *
   * @param rng The RNG engine
   * @param crossClass The character class currently equipped by the player
   *   character
   * @param enemyDropInfo Enemy-specific drop information
   * @returns The rolled Items
   */
  rollItems(
    rng: MtRand,
    crossClass: CharacterClass,
    enemyDropInfo: EnemyDropInfo,
  ): Item[] {
    const itemCount = this.#chestItemCountProbabilities.rollChestItemCount(rng);

    const items: Item[] = [];
    let index = 0;
    for (let i = 0; i < itemCount; i++) {
      let item: Item | EquipmentPool | undefined = undefined;
      while (item === undefined) {
        if (rng.randBoolean(this.#itemDropProbabilities[index].probability)) {
          const maybeItem = this.#itemDropProbabilities[index].item;
          if (
            !(
              maybeItem instanceof Item &&
              (maybeItem.type === "holofigure" ||
                maybeItem.type === "blueprint")
            )
          ) {
            item = maybeItem;
          }
        }

        index = (index + 1) % this.#itemDropProbabilities.length;
      }

      if (item instanceof EquipmentPool) {
        item = item.rollEquipmentTemplate(rng, crossClass, enemyDropInfo);
      }

      if (item instanceof EquipmentTemplate) {
        items.push(item.rollEquipment(rng, this.#chestQuality));
        continue;
      }

      items.push(item);
    }

    return items;
  }

  /**
   * Gets the average number of times per drop that the given Item will be
   * dropped from this Item Drop Table.
   *
   * @param targetItem The Item
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
    crossClass: CharacterClass,
    optimalParty: boolean,
    enemyDropInfo: EnemyDropInfo,
  ): number {
    let totalExpectedCount = 0;
    for (
      let itemCount = 1;
      itemCount <= this.#chestItemCountProbabilities.maxItemCount;
      itemCount++
    ) {
      const possibleItemDropProbabilities = this.#itemDropProbabilities.filter(
        (itemDropProbability) =>
          itemDropProbability.probability !== 0 &&
          !(
            itemDropProbability.item instanceof Item &&
            (itemDropProbability.item.type === "holofigure" ||
              itemDropProbability.item.type === "blueprint")
          ),
      );

      const extendedItemDropProbabilities: (ItemDropProbability & {
        extendId: number;
      })[] = Array.from({ length: 3 }).flatMap((_, i) =>
        possibleItemDropProbabilities.map((itemDropProbability, index) => ({
          ...itemDropProbability,
          extendId: i * possibleItemDropProbabilities.length + index,
        })),
      );

      let expectedCountForItemCount = 0;
      for (const itemDrops of new Combination(
        extendedItemDropProbabilities,
        itemCount,
      )) {
        const desiredCount = itemDrops.reduce((acc, itemDrop) => {
          if (
            itemDrop.item instanceof EquipmentPool &&
            targetItem instanceof EquipmentTemplate
          ) {
            return (
              acc +
              itemDrop.item.probabilityOfEquipmentTemplate(
                targetItem,
                crossClass,
                optimalParty,
                enemyDropInfo,
              )
            );
          }

          return acc + +(itemDrop.item === targetItem);
        }, 0);

        let probability = 1;
        let dropIndex = 0;
        for (const itemDrop of extendedItemDropProbabilities) {
          if (dropIndex >= itemDrops.length) {
            break;
          }

          if (itemDrop.extendId === itemDrops[dropIndex].extendId) {
            probability *= itemDrop.probability / 100;
            dropIndex++;
          } else {
            probability *= 1 - itemDrop.probability / 100;
          }
        }

        expectedCountForItemCount += desiredCount * probability;
      }

      totalExpectedCount +=
        expectedCountForItemCount *
        this.#chestItemCountProbabilities.getProbabilityOfExactly(itemCount);
    }

    return totalExpectedCount;
  }
}
