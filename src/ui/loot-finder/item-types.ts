import type { ValueOf } from "type-fest";
import type { Translation } from "~/common/languages";
import type { Item, ItemType } from "~/data/mapped/item/item";

export const groupKeyForItemType = {
  "ground-weapon-melee": "groundWeaponsMelee",
  "ground-weapon-ranged": "groundWeaponsRanged",
  "ground-armor-head": "groundArmors",
  "ground-armor-body": "groundArmors",
  "ground-armor-arm-l": "groundArmors",
  "ground-armor-arm-r": "groundArmors",
  "ground-armor-legs": "groundArmors",
  "skell-weapon-sidearm": "skellWeapons",
  "skell-weapon-back": "skellWeapons",
  "skell-weapon-shoulder": "skellWeapons",
  "skell-weapon-arm": "skellWeapons",
  "skell-weapon-spare": "skellWeapons",
  "skell-armor-head": "skellArmors",
  "skell-armor-body": "skellArmors",
  "skell-armor-arm-l": "skellArmors",
  "skell-armor-arm-r": "skellArmors",
  "skell-armor-legs": "skellArmors",
  "ground-augment": "augments",
  "skell-augment": "augments",
  material: "materials",
  blueprint: "other",
  holofigure: "other",
  "nemesis-fragments": "other",
  important: "other",
} as const satisfies Record<
  ItemType,
  keyof Translation["lootFinder"]["itemTypeGroups"]
>;

export const sortIndexForGroupKey = {
  groundWeaponsMelee: 0,
  groundWeaponsRanged: 1,
  groundArmors: 2,
  skellWeapons: 3,
  skellArmors: 4,
  augments: 5,
  materials: 6,
  other: 7,
} as const satisfies Record<ValueOf<typeof groupKeyForItemType>, number>;

export function itemTypeSort(lhs: Item, rhs: Item): number {
  return (
    sortIndexForGroupKey[groupKeyForItemType[lhs.type]] -
    sortIndexForGroupKey[groupKeyForItemType[rhs.type]]
  );
}
