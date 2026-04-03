import {
  getDrpBoxTable,
  getDrpBronzeBoxTable,
  getDrpGoldBoxTable,
  getDrpSilverBoxTable,
} from "~/data/bdat/bdat";
import type {
  DrpGoldBoxTableRow,
  DrpSilverBoxTableRow,
} from "~/data/bdat/bdat.types";
import { DropTable } from "~/data/mapped/chest/drop-table";
import { ItemDropTable } from "~/data/mapped/chest/item-drop-table";
import { MaterialDropTable } from "~/data/mapped/chest/material-drop-table";
import { mapBdat } from "~/data/mapped/common";
import { items, materials } from "~/data/mapped/item";
import { chestQualityProbabilities } from "~/data/mapped/probabilities";
import type { NonMaterialChestQuality } from "~/data/mapped/probabilities/chest-quality-probabilities";

export const materialDropTables: MaterialDropTable[] = mapBdat(
  getDrpBronzeBoxTable(),
  (row) =>
    new MaterialDropTable(
      [
        row.item1,
        row.item2,
        row.item3,
        row.item4,
        row.item5,
        row.item6,
        row.item7,
        row.item8,
      ]
        .filter((materialId) => materialId !== 0)
        .map((materialId) => materials[materialId]),
    ),
);

function mapItemDropTableRow(
  row: DrpSilverBoxTableRow | DrpGoldBoxTableRow,
  chestQuality: NonMaterialChestQuality,
): ItemDropTable {
  const itemDropProbabilities = Array.from({ length: 12 }).map((_, i) => ({
    item: items[row[`item${(i + 1).toString()}` as keyof typeof row]],
    probability: row[`lot${(i + 1).toString()}` as keyof typeof row],
  }));

  return new ItemDropTable(itemDropProbabilities, chestQuality);
}

export const silverItemDropTables: ItemDropTable[] = mapBdat(
  getDrpSilverBoxTable(),
  (row) => mapItemDropTableRow(row, "silver"),
);

export const goldItemDropTables: ItemDropTable[] = mapBdat(
  getDrpGoldBoxTable(),
  (row) => mapItemDropTableRow(row, "gold"),
);

export const dropTables: DropTable[] = mapBdat(
  getDrpBoxTable(),
  (row) =>
    new DropTable(
      materialDropTables[row.bronzeBox],
      silverItemDropTables[row.silverBox],
      goldItemDropTables[row.goldBox],
      chestQualityProbabilities[row.lotRank],
    ),
);
