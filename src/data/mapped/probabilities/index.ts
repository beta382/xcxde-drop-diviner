import {
  getDrpAffixSlotTable,
  getDrpItemNumTable,
  getDrpLotMaterialTable,
  getDrpLotRankTable,
  getXyzAffixChoiceTableGold,
  getXyzAffixChoiceTableSilver,
} from "~/data/bdat/bdat";
import { mapBdat } from "~/data/mapped/common";
import { AffixSlotCountProbabilities } from "~/data/mapped/probabilities/affix-slot-count-probabilities";
import { ChestItemCountProbabilities } from "~/data/mapped/probabilities/chest-item-count-probabilities";
import { ChestMaterialDropProbabilities } from "~/data/mapped/probabilities/chest-material-drop-probabilities";
import { ChestQualityProbabilities } from "~/data/mapped/probabilities/chest-quality-probabilities";
import { TraitTableChoiceProbabilities } from "~/data/mapped/probabilities/trait-table-choice-probabilities";

export const affixSlotCountProbabilities: AffixSlotCountProbabilities[] =
  mapBdat(
    getDrpAffixSlotTable(),
    (row) =>
      new AffixSlotCountProbabilities([row.lot1, row.lot2, row.lot3, row.lot4]),
  );

export const silverTraitTableChoiceProbabilities: TraitTableChoiceProbabilities[] =
  mapBdat(
    getXyzAffixChoiceTableSilver(),
    (row) =>
      new TraitTableChoiceProbabilities(
        [row.lot1, row.lot2, row.lot3].slice(0, row.id),
      ),
  );

export const goldTraitTableChoiceProbabilities: TraitTableChoiceProbabilities[] =
  mapBdat(
    getXyzAffixChoiceTableGold(),
    (row) =>
      new TraitTableChoiceProbabilities(
        [row.lot1, row.lot2, row.lot3].slice(0, row.id),
      ),
  );

export const chestQualityProbabilities: ChestQualityProbabilities[] = mapBdat(
  getDrpLotRankTable(),
  (row) =>
    new ChestQualityProbabilities(row.lotGold, row.lotSilver, row.lotBronze),
);

export const chestMaterialDropProbabilities: ChestMaterialDropProbabilities[] =
  mapBdat(
    getDrpLotMaterialTable(),
    (row) =>
      new ChestMaterialDropProbabilities(
        row.lotLvGroup1,
        row.lotLvGroup2,
        row.lotLvGroup3,
      ),
  );

export const nonCrownChestItemCountProbabilities: ChestItemCountProbabilities[] =
  mapBdat(
    getDrpItemNumTable(),
    (row) => new ChestItemCountProbabilities([row.lot3, row.lot2, row.lot1]),
  );
