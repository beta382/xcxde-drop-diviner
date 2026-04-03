import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import { goldItemDropTables, silverItemDropTables } from "~/data/mapped/chest";
import type { EnemyDropInfo } from "~/data/mapped/chest/drop-info.types";
import { items } from "~/data/mapped/item";
import { Item } from "~/data/mapped/item/item";
import { classes } from "~/data/mapped/party";
import type { NonMaterialChestQuality } from "~/data/mapped/probabilities/chest-quality-probabilities";

// Random test data generated from Hamidu's Java reference impl

test.each<{
  id: number;
  chestQuality: NonMaterialChestQuality;
  enemyDropInfo: EnemyDropInfo;
  expectedItems: string[];
}>([
  {
    id: 396,
    chestQuality: "silver",
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 4,
      skellWeaponPoolId: 14,
      skellArmorPoolId: 0,
    },
    expectedItems: [
      "Ultra Infinite Headwear",
      "Ultra Infinite Armor",
      "Ultra Infinite Armwear R",
      "Ultra Infinite Armwear L",
      "Ultra Infinite Legwear",
      "SRM-XR160ME B-Gatling",
      "SRM-XR360GG H-Arrow",
      "SSM-XR260ME Widebeam",
      "SSM-XR260SA HB-Missile",
      "SHM-XM260ME B-Centipede",
      "SHM-XR360ME B-XSniper",
      "SHM-XR460SA B-Rifle",
      "SHM-XR260ME B-Rifle",
    ],
  },
])(
  "$chestQuality-ItemDropTables[$id].getDroppableItems($enemyDropInfo) " +
    "returns $expectedItems",
  ({ id, chestQuality, enemyDropInfo, expectedItems }) => {
    const itemDropTable = (() => {
      switch (chestQuality) {
        case "silver":
          return silverItemDropTables;
        case "gold":
          return goldItemDropTables;
        default:
          return chestQuality satisfies never;
      }
    })()[id];

    expect(
      itemDropTable
        .getDroppableItems(enemyDropInfo)
        .map((item) => item.getLocalizedName("en")),
    ).toEqual(expectedItems);
  },
);

