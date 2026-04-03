import {
  getBtlItemSkillDoll,
  getBtlItemSkillInner,
  getDrpAffixTable,
} from "~/data/bdat/bdat";
import type { DrpAffixTableRow } from "~/data/bdat/bdat.types";
import { Affix } from "~/data/mapped/affix/affix";
import {
  getAffixForTraitTableRow,
  TraitTable,
  type TraitProbability,
} from "~/data/mapped/affix/trait-table";
import { mapBdat } from "~/data/mapped/common";

export const groundAffixes: Affix[] = mapBdat(
  getBtlItemSkillInner(),
  (row) => new Affix(row.id, row.name, "ground"),
);

export const skellAffixes: Affix[] = mapBdat(
  getBtlItemSkillDoll(),
  (row) => new Affix(row.id, row.name, "skell"),
);

export const traitTables: TraitTable[] = mapBdat(getDrpAffixTable(), (row) => {
  const traitProbabilities: TraitProbability[] = [];

  for (let i = 1; i <= 10; i++) {
    const affixColumn = `affixId${i.toString()}` as keyof DrpAffixTableRow;
    const lotColumn = `lot${i.toString()}` as keyof DrpAffixTableRow;

    const trait = getAffixForTraitTableRow(row.id, row[affixColumn]);

    if (!trait) {
      break;
    }

    traitProbabilities.push({
      trait,
      traitId: row[affixColumn],
      probability: row[lotColumn],
    });
  }

  return new TraitTable(traitProbabilities);
});
