import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import { groundAffixes, skellAffixes } from "~/data/mapped/affix";
import { enemyTemplates } from "~/data/mapped/enemy";
import { items } from "~/data/mapped/item";
import { Equipment, EquipmentTemplate } from "~/data/mapped/item/equipment";
import { Item } from "~/data/mapped/item/item";
import { classes } from "~/data/mapped/party";

test.each<{
  id: number;
  expectedLevels: number[];
}>([
  {
    id: 3872,
    expectedLevels: [66, 67, 68],
  },
  {
    id: 2061,
    expectedLevels: [88],
  },
  {
    id: 4132,
    expectedLevels: [53, 56, 57],
  },
  {
    id: 2519,
    expectedLevels: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
  },
  {
    id: 2682,
    expectedLevels: [53, 55, 92],
  },
])(
  "enemyTemplates[$id].levels equals $expectedLevels",
  ({ id, expectedLevels }) => {
    const enemy = enemyTemplates[id];

    expect(enemy.levels).toEqual(expectedLevels);
  },
);

test.each<{
  id: number;
  expectedLevels: number[];
}>([
  {
    id: 3872,
    expectedLevels: [69, 70, 71, 72, 73, 74],
  },
  {
    id: 2061,
    expectedLevels: [],
  },
  {
    id: 4132,
    expectedLevels: [54, 55, 58, 59, 60, 61, 62, 63],
  },
  {
    id: 2052,
    expectedLevels: [],
  },
  {
    id: 2682,
    expectedLevels: [54, 56, 57, 58, 59, 60, 61, 93, 94, 95, 96, 97, 98],
  },
])(
  "enemyTemplates[$id].heroicTaleLevels equals $expectedLevels",
  ({ id, expectedLevels }) => {
    const enemy = enemyTemplates[id];

    expect(enemy.heroicTaleLevels).toEqual(expectedLevels);
  },
);

test.each<{
  id: number;
  expectedName: string;
}>([
  {
    id: 3872,
    expectedName: "Body",
  },
])(
  "enemyTemplates[$id].body has English name $expectedName and debug name ''",
  ({ id, expectedName }) => {
    const body = enemyTemplates[id].body;

    expect(body.getLocalizedDisplayName("en")).toEqual(expectedName);
    expect(body.debugName).toEqual("");
  },
);

test.each<{
  id: number;
  appendageIndex: number;
  expectedName: string;
  expectedDebugName: string;
}>([
  {
    id: 2061,
    appendageIndex: 5,
    expectedName: "Tail",
    expectedDebugName: "tail_R",
  },
])(
  "enemyTemplates[$id].appendages[$appendageIndex-1] has English name " +
    "$expectedName and debug name $expectedDebugName",
  ({ id, appendageIndex, expectedName, expectedDebugName }) => {
    const appendage = enemyTemplates[id].appendages[appendageIndex - 1];

    expect(appendage.getLocalizedDisplayName("en")).toEqual(expectedName);
    expect(appendage.debugName).toEqual(expectedDebugName);
  },
);

function getEnemy(id: number, level: number, brokenAppendageIndexes: number[]) {
  return enemyTemplates[id].createEnemy(
    level,
    brokenAppendageIndexes.map(
      (appendageIndex) => enemyTemplates[id].appendages[appendageIndex - 1],
    ),
  );
}

test.each<{
  id: number;
  level: number;
}>([
  {
    id: 2526,
    level: 84,
  },
  {
    id: 2682,
    level: 93,
  },
])(
  "enemyTemplates[$id].createEnemy($level, []).level equals $level",
  ({ id, level }) => {
    const enemy = getEnemy(id, level, []);

    expect(enemy.level).toBe(level);
  },
);

test.each<{
  id: number;
  brokenAppendageIndexes: number[];
}>([
  {
    id: 2526,
    brokenAppendageIndexes: [],
  },
  {
    id: 2526,
    brokenAppendageIndexes: [1, 7],
  },
])(
  "enemyTemplates[$id].createEnemy(84, $brokenAppendageIndexes).level equals " +
    "[0, ...$brokenAppendageIndexes]",
  ({ id, brokenAppendageIndexes }) => {
    const enemy = getEnemy(id, 84, brokenAppendageIndexes);

    expect(
      enemy.brokenAppendages.map((appendage) => appendage.appendageIndex),
    ).toEqual([0, ...brokenAppendageIndexes]);
  },
);

