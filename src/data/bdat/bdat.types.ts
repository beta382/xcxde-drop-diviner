export type Bdat<T extends BdatRow> = T[];

export type StringsBdat = Bdat<StringsBdatRow>;

export interface BdatRow {
  readonly id: number;
}

export interface StringsBdatRow extends BdatRow {
  readonly name: string;
}

export interface AmrDlListRow extends BdatRow {
  readonly name: number;
}

export interface AmrPcListRow extends BdatRow {
  readonly name: number;
}

export interface BtlEnhanceRow extends BdatRow {
  readonly enhanceType: number;
  readonly type: number;
  readonly param1: number;
  readonly param2: number;
  readonly caption: number;
}

export interface BtlItemSkillDollRow extends BdatRow {
  readonly name: number;
  readonly enhanceId: number;
}

export interface BtlItemSkillInnerRow extends BdatRow {
  readonly name: number;
  readonly enhanceId: number;
}

export interface ChrClassInfoRow extends BdatRow {
  readonly name: number;
  readonly nearWeapon: number;
  readonly farWeapon: number;
}

export interface ChrEnListRow extends BdatRow {
  readonly paramId: number;
  readonly name: number;
  readonly lvMin: number;
  readonly lvMax: number;
  readonly flagNamed: number;
  readonly dropTableId: number;
  readonly rstDebuffRev: number;
}

export interface ChrEnParamRow extends BdatRow {
  readonly resourceId: number;
  readonly rstDebuffFull: number;
}

export interface ChrEnRstDebuffRevRow extends BdatRow {
  readonly type: number;
  readonly rstDebuffFullRev2: number;
}

export interface DefPcListRow extends BdatRow {
  readonly name: number;
  readonly classType: number;
}

export interface DrpAffixSlotTableRow extends BdatRow {
  readonly lot1: number;
  readonly lot2: number;
  readonly lot3: number;
  readonly lot4: number;
}

export interface DrpAffixTableRow extends BdatRow {
  readonly lot1: number;
  readonly affixId1: number;
  readonly lot2: number;
  readonly affixId2: number;
  readonly lot3: number;
  readonly affixId3: number;
  readonly lot4: number;
  readonly affixId4: number;
  readonly lot5: number;
  readonly affixId5: number;
  readonly lot6: number;
  readonly affixId6: number;
  readonly lot7: number;
  readonly affixId7: number;
  readonly lot8: number;
  readonly affixId8: number;
  readonly lot9: number;
  readonly affixId9: number;
  readonly lot10: number;
  readonly affixId10: number;
}

export interface DrpBoxTableRow extends BdatRow {
  readonly name: string;
  readonly partsName: number;
  readonly lotRank: number;
  readonly lock: number;
  readonly goldBox: number;
  readonly silverBox: number;
  readonly bronzeBox: number;
}

export interface DrpBronzeBoxTableRow extends BdatRow {
  readonly item1: number;
  readonly item2: number;
  readonly item3: number;
  readonly item4: number;
  readonly item5: number;
  readonly item6: number;
  readonly item7: number;
  readonly item8: number;
}

export interface DrpDlArmorTableGoldRow extends BdatRow {
  readonly armor0: number;
  readonly armor1: number;
  readonly armor2: number;
  readonly armor3: number;
  readonly armor4: number;
  readonly armor5: number;
  readonly armor6: number;
  readonly armor7: number;
  readonly armor8: number;
  readonly armor9: number;
  readonly armor10: number;
  readonly armor11: number;
}

export interface DrpDlArmorTableSilverRow extends BdatRow {
  readonly armor0: number;
  readonly armor1: number;
  readonly armor2: number;
  readonly armor3: number;
  readonly armor4: number;
  readonly armor5: number;
  readonly armor6: number;
  readonly armor7: number;
  readonly armor8: number;
  readonly armor9: number;
  readonly armor10: number;
  readonly armor11: number;
}

