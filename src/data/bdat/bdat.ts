import { inferSchema, initParser } from "udsv";
import * as csv from "~/data/bdat/bdat-csv-index";
import * as bdatTypes from "~/data/bdat/bdat.types";

function ingestBdat<T extends bdatTypes.BdatRow>(
  bdatCsvStr: string,
  dummy: T,
): bdatTypes.Bdat<T> {
  const schema = inferSchema(bdatCsvStr);
  const parser = initParser({
    ...schema,
    cols: schema.cols.map((col) => ({
      ...col,
      repl: { ...col.repl, empty: undefined },
    })),
  });
  const records = parser.typedObjs(bdatCsvStr) as T[];

  // Tested by bdats.types.ts
  // Used to validate alignment between types and bdats
  // This caught 3 errors
  if (records.length > 0) {
    const testRecord = records[0];
    for (const key in dummy) {
      if (!Object.keys(testRecord).includes(key)) {
        throw new TypeError(
          `bdat did not contain expected column ${key}: ` +
            Object.keys(testRecord).toString(),
        );
      }
    }
  }

  return records.reduce<bdatTypes.Bdat<T>>((acc, record) => {
    acc[record.id] = record;
    return acc;
  }, []);
}

// Content generated:
// - Select bdat file range in VSCode
// - Right Click -> Copy Relative Path -> Paste into file
// - Find/Replace w/ Regex enabled
//   - Find: ^src/assets/data/((.)(.*)_(.*))\.csv$
//   - Replace: let \l$2\L$3$4Cache: bdatTypes.Bdat<bdatTypes.$2\L$3$4Row> | undefined = undefined;\nexport function get$2\L$3$4(): bdatTypes.Bdat<bdatTypes.$2\L$3$4Row> {\nif (!\l$2\L$3$4Cache) {\nconst \l$2\L$3$4Dummy: bdatTypes.$2\L$3$4Row = {\nid: 0,\n\n};\n\l$2\L$3$4Cache = ingestBdat(csv.$1, \l$2\L$3$4Dummy);\n}\n\nreturn \l$2\L$3$4Cache;\n}\n
// - Dummies filled manually
// - Format with Prettier

let amrDlListCache: bdatTypes.Bdat<bdatTypes.AmrDlListRow> | undefined =
  undefined;
export function getAmrDlList(): bdatTypes.Bdat<bdatTypes.AmrDlListRow> {
  if (!amrDlListCache) {
    const amrDlListDummy: bdatTypes.AmrDlListRow = {
      id: 0,
      name: 0,
    };
    amrDlListCache = ingestBdat(csv.AMR_DlList, amrDlListDummy);
  }

  return amrDlListCache;
}

let amrPcListCache: bdatTypes.Bdat<bdatTypes.AmrPcListRow> | undefined =
  undefined;
export function getAmrPcList(): bdatTypes.Bdat<bdatTypes.AmrPcListRow> {
  if (!amrPcListCache) {
    const amrPcListDummy: bdatTypes.AmrPcListRow = {
      id: 0,
      name: 0,
    };
    amrPcListCache = ingestBdat(csv.AMR_PcList, amrPcListDummy);
  }

  return amrPcListCache;
}

let btlEnhanceCache: bdatTypes.Bdat<bdatTypes.BtlEnhanceRow> | undefined =
  undefined;
export function getBtlEnhance(): bdatTypes.Bdat<bdatTypes.BtlEnhanceRow> {
  if (!btlEnhanceCache) {
    const btlEnhanceDummy: bdatTypes.BtlEnhanceRow = {
      id: 0,
      enhanceType: 0,
      type: 0,
      param1: 0,
      param2: 0,
      caption: 0,
    };
    btlEnhanceCache = ingestBdat(csv.BTL_Enhance, btlEnhanceDummy);
  }

  return btlEnhanceCache;
}

let btlItemSkillDollCache:
  | bdatTypes.Bdat<bdatTypes.BtlItemSkillDollRow>
  | undefined = undefined;
export function getBtlItemSkillDoll(): bdatTypes.Bdat<bdatTypes.BtlItemSkillDollRow> {
  if (!btlItemSkillDollCache) {
    const btlItemSkillDollDummy: bdatTypes.BtlItemSkillDollRow = {
      id: 0,
      name: 0,
      enhanceId: 0,
    };
    btlItemSkillDollCache = ingestBdat(
      csv.BTL_ItemSkillDoll,
      btlItemSkillDollDummy,
    );
  }

  return btlItemSkillDollCache;
}

let btlItemSkillInnerCache:
  | bdatTypes.Bdat<bdatTypes.BtlItemSkillInnerRow>
  | undefined = undefined;
export function getBtlItemSkillInner(): bdatTypes.Bdat<bdatTypes.BtlItemSkillInnerRow> {
  if (!btlItemSkillInnerCache) {
    const btlItemSkillInnerDummy: bdatTypes.BtlItemSkillInnerRow = {
      id: 0,
      name: 0,
      enhanceId: 0,
    };
    btlItemSkillInnerCache = ingestBdat(
      csv.BTL_ItemSkillInner,
      btlItemSkillInnerDummy,
    );
  }

  return btlItemSkillInnerCache;
}

let chrClassInfoCache: bdatTypes.Bdat<bdatTypes.ChrClassInfoRow> | undefined =
  undefined;
export function getChrClassInfo(): bdatTypes.Bdat<bdatTypes.ChrClassInfoRow> {
  if (!chrClassInfoCache) {
    const chrClassInfoDummy: bdatTypes.ChrClassInfoRow = {
      id: 0,
      name: 0,
      nearWeapon: 0,
      farWeapon: 0,
    };
    chrClassInfoCache = ingestBdat(csv.CHR_ClassInfo, chrClassInfoDummy);
  }

  return chrClassInfoCache;
}

let chrEnListCache: bdatTypes.Bdat<bdatTypes.ChrEnListRow> | undefined =
  undefined;
export function getChrEnList(): bdatTypes.Bdat<bdatTypes.ChrEnListRow> {
  if (!chrEnListCache) {
    const chrEnListDummy: bdatTypes.ChrEnListRow = {
      id: 0,
      paramId: 0,
      name: 0,
      lvMin: 0,
      lvMax: 0,
      flagNamed: 0,
      dropTableId: 0,
      rstDebuffRev: 0,
    };
    chrEnListCache = ingestBdat(csv.CHR_EnList, chrEnListDummy);
  }

  return chrEnListCache;
}

let chrEnParamCache: bdatTypes.Bdat<bdatTypes.ChrEnParamRow> | undefined =
  undefined;
export function getChrEnParam(): bdatTypes.Bdat<bdatTypes.ChrEnParamRow> {
  if (!chrEnParamCache) {
    const chrEnParamDummy: bdatTypes.ChrEnParamRow = {
      id: 0,
      resourceId: 0,
      rstDebuffFull: 0,
    };
    chrEnParamCache = ingestBdat(csv.CHR_EnParam, chrEnParamDummy);
  }

  return chrEnParamCache;
}

let chrEnRstDebuffRevCache:
  | bdatTypes.Bdat<bdatTypes.ChrEnRstDebuffRevRow>
  | undefined = undefined;
export function getChrEnRstDebuffRev(): bdatTypes.Bdat<bdatTypes.ChrEnRstDebuffRevRow> {
  if (!chrEnRstDebuffRevCache) {
    const chrEnRstDebuffRevDummy: bdatTypes.ChrEnRstDebuffRevRow = {
      id: 0,
      type: 0,
      rstDebuffFullRev2: 0,
    };
    chrEnRstDebuffRevCache = ingestBdat(
      csv.CHR_EnRstDebuffRev,
      chrEnRstDebuffRevDummy,
    );
  }

  return chrEnRstDebuffRevCache;
}

let defPcListCache: bdatTypes.Bdat<bdatTypes.DefPcListRow> | undefined =
  undefined;
export function getDefPcList(): bdatTypes.Bdat<bdatTypes.DefPcListRow> {
  if (!defPcListCache) {
    const defPcListDummy: bdatTypes.DefPcListRow = {
      id: 0,
      name: 0,
      classType: 0,
    };
    defPcListCache = ingestBdat(csv.DEF_PcList, defPcListDummy);
  }

  return defPcListCache;
}

let drpAffixSlotTableCache:
  | bdatTypes.Bdat<bdatTypes.DrpAffixSlotTableRow>
  | undefined = undefined;
export function getDrpAffixSlotTable(): bdatTypes.Bdat<bdatTypes.DrpAffixSlotTableRow> {
  if (!drpAffixSlotTableCache) {
    const drpAffixSlotTableDummy: bdatTypes.DrpAffixSlotTableRow = {
      id: 0,
      lot1: 0,
      lot2: 0,
      lot3: 0,
      lot4: 0,
    };
    drpAffixSlotTableCache = ingestBdat(
      csv.DRP_AffixSlotTable,
      drpAffixSlotTableDummy,
    );
  }

  return drpAffixSlotTableCache;
}

let drpAffixTableCache: bdatTypes.Bdat<bdatTypes.DrpAffixTableRow> | undefined =
  undefined;