test.each<{
  id: number;
  level: number;
  brokenAppendageIndexes: number[];
  treasureSensor: number;
  expectedItems: string[];
}>([
  {
    id: 2526,
    level: 84,
    brokenAppendageIndexes: [],
    treasureSensor: 0,
    expectedItems: [
      "XSK60SA H-HEAD-ATK4",
      "XSK60SA H-BODY-ATK4",
      "XSK60SA H-RARM-ATK4",
      "XSK60SA H-LARM-ATK4",
      "XSK60SA H-LEGS-ATK4",
      "Seidr Control Device",
      "Advanced Chamber",
      "Advanced Crank",
      "Orichalcum Metal",
      "Advanced Lens",
      "Upgraded Lens",
    ],
  },
  {
    id: 2526,
    level: 84,
    brokenAppendageIndexes: [3],
    treasureSensor: 89,
    expectedItems: [
      "XSK60SA H-HEAD-ATK4",
      "XSK60SA H-BODY-ATK4",
      "XSK60SA H-RARM-ATK4",
      "XSK60SA H-LARM-ATK4",
      "XSK60SA H-LEGS-ATK4",
      "Seidr Control Device",
      "Advanced Chamber",
      "Advanced Crank",
      "Orichalcum Metal",
      "Advanced Lens",
      "Upgraded Lens",
      "SRM-XR562GA R-Cannon",
      "SRM-XR760SA L-Missile",
      "SRM-XR660ME L-Missile",
      "SRM-XR260SA S-Missile",
      "SRM-XR260ME S-Missile",
      "SSM-XR160SA M-Missile",
      "SSM-XR160GG M-Missile",
      "SSM-XR160ME M-Missile",
      "SRM-XXR760SA L-Missile",
      "SRM-XXR660ME L-Missile",
      "SRM-XXR260SA S-Missile",
      "SRM-XXR260ME S-Missile",
      "SSM-XXR160SA M-Missile",
      "SSM-XXR160GG M-Missile",
      "SSM-XXR160ME M-Missile",
    ],
  },
  {
    id: 2526,
    level: 84,
    brokenAppendageIndexes: [3],
    treasureSensor: 90,
    expectedItems: [
      "XSK60SA H-HEAD-ATK4",
      "XSK60SA H-BODY-ATK4",
      "XSK60SA H-RARM-ATK4",
      "XSK60SA H-LARM-ATK4",
      "XSK60SA H-LEGS-ATK4",
      "Seidr Control Device",
      "Advanced Chamber",
      "Advanced Crank",
      "Orichalcum Metal",
      "Advanced Lens",
      "Upgraded Lens",
      "SRM-XR562GA R-Cannon",
      "SRM-XXR760SA L-Missile",
      "SRM-XXR660ME L-Missile",
      "SRM-XXR260SA S-Missile",
      "SRM-XXR260ME S-Missile",
      "SSM-XXR160SA M-Missile",
      "SSM-XXR160GG M-Missile",
      "SSM-XXR160ME M-Missile",
    ],
  },
])(
  "enemyTemplates[$id].createEnemy($level, $brokenAppendageIndexes)" +
    ".getDroppableItems($treasureSensor) returns $expectedItems",
  ({ id, level, brokenAppendageIndexes, treasureSensor, expectedItems }) => {
    const enemy = getEnemy(id, level, brokenAppendageIndexes);

    expect(
      enemy
        .getDroppableItems(treasureSensor)
        .map((item) => item.getLocalizedName("en")),
    ).toEqual(expectedItems);
  },
);

