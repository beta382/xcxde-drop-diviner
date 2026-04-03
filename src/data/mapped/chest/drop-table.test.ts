import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import { groundAffixes, skellAffixes } from "~/data/mapped/affix";
import { dropTables } from "~/data/mapped/chest";
import type {
  ChestDropInfo,
  EnemyDropInfo,
} from "~/data/mapped/chest/drop-info.types";
import { items } from "~/data/mapped/item";
import { EquipmentTemplate } from "~/data/mapped/item/equipment";
import { Item } from "~/data/mapped/item/item";
import { classes } from "~/data/mapped/party";
import type { ChestQuality } from "~/data/mapped/probabilities/chest-quality-probabilities";

// Random test data generated from Hamidu's Java reference impl

// Probability data generated from my Python reference impl
// (https://www.onlinegdb.com/L4DFBDoGR)

test.each<{
  id: number;
  treasureSensor: number;
  appendageIndex: number;
  enemyDropInfo: EnemyDropInfo;
  expectedItems: string[];
}>([
  {
    id: 778,
    treasureSensor: 100,
    appendageIndex: 4,
    enemyDropInfo: {
      level: 50,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 24,
      skellArmorPoolId: 6,
    },
    expectedItems: [
      "SSM-XR2450GA E-Bubble",
      "SRM-XXR440SA Grenade",
      "SRM-XXM140ME Dragon",
      "SRM-XXR540SA Hyper-Rail",
      "SRM-XXR640SA Buster-Launcher",
      "SRM-XXR540ME Meteor",
      "SHM-XXR240GG Diskbomb",
      "SRM-XXR450SA Grenade",
      "SRM-XXM150ME Dragon",
      "SRM-XXR550SA Hyper-Rail",
      "SRM-XXR650SA Buster-Launcher",
      "SRM-XXR550ME Meteor",
      "SHM-XXR250GG Diskbomb",
    ],
  },
  {
    id: 778,
    treasureSensor: 85,
    appendageIndex: 4,
    enemyDropInfo: {
      level: 50,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 24,
      skellArmorPoolId: 6,
    },
    expectedItems: [
      "SSM-XR2450GA E-Bubble",
      "SRM-XR440SA Grenade",
      "SRM-XM140ME Dragon",
      "SRM-XR540SA Hyper-Rail",
      "SRM-XR640SA Buster-Launcher",
      "SRM-XR540ME Meteor",
      "SHM-XR240GG Diskbomb",
      "SRM-XR450SA Grenade",
      "SRM-XM150ME Dragon",
      "SRM-XR550SA Hyper-Rail",
      "SRM-XR650SA Buster-Launcher",
      "SRM-XR550ME Meteor",
      "SHM-XR250GG Diskbomb",
      "Qmoevan Capacitor",
      "SRM-XXR440SA Grenade",
      "SRM-XXM140ME Dragon",
      "SRM-XXR540SA Hyper-Rail",
      "SRM-XXR640SA Buster-Launcher",
      "SRM-XXR540ME Meteor",
      "SHM-XXR240GG Diskbomb",
      "SRM-XXR450SA Grenade",
      "SRM-XXM150ME Dragon",
      "SRM-XXR550SA Hyper-Rail",
      "SRM-XXR650SA Buster-Launcher",
      "SRM-XXR550ME Meteor",
      "SHM-XXR250GG Diskbomb",
    ],
  },
  {
    id: 775,
    treasureSensor: 0,
    appendageIndex: 1,
    enemyDropInfo: {
      level: 50,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 24,
      skellArmorPoolId: 6,
    },
    expectedItems: ["Genuine Frame"],
  },
])(
  "dropTables[$id].getDroppableItems($treasureSensor, $appendageIndex, " +
    "$enemyDropInfo) returns $expectedItems",
  ({ id, treasureSensor, appendageIndex, enemyDropInfo, expectedItems }) => {
    const dropTable = dropTables[id];

    expect(
      dropTable
        .getDroppableItems(treasureSensor, appendageIndex, enemyDropInfo)
        .map((item) => item.getLocalizedName("en")),
    ).toEqual(expectedItems);
  },
);