export function getDrpAffixTable(): bdatTypes.Bdat<bdatTypes.DrpAffixTableRow> {
  if (!drpAffixTableCache) {
    const drpAffixTableDummy: bdatTypes.DrpAffixTableRow = {
      id: 0,
      lot1: 0,
      affixId1: 0,
      lot2: 0,
      affixId2: 0,
      lot3: 0,
      affixId3: 0,
      lot4: 0,
      affixId4: 0,
      lot5: 0,
      affixId5: 0,
      lot6: 0,
      affixId6: 0,
      lot7: 0,
      affixId7: 0,
      lot8: 0,
      affixId8: 0,
      lot9: 0,
      affixId9: 0,
      lot10: 0,
      affixId10: 0,
    };
    drpAffixTableCache = ingestBdat(csv.DRP_AffixTable, drpAffixTableDummy);
  }

  return drpAffixTableCache;
}

let drpBoxTableCache: bdatTypes.Bdat<bdatTypes.DrpBoxTableRow> | undefined =
  undefined;
export function getDrpBoxTable(): bdatTypes.Bdat<bdatTypes.DrpBoxTableRow> {
  if (!drpBoxTableCache) {
    const drpBoxTableDummy: bdatTypes.DrpBoxTableRow = {
      id: 0,
      name: "",
      partsName: 0,
      lotRank: 0,
      lock: 0,
      goldBox: 0,
      silverBox: 0,
      bronzeBox: 0,
    };
    drpBoxTableCache = ingestBdat(csv.DRP_BoxTable, drpBoxTableDummy);
  }

  return drpBoxTableCache;
}

let drpBronzeBoxTableCache:
  | bdatTypes.Bdat<bdatTypes.DrpBronzeBoxTableRow>
  | undefined = undefined;
export function getDrpBronzeBoxTable(): bdatTypes.Bdat<bdatTypes.DrpBronzeBoxTableRow> {
  if (!drpBronzeBoxTableCache) {
    const drpBronzeBoxTableDummy: bdatTypes.DrpBronzeBoxTableRow = {
      id: 0,
      item1: 0,
      item2: 0,
      item3: 0,
      item4: 0,
      item5: 0,
      item6: 0,
      item7: 0,
      item8: 0,
    };
    drpBronzeBoxTableCache = ingestBdat(
      csv.DRP_BronzeBoxTable,
      drpBronzeBoxTableDummy,
    );
  }

  return drpBronzeBoxTableCache;
}

let drpDlArmorTableGoldCache:
  | bdatTypes.Bdat<bdatTypes.DrpDlArmorTableGoldRow>
  | undefined = undefined;
export function getDrpDlArmorTableGold(): bdatTypes.Bdat<bdatTypes.DrpDlArmorTableGoldRow> {
  if (!drpDlArmorTableGoldCache) {
    const drpDlArmorTableGoldDummy: bdatTypes.DrpDlArmorTableGoldRow = {
      id: 0,
      armor0: 0,
      armor1: 0,
      armor2: 0,
      armor3: 0,
      armor4: 0,
      armor5: 0,
      armor6: 0,
      armor7: 0,
      armor8: 0,
      armor9: 0,
      armor10: 0,
      armor11: 0,
    };
    drpDlArmorTableGoldCache = ingestBdat(
      csv.DRP_DlArmorTableGold,
      drpDlArmorTableGoldDummy,
    );
  }

  return drpDlArmorTableGoldCache;
}

let drpDlArmorTableSilverCache:
  | bdatTypes.Bdat<bdatTypes.DrpDlArmorTableSilverRow>
  | undefined = undefined;
export function getDrpDlArmorTableSilver(): bdatTypes.Bdat<bdatTypes.DrpDlArmorTableSilverRow> {
  if (!drpDlArmorTableSilverCache) {
    const drpDlArmorTableSilverDummy: bdatTypes.DrpDlArmorTableSilverRow = {
      id: 0,
      armor0: 0,
      armor1: 0,
      armor2: 0,
      armor3: 0,
      armor4: 0,
      armor5: 0,
      armor6: 0,
      armor7: 0,
      armor8: 0,
      armor9: 0,
      armor10: 0,
      armor11: 0,
    };
    drpDlArmorTableSilverCache = ingestBdat(
      csv.DRP_DlArmorTableSilver,
      drpDlArmorTableSilverDummy,
    );
  }

  return drpDlArmorTableSilverCache;
}

let drpDlWpnTableGoldCache:
  | bdatTypes.Bdat<bdatTypes.DrpDlWpnTableGoldRow>
  | undefined = undefined;
export function getDrpDlWpnTableGold(): bdatTypes.Bdat<bdatTypes.DrpDlWpnTableGoldRow> {
  if (!drpDlWpnTableGoldCache) {
    const drpDlWpnTableGoldDummy: bdatTypes.DrpDlWpnTableGoldRow = {
      id: 0,
      wpn0: 0,
      wpn1: 0,
      wpn2: 0,
      wpn3: 0,
      wpn4: 0,
      wpn5: 0,
      wpn6: 0,
      wpn7: 0,
      wpn8: 0,
      wpn9: 0,
      wpn10: 0,
      wpn11: 0,
      wpn12: 0,
      wpn13: 0,
      wpn14: 0,
      wpn15: 0,
      wpn16: 0,
      wpn17: 0,
      wpn18: 0,
      wpn19: 0,
      wpn20: 0,
      wpn21: 0,
      wpn22: 0,
      wpn23: 0,
      wpn24: 0,
      wpn25: 0,
      wpn26: 0,
    };
    drpDlWpnTableGoldCache = ingestBdat(
      csv.DRP_DlWpnTableGold,
      drpDlWpnTableGoldDummy,
    );
  }

  return drpDlWpnTableGoldCache;
}

let drpDlWpnTableSilverCache:
  | bdatTypes.Bdat<bdatTypes.DrpDlWpnTableSilverRow>
  | undefined = undefined;
export function getDrpDlWpnTableSilver(): bdatTypes.Bdat<bdatTypes.DrpDlWpnTableSilverRow> {
  if (!drpDlWpnTableSilverCache) {
    const drpDlWpnTableSilverDummy: bdatTypes.DrpDlWpnTableSilverRow = {
      id: 0,
      wpn0: 0,
      wpn1: 0,
      wpn2: 0,
      wpn3: 0,
      wpn4: 0,
      wpn5: 0,
      wpn6: 0,
      wpn7: 0,
      wpn8: 0,
      wpn9: 0,
      wpn10: 0,
      wpn11: 0,
      wpn12: 0,
      wpn13: 0,
      wpn14: 0,
      wpn15: 0,
      wpn16: 0,
      wpn17: 0,
      wpn18: 0,
      wpn19: 0,
      wpn20: 0,
      wpn21: 0,
      wpn22: 0,
      wpn23: 0,
      wpn24: 0,
      wpn25: 0,
      wpn26: 0,
    };
    drpDlWpnTableSilverCache = ingestBdat(
      csv.DRP_DlWpnTableSilver,
      drpDlWpnTableSilverDummy,
    );
  }

  return drpDlWpnTableSilverCache;
}

let drpGoldBoxTableCache:
  | bdatTypes.Bdat<bdatTypes.DrpGoldBoxTableRow>
  | undefined = undefined;
export function getDrpGoldBoxTable(): bdatTypes.Bdat<bdatTypes.DrpGoldBoxTableRow> {
  if (!drpGoldBoxTableCache) {
    const drpGoldBoxTableDummy: bdatTypes.DrpGoldBoxTableRow = {
      id: 0,
      lot1: 0,
      item1: 0,
      lot2: 0,
      item2: 0,
      lot3: 0,
      item3: 0,
      lot4: 0,
      item4: 0,
      lot5: 0,
      item5: 0,
      lot6: 0,
      item6: 0,
      lot7: 0,
      item7: 0,
      lot8: 0,
      item8: 0,
      lot9: 0,
      item9: 0,
      lot10: 0,
      item10: 0,
      lot11: 0,
      item11: 0,
      lot12: 0,
      item12: 0,
    };
    drpGoldBoxTableCache = ingestBdat(
      csv.DRP_GoldBoxTable,
      drpGoldBoxTableDummy,
    );
  }

  return drpGoldBoxTableCache;
}

let drpHazureCache: bdatTypes.Bdat<bdatTypes.DrpHazureRow> | undefined =
  undefined;
export function getDrpHazure(): bdatTypes.Bdat<bdatTypes.DrpHazureRow> {
  if (!drpHazureCache) {
    const drpHazureDummy: bdatTypes.DrpHazureRow = {
      id: 0,
      hazureId: 0,
    };
    drpHazureCache = ingestBdat(csv.DRP_Hazure, drpHazureDummy);
  }

  return drpHazureCache;
}

let drpItemNumTableCache:
  | bdatTypes.Bdat<bdatTypes.DrpItemNumTableRow>
  | undefined = undefined;
export function getDrpItemNumTable(): bdatTypes.Bdat<bdatTypes.DrpItemNumTableRow> {
  if (!drpItemNumTableCache) {
    const drpItemNumTableDummy: bdatTypes.DrpItemNumTableRow = {
      id: 0,
      lot3: 0,
      lot2: 0,
      lot1: 0,
    };
    drpItemNumTableCache = ingestBdat(
      csv.DRP_ItemNumTable,
      drpItemNumTableDummy,
    );
  }

  return drpItemNumTableCache;
}

