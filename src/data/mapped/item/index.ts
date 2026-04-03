import {
  getAmrDlList,
  getAmrPcList,
  getBtlItemSkillDoll,
  getBtlItemSkillInner,
  getDrpDlArmorTableGold,
  getDrpDlArmorTableSilver,
  getDrpDlWpnTableGold,
  getDrpDlWpnTableSilver,
  getDrpItemTable,
  getDrpPcArmorTableGold,
  getDrpPcArmorTableSilver,
  getDrpPcWpnTableGold,
  getDrpPcWpnTableSilver,
  getItmBlueprint,
  getItmFigList,
  getItmMaterialList,
  getItmPieceList,
  getItmPreciousList,
  getWpnDlList,
  getWpnPcList,
} from "~/data/bdat/bdat";
import type {
  Bdat,
  DrpDlArmorTableGoldRow,
  DrpDlArmorTableSilverRow,
  DrpDlWpnTableGoldRow,
  DrpDlWpnTableSilverRow,
  DrpPcArmorTableGoldRow,
  DrpPcArmorTableSilverRow,
  DrpPcWpnTableGoldRow,
  DrpPcWpnTableSilverRow,
  ItmMaterialListRow,
} from "~/data/bdat/bdat.types";
import { traitTables } from "~/data/mapped/affix";
import { mapBdat } from "~/data/mapped/common";
import {
  EquipmentTemplate,
  type EquipmentType,
} from "~/data/mapped/item/equipment";
import {
  EquipmentPool,
  type EquipmentPoolType,
} from "~/data/mapped/item/equipment-pool";
import { Item } from "~/data/mapped/item/item";
import { Material } from "~/data/mapped/item/material";
import {
  affixSlotCountProbabilities,
  chestMaterialDropProbabilities,
} from "~/data/mapped/probabilities";

// Initialize all except EquipmentPools
const _items: (Item | null)[] = mapBdat(getDrpItemTable(), (row) => {
  if (row.itemType === 0) {
    return null;
  }

  const templateInfo: {
    nameId: number;
    equipmentType: EquipmentType;
  } | null = (() => {
    switch (row.itemType) {
      case 1:
        return {
          nameId: getAmrPcList()[row.itemId].name,
          equipmentType: "ground-armor-head",
        };
      case 2:
        return {
          nameId: getAmrPcList()[row.itemId].name,
          equipmentType: "ground-armor-body",
        };
      case 3:
        return {
          nameId: getAmrPcList()[row.itemId].name,
          equipmentType: "ground-armor-arm-r",
        };
      case 4:
        return {
          nameId: getAmrPcList()[row.itemId].name,
          equipmentType: "ground-armor-arm-l",
        };
      case 5:
        return {
          nameId: getAmrPcList()[row.itemId].name,
          equipmentType: "ground-armor-legs",
        };
      case 6:
        return {
          nameId: getWpnPcList()[row.itemId].name,
          equipmentType: "ground-weapon-ranged",
        };
      case 7:
        return {
          nameId: getWpnPcList()[row.itemId].name,
          equipmentType: "ground-weapon-melee",
        };
      case 10:
        return {
          nameId: getAmrDlList()[row.itemId].name,
          equipmentType: "skell-armor-head",
        };
      case 11:
        return {
          nameId: getAmrDlList()[row.itemId].name,
          equipmentType: "skell-armor-body",
        };
      case 12:
        return {
          nameId: getAmrDlList()[row.itemId].name,
          equipmentType: "skell-armor-arm-r",
        };
      case 13:
        return {
          nameId: getAmrDlList()[row.itemId].name,
          equipmentType: "skell-armor-arm-l",
        };
      case 14:
        return {
          nameId: getAmrDlList()[row.itemId].name,
          equipmentType: "skell-armor-legs",
        };
      case 15:
        return {
          nameId: getWpnDlList()[row.itemId].name,
          equipmentType: "skell-weapon-back",
        };
      case 16:
        return {
          nameId: getWpnDlList()[row.itemId].name,
          equipmentType: "skell-weapon-shoulder",
        };
      case 17:
        return {
          nameId: getWpnDlList()[row.itemId].name,
          equipmentType: "skell-weapon-arm",
        };
      case 18:
        return {
          nameId: getWpnDlList()[row.itemId].name,
          equipmentType: "skell-weapon-sidearm",
        };
      case 19:
        return {
          nameId: getWpnDlList()[row.itemId].name,
          equipmentType: "skell-weapon-spare",
        };
      default:
        return null;
    }
  })();

  if (templateInfo !== null) {
    return new EquipmentTemplate(
      row.id,
      templateInfo.nameId,
      templateInfo.equipmentType,
      traitTables[row.affixLot],
      traitTables[row.affixLotGood],
      affixSlotCountProbabilities[row.affixNumLot],
      affixSlotCountProbabilities[row.affixNumLotG],
      affixSlotCountProbabilities[row.slotNumLot],
      affixSlotCountProbabilities[row.slotNumLotG],
    );
  }

  switch (row.itemType) {
    case 21:
      return new Item(
        row.id,
        getBtlItemSkillInner()[row.itemId].name,
        "ground-augment",
      );
    case 24:
      return new Item(
        row.id,
        getBtlItemSkillDoll()[row.itemId].name,
        "skell-augment",
      );
    // Materials don't actually exist in DRP_ItemTable
    // case 26:
    //   return new Item(
    //     row.id,
    //     getItmMaterialList()[row.itemId].name,
    //     "material",
    //   );
    case 29:
      return new Item(
        row.id,
        getItmPreciousList()[row.itemId].name,
        "important",
      );
    case 30:
      return new Item(
        row.id,
        getItmPieceList()[row.itemId].name,
        "nemesis-fragments",
      );
    case 64:
      return new Item(row.id, getItmFigList()[row.itemId].name, "holofigure");
    case 65:
      return new Item(row.id, getItmBlueprint()[row.itemId].name, "blueprint");
    default:
      throw new RangeError(`itemType=${row.itemType.toString()} is invalid`);
  }
});