test.each<{
  id: number;
  seed: number;
  chestQuality: NonMaterialChestQuality;
  crossClassId: number;
  enemyDropInfo: EnemyDropInfo;
  expectedItems: string[];
}>([
  {
    id: 8,
    seed: 99,
    chestQuality: "gold",
    crossClassId: 4, // Duelist
    enemyDropInfo: {
      level: 99,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    expectedItems: [
      "Ultra Infinite Headset",
      "Ultra Infinite Pants",
      "SRM-XXR160SA Railgun",
    ],
  },
  {
    id: 120,
    seed: 10,
    chestQuality: "gold",
    crossClassId: 4, // Duelist
    enemyDropInfo: {
      level: 99,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    expectedItems: [
      "Bewitched Glaive: Receding Rust",
      "Ultra Nebulan Assault Rifle",
    ],
  },
  {
    id: 314,
    seed: 50,
    chestQuality: "silver",
    crossClassId: 4, // Duelist
    enemyDropInfo: {
      level: 99,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    expectedItems: ["Ultra Infinite Headset", "Ultra Infinite Sleeve R"],
  },
  {
    id: 314,
    seed: 100,
    chestQuality: "silver",
    crossClassId: 4, // Duelist
    enemyDropInfo: {
      level: 99,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    expectedItems: ["Ultra Infinite Shirt"],
  },
  {
    id: 27,
    seed: 62,
    chestQuality: "gold",
    crossClassId: 4, // Duelist
    enemyDropInfo: {
      level: 99,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    expectedItems: ["SHM-XXR1060SA E-Cannon"],
  },
  {
    id: 26,
    seed: 43,
    chestQuality: "gold",
    crossClassId: 4, // Duelist
    enemyDropInfo: {
      level: 99,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    expectedItems: ["SRM-XXR260GG Lasergun", "Ultra Nebulan Rapture"],
  },
  {
    id: 252,
    seed: 53,
    chestQuality: "silver",
    crossClassId: 4, // Duelist
    enemyDropInfo: {
      level: 99,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    expectedItems: ["Ultra Phenomenon Lance"],
  },
])(
  "$chestQuality-ItemDropTables[$id].rollItems(new MtRand($seed), " +
    "$crossClassId, $enemyDropInfo) returns with English names $expectedItems",
  ({ id, seed, chestQuality, crossClassId, enemyDropInfo, expectedItems }) => {
    const itemDropTable = (() => {
      switch (chestQuality) {
        case "silver":
          return silverItemDropTables;
        case "gold":
          return goldItemDropTables;
        default:
          return chestQuality satisfies never;
      }
    })()[id];

    const rng = new MtRand(seed);

    expect(
      itemDropTable
        .rollItems(rng, classes[crossClassId], enemyDropInfo)
        .map((item) => item.getLocalizedName("en")),
    ).toEqual(expectedItems);
  },
);

test.each<{
  id: number;
  chestQuality: NonMaterialChestQuality;
  targetItemId: number;
  crossClassId: number;
  optimalParty: boolean;
  enemyDropInfo: EnemyDropInfo;
  expectedDropCount: number;
}>([
  {
    id: 1, // 100!
    chestQuality: "gold",
    targetItemId: 1561, // Ultra Diamond Spatha
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
      (0.01 * 3 + 0.99 * 0.05 * 2 + 0.99 * 0.95),
  },
  {
    id: 5, // 25, 100!
    chestQuality: "gold",
    targetItemId: 1561, // Ultra Diamond Spatha
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
      (0.01 *
        (0.25 * 0.25 * 1 +
          0.25 * 0.75 * 2 +
          0.75 * 0.25 * 2 +
          0.75 * 0.75 * 0.25 * 2 +
          0.75 * 0.75 * 0.75 * 3) +
        0.99 * 0.05 * (0.25 * 1 + 0.75 * 0.25 * 1 + 0.75 * 0.75 * 2) +
        0.99 * 0.95 * 0.75),
  },
  {
    id: 120, // 20, 30!, 100, 100, 100
    chestQuality: "gold",
    targetItemId: 2593, // Reflect: Electric
    crossClassId: 4, // Duelist
    optimalParty: true,
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 1,
      skellArmorPoolId: 1,
    },
    expectedDropCount:
      0.01 * (0.2 * 0.3 * 1 + 0.8 * 0.3 * 1) +
      0.99 * 0.05 * (0.2 * 0.3 * 1 + 0.8 * 0.3 * 1) +
      0.99 * 0.95 * (0.8 * 0.3),
  },
  {
    id: 254, // 100X, 100!, 100!
    chestQuality: "silver",
    targetItemId: 1561, // Ultra Diamond Spatha
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
      (0.05 * 3 + 0.95 * 0.1 * 2 + 0.95 * 0.9 * 1),
  },
  {
    id: 396, // 100X, 50!, 100, 100!
    chestQuality: "silver",
    targetItemId: 1300, // Ultra Infnite Headwear
    crossClassId: 4, // Duelist
    optimalParty: true,
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 4,
      skellWeaponPoolId: 14,
      skellArmorPoolId: 0,
    },
    expectedDropCount:
      (1 / 5) *
      (0.05 * (0.5 * 2 + 0.5 * 0.5 * 2 + 0.5 * 0.5 * 1) +
        0.95 * 0.1 * (0.5 * 1 + 0.5 * 1) +
        0.95 * 0.9 * (0.5 * 1)),
  },
])(
  "$chestQuality-ItemDropTables[$id].averageDropCountForItem($targetItemId, " +
    "$crossClassId, $optimalParty, $enemyDropInfo) returns $expectedDropCount",
  ({
    id,
    chestQuality,
    targetItemId,
    crossClassId,
    optimalParty,
    enemyDropInfo,
    expectedDropCount,
  }) => {
    const itemDropTable = (() => {
      switch (chestQuality) {
        case "silver":
          return silverItemDropTables;
        case "gold":
          return goldItemDropTables;
        default:
          return chestQuality satisfies never;
      }
    })()[id];

    const targetItem = items[targetItemId] as Item;
    expect(targetItem).toBeInstanceOf(Item);

    expect(
      itemDropTable.averageDropCountForItem(
        targetItem,
        classes[crossClassId],
        optimalParty,
        enemyDropInfo,
      ),
    ).toBeCloseTo(expectedDropCount, 12);
  },
);