let drpItemTableCache: bdatTypes.Bdat<bdatTypes.DrpItemTableRow> | undefined =
  undefined;
export function getDrpItemTable(): bdatTypes.Bdat<bdatTypes.DrpItemTableRow> {
  if (!drpItemTableCache) {
    const drpItemTableDummy: bdatTypes.DrpItemTableRow = {
      id: 0,
      lotTable: 0,
      itemType: 0,
      itemId: 0,
      affixLot: 0,
      affixLotGood: 0,
      affixNumLot: 0,
      slotNumLot: 0,
      affixNumLotG: 0,
      slotNumLotG: 0,
    };
    drpItemTableCache = ingestBdat(csv.DRP_ItemTable, drpItemTableDummy);
  }

  return drpItemTableCache;
}

let drpLotMaterialTableCache:
  | bdatTypes.Bdat<bdatTypes.DrpLotMaterialTableRow>
  | undefined = undefined;
export function getDrpLotMaterialTable(): bdatTypes.Bdat<bdatTypes.DrpLotMaterialTableRow> {
  if (!drpLotMaterialTableCache) {
    const drpLotMaterialTableDummy: bdatTypes.DrpLotMaterialTableRow = {
      id: 0,
      lotLvGroup1: 0,
      lotLvGroup2: 0,
      lotLvGroup3: 0,
    };
    drpLotMaterialTableCache = ingestBdat(
      csv.DRP_LotMaterialTable,
      drpLotMaterialTableDummy,
    );
  }

  return drpLotMaterialTableCache;
}

let drpLotRankTableCache:
  | bdatTypes.Bdat<bdatTypes.DrpLotRankTableRow>
  | undefined = undefined;
export function getDrpLotRankTable(): bdatTypes.Bdat<bdatTypes.DrpLotRankTableRow> {
  if (!drpLotRankTableCache) {
    const drpLotRankTableDummy: bdatTypes.DrpLotRankTableRow = {
      id: 0,
      lotGold: 0,
      lotSilver: 0,
      lotBronze: 0,
    };
    drpLotRankTableCache = ingestBdat(
      csv.DRP_LotRankTable,
      drpLotRankTableDummy,
    );
  }

  return drpLotRankTableCache;
}

let drpPcArmorTableGoldCache:
  | bdatTypes.Bdat<bdatTypes.DrpPcArmorTableGoldRow>
  | undefined = undefined;
export function getDrpPcArmorTableGold(): bdatTypes.Bdat<bdatTypes.DrpPcArmorTableGoldRow> {
  if (!drpPcArmorTableGoldCache) {
    const drpPcArmorTableGoldDummy: bdatTypes.DrpPcArmorTableGoldRow = {
      id: 0,
      armor0: 0,
      armor1: 0,
      armor2: 0,
      armor3: 0,
      armor4: 0,
      armor5: 0,
      armor6: 0,
      armor7: 0,
      armor8: 0,
      armor9: 0,
      armor10: 0,
      armor11: 0,
      armor12: 0,
      armor13: 0,
      armor14: 0,
      armor15: 0,
      armor16: 0,
      armor17: 0,
      armor18: 0,
      armor19: 0,
      armor20: 0,
      armor21: 0,
    };
    drpPcArmorTableGoldCache = ingestBdat(
      csv.DRP_PcArmorTableGold,
      drpPcArmorTableGoldDummy,
    );
  }

  return drpPcArmorTableGoldCache;
}

let drpPcArmorTableSilverCache:
  | bdatTypes.Bdat<bdatTypes.DrpPcArmorTableSilverRow>
  | undefined = undefined;
export function getDrpPcArmorTableSilver(): bdatTypes.Bdat<bdatTypes.DrpPcArmorTableSilverRow> {
  if (!drpPcArmorTableSilverCache) {
    const drpPcArmorTableSilverDummy: bdatTypes.DrpPcArmorTableSilverRow = {
      id: 0,
      armor0: 0,
      armor1: 0,
      armor2: 0,
      armor3: 0,
      armor4: 0,
      armor5: 0,
      armor6: 0,
      armor7: 0,
      armor8: 0,
      armor9: 0,
      armor10: 0,
      armor11: 0,
      armor12: 0,
      armor13: 0,
      armor14: 0,
      armor15: 0,
      armor16: 0,
      armor17: 0,
      armor18: 0,
      armor19: 0,
      armor20: 0,
      armor21: 0,
    };
    drpPcArmorTableSilverCache = ingestBdat(
      csv.DRP_PcArmorTableSilver,
      drpPcArmorTableSilverDummy,
    );
  }

  return drpPcArmorTableSilverCache;
}

let drpPcWpnLotTableCache:
  | bdatTypes.Bdat<bdatTypes.DrpPcWpnLotTableRow>
  | undefined = undefined;
export function getDrpPcWpnLotTable(): bdatTypes.Bdat<bdatTypes.DrpPcWpnLotTableRow> {
  if (!drpPcWpnLotTableCache) {
    const drpPcWpnLotTableDummy: bdatTypes.DrpPcWpnLotTableRow = {
      id: 0,
      pc: 0,
      npc: 0,
    };
    drpPcWpnLotTableCache = ingestBdat(
      csv.DRP_PcWpnLotTable,
      drpPcWpnLotTableDummy,
    );
  }

  return drpPcWpnLotTableCache;
}

let drpPcWpnTableGoldCache:
  | bdatTypes.Bdat<bdatTypes.DrpPcWpnTableGoldRow>
  | undefined = undefined;
export function getDrpPcWpnTableGold(): bdatTypes.Bdat<bdatTypes.DrpPcWpnTableGoldRow> {
  if (!drpPcWpnTableGoldCache) {
    const drpPcWpnTableGoldDummy: bdatTypes.DrpPcWpnTableGoldRow = {
      id: 0,
      wpn0: 0,
      wpn1: 0,
      wpn2: 0,
      wpn3: 0,
      wpn4: 0,
      wpn5: 0,
      wpn6: 0,
      wpn7: 0,
      wpn8: 0,
      wpn9: 0,
      wpn10: 0,
      wpn11: 0,
    };
    drpPcWpnTableGoldCache = ingestBdat(
      csv.DRP_PcWpnTableGold,
      drpPcWpnTableGoldDummy,
    );
  }

  return drpPcWpnTableGoldCache;
}

let drpPcWpnTableSilverCache:
  | bdatTypes.Bdat<bdatTypes.DrpPcWpnTableSilverRow>
  | undefined = undefined;
export function getDrpPcWpnTableSilver(): bdatTypes.Bdat<bdatTypes.DrpPcWpnTableSilverRow> {
  if (!drpPcWpnTableSilverCache) {
    const drpPcWpnTableSilverDummy: bdatTypes.DrpPcWpnTableSilverRow = {
      id: 0,
      wpn0: 0,
      wpn1: 0,
      wpn2: 0,
      wpn3: 0,
      wpn4: 0,
      wpn5: 0,
      wpn6: 0,
      wpn7: 0,
      wpn8: 0,
      wpn9: 0,
      wpn10: 0,
      wpn11: 0,
    };
    drpPcWpnTableSilverCache = ingestBdat(
      csv.DRP_PcWpnTableSilver,
      drpPcWpnTableSilverDummy,
    );
  }

  return drpPcWpnTableSilverCache;
}

let drpSilverBoxTableCache:
  | bdatTypes.Bdat<bdatTypes.DrpSilverBoxTableRow>
  | undefined = undefined;
export function getDrpSilverBoxTable(): bdatTypes.Bdat<bdatTypes.DrpSilverBoxTableRow> {
  if (!drpSilverBoxTableCache) {
    const drpSilverBoxTableDummy: bdatTypes.DrpSilverBoxTableRow = {
      id: 0,
      lot1: 0,
      item1: 0,
      lot2: 0,
      item2: 0,
      lot3: 0,
      item3: 0,
      lot4: 0,
      item4: 0,
      lot5: 0,
      item5: 0,
      lot6: 0,
      item6: 0,
      lot7: 0,
      item7: 0,
      lot8: 0,
      item8: 0,
      lot9: 0,
      item9: 0,
      lot10: 0,
      item10: 0,
      lot11: 0,
      item11: 0,
      lot12: 0,
      item12: 0,
    };
    drpSilverBoxTableCache = ingestBdat(
      csv.DRP_SilverBoxTable,
      drpSilverBoxTableDummy,
    );
  }

  return drpSilverBoxTableCache;
}

let itmBlueprintCache: bdatTypes.Bdat<bdatTypes.ItmBlueprintRow> | undefined =
  undefined;
export function getItmBlueprint(): bdatTypes.Bdat<bdatTypes.ItmBlueprintRow> {
  if (!itmBlueprintCache) {
    const itmBlueprintDummy: bdatTypes.ItmBlueprintRow = {
      id: 0,
      name: 0,
    };
    itmBlueprintCache = ingestBdat(csv.ITM_Blueprint, itmBlueprintDummy);
  }

  return itmBlueprintCache;
}

let itmFigListCache: bdatTypes.Bdat<bdatTypes.ItmFigListRow> | undefined =
  undefined;