export interface DrpDlWpnTableGoldRow extends BdatRow {
  readonly wpn0: number;
  readonly wpn1: number;
  readonly wpn2: number;
  readonly wpn3: number;
  readonly wpn4: number;
  readonly wpn5: number;
  readonly wpn6: number;
  readonly wpn7: number;
  readonly wpn8: number;
  readonly wpn9: number;
  readonly wpn10: number;
  readonly wpn11: number;
  readonly wpn12: number;
  readonly wpn13: number;
  readonly wpn14: number;
  readonly wpn15: number;
  readonly wpn16: number;
  readonly wpn17: number;
  readonly wpn18: number;
  readonly wpn19: number;
  readonly wpn20: number;
  readonly wpn21: number;
  readonly wpn22: number;
  readonly wpn23: number;
  readonly wpn24: number;
  readonly wpn25: number;
  readonly wpn26: number;
}

export interface DrpDlWpnTableSilverRow extends BdatRow {
  readonly wpn0: number;
  readonly wpn1: number;
  readonly wpn2: number;
  readonly wpn3: number;
  readonly wpn4: number;
  readonly wpn5: number;
  readonly wpn6: number;
  readonly wpn7: number;
  readonly wpn8: number;
  readonly wpn9: number;
  readonly wpn10: number;
  readonly wpn11: number;
  readonly wpn12: number;
  readonly wpn13: number;
  readonly wpn14: number;
  readonly wpn15: number;
  readonly wpn16: number;
  readonly wpn17: number;
  readonly wpn18: number;
  readonly wpn19: number;
  readonly wpn20: number;
  readonly wpn21: number;
  readonly wpn22: number;
  readonly wpn23: number;
  readonly wpn24: number;
  readonly wpn25: number;
  readonly wpn26: number;
}

export interface DrpGoldBoxTableRow extends BdatRow {
  readonly lot1: number;
  readonly item1: number;
  readonly lot2: number;
  readonly item2: number;
  readonly lot3: number;
  readonly item3: number;
  readonly lot4: number;
  readonly item4: number;
  readonly lot5: number;
  readonly item5: number;
  readonly lot6: number;
  readonly item6: number;
  readonly lot7: number;
  readonly item7: number;
  readonly lot8: number;
  readonly item8: number;
  readonly lot9: number;
  readonly item9: number;
  readonly lot10: number;
  readonly item10: number;
  readonly lot11: number;
  readonly item11: number;
  readonly lot12: number;
  readonly item12: number;
}

export interface DrpHazureRow extends BdatRow {
  readonly hazureId: number;
}

export interface DrpItemNumTableRow extends BdatRow {
  readonly lot3: number;
  readonly lot2: number;
  readonly lot1: number;
}

export interface DrpItemTableRow extends BdatRow {
  readonly lotTable: number;
  readonly itemType: number;
  readonly itemId: number;
  readonly affixLot: number;
  readonly affixLotGood: number;
  readonly affixNumLot: number;
  readonly slotNumLot: number;
  readonly affixNumLotG: number;
  readonly slotNumLotG: number;
}

export interface DrpLotMaterialTableRow extends BdatRow {
  readonly lotLvGroup1: number;
  readonly lotLvGroup2: number;
  readonly lotLvGroup3: number;
}

export interface DrpLotRankTableRow extends BdatRow {
  readonly lotGold: number;
  readonly lotSilver: number;
  readonly lotBronze: number;
}

export interface DrpPcArmorTableGoldRow extends BdatRow {
  readonly armor0: number;
  readonly armor1: number;
  readonly armor2: number;
  readonly armor3: number;
  readonly armor4: number;
  readonly armor5: number;
  readonly armor6: number;
  readonly armor7: number;
  readonly armor8: number;
  readonly armor9: number;
  readonly armor10: number;
  readonly armor11: number;
  readonly armor12: number;
  readonly armor13: number;
  readonly armor14: number;
  readonly armor15: number;
  readonly armor16: number;
  readonly armor17: number;
  readonly armor18: number;
  readonly armor19: number;
  readonly armor20: number;
  readonly armor21: number;
}

export interface DrpPcArmorTableSilverRow extends BdatRow {
  readonly armor0: number;
  readonly armor1: number;
  readonly armor2: number;
  readonly armor3: number;
  readonly armor4: number;
  readonly armor5: number;
  readonly armor6: number;
  readonly armor7: number;
  readonly armor8: number;
  readonly armor9: number;
  readonly armor10: number;
  readonly armor11: number;
  readonly armor12: number;
  readonly armor13: number;
  readonly armor14: number;
  readonly armor15: number;
  readonly armor16: number;
  readonly armor17: number;
  readonly armor18: number;
  readonly armor19: number;
  readonly armor20: number;
  readonly armor21: number;
}