test.each<{
  id: number;
  seed: number;
  level: number;
  brokenAppendageIndexes: number[];
  treasureSensor: number;
  crossClassId: number;
  expectedItems: { name: string; traits?: string[]; augmentSlots?: number }[];
}>([
  {
    id: 3872,
    seed: 1000,
    level: 66,
    brokenAppendageIndexes: [],
    treasureSensor: 100,
    crossClassId: 4, // Duelist
    expectedItems: [
      {
        name: "Ultra Nebulan Dual Guns II",
        traits: ["Cooldown Reducer XV", "Ranged Accuracy Up XV"],
        augmentSlots: 0,
      },
      {
        name: "Visigel Poison Orb",
      },
      {
        name: "Opaque Membrane",
      },
    ],
  },
  {
    id: 4132,
    seed: 635,
    level: 57,
    brokenAppendageIndexes: [2, 3],
    treasureSensor: 25,
    crossClassId: 14, // Mastermind
    expectedItems: [
      {
        name: "SSM-XR550GG Drone",
        traits: ["SpecUp.R-ACC IX"],
        augmentSlots: 1,
      },
      {
        name: "Quality Core",
      },
      {
        name: "Advanced Core",
      },
      {
        name: "Advanced Core",
      },
    ],
  },
  {
    id: 2061,
    seed: 52683,
    level: 88,
    brokenAppendageIndexes: [1],
    treasureSensor: 49,
    crossClassId: 14, // Mastermind
    expectedItems: [
      {
        name: "Ultra Diamond Iyst",
        traits: ["Critical Chance Up XV"],
        augmentSlots: 0,
      },
      {
        name: "Ultra Phenomenon Glaive II",
        traits: ["Nullify Physical Reflect XV"],
        augmentSlots: 0,
      },
      {
        name: "Ultra Diamond Knife II",
        traits: ["Melee: Recover HP XV", "Melee Accuracy Up XV"],
        augmentSlots: 0,
      },
      {
        name: "Ultra Nebulan Fwooshers",
        traits: ["Ranged Accuracy Up XV"],
        augmentSlots: 1,
      },
      {
        name: "Ultra Diamond Candela",
        traits: ["Melee Accuracy Up XV"],
        augmentSlots: 1,
      },
      {
        name: "Ultra Diamond Knife",
        traits: ["Melee Attack Up XV"],
        augmentSlots: 0,
      },
    ],
  },
])(
  "enemyTemplates[$id].createEnemy($level, $brokenAppendageIndexes)" +
    ".rollItems(new MtRand($seed), $treasureSensor, $crossClassId) equals " +
    "$expectedItems",
  ({
    id,
    seed,
    level,
    brokenAppendageIndexes,
    treasureSensor,
    crossClassId,
    expectedItems,
  }) => {
    const enemy = getEnemy(id, level, brokenAppendageIndexes);
    const rng = new MtRand(seed);

    const actualItems = enemy.rollItems(
      rng,
      treasureSensor,
      classes[crossClassId],
    );

    expect(
      actualItems.map((item) => {
        const name = item.getLocalizedName("en");
        if (item instanceof Equipment) {
          return {
            name,
            traits: item.traits.map((trait) => trait.getLocalizedName("en")),
            augmentSlots: item.augmentSlots,
          };
        }

        return { name };
      }),
    ).toEqual(expectedItems);
  },
);

test.each<{
  id: number;
  level: number;
  brokenAppendageIndexes: number[];
  targetItemId: number;
  treasureSensor: number;
  crossClassId: number;
  optimalParty: boolean;
  expectedDropCount: number;
}>([
  {
    id: 3872, // Aquatic Visigel
    level: 66,
    brokenAppendageIndexes: [],
    targetItemId: 1561, // Ultra Diamond Spatha
    treasureSensor: 0,
    crossClassId: 4, // Duelist
    optimalParty: true,
    expectedDropCount:
      (0.8 * 0.5 + 0.2 * (1 / 12)) *
      (1 / 8) *
      (0.05 * (0.01 * 3 + 0.99 * 0.05 * 2 + 0.99 * 0.95) +
        0.95 * 0.25 * (0.05 * 3 + 0.95 * 0.1 * 2 + 0.95 * 0.9)),
  },
  {
    id: 2061, // Lugalbanda, the Wanderer-King
    level: 88,
    brokenAppendageIndexes: [1],
    targetItemId: 1561, // Ultra Diamond Spatha
    treasureSensor: 50,
    crossClassId: 4, // Duelist
    optimalParty: true,
    expectedDropCount:
      (0.8 * 0.5 + 0.2 * (1 / 12)) *
      (1 / 8) *
      (0.01 * (0.2 * 0.7 * 1 + 0.8 * 0.3 * 1 + 0.8 * 0.7 * 2) +
        0.99 * 0.05 * (0.8 * 0.7 * 1) +
        (0.05 * 3 + 0.95 * 0.1 * 2 + 0.95 * 0.9 * 1)),
  },
  {
    id: 2061, // Lugalbanda, the Wanderer-King
    level: 88,
    brokenAppendageIndexes: [],
    targetItemId: 2593, // Reflect: Electric
    treasureSensor: 0,
    crossClassId: 4, // Duelist
    optimalParty: true,
    expectedDropCount:
      0.5 *
      (0.01 * (0.3 * 1) +
        0.99 * 0.05 * (0.3 * 1) +
        0.99 * 0.95 * (0.8 * 0.3 * 1)),
  },
])(
  "enemyTemplates[$id].createEnemy($level, $brokenAppendageIndexes)" +
    ".averageDropCountForItem($targetItemId, $treasureSensor, $crossClassId, " +
    "$optimalParty) equals $expectedDropCount",
  ({
    id,
    level,
    brokenAppendageIndexes,
    targetItemId,
    treasureSensor,
    crossClassId,
    optimalParty,
    expectedDropCount,
  }) => {
    const enemy = getEnemy(id, level, brokenAppendageIndexes);
    const targetItem = items[targetItemId] as Item;
    expect(targetItem).toBeInstanceOf(Item);

    expect(
      enemy.averageDropCountForItem(
        targetItem,
        treasureSensor,
        classes[crossClassId],
        optimalParty,
      ),
    ).toBeCloseTo(expectedDropCount, 15);
  },
);