export function getItmFigList(): bdatTypes.Bdat<bdatTypes.ItmFigListRow> {
  if (!itmFigListCache) {
    const itmFigListDummy: bdatTypes.ItmFigListRow = {
      id: 0,
      name: 0,
    };
    itmFigListCache = ingestBdat(csv.ITM_FigList, itmFigListDummy);
  }

  return itmFigListCache;
}

let itmMaterialListCache:
  | bdatTypes.Bdat<bdatTypes.ItmMaterialListRow>
  | undefined = undefined;
export function getItmMaterialList(): bdatTypes.Bdat<bdatTypes.ItmMaterialListRow> {
  if (!itmMaterialListCache) {
    const itmMaterialListDummy: bdatTypes.ItmMaterialListRow = {
      id: 0,
      name: 0,
      lot: 0,
      lotParts: 0,
      addLotRevSilver: 0,
      addLotRevGold: 0,
      flagParts0: 0,
      flagParts1: 0,
      flagParts2: 0,
      flagParts3: 0,
      flagParts4: 0,
      flagParts5: 0,
      flagParts6: 0,
      flagParts7: 0,
      flagParts8: 0,
      flagParts9: 0,
      flagParts10: 0,
    };
    itmMaterialListCache = ingestBdat(
      csv.ITM_MaterialList,
      itmMaterialListDummy,
    );
  }

  return itmMaterialListCache;
}

let itmPieceListCache: bdatTypes.Bdat<bdatTypes.ItmPieceListRow> | undefined =
  undefined;
export function getItmPieceList(): bdatTypes.Bdat<bdatTypes.ItmPieceListRow> {
  if (!itmPieceListCache) {
    const itmPieceListDummy: bdatTypes.ItmPieceListRow = {
      id: 0,
      name: 0,
      itemType: 0,
      itemId: 0,
    };
    itmPieceListCache = ingestBdat(csv.ITM_PieceList, itmPieceListDummy);
  }

  return itmPieceListCache;
}

let itmPreciousListCache:
  | bdatTypes.Bdat<bdatTypes.ItmPreciousListRow>
  | undefined = undefined;
export function getItmPreciousList(): bdatTypes.Bdat<bdatTypes.ItmPreciousListRow> {
  if (!itmPreciousListCache) {
    const itmPreciousListDummy: bdatTypes.ItmPreciousListRow = {
      id: 0,
      name: 0,
    };
    itmPreciousListCache = ingestBdat(
      csv.ITM_PreciousList,
      itmPreciousListDummy,
    );
  }

  return itmPreciousListCache;
}

let rscEnListCache: bdatTypes.Bdat<bdatTypes.RscEnListRow> | undefined =
  undefined;
export function getRscEnList(): bdatTypes.Bdat<bdatTypes.RscEnListRow> {
  if (!rscEnListCache) {
    const rscEnListDummy: bdatTypes.RscEnListRow = {
      id: 0,
      drpPcArmorType: 0,
      drpDlWpnType: 0,
      drpDlArmorType: 0,
      parts: "",
    };
    rscEnListCache = ingestBdat(csv.RSC_EnList, rscEnListDummy);
  }

  return rscEnListCache;
}

let wpnDlListCache: bdatTypes.Bdat<bdatTypes.WpnDlListRow> | undefined =
  undefined;
export function getWpnDlList(): bdatTypes.Bdat<bdatTypes.WpnDlListRow> {
  if (!wpnDlListCache) {
    const wpnDlListDummy: bdatTypes.WpnDlListRow = {
      id: 0,
      name: 0,
    };
    wpnDlListCache = ingestBdat(csv.WPN_DlList, wpnDlListDummy);
  }

  return wpnDlListCache;
}

let wpnPcListCache: bdatTypes.Bdat<bdatTypes.WpnPcListRow> | undefined =
  undefined;
export function getWpnPcList(): bdatTypes.Bdat<bdatTypes.WpnPcListRow> {
  if (!wpnPcListCache) {
    const wpnPcListDummy: bdatTypes.WpnPcListRow = {
      id: 0,
      name: 0,
    };
    wpnPcListCache = ingestBdat(csv.WPN_PcList, wpnPcListDummy);
  }

  return wpnPcListCache;
}

let xyzAffixChoiceTableGoldCache:
  | bdatTypes.Bdat<bdatTypes.XyzAffixChoiceTableGoldRow>
  | undefined = undefined;
export function getXyzAffixChoiceTableGold(): bdatTypes.Bdat<bdatTypes.XyzAffixChoiceTableGoldRow> {
  if (!xyzAffixChoiceTableGoldCache) {
    const xyzAffixChoiceTableGoldDummy: bdatTypes.XyzAffixChoiceTableGoldRow = {
      id: 0,
      lot1: 0,
      lot2: 0,
      lot3: 0,
    };
    xyzAffixChoiceTableGoldCache = ingestBdat(
      csv.XYZ_AffixChoiceTableGold,
      xyzAffixChoiceTableGoldDummy,
    );
  }

  return xyzAffixChoiceTableGoldCache;
}

let xyzAffixChoiceTableSilverCache:
  | bdatTypes.Bdat<bdatTypes.XyzAffixChoiceTableSilverRow>
  | undefined = undefined;
export function getXyzAffixChoiceTableSilver(): bdatTypes.Bdat<bdatTypes.XyzAffixChoiceTableSilverRow> {
  if (!xyzAffixChoiceTableSilverCache) {
    const xyzAffixChoiceTableSilverDummy: bdatTypes.XyzAffixChoiceTableSilverRow =
      {
        id: 0,
        lot1: 0,
        lot2: 0,
        lot3: 0,
      };
    xyzAffixChoiceTableSilverCache = ingestBdat(
      csv.XYZ_AffixChoiceTableSilver,
      xyzAffixChoiceTableSilverDummy,
    );
  }

  return xyzAffixChoiceTableSilverCache;
}

let xyzEnemyPopGimkCache:
  | bdatTypes.Bdat<bdatTypes.XyzEnemyPopGimkRow>
  | undefined = undefined;
export function getXyzEnemyPopGimk(): bdatTypes.Bdat<bdatTypes.XyzEnemyPopGimkRow> {
  if (!xyzEnemyPopGimkCache) {
    const xyzEnemyPopGimkDummy: bdatTypes.XyzEnemyPopGimkRow = {
      id: 0,
      gmepId: 0,
    };
    xyzEnemyPopGimkCache = ingestBdat(
      csv.XYZ_EnemyPopGimk,
      xyzEnemyPopGimkDummy,
    );
  }

  return xyzEnemyPopGimkCache;
}

let xyzEnemyPopGmepCache:
  | bdatTypes.Bdat<bdatTypes.XyzEnemyPopGmepRow>
  | undefined = undefined;
export function getXyzEnemyPopGmep(): bdatTypes.Bdat<bdatTypes.XyzEnemyPopGmepRow> {
  if (!xyzEnemyPopGmepCache) {
    const xyzEnemyPopGmepDummy: bdatTypes.XyzEnemyPopGmepRow = {
      id: 0,
      enemyId1: 0,
      enemyId2: 0,
      enemyId3: 0,
      lvMin: 0,
      lvMax: 0,
    };
    xyzEnemyPopGmepCache = ingestBdat(
      csv.XYZ_EnemyPopGmep,
      xyzEnemyPopGmepDummy,
    );
  }

  return xyzEnemyPopGmepCache;
}

let xyzItemNumTableCrownCache:
  | bdatTypes.Bdat<bdatTypes.XyzItemNumTableCrownRow>
  | undefined = undefined;
export function getXyzItemNumTableCrown(): bdatTypes.Bdat<bdatTypes.XyzItemNumTableCrownRow> {
  if (!xyzItemNumTableCrownCache) {
    const xyzItemNumTableCrownDummy: bdatTypes.XyzItemNumTableCrownRow = {
      id: 0,
      lot3: 0,
      lot2: 0,
      lot1: 0,
    };
    xyzItemNumTableCrownCache = ingestBdat(
      csv.XYZ_ItemNumTableCrown,
      xyzItemNumTableCrownDummy,
    );
  }

  return xyzItemNumTableCrownCache;
}

let xyzPartsEnCache: bdatTypes.Bdat<bdatTypes.XyzPartsEnRow> | undefined =
  undefined;
export function getXyzPartsEn(): bdatTypes.Bdat<bdatTypes.XyzPartsEnRow> {
  if (!xyzPartsEnCache) {
    const xyzPartsEnDummy: bdatTypes.XyzPartsEnRow = {
      id: 0,
      file: "",
      partsId: 0,
      name: "",
    };
    xyzPartsEnCache = ingestBdat(csv.XYZ_PartsEn, xyzPartsEnDummy);
  }

  return xyzPartsEnCache;
}

// End generated content

const stringsDummy: bdatTypes.StringsBdatRow = {
  id: 0,
  name: "",
};

