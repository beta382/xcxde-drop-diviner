import {
  getChrEnList,
  getChrEnParam,
  getChrEnRstDebuffRev,
  getDrpBoxTable,
  getRscEnList,
  getXyzEnemyPopGimk,
  getXyzEnemyPopGmep,
  getXyzPartsEn,
} from "~/data/bdat/bdat";
import { dropTables } from "~/data/mapped/chest";
import { mapBdat } from "~/data/mapped/common";
import { Appendage } from "~/data/mapped/enemy/appendage";
import { EnemyTemplate } from "~/data/mapped/enemy/enemy";

const _parts = new Map<string, string[]>();
// Must start at index 1
for (let i = 1; i < getXyzPartsEn().length; i++) {
  const { file, name } = getXyzPartsEn()[i];
  if (!_parts.has(file)) {
    _parts.set(file, []);
  }

  _parts.get(file)?.push(name);
}

const _gmepPresent = new Map<number, true>();
for (const { gmepId } of getXyzEnemyPopGimk()) {
  _gmepPresent.set(gmepId, true);
}

const _gmepLevels = new Map<number, number[]>();
for (const row of getXyzEnemyPopGmep()) {
  if (!_gmepPresent.get(row.id)) {
    continue;
  }

  const minLevel = row.lvMin;
  const maxLevel = Math.max(minLevel, row.lvMax - 1);

  if (minLevel === 0 || maxLevel === 0) {
    continue;
  }

  for (const enemyId of [row.enemyId1, row.enemyId2, row.enemyId3]) {
    if (!_gmepLevels.has(enemyId)) {
      _gmepLevels.set(enemyId, []);
    }

    _gmepLevels
      .get(enemyId)
      ?.push(
        ...Array.from(
          { length: maxLevel - minLevel + 1 },
          (_, i) => minLevel + i,
        ),
      );
  }
}
for (const [enemyId, levels] of _gmepLevels) {
  _gmepLevels.set(
    enemyId,
    [...new Set(levels)].sort((lhs, rhs) => lhs - rhs),
  );
}

export const enemyTemplates: EnemyTemplate[] = mapBdat(
  getChrEnList(),
  (row) => {
    // Levels
    const levels =
      _gmepLevels.get(row.id) ??
      Array.from(
        { length: row.lvMax - row.lvMin + 1 },
        (_, i) => row.lvMin + i,
      );

    const rstDebuff = (() => {
      const rstDebuffBase = getChrEnParam()[row.paramId].rstDebuffFull;

      if (row.rstDebuffRev === 0) {
        return rstDebuffBase;
      }

      const { type, rstDebuffFullRev2 } =
        getChrEnRstDebuffRev()[row.rstDebuffRev];

      return type === 0
        ? rstDebuffBase | rstDebuffFullRev2
        : rstDebuffBase & rstDebuffFullRev2;
    })();
    const canBeHeroicTaled = (rstDebuff & (1 << (32 - 13))) === 0;

    const heroicTaleLevels = canBeHeroicTaled
      ? [
          ...new Set(
            levels.flatMap((level) =>
              Array.from({ length: 6 }).map((_, i) => level + i + 1),
            ),
          ),
        ].filter((level) => !levels.includes(level))
      : [];

    // Appendages
    const resourceRow = getRscEnList()[getChrEnParam()[row.paramId].resourceId];
    const parts = _parts.get(resourceRow.parts) ?? [];

    const appendages = [
      new Appendage(
        getDrpBoxTable()[row.dropTableId].partsName,
        dropTables[row.dropTableId],
        0,
        "",
      ),
      ...parts.map(
        (part, index) =>
          new Appendage(
            getDrpBoxTable()[row.dropTableId + index + 1].partsName,
            dropTables[row.dropTableId + index + 1],
            index + 1,
            part,
          ),
      ),
    ];

    return new EnemyTemplate(
      row.name,
      row.id,
      levels,
      heroicTaleLevels,
      {
        groundArmorPoolId: resourceRow.drpPcArmorType,
        skellWeaponPoolId: resourceRow.drpDlWpnType,
        skellArmorPoolId: resourceRow.drpDlArmorType,
      },
      appendages,
    );
  },
);
