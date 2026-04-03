import type { MtRand } from "~/common/util/mt-rand";
import type { ChestDropInfo } from "~/data/mapped/chest/drop-info.types";
import type { Material } from "~/data/mapped/item/material";

/** Represents all materials that a given appendage chest can drop. */
export class MaterialDropTable {
  readonly #materials: Material[];

  constructor(materials: Material[]) {
    this.#materials = materials;
  }

  /**
   * Gets all Materials that this Material Drop Table can drop for the given
   * parameters.
   *
   * @param chestDropInfo Chest-specific drop information
   * @param level The enemy level
   * @returns The materials
   */
  getDroppableMaterials(
    chestDropInfo: ChestDropInfo,
    level: number,
  ): Material[] {
    const droppableMaterials: Material[] = [];
    for (const material of this.#materials) {
      if (
        material.canDropFromAppendageIndex(
          chestDropInfo.sourceAppendageIndex,
        ) &&
        material.getDropProbability(chestDropInfo, level) > 0
      ) {
        droppableMaterials.push(material);
      }
    }

    return droppableMaterials;
  }

  /**
   * Randomly rolls materials from this drop table.
   *
   * @param rng The RNG engine
   * @param chestDropInfo Chest-specific drop information
   * @param level The enemy level
   * @returns The rolled materials
   */
  rollMaterials(
    rng: MtRand,
    chestDropInfo: ChestDropInfo,
    level: number,
  ): Material[] {
    return this.#materials.filter(
      (material) =>
        material.canDropFromAppendageIndex(
          chestDropInfo.sourceAppendageIndex,
        ) && rng.randBoolean(material.getDropProbability(chestDropInfo, level)),
    );
  }
}