// Similar to chest-quality-probabilities.test.ts
test.each<{
  id: number;
  seed: number;
  treasureSensor: number;
  expectedChestQualities: (ChestQuality | null)[];
}>([
  {
    id: 5,
    seed: 0,
    treasureSensor: 0,
    expectedChestQualities: [
      "silver",
      null,
      "silver",
      null,
      null,
      null,
      null,
      null,
      "bronze",
      null,
    ],
  },
  {
    id: 5,
    seed: 0,
    treasureSensor: 25,
    expectedChestQualities: [
      "gold",
      "gold",
      null,
      "silver",
      "silver",
      "bronze",
      "bronze",
      "silver",
      "bronze",
      null,
    ],
  },
  {
    id: 2975,
    seed: 0x3eadee18,
    treasureSensor: 100,
    expectedChestQualities: [
      "silver",
      "silver",
      "silver",
      "silver",
      "silver",
      "silver",
      "silver",
      "silver",
      "silver",
      "silver",
    ],
  },
])(
  "dropTables[$id].rollChestQuality(new MtRand($seed), $treasureSensor) for " +
    "$expectedChestQualities.length trials equals $expectedChestQualities",
  ({ id, seed, treasureSensor, expectedChestQualities }) => {
    const dropTable = dropTables[id];
    const rng = new MtRand(seed);
    const actualChestQualities = Array.from({
      length: expectedChestQualities.length,
    }).map(() => dropTable.rollChestQuality(rng, treasureSensor));

    expect(actualChestQualities).toEqual(expectedChestQualities);
  },
);