// Content generated:
// - Select strings bdat file range in VSCode
// - Right Click -> Copy Relative Path -> Paste into file
// - Find/Replace w/ Regex enabled
//   - Find: ^src/assets/data/strings/(.*)/((.)(?:([A-Z]{2})_)?(.*))_ms\.csv$
//   - Replace: let \l$3\L$4$5\u$1Cache: bdatTypes.StringsBdat | undefined = undefined;\nexport function get$3\L$4$5\u$1(): bdatTypes.StringsBdat {\nif (!\l$3\L$4$5\u$1Cache) {\n\l$3\L$4$5\u$1Cache = ingestBdat(csv.$2_$1, stringsDummy);\n}\n\nreturn \l$3\L$4$5\u$1Cache;\n}\n
// - Format with Prettier

let amrDlListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrDlListCn(): bdatTypes.StringsBdat {
  if (!amrDlListCnCache) {
    amrDlListCnCache = ingestBdat(csv.AMR_DlList_cn, stringsDummy);
  }

  return amrDlListCnCache;
}

let amrPcListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrPcListCn(): bdatTypes.StringsBdat {
  if (!amrPcListCnCache) {
    amrPcListCnCache = ingestBdat(csv.AMR_PcList_cn, stringsDummy);
  }

  return amrPcListCnCache;
}

let battleSkillCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillCn(): bdatTypes.StringsBdat {
  if (!battleSkillCnCache) {
    battleSkillCnCache = ingestBdat(csv.BattleSkill_cn, stringsDummy);
  }

  return battleSkillCnCache;
}

let battleSkillDlCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillDlCn(): bdatTypes.StringsBdat {
  if (!battleSkillDlCnCache) {
    battleSkillDlCnCache = ingestBdat(csv.BattleSkillDl_cn, stringsDummy);
  }

  return battleSkillDlCnCache;
}

let chrClassListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrClassListCn(): bdatTypes.StringsBdat {
  if (!chrClassListCnCache) {
    chrClassListCnCache = ingestBdat(csv.CHR_ClassList_cn, stringsDummy);
  }

  return chrClassListCnCache;
}

let chrEnListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrEnListCn(): bdatTypes.StringsBdat {
  if (!chrEnListCnCache) {
    chrEnListCnCache = ingestBdat(csv.CHR_EnList_cn, stringsDummy);
  }

  return chrEnListCnCache;
}

let defPcListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getDefPcListCn(): bdatTypes.StringsBdat {
  if (!defPcListCnCache) {
    defPcListCnCache = ingestBdat(csv.DEF_PcList_cn, stringsDummy);
  }

  return defPcListCnCache;
}

let itmBlueprintCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmBlueprintCn(): bdatTypes.StringsBdat {
  if (!itmBlueprintCnCache) {
    itmBlueprintCnCache = ingestBdat(csv.ITM_Blueprint_cn, stringsDummy);
  }

  return itmBlueprintCnCache;
}

let itmDeviceListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmDeviceListCn(): bdatTypes.StringsBdat {
  if (!itmDeviceListCnCache) {
    itmDeviceListCnCache = ingestBdat(csv.ITM_DeviceList_cn, stringsDummy);
  }

  return itmDeviceListCnCache;
}

let itmFigListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmFigListCn(): bdatTypes.StringsBdat {
  if (!itmFigListCnCache) {
    itmFigListCnCache = ingestBdat(csv.ITM_FigList_cn, stringsDummy);
  }

  return itmFigListCnCache;
}

let itmMaterialListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmMaterialListCn(): bdatTypes.StringsBdat {
  if (!itmMaterialListCnCache) {
    itmMaterialListCnCache = ingestBdat(csv.ITM_MaterialList_cn, stringsDummy);
  }

  return itmMaterialListCnCache;
}

let itmPieceListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPieceListCn(): bdatTypes.StringsBdat {
  if (!itmPieceListCnCache) {
    itmPieceListCnCache = ingestBdat(csv.ITM_PieceList_cn, stringsDummy);
  }

  return itmPieceListCnCache;
}

let itmPreciousListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPreciousListCn(): bdatTypes.StringsBdat {
  if (!itmPreciousListCnCache) {
    itmPreciousListCnCache = ingestBdat(csv.ITM_PreciousList_cn, stringsDummy);
  }

  return itmPreciousListCnCache;
}

let wpnDlListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnDlListCn(): bdatTypes.StringsBdat {
  if (!wpnDlListCnCache) {
    wpnDlListCnCache = ingestBdat(csv.WPN_DlList_cn, stringsDummy);
  }

  return wpnDlListCnCache;
}

let wpnPcListCnCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnPcListCn(): bdatTypes.StringsBdat {
  if (!wpnPcListCnCache) {
    wpnPcListCnCache = ingestBdat(csv.WPN_PcList_cn, stringsDummy);
  }

  return wpnPcListCnCache;
}

let amrDlListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrDlListFr(): bdatTypes.StringsBdat {
  if (!amrDlListFrCache) {
    amrDlListFrCache = ingestBdat(csv.AMR_DlList_fr, stringsDummy);
  }

  return amrDlListFrCache;
}

let amrPcListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrPcListFr(): bdatTypes.StringsBdat {
  if (!amrPcListFrCache) {
    amrPcListFrCache = ingestBdat(csv.AMR_PcList_fr, stringsDummy);
  }

  return amrPcListFrCache;
}

let battleSkillFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillFr(): bdatTypes.StringsBdat {
  if (!battleSkillFrCache) {
    battleSkillFrCache = ingestBdat(csv.BattleSkill_fr, stringsDummy);
  }

  return battleSkillFrCache;
}

let battleSkillDlFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillDlFr(): bdatTypes.StringsBdat {
  if (!battleSkillDlFrCache) {
    battleSkillDlFrCache = ingestBdat(csv.BattleSkillDl_fr, stringsDummy);
  }

  return battleSkillDlFrCache;
}

let chrClassListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrClassListFr(): bdatTypes.StringsBdat {
  if (!chrClassListFrCache) {
    chrClassListFrCache = ingestBdat(csv.CHR_ClassList_fr, stringsDummy);
  }

  return chrClassListFrCache;
}

let chrEnListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrEnListFr(): bdatTypes.StringsBdat {
  if (!chrEnListFrCache) {
    chrEnListFrCache = ingestBdat(csv.CHR_EnList_fr, stringsDummy);
  }

  return chrEnListFrCache;
}

let defPcListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getDefPcListFr(): bdatTypes.StringsBdat {
  if (!defPcListFrCache) {
    defPcListFrCache = ingestBdat(csv.DEF_PcList_fr, stringsDummy);
  }

  return defPcListFrCache;
}

let itmBlueprintFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmBlueprintFr(): bdatTypes.StringsBdat {
  if (!itmBlueprintFrCache) {
    itmBlueprintFrCache = ingestBdat(csv.ITM_Blueprint_fr, stringsDummy);
  }

  return itmBlueprintFrCache;
}

let itmDeviceListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmDeviceListFr(): bdatTypes.StringsBdat {
  if (!itmDeviceListFrCache) {
    itmDeviceListFrCache = ingestBdat(csv.ITM_DeviceList_fr, stringsDummy);
  }

  return itmDeviceListFrCache;
}

let itmFigListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmFigListFr(): bdatTypes.StringsBdat {
  if (!itmFigListFrCache) {
    itmFigListFrCache = ingestBdat(csv.ITM_FigList_fr, stringsDummy);
  }

  return itmFigListFrCache;
}

let itmMaterialListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmMaterialListFr(): bdatTypes.StringsBdat {
  if (!itmMaterialListFrCache) {
    itmMaterialListFrCache = ingestBdat(csv.ITM_MaterialList_fr, stringsDummy);
  }

  return itmMaterialListFrCache;
}

let itmPieceListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPieceListFr(): bdatTypes.StringsBdat {
  if (!itmPieceListFrCache) {
    itmPieceListFrCache = ingestBdat(csv.ITM_PieceList_fr, stringsDummy);
  }

  return itmPieceListFrCache;
}

let itmPreciousListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPreciousListFr(): bdatTypes.StringsBdat {
  if (!itmPreciousListFrCache) {
    itmPreciousListFrCache = ingestBdat(csv.ITM_PreciousList_fr, stringsDummy);
  }

  return itmPreciousListFrCache;
}

let wpnDlListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnDlListFr(): bdatTypes.StringsBdat {
  if (!wpnDlListFrCache) {
    wpnDlListFrCache = ingestBdat(csv.WPN_DlList_fr, stringsDummy);
  }

  return wpnDlListFrCache;
}

let wpnPcListFrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnPcListFr(): bdatTypes.StringsBdat {
  if (!wpnPcListFrCache) {
    wpnPcListFrCache = ingestBdat(csv.WPN_PcList_fr, stringsDummy);
  }

  return wpnPcListFrCache;
}

let amrDlListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrDlListGe(): bdatTypes.StringsBdat {
  if (!amrDlListGeCache) {
    amrDlListGeCache = ingestBdat(csv.AMR_DlList_ge, stringsDummy);
  }

  return amrDlListGeCache;
}

let amrPcListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrPcListGe(): bdatTypes.StringsBdat {
  if (!amrPcListGeCache) {
    amrPcListGeCache = ingestBdat(csv.AMR_PcList_ge, stringsDummy);
  }

  return amrPcListGeCache;
}

let battleSkillGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillGe(): bdatTypes.StringsBdat {
  if (!battleSkillGeCache) {
    battleSkillGeCache = ingestBdat(csv.BattleSkill_ge, stringsDummy);
  }

  return battleSkillGeCache;
}

let battleSkillDlGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillDlGe(): bdatTypes.StringsBdat {
  if (!battleSkillDlGeCache) {
    battleSkillDlGeCache = ingestBdat(csv.BattleSkillDl_ge, stringsDummy);
  }

  return battleSkillDlGeCache;
}

let chrClassListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrClassListGe(): bdatTypes.StringsBdat {
  if (!chrClassListGeCache) {
    chrClassListGeCache = ingestBdat(csv.CHR_ClassList_ge, stringsDummy);
  }

  return chrClassListGeCache;
}

let chrEnListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrEnListGe(): bdatTypes.StringsBdat {
  if (!chrEnListGeCache) {
    chrEnListGeCache = ingestBdat(csv.CHR_EnList_ge, stringsDummy);
  }

  return chrEnListGeCache;
}

let defPcListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getDefPcListGe(): bdatTypes.StringsBdat {
  if (!defPcListGeCache) {
    defPcListGeCache = ingestBdat(csv.DEF_PcList_ge, stringsDummy);
  }

  return defPcListGeCache;
}

let itmBlueprintGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmBlueprintGe(): bdatTypes.StringsBdat {
  if (!itmBlueprintGeCache) {
    itmBlueprintGeCache = ingestBdat(csv.ITM_Blueprint_ge, stringsDummy);
  }

  return itmBlueprintGeCache;
}

let itmDeviceListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmDeviceListGe(): bdatTypes.StringsBdat {
  if (!itmDeviceListGeCache) {
    itmDeviceListGeCache = ingestBdat(csv.ITM_DeviceList_ge, stringsDummy);
  }

  return itmDeviceListGeCache;
}

let itmFigListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmFigListGe(): bdatTypes.StringsBdat {
  if (!itmFigListGeCache) {
    itmFigListGeCache = ingestBdat(csv.ITM_FigList_ge, stringsDummy);
  }

  return itmFigListGeCache;
}

let itmMaterialListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmMaterialListGe(): bdatTypes.StringsBdat {
  if (!itmMaterialListGeCache) {
    itmMaterialListGeCache = ingestBdat(csv.ITM_MaterialList_ge, stringsDummy);
  }

  return itmMaterialListGeCache;
}

let itmPieceListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPieceListGe(): bdatTypes.StringsBdat {
  if (!itmPieceListGeCache) {
    itmPieceListGeCache = ingestBdat(csv.ITM_PieceList_ge, stringsDummy);
  }

  return itmPieceListGeCache;
}

let itmPreciousListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPreciousListGe(): bdatTypes.StringsBdat {
  if (!itmPreciousListGeCache) {
    itmPreciousListGeCache = ingestBdat(csv.ITM_PreciousList_ge, stringsDummy);
  }

  return itmPreciousListGeCache;
}

let wpnDlListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnDlListGe(): bdatTypes.StringsBdat {
  if (!wpnDlListGeCache) {
    wpnDlListGeCache = ingestBdat(csv.WPN_DlList_ge, stringsDummy);
  }

  return wpnDlListGeCache;
}

let wpnPcListGeCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnPcListGe(): bdatTypes.StringsBdat {
  if (!wpnPcListGeCache) {
    wpnPcListGeCache = ingestBdat(csv.WPN_PcList_ge, stringsDummy);
  }

  return wpnPcListGeCache;
}

let amrDlListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrDlListIt(): bdatTypes.StringsBdat {
  if (!amrDlListItCache) {
    amrDlListItCache = ingestBdat(csv.AMR_DlList_it, stringsDummy);
  }

  return amrDlListItCache;
}

let amrPcListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrPcListIt(): bdatTypes.StringsBdat {
  if (!amrPcListItCache) {
    amrPcListItCache = ingestBdat(csv.AMR_PcList_it, stringsDummy);
  }

  return amrPcListItCache;
}

let battleSkillItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillIt(): bdatTypes.StringsBdat {
  if (!battleSkillItCache) {
    battleSkillItCache = ingestBdat(csv.BattleSkill_it, stringsDummy);
  }

  return battleSkillItCache;
}

let battleSkillDlItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillDlIt(): bdatTypes.StringsBdat {
  if (!battleSkillDlItCache) {
    battleSkillDlItCache = ingestBdat(csv.BattleSkillDl_it, stringsDummy);
  }

  return battleSkillDlItCache;
}

let chrClassListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrClassListIt(): bdatTypes.StringsBdat {
  if (!chrClassListItCache) {
    chrClassListItCache = ingestBdat(csv.CHR_ClassList_it, stringsDummy);
  }

  return chrClassListItCache;
}

let chrEnListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrEnListIt(): bdatTypes.StringsBdat {
  if (!chrEnListItCache) {
    chrEnListItCache = ingestBdat(csv.CHR_EnList_it, stringsDummy);
  }

  return chrEnListItCache;
}

let defPcListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getDefPcListIt(): bdatTypes.StringsBdat {
  if (!defPcListItCache) {
    defPcListItCache = ingestBdat(csv.DEF_PcList_it, stringsDummy);
  }

  return defPcListItCache;
}

let itmBlueprintItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmBlueprintIt(): bdatTypes.StringsBdat {
  if (!itmBlueprintItCache) {
    itmBlueprintItCache = ingestBdat(csv.ITM_Blueprint_it, stringsDummy);
  }

  return itmBlueprintItCache;
}

let itmDeviceListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmDeviceListIt(): bdatTypes.StringsBdat {
  if (!itmDeviceListItCache) {
    itmDeviceListItCache = ingestBdat(csv.ITM_DeviceList_it, stringsDummy);
  }

  return itmDeviceListItCache;
}

let itmFigListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmFigListIt(): bdatTypes.StringsBdat {
  if (!itmFigListItCache) {
    itmFigListItCache = ingestBdat(csv.ITM_FigList_it, stringsDummy);
  }

  return itmFigListItCache;
}

let itmMaterialListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmMaterialListIt(): bdatTypes.StringsBdat {
  if (!itmMaterialListItCache) {
    itmMaterialListItCache = ingestBdat(csv.ITM_MaterialList_it, stringsDummy);
  }

  return itmMaterialListItCache;
}

let itmPieceListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPieceListIt(): bdatTypes.StringsBdat {
  if (!itmPieceListItCache) {
    itmPieceListItCache = ingestBdat(csv.ITM_PieceList_it, stringsDummy);
  }

  return itmPieceListItCache;
}

let itmPreciousListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPreciousListIt(): bdatTypes.StringsBdat {
  if (!itmPreciousListItCache) {
    itmPreciousListItCache = ingestBdat(csv.ITM_PreciousList_it, stringsDummy);
  }

  return itmPreciousListItCache;
}

let wpnDlListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnDlListIt(): bdatTypes.StringsBdat {
  if (!wpnDlListItCache) {
    wpnDlListItCache = ingestBdat(csv.WPN_DlList_it, stringsDummy);
  }

  return wpnDlListItCache;
}

let wpnPcListItCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnPcListIt(): bdatTypes.StringsBdat {
  if (!wpnPcListItCache) {
    wpnPcListItCache = ingestBdat(csv.WPN_PcList_it, stringsDummy);
  }

  return wpnPcListItCache;
}

let amrDlListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrDlListJp(): bdatTypes.StringsBdat {
  if (!amrDlListJpCache) {
    amrDlListJpCache = ingestBdat(csv.AMR_DlList_jp, stringsDummy);
  }

  return amrDlListJpCache;
}

let amrPcListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrPcListJp(): bdatTypes.StringsBdat {
  if (!amrPcListJpCache) {
    amrPcListJpCache = ingestBdat(csv.AMR_PcList_jp, stringsDummy);
  }

  return amrPcListJpCache;
}

let battleSkillJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillJp(): bdatTypes.StringsBdat {
  if (!battleSkillJpCache) {
    battleSkillJpCache = ingestBdat(csv.BattleSkill_jp, stringsDummy);
  }

  return battleSkillJpCache;
}

let battleSkillDlJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillDlJp(): bdatTypes.StringsBdat {
  if (!battleSkillDlJpCache) {
    battleSkillDlJpCache = ingestBdat(csv.BattleSkillDl_jp, stringsDummy);
  }

  return battleSkillDlJpCache;
}

let chrClassListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrClassListJp(): bdatTypes.StringsBdat {
  if (!chrClassListJpCache) {
    chrClassListJpCache = ingestBdat(csv.CHR_ClassList_jp, stringsDummy);
  }

  return chrClassListJpCache;
}

let chrEnListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrEnListJp(): bdatTypes.StringsBdat {
  if (!chrEnListJpCache) {
    chrEnListJpCache = ingestBdat(csv.CHR_EnList_jp, stringsDummy);
  }

  return chrEnListJpCache;
}

let defPcListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getDefPcListJp(): bdatTypes.StringsBdat {
  if (!defPcListJpCache) {
    defPcListJpCache = ingestBdat(csv.DEF_PcList_jp, stringsDummy);
  }

  return defPcListJpCache;
}

let itmBlueprintJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmBlueprintJp(): bdatTypes.StringsBdat {
  if (!itmBlueprintJpCache) {
    itmBlueprintJpCache = ingestBdat(csv.ITM_Blueprint_jp, stringsDummy);
  }

  return itmBlueprintJpCache;
}

let itmDeviceListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmDeviceListJp(): bdatTypes.StringsBdat {
  if (!itmDeviceListJpCache) {
    itmDeviceListJpCache = ingestBdat(csv.ITM_DeviceList_jp, stringsDummy);
  }

  return itmDeviceListJpCache;
}

let itmFigListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmFigListJp(): bdatTypes.StringsBdat {
  if (!itmFigListJpCache) {
    itmFigListJpCache = ingestBdat(csv.ITM_FigList_jp, stringsDummy);
  }

  return itmFigListJpCache;
}

let itmMaterialListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmMaterialListJp(): bdatTypes.StringsBdat {
  if (!itmMaterialListJpCache) {
    itmMaterialListJpCache = ingestBdat(csv.ITM_MaterialList_jp, stringsDummy);
  }

  return itmMaterialListJpCache;
}

let itmPieceListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPieceListJp(): bdatTypes.StringsBdat {
  if (!itmPieceListJpCache) {
    itmPieceListJpCache = ingestBdat(csv.ITM_PieceList_jp, stringsDummy);
  }

  return itmPieceListJpCache;
}

let itmPreciousListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPreciousListJp(): bdatTypes.StringsBdat {
  if (!itmPreciousListJpCache) {
    itmPreciousListJpCache = ingestBdat(csv.ITM_PreciousList_jp, stringsDummy);
  }

  return itmPreciousListJpCache;
}

let wpnDlListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnDlListJp(): bdatTypes.StringsBdat {
  if (!wpnDlListJpCache) {
    wpnDlListJpCache = ingestBdat(csv.WPN_DlList_jp, stringsDummy);
  }

  return wpnDlListJpCache;
}

let wpnPcListJpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnPcListJp(): bdatTypes.StringsBdat {
  if (!wpnPcListJpCache) {
    wpnPcListJpCache = ingestBdat(csv.WPN_PcList_jp, stringsDummy);
  }

  return wpnPcListJpCache;
}

let amrDlListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrDlListKr(): bdatTypes.StringsBdat {
  if (!amrDlListKrCache) {
    amrDlListKrCache = ingestBdat(csv.AMR_DlList_kr, stringsDummy);
  }

  return amrDlListKrCache;
}

let amrPcListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrPcListKr(): bdatTypes.StringsBdat {
  if (!amrPcListKrCache) {
    amrPcListKrCache = ingestBdat(csv.AMR_PcList_kr, stringsDummy);
  }

  return amrPcListKrCache;
}

let battleSkillKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillKr(): bdatTypes.StringsBdat {
  if (!battleSkillKrCache) {
    battleSkillKrCache = ingestBdat(csv.BattleSkill_kr, stringsDummy);
  }

  return battleSkillKrCache;
}

let battleSkillDlKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillDlKr(): bdatTypes.StringsBdat {
  if (!battleSkillDlKrCache) {
    battleSkillDlKrCache = ingestBdat(csv.BattleSkillDl_kr, stringsDummy);
  }

  return battleSkillDlKrCache;
}

let chrClassListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrClassListKr(): bdatTypes.StringsBdat {
  if (!chrClassListKrCache) {
    chrClassListKrCache = ingestBdat(csv.CHR_ClassList_kr, stringsDummy);
  }

  return chrClassListKrCache;
}

let chrEnListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrEnListKr(): bdatTypes.StringsBdat {
  if (!chrEnListKrCache) {
    chrEnListKrCache = ingestBdat(csv.CHR_EnList_kr, stringsDummy);
  }

  return chrEnListKrCache;
}

let defPcListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getDefPcListKr(): bdatTypes.StringsBdat {
  if (!defPcListKrCache) {
    defPcListKrCache = ingestBdat(csv.DEF_PcList_kr, stringsDummy);
  }

  return defPcListKrCache;
}

let itmBlueprintKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmBlueprintKr(): bdatTypes.StringsBdat {
  if (!itmBlueprintKrCache) {
    itmBlueprintKrCache = ingestBdat(csv.ITM_Blueprint_kr, stringsDummy);
  }

  return itmBlueprintKrCache;
}

let itmDeviceListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmDeviceListKr(): bdatTypes.StringsBdat {
  if (!itmDeviceListKrCache) {
    itmDeviceListKrCache = ingestBdat(csv.ITM_DeviceList_kr, stringsDummy);
  }

  return itmDeviceListKrCache;
}

let itmFigListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmFigListKr(): bdatTypes.StringsBdat {
  if (!itmFigListKrCache) {
    itmFigListKrCache = ingestBdat(csv.ITM_FigList_kr, stringsDummy);
  }

  return itmFigListKrCache;
}

let itmMaterialListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmMaterialListKr(): bdatTypes.StringsBdat {
  if (!itmMaterialListKrCache) {
    itmMaterialListKrCache = ingestBdat(csv.ITM_MaterialList_kr, stringsDummy);
  }

  return itmMaterialListKrCache;
}

let itmPieceListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPieceListKr(): bdatTypes.StringsBdat {
  if (!itmPieceListKrCache) {
    itmPieceListKrCache = ingestBdat(csv.ITM_PieceList_kr, stringsDummy);
  }

  return itmPieceListKrCache;
}

let itmPreciousListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPreciousListKr(): bdatTypes.StringsBdat {
  if (!itmPreciousListKrCache) {
    itmPreciousListKrCache = ingestBdat(csv.ITM_PreciousList_kr, stringsDummy);
  }

  return itmPreciousListKrCache;
}

let wpnDlListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnDlListKr(): bdatTypes.StringsBdat {
  if (!wpnDlListKrCache) {
    wpnDlListKrCache = ingestBdat(csv.WPN_DlList_kr, stringsDummy);
  }

  return wpnDlListKrCache;
}

let wpnPcListKrCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnPcListKr(): bdatTypes.StringsBdat {
  if (!wpnPcListKrCache) {
    wpnPcListKrCache = ingestBdat(csv.WPN_PcList_kr, stringsDummy);
  }

  return wpnPcListKrCache;
}

let amrDlListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrDlListSp(): bdatTypes.StringsBdat {
  if (!amrDlListSpCache) {
    amrDlListSpCache = ingestBdat(csv.AMR_DlList_sp, stringsDummy);
  }

  return amrDlListSpCache;
}

let amrPcListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrPcListSp(): bdatTypes.StringsBdat {
  if (!amrPcListSpCache) {
    amrPcListSpCache = ingestBdat(csv.AMR_PcList_sp, stringsDummy);
  }

  return amrPcListSpCache;
}

let battleSkillSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillSp(): bdatTypes.StringsBdat {
  if (!battleSkillSpCache) {
    battleSkillSpCache = ingestBdat(csv.BattleSkill_sp, stringsDummy);
  }

  return battleSkillSpCache;
}

let battleSkillDlSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillDlSp(): bdatTypes.StringsBdat {
  if (!battleSkillDlSpCache) {
    battleSkillDlSpCache = ingestBdat(csv.BattleSkillDl_sp, stringsDummy);
  }

  return battleSkillDlSpCache;
}

let chrClassListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrClassListSp(): bdatTypes.StringsBdat {
  if (!chrClassListSpCache) {
    chrClassListSpCache = ingestBdat(csv.CHR_ClassList_sp, stringsDummy);
  }

  return chrClassListSpCache;
}

let chrEnListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrEnListSp(): bdatTypes.StringsBdat {
  if (!chrEnListSpCache) {
    chrEnListSpCache = ingestBdat(csv.CHR_EnList_sp, stringsDummy);
  }

  return chrEnListSpCache;
}

let defPcListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getDefPcListSp(): bdatTypes.StringsBdat {
  if (!defPcListSpCache) {
    defPcListSpCache = ingestBdat(csv.DEF_PcList_sp, stringsDummy);
  }

  return defPcListSpCache;
}

let itmBlueprintSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmBlueprintSp(): bdatTypes.StringsBdat {
  if (!itmBlueprintSpCache) {
    itmBlueprintSpCache = ingestBdat(csv.ITM_Blueprint_sp, stringsDummy);
  }

  return itmBlueprintSpCache;
}

let itmDeviceListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmDeviceListSp(): bdatTypes.StringsBdat {
  if (!itmDeviceListSpCache) {
    itmDeviceListSpCache = ingestBdat(csv.ITM_DeviceList_sp, stringsDummy);
  }

  return itmDeviceListSpCache;
}

let itmFigListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmFigListSp(): bdatTypes.StringsBdat {
  if (!itmFigListSpCache) {
    itmFigListSpCache = ingestBdat(csv.ITM_FigList_sp, stringsDummy);
  }

  return itmFigListSpCache;
}

let itmMaterialListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmMaterialListSp(): bdatTypes.StringsBdat {
  if (!itmMaterialListSpCache) {
    itmMaterialListSpCache = ingestBdat(csv.ITM_MaterialList_sp, stringsDummy);
  }

  return itmMaterialListSpCache;
}

let itmPieceListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPieceListSp(): bdatTypes.StringsBdat {
  if (!itmPieceListSpCache) {
    itmPieceListSpCache = ingestBdat(csv.ITM_PieceList_sp, stringsDummy);
  }

  return itmPieceListSpCache;
}

let itmPreciousListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPreciousListSp(): bdatTypes.StringsBdat {
  if (!itmPreciousListSpCache) {
    itmPreciousListSpCache = ingestBdat(csv.ITM_PreciousList_sp, stringsDummy);
  }

  return itmPreciousListSpCache;
}

let wpnDlListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnDlListSp(): bdatTypes.StringsBdat {
  if (!wpnDlListSpCache) {
    wpnDlListSpCache = ingestBdat(csv.WPN_DlList_sp, stringsDummy);
  }

  return wpnDlListSpCache;
}

let wpnPcListSpCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnPcListSp(): bdatTypes.StringsBdat {
  if (!wpnPcListSpCache) {
    wpnPcListSpCache = ingestBdat(csv.WPN_PcList_sp, stringsDummy);
  }

  return wpnPcListSpCache;
}

let amrDlListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrDlListTw(): bdatTypes.StringsBdat {
  if (!amrDlListTwCache) {
    amrDlListTwCache = ingestBdat(csv.AMR_DlList_tw, stringsDummy);
  }

  return amrDlListTwCache;
}

let amrPcListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrPcListTw(): bdatTypes.StringsBdat {
  if (!amrPcListTwCache) {
    amrPcListTwCache = ingestBdat(csv.AMR_PcList_tw, stringsDummy);
  }

  return amrPcListTwCache;
}

let battleSkillTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillTw(): bdatTypes.StringsBdat {
  if (!battleSkillTwCache) {
    battleSkillTwCache = ingestBdat(csv.BattleSkill_tw, stringsDummy);
  }

  return battleSkillTwCache;
}

let battleSkillDlTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillDlTw(): bdatTypes.StringsBdat {
  if (!battleSkillDlTwCache) {
    battleSkillDlTwCache = ingestBdat(csv.BattleSkillDl_tw, stringsDummy);
  }

  return battleSkillDlTwCache;
}

let chrClassListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrClassListTw(): bdatTypes.StringsBdat {
  if (!chrClassListTwCache) {
    chrClassListTwCache = ingestBdat(csv.CHR_ClassList_tw, stringsDummy);
  }

  return chrClassListTwCache;
}

let chrEnListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrEnListTw(): bdatTypes.StringsBdat {
  if (!chrEnListTwCache) {
    chrEnListTwCache = ingestBdat(csv.CHR_EnList_tw, stringsDummy);
  }

  return chrEnListTwCache;
}

let defPcListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getDefPcListTw(): bdatTypes.StringsBdat {
  if (!defPcListTwCache) {
    defPcListTwCache = ingestBdat(csv.DEF_PcList_tw, stringsDummy);
  }

  return defPcListTwCache;
}

let itmBlueprintTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmBlueprintTw(): bdatTypes.StringsBdat {
  if (!itmBlueprintTwCache) {
    itmBlueprintTwCache = ingestBdat(csv.ITM_Blueprint_tw, stringsDummy);
  }

  return itmBlueprintTwCache;
}

let itmDeviceListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmDeviceListTw(): bdatTypes.StringsBdat {
  if (!itmDeviceListTwCache) {
    itmDeviceListTwCache = ingestBdat(csv.ITM_DeviceList_tw, stringsDummy);
  }

  return itmDeviceListTwCache;
}

let itmFigListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmFigListTw(): bdatTypes.StringsBdat {
  if (!itmFigListTwCache) {
    itmFigListTwCache = ingestBdat(csv.ITM_FigList_tw, stringsDummy);
  }

  return itmFigListTwCache;
}

let itmMaterialListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmMaterialListTw(): bdatTypes.StringsBdat {
  if (!itmMaterialListTwCache) {
    itmMaterialListTwCache = ingestBdat(csv.ITM_MaterialList_tw, stringsDummy);
  }

  return itmMaterialListTwCache;
}

let itmPieceListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPieceListTw(): bdatTypes.StringsBdat {
  if (!itmPieceListTwCache) {
    itmPieceListTwCache = ingestBdat(csv.ITM_PieceList_tw, stringsDummy);
  }

  return itmPieceListTwCache;
}

let itmPreciousListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPreciousListTw(): bdatTypes.StringsBdat {
  if (!itmPreciousListTwCache) {
    itmPreciousListTwCache = ingestBdat(csv.ITM_PreciousList_tw, stringsDummy);
  }

  return itmPreciousListTwCache;
}

let wpnDlListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnDlListTw(): bdatTypes.StringsBdat {
  if (!wpnDlListTwCache) {
    wpnDlListTwCache = ingestBdat(csv.WPN_DlList_tw, stringsDummy);
  }

  return wpnDlListTwCache;
}

let wpnPcListTwCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnPcListTw(): bdatTypes.StringsBdat {
  if (!wpnPcListTwCache) {
    wpnPcListTwCache = ingestBdat(csv.WPN_PcList_tw, stringsDummy);
  }

  return wpnPcListTwCache;
}

let amrDlListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrDlListUs(): bdatTypes.StringsBdat {
  if (!amrDlListUsCache) {
    amrDlListUsCache = ingestBdat(csv.AMR_DlList_us, stringsDummy);
  }

  return amrDlListUsCache;
}

let amrPcListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getAmrPcListUs(): bdatTypes.StringsBdat {
  if (!amrPcListUsCache) {
    amrPcListUsCache = ingestBdat(csv.AMR_PcList_us, stringsDummy);
  }

  return amrPcListUsCache;
}

let battleSkillUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillUs(): bdatTypes.StringsBdat {
  if (!battleSkillUsCache) {
    battleSkillUsCache = ingestBdat(csv.BattleSkill_us, stringsDummy);
  }

  return battleSkillUsCache;
}

let battleSkillDlUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getBattleSkillDlUs(): bdatTypes.StringsBdat {
  if (!battleSkillDlUsCache) {
    battleSkillDlUsCache = ingestBdat(csv.BattleSkillDl_us, stringsDummy);
  }

  return battleSkillDlUsCache;
}

let chrClassListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrClassListUs(): bdatTypes.StringsBdat {
  if (!chrClassListUsCache) {
    chrClassListUsCache = ingestBdat(csv.CHR_ClassList_us, stringsDummy);
  }

  return chrClassListUsCache;
}

let chrEnListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getChrEnListUs(): bdatTypes.StringsBdat {
  if (!chrEnListUsCache) {
    chrEnListUsCache = ingestBdat(csv.CHR_EnList_us, stringsDummy);
  }

  return chrEnListUsCache;
}

let defPcListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getDefPcListUs(): bdatTypes.StringsBdat {
  if (!defPcListUsCache) {
    defPcListUsCache = ingestBdat(csv.DEF_PcList_us, stringsDummy);
  }

  return defPcListUsCache;
}

let itmBlueprintUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmBlueprintUs(): bdatTypes.StringsBdat {
  if (!itmBlueprintUsCache) {
    itmBlueprintUsCache = ingestBdat(csv.ITM_Blueprint_us, stringsDummy);
  }

  return itmBlueprintUsCache;
}

let itmDeviceListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmDeviceListUs(): bdatTypes.StringsBdat {
  if (!itmDeviceListUsCache) {
    itmDeviceListUsCache = ingestBdat(csv.ITM_DeviceList_us, stringsDummy);
  }

  return itmDeviceListUsCache;
}

let itmFigListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmFigListUs(): bdatTypes.StringsBdat {
  if (!itmFigListUsCache) {
    itmFigListUsCache = ingestBdat(csv.ITM_FigList_us, stringsDummy);
  }

  return itmFigListUsCache;
}

let itmMaterialListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmMaterialListUs(): bdatTypes.StringsBdat {
  if (!itmMaterialListUsCache) {
    itmMaterialListUsCache = ingestBdat(csv.ITM_MaterialList_us, stringsDummy);
  }

  return itmMaterialListUsCache;
}

let itmPieceListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPieceListUs(): bdatTypes.StringsBdat {
  if (!itmPieceListUsCache) {
    itmPieceListUsCache = ingestBdat(csv.ITM_PieceList_us, stringsDummy);
  }

  return itmPieceListUsCache;
}

let itmPreciousListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getItmPreciousListUs(): bdatTypes.StringsBdat {
  if (!itmPreciousListUsCache) {
    itmPreciousListUsCache = ingestBdat(csv.ITM_PreciousList_us, stringsDummy);
  }

  return itmPreciousListUsCache;
}

let wpnDlListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnDlListUs(): bdatTypes.StringsBdat {
  if (!wpnDlListUsCache) {
    wpnDlListUsCache = ingestBdat(csv.WPN_DlList_us, stringsDummy);
  }

  return wpnDlListUsCache;
}

let wpnPcListUsCache: bdatTypes.StringsBdat | undefined = undefined;
export function getWpnPcListUs(): bdatTypes.StringsBdat {
  if (!wpnPcListUsCache) {
    wpnPcListUsCache = ingestBdat(csv.WPN_PcList_us, stringsDummy);
  }

  return wpnPcListUsCache;
}

// End generated content