test.each<{
  id: number;
  level: number;
  brokenAppendageIndexes: number[];
  targetEquipmentTemplateId: number;
  equipmentType: "ground" | "skell";
  treasureSensor: number;
  crossClassId: number;
  optimalParty: boolean;
  affixIds: number[];
  augmentSlots: number;
  expectedDropCount: number;
}>([
  {
    id: 3872, // Aquatic Visigel
    level: 66,
    brokenAppendageIndexes: [],
    targetEquipmentTemplateId: 1561, // Ultra Diamond Spatha
    equipmentType: "ground",
    treasureSensor: 0,
    crossClassId: 4, // Duelist
    optimalParty: true,
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
    id: 2061, // Lugalbanda, the Wanderer-King
    level: 88,
    brokenAppendageIndexes: [1],
    targetEquipmentTemplateId: 1561, // Ultra Diamond Spatha
    equipmentType: "ground",
    treasureSensor: 50,
    crossClassId: 4, // Duelist
    optimalParty: true,
    // Melee Attack Up XV, Critical Chance Up XV, Weapon Attack Power Up XV
    affixIds: [115, 1277, 655],
    augmentSlots: 0,
    expectedDropCount:
      (0.8 * 0.5 + 0.2 * (1 / 12)) *
      (1 / 8) *
      ((0.01 * (0.2 * 0.7 * 1 + 0.8 * 0.3 * 1 + 0.8 * 0.7 * 2) +
        0.99 * 0.05 * (0.8 * 0.7 * 1)) *
        3.6075616e-6 +
        (0.05 * 3 + 0.95 * 0.1 * 2 + 0.95 * 0.9 * 1) * 6.442074e-8),
  },
])(
  "enemyTemplates[$id].createEnemy($level, $brokenAppendageIndexes)" +
    ".averageDropCountForSatisfyingEquipment($targetEquipmentTemplateId, " +
    "$treasureSensor, $crossClassId, $optimalParty, $affixIds, " +
    "$augmentSlots) equals $expectedDropCount",
  ({
    id,
    level,
    brokenAppendageIndexes,
    targetEquipmentTemplateId,
    equipmentType,
    treasureSensor,
    crossClassId,
    optimalParty,
    affixIds,
    augmentSlots,
    expectedDropCount,
  }) => {
    const enemy = getEnemy(id, level, brokenAppendageIndexes);
    const targetItem = items[targetEquipmentTemplateId] as EquipmentTemplate;
    expect(targetItem).toBeInstanceOf(EquipmentTemplate);

    const affixes = equipmentType === "ground" ? groundAffixes : skellAffixes;

    expect(
      enemy.averageDropCountForSatisfyingEquipment(
        targetItem,
        treasureSensor,
        classes[crossClassId],
        optimalParty,
        affixIds.map((affixId) => affixes[affixId]),
        augmentSlots,
      ),
    ).toBeCloseTo(expectedDropCount, 15);
  },
);