test.each<{
  id: number;
  seed: number;
  crossClassId: number;
  enemyDropInfo: EnemyDropInfo;
  chestDropInfo: ChestDropInfo;
  expectedItems: string[];
}>([
  {
    id: 1212, // Caesar, the Hundred-Eyed (body)
    seed: 111,
    crossClassId: 1, // Drifter
    enemyDropInfo: {
      level: 68,
      groundArmorPoolId: 5,
      skellWeaponPoolId: 19,
      skellArmorPoolId: 1,
    },
    chestDropInfo: {
      quality: "gold",
      sourceAppendageIndex: 0,
    },
    expectedItems: [
      "SHM-XXR260SA E-Machine Gun",
      "Rainbow Metal",
      "Iron Lump",
      "Cracked Claw",
    ],
  },
  {
    id: 3025, // Pharsis, the Everqueen (body)
    seed: 222,
    crossClassId: 6, // Bastion Warrior
    enemyDropInfo: {
      level: 97,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    chestDropInfo: {
      quality: "gold",
      sourceAppendageIndex: 0,
    },
    expectedItems: ["Ultra Phenomenon Glaive", "White Yggralith Scale"],
  },
  {
    id: 3025, // Pharsis, the Everqueen (body)
    seed: 222,
    crossClassId: 9, // Full Metal Jaguar
    enemyDropInfo: {
      level: 97,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    chestDropInfo: {
      quality: "silver",
      sourceAppendageIndex: 0,
    },
    expectedItems: ["Ultra Nebulan Dyads III", "White Yggralith Scale"],
  },
  {
    id: 2210, // Xair, the Cerulean Walker (body)
    seed: 333,
    crossClassId: 13, // Psycorruptor
    enemyDropInfo: {
      level: 75,
      groundArmorPoolId: 20,
      skellWeaponPoolId: 4,
      skellArmorPoolId: 1,
    },
    chestDropInfo: {
      quality: "silver",
      sourceAppendageIndex: 0,
    },
    expectedItems: ["Ultra Boundless Sabatons", "Coronid Larynx"],
  },
])(
  "dropTables[$id].rollItems(new MtRand($seed), $crossClassId, " +
    "$enemyDropInfo, $chestDropInfo) equals $expectedItems",
  ({ id, seed, crossClassId, enemyDropInfo, chestDropInfo, expectedItems }) => {
    const dropTable = dropTables[id];
    const rng = new MtRand(seed);

    expect(
      dropTable
        .rollItems(rng, classes[crossClassId], enemyDropInfo, chestDropInfo)
        .map((item) => item.getLocalizedName("en")),
    ).toEqual(expectedItems);
  },
);

test.each<{
  id: number;
  targetItemId: number;
  treasureSensor: number;
  crossClassId: number;
  optimalParty: boolean;
  enemyDropInfo: EnemyDropInfo;
  expectedDropCount: number;
}>([
  {
    id: 2519, // Aquatic Visigel (body)
    targetItemId: 1561, // Ultra Diamond Spatha
    treasureSensor: 0,
    crossClassId: 4, // Duelist
    optimalParty: true,
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    expectedDropCount:
      (0.8 * 0.5 + 0.2 * (1 / 12)) *
      (1 / 8) *
      (0.05 * (0.01 * 3 + 0.99 * 0.05 * 2 + 0.99 * 0.95) +
        0.95 * 0.25 * (0.05 * 3 + 0.95 * 0.1 * 2 + 0.95 * 0.9)),
  },
  {
    id: 2519, // Aquatic Visigel (body)
    targetItemId: 1561, // Ultra Diamond Spatha
    treasureSensor: 94,
    crossClassId: 4, // Duelist
    optimalParty: true,
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    expectedDropCount:
      (0.8 * 0.5 + 0.2 * (1 / 12)) *
      (1 / 8) *
      (0.99 * (0.01 * 3 + 0.99 * 0.05 * 2 + 0.99 * 0.95) +
        0.01 * (0.05 * 3 + 0.95 * 0.1 * 2 + 0.95 * 0.9)),
  },
])(
  "dropTables[$id].averageDropCountForItem($targetItemId, $treasureSensor, " +
    "$crossClassId, $optimalParty, $enemyDropInfo) equals $expectedDropCount",
  ({
    id,
    targetItemId,
    treasureSensor,
    crossClassId,
    optimalParty,
    enemyDropInfo,
    expectedDropCount,
  }) => {
    const dropTable = dropTables[id];
    const targetItem = items[targetItemId] as Item;
    expect(targetItem).toBeInstanceOf(Item);

    expect(
      dropTable.averageDropCountForItem(
        targetItem,
        treasureSensor,
        classes[crossClassId],
        optimalParty,
        enemyDropInfo,
      ),
    ).toBeCloseTo(expectedDropCount, 8);
  },
);

test.each<{
  id: number;
  targetEquipmentTemplateId: number;
  equipmentType: "ground" | "skell";
  treasureSensor: number;
  crossClassId: number;
  optimalParty: boolean;
  enemyDropInfo: EnemyDropInfo;
  affixIds: number[];
  augmentSlots: number;
  expectedDropCount: number;
}>([
  {
    id: 2519, // Aquatic Visigel (body)
    targetEquipmentTemplateId: 1561, // Ultra Diamond Spatha
    equipmentType: "ground",
    treasureSensor: 0,
    crossClassId: 4, // Duelist
    optimalParty: true,
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    // Melee Attack Up XV, Critical Chance Up XV, Weapon Attack Power Up XV
    affixIds: [115, 1277, 655],
    augmentSlots: 3,
    expectedDropCount:
      (0.8 * 0.5 + 0.2 * (1 / 12)) *
      (1 / 8) *
      (0.05 *
        (0.01 * 3 + 0.99 * 0.05 * 2 + 0.99 * 0.95) *
        3.6075616e-6 *
        0.00135 +
        0.95 *
          0.25 *
          (0.05 * 3 + 0.95 * 0.1 * 2 + 0.95 * 0.9) *
          6.442074e-8 *
          0.00015),
  },
  {
    id: 2519, // Aquatic Visigel (body)
    targetEquipmentTemplateId: 1561, // Ultra Diamond Spatha
    equipmentType: "ground",
    treasureSensor: 100,
    crossClassId: 4, // Duelist
    optimalParty: true,
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    // Melee Attack Up XV, Critical Chance Up XV, Weapon Attack Power Up XV
    affixIds: [115, 1277, 655],
    augmentSlots: 3,
    expectedDropCount:
      (0.8 * 0.5 + 0.2 * (1 / 12)) *
      (1 / 8) *
      ((0.01 * 3 + 0.99 * 0.05 * 2 + 0.99 * 0.95) * 3.6075616e-6 * 0.00135),
  },
])(
  "dropTables[$id].averageDropCountForSatisfyingEquipment(" +
    "$targetEquipmentTemplateId, $treasureSensor, $crossClassId, " +
    "$optimalParty, $enemyDropInfo, $affixIds, $augmentSlots) equals " +
    "$expectedDropCount",
  ({
    id,
    targetEquipmentTemplateId,
    equipmentType,
    treasureSensor,
    crossClassId,
    optimalParty,
    enemyDropInfo,
    affixIds,
    augmentSlots,
    expectedDropCount,
  }) => {
    const dropTable = dropTables[id];
    const targetItem = items[targetEquipmentTemplateId] as EquipmentTemplate;
    expect(targetItem).toBeInstanceOf(EquipmentTemplate);

    const affixes = equipmentType === "ground" ? groundAffixes : skellAffixes;

    expect(
      dropTable.averageDropCountForSatisfyingEquipment(
        targetItem,
        treasureSensor,
        classes[crossClassId],
        optimalParty,
        enemyDropInfo,
        affixIds.map((affixId) => affixes[affixId]),
        augmentSlots,
      ),
    ).toBeCloseTo(expectedDropCount, 15);
  },
);
