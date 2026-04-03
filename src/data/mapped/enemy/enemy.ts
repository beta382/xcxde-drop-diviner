import type { Except } from "type-fest";
import type { MtRand } from "~/common/util/mt-rand";
import type { Affix } from "~/data/mapped/affix/affix";
import type {
  ChestDropInfo,
  EnemyDropInfo,
} from "~/data/mapped/chest/drop-info.types";
import type { DropTable } from "~/data/mapped/chest/drop-table";
import { Named } from "~/data/mapped/common";
import type { Appendage } from "~/data/mapped/enemy/appendage";
import type { EquipmentTemplate } from "~/data/mapped/item/equipment";
import type { Item } from "~/data/mapped/item/item";
import type { CharacterClass } from "~/data/mapped/party/character-class";

type DropPools = Except<EnemyDropInfo, "level">;

/** Represents a specific enemy type. */
export class EnemyTemplate extends Named {
  readonly id: number;
  readonly #levels: number[];
  readonly #heroicTaleLevels: number[];
  readonly #appendages: Appendage[];
  readonly #dropPools: DropPools;

  constructor(
    nameId: number,
    id: number,
    levels: number[],
    heroicTaleLevels: number[],
    dropPools: DropPools,
    appendages: Appendage[],
  ) {
    super(nameId, "ChrEnList");
    this.id = id;
    this.#levels = levels;
    this.#heroicTaleLevels = heroicTaleLevels;
    this.#appendages = appendages;
    this.#dropPools = dropPools;
  }

  /** The valid Enemy levels for this Enemy Template. */
  get levels(): number[] {
    return [...this.#levels];
  }

  /** The Heroic Tale-exclusive Enemy levels for this Enemy Template. */
  get heroicTaleLevels(): number[] {
    return [...this.#heroicTaleLevels];
  }

  /** The body appendage for this Enemy Template. */
  get body(): Appendage {
    return this.#appendages[0];
  }

  /** The non-body appendages for this Enemy Template. */
  get appendages(): Appendage[] {
    return this.#appendages.slice(1);
  }

  /**
   * Creates an instance of an Enemy from this Enemy Template.
   *
   * @param level The level of the Enemy
   * @param brokenAppendages The broken appendages of the Enemy (exclude body)
   * @returns The Enemy
   */
  createEnemy(level: number, brokenAppendages: Appendage[]): Enemy {
    if (
      !this.#levels.includes(level) &&
      !this.#heroicTaleLevels.includes(level)
    ) {
      throw new RangeError(
        `level=${level.toString()} is invalid, must be in ` +
          `[${this.#levels.toString()}] or ` +
          `[${this.#heroicTaleLevels.toString()}]`,
      );
    }

    for (const appendage of brokenAppendages) {
      if (!this.appendages.includes(appendage)) {
        throw new RangeError(
          `appendage="${appendage.debugName}":` +
            `${appendage.appendageIndex.toString()} is invalid`,
        );
      }
    }

    brokenAppendages = [this.body, ...brokenAppendages];
    return new Enemy(
      this.id,
      this.nameId,
      { level, ...this.#dropPools },
      brokenAppendages,
    );
  }
}

/**
 * Represents a specific enemy instance, with an exact level and broken
 * appendages.
 */
export class Enemy extends Named {
  readonly id: number;
  readonly #dropInfo: EnemyDropInfo;
  readonly #brokenAppendages: Appendage[];

  constructor(
    id: number,
    nameId: number,
    dropInfo: EnemyDropInfo,
    brokenAppendages: Appendage[],
  ) {
    super(nameId, "ChrEnList");
    this.id = id;
    this.#dropInfo = dropInfo;
    this.#brokenAppendages = brokenAppendages;
  }

  /** The level for this enemy. */
  get level(): number {
    return this.#dropInfo.level;
  }

  /** The broken appendages for this enemy (includes body) */
  get brokenAppendages(): Appendage[] {
    return [...this.#brokenAppendages];
  }

  /**
   * Gets all Items that this Enemy can drop for the given parameters.
   *
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @returns The deduplicated set of Items
   */
  getDroppableItems(treasureSensor: number): Item[] {
    return [
      ...new Set(
        this.#brokenAppendages.flatMap((appendage) =>
          appendage.dropTable.getDroppableItems(
            treasureSensor,
            appendage.appendageIndex,
            this.#dropInfo,
          ),
        ),
      ),
    ];
  }

  /**
   * Randomly rolls item drops for this Enemy.
   *
   * @param rng The RNG engine
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @param crossClass The character class currently equipped by the player
   *   character
   * @returns The rolled items
   */
  rollItems(
    rng: MtRand,
    treasureSensor: number,
    crossClass: CharacterClass,
  ): Item[] {
    const chests: { dropTable: DropTable; chestDropInfo: ChestDropInfo }[] = [];
    for (const appendage of this.#brokenAppendages) {
      const dropTable = appendage.dropTable;
      const chestQuality = dropTable.rollChestQuality(rng, treasureSensor);
      if (!chestQuality) {
        continue;
      }

      chests.push({
        dropTable,
        chestDropInfo: {
          quality: chestQuality,
          sourceAppendageIndex: appendage.appendageIndex,
        },
      });
    }

    return chests.flatMap((chest) =>
      chest.dropTable.rollItems(
        rng,
        crossClass,
        this.#dropInfo,
        chest.chestDropInfo,
      ),
    );
  }

  /**
   * Gets the average number of times per kill that the given Item will be
   * dropped from this Enemy.
   *
   * Material targetItems are not supported.
   *
   * @param targetItem The Item
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @param crossClass The character class currently equipped by the player
   *   character
   * @param optimalParty Whether to assume the rest of the party exists and
   *   consits of effectively identical classes to crossClass
   * @returns The average number of times the given item will drop from this
   *   enemy
   */
  averageDropCountForItem(
    targetItem: Item,
    treasureSensor: number,
    crossClass: CharacterClass,
    optimalParty: boolean,
  ): number {
    return this.#brokenAppendages
      .map((appendage) => appendage.dropTable)
      .reduce(
        (acc, dropTable) =>
          acc +
          dropTable.averageDropCountForItem(
            targetItem,
            treasureSensor,
            crossClass,
            optimalParty,
            this.#dropInfo,
          ),
        0,
      );
  }

  /**
   * Gets the average number of times per kill that a satisfying Equipment will
   * be dropped from this Enemy.
   *
   * @param targetEquipmentTemplate The Equipment Template
   * @param treasureSensor The Treasure Sensor bonus in percentage points
   * @param crossClass The character class currently equipped by the player
   *   character
   * @param optimalParty Whether to assume the rest of the party exists and
   *   consits of effectively identical classes to crossClass
   * @param traits The traits that must be present
   * @param augmentSlots The minimum number of augment slots
   * @returns The average number of times a satisfying Equipment will drop from
   *   this Enemy
   */
  averageDropCountForSatisfyingEquipment(
    targetEquipmentTemplate: EquipmentTemplate,
    treasureSensor: number,
    crossClass: CharacterClass,
    optimalParty: boolean,
    traits: Affix[],
    augmentSlots: number,
  ): number {
    return this.#brokenAppendages
      .map((appendage) => appendage.dropTable)
      .reduce(
        (acc, dropTable) =>
          acc +
          dropTable.averageDropCountForSatisfyingEquipment(
            targetEquipmentTemplate,
            treasureSensor,
            crossClass,
            optimalParty,
            this.#dropInfo,
            traits,
            augmentSlots,
          ),
        0,
      );
  }
}