function createEquipmentPool<
  T extends
    | DrpPcWpnTableSilverRow
    | DrpPcWpnTableGoldRow
    | DrpPcArmorTableSilverRow
    | DrpPcArmorTableGoldRow
    | DrpDlWpnTableSilverRow
    | DrpDlWpnTableGoldRow
    | DrpDlArmorTableSilverRow
    | DrpDlArmorTableGoldRow,
>(
  equipmentPoolBdat: Bdat<T>,
  equipmentPoolType: EquipmentPoolType,
): EquipmentPool {
  const numLevelRanges =
    equipmentPoolType === "ground-weapon" ||
    equipmentPoolType === "ground-armor"
      ? 16
      : 8;
  const poolKeyPrefix =
    equipmentPoolType === "ground-weapon" ||
    equipmentPoolType === "skell-weapon"
      ? "wpn"
      : "armor";

  const numPools = Object.keys(equipmentPoolBdat[0]).length - 1;

  const equipmentPool: EquipmentTemplate[][][] = [];
  for (let levelRangeId = 0; levelRangeId < numLevelRanges; levelRangeId++) {
    equipmentPool[levelRangeId] = [];

    const baseItemId = levelRangeId * 10;

    for (let poolId = 0; poolId < numPools; poolId++) {
      equipmentPool[levelRangeId][poolId] = [];

      const poolKey = `${poolKeyPrefix}${poolId.toString()}` as keyof T;

      for (let itemIdOffset = 0; itemIdOffset < 10; itemIdOffset++) {
        const itemId = equipmentPoolBdat[baseItemId + itemIdOffset][
          poolKey
        ] as number;

        if (itemId <= 0) {
          continue;
        }

        const item: Item | null = _items[itemId];

        if (!(item instanceof EquipmentTemplate)) {
          throw new TypeError("item was not an EquipmentTemplate");
        }

        equipmentPool[levelRangeId][poolId].push(item);
      }
    }
  }

  return new EquipmentPool(equipmentPool, equipmentPoolType);
}

// Initialize EquipmentPools
export const items: (Item | EquipmentPool)[] = _items.map((item, index) => {
  if (item !== null) {
    return item;
  }

  const equipmentPoolId = getDrpItemTable()[index].lotTable;

  switch (equipmentPoolId) {
    case 1:
      return createEquipmentPool(getDrpPcWpnTableSilver(), "ground-weapon");
    case 2:
      return createEquipmentPool(getDrpPcWpnTableGold(), "ground-weapon");
    case 3:
      return createEquipmentPool(getDrpPcArmorTableSilver(), "ground-armor");
    case 4:
      return createEquipmentPool(getDrpPcArmorTableGold(), "ground-armor");
    case 5:
      return createEquipmentPool(getDrpDlWpnTableSilver(), "skell-weapon");
    case 6:
      return createEquipmentPool(getDrpDlWpnTableGold(), "skell-weapon");
    case 7:
      return createEquipmentPool(getDrpDlArmorTableSilver(), "skell-armor");
    case 8:
      return createEquipmentPool(getDrpDlArmorTableGold(), "skell-armor");
    default:
      throw new RangeError(
        `equipmentPool=${equipmentPoolId.toString()} is invalid`,
      );
  }
});

export const materials: Material[] = mapBdat(getItmMaterialList(), (row) => {
  const canDropFromAppendageIndex = Array.from({ length: 11 }).map(
    (_, i) => row[`flagParts${i.toString()}` as keyof ItmMaterialListRow] === 1,
  );

  return new Material(
    row.id,
    row.name,
    chestMaterialDropProbabilities[row.lot],
    chestMaterialDropProbabilities[row.lotParts],
    row.addLotRevSilver,
    row.addLotRevGold,
    canDropFromAppendageIndex,
  );
});