export interface DrpPcWpnLotTableRow extends BdatRow {
  readonly pc: number;
  readonly npc: number;
}

export interface DrpPcWpnTableGoldRow extends BdatRow {
  readonly wpn0: number;
  readonly wpn1: number;
  readonly wpn2: number;
  readonly wpn3: number;
  readonly wpn4: number;
  readonly wpn5: number;
  readonly wpn6: number;
  readonly wpn7: number;
  readonly wpn8: number;
  readonly wpn9: number;
  readonly wpn10: number;
  readonly wpn11: number;
}

export interface DrpPcWpnTableSilverRow extends BdatRow {
  readonly wpn0: number;
  readonly wpn1: number;
  readonly wpn2: number;
  readonly wpn3: number;
  readonly wpn4: number;
  readonly wpn5: number;
  readonly wpn6: number;
  readonly wpn7: number;
  readonly wpn8: number;
  readonly wpn9: number;
  readonly wpn10: number;
  readonly wpn11: number;
}

export interface DrpSilverBoxTableRow extends BdatRow {
  readonly lot1: number;
  readonly item1: number;
  readonly lot2: number;
  readonly item2: number;
  readonly lot3: number;
  readonly item3: number;
  readonly lot4: number;
  readonly item4: number;
  readonly lot5: number;
  readonly item5: number;
  readonly lot6: number;
  readonly item6: number;
  readonly lot7: number;
  readonly item7: number;
  readonly lot8: number;
  readonly item8: number;
  readonly lot9: number;
  readonly item9: number;
  readonly lot10: number;
  readonly item10: number;
  readonly lot11: number;
  readonly item11: number;
  readonly lot12: number;
  readonly item12: number;
}

export interface ItmBlueprintRow extends BdatRow {
  readonly name: number;
}

export interface ItmFigListRow extends BdatRow {
  readonly name: number;
}

export interface ItmMaterialListRow extends BdatRow {
  readonly name: number;
  readonly lot: number;
  readonly lotParts: number;
  readonly addLotRevSilver: number;
  readonly addLotRevGold: number;
  readonly flagParts0: number;
  readonly flagParts1: number;
  readonly flagParts2: number;
  readonly flagParts3: number;
  readonly flagParts4: number;
  readonly flagParts5: number;
  readonly flagParts6: number;
  readonly flagParts7: number;
  readonly flagParts8: number;
  readonly flagParts9: number;
  readonly flagParts10: number;
}

export interface ItmPieceListRow extends BdatRow {
  readonly name: number;
  readonly itemType: number;
  readonly itemId: number;
}

export interface ItmPreciousListRow extends BdatRow {
  readonly name: number;
}

export interface RscEnListRow extends BdatRow {
  readonly drpPcArmorType: number;
  readonly drpDlWpnType: number;
  readonly drpDlArmorType: number;
  readonly parts: string;
}

export interface WpnDlListRow extends BdatRow {
  readonly name: number;
}

export interface WpnPcListRow extends BdatRow {
  readonly name: number;
}

export interface XyzAffixChoiceTableGoldRow extends BdatRow {
  readonly lot1: number;
  readonly lot2: number;
  readonly lot3: number;
}

export interface XyzAffixChoiceTableSilverRow extends BdatRow {
  readonly lot1: number;
  readonly lot2: number;
  readonly lot3: number;
}

export interface XyzEnemyPopGimkRow extends BdatRow {
  readonly gmepId: number;
}

export interface XyzEnemyPopGmepRow extends BdatRow {
  readonly enemyId1: number;
  readonly enemyId2: number;
  readonly enemyId3: number;
  readonly lvMin: number;
  readonly lvMax: number;
}

export interface XyzItemNumTableCrownRow extends BdatRow {
  readonly lot3: number;
  readonly lot2: number;
  readonly lot1: number;
}

export interface XyzPartsEnRow extends BdatRow {
  readonly file: string;
  readonly partsId: number;
  readonly name: string;
}
