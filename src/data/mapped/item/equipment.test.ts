import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import { groundAffixes, skellAffixes } from "~/data/mapped/affix";
import type { Affix } from "~/data/mapped/affix/affix";
import { items } from "~/data/mapped/item";
import { Equipment, EquipmentTemplate } from "~/data/mapped/item/equipment";
import type { NonMaterialChestQuality } from "~/data/mapped/probabilities/chest-quality-probabilities";

// Random test data generated from Hamidu's Java reference impl

// Probability data generated from my Python reference impl
// (https://www.onlinegdb.com/L4DFBDoGR)

test.each<{
  id: number;
  seed: number;
  chestQuality: NonMaterialChestQuality;
  expectedName: string;
  expectedTraits: string[];
  expectedAugmentSlots: number;
}>([
  {
    id: 3873,
    seed: 4,
    chestQuality: "gold",
    expectedName: "Bewitched Glaive: Receding Rust",
    expectedTraits: [
      "Melee: TP Gain Up",
      "Front Attack Plus XV",
      "Melee: Thermal Res Down XV",
    ],
    expectedAugmentSlots: 0,
  },
  {
    id: 1800,
    seed: 382,
    chestQuality: "silver",
    expectedName: "Worn Carbide Haven",
    expectedTraits: ["Ether Resistance Up XI", "Resist Knockback XI"],
    expectedAugmentSlots: 1,
  },
  {
    id: 382,
    seed: 1337,
    chestQuality: "gold",
    expectedName: "Worn Combat Guard R",
    expectedTraits: ["Front Attack Plus II"],
    expectedAugmentSlots: 1,
  },
])(
  "items[$id] is an EquipmentTemplate and .rollEquipment(new MtRand($seed), " +
    "$chestQuality) returns $expectedName with traits=$expectedTraits and " +
    "$expectedAugmentSlots augment slots",
  ({
    id,
    seed,
    chestQuality,
    expectedName,
    expectedTraits,
    expectedAugmentSlots,
  }) => {
    const equipmentTemplate = items[id] as EquipmentTemplate;
    expect(equipmentTemplate).toBeInstanceOf(EquipmentTemplate);

    const rng = new MtRand(seed);
    const equipment = equipmentTemplate.rollEquipment(rng, chestQuality);

    expect(equipment.getLocalizedName("en")).toBe(expectedName);
    expect(
      equipment.traits.map((trait) => trait.getLocalizedName("en")),
    ).toEqual(expectedTraits);
    expect(equipment.augmentSlots).toBe(expectedAugmentSlots);
  },
);

test.each<{
  id: number;
  seed: number;
  chestQuality: NonMaterialChestQuality;
}>([
  {
    id: 3873,
    seed: 4,
    chestQuality: "gold",
  },
])(
  "items[$id] is an EquipmentTemplate and .rollEquipment(new MtRand($seed), " +
    "$chestQuality) returns an Equipment satisfying " +
    "items[$id].isSameItem(equipment)",
  ({ id, seed, chestQuality }) => {
    const equipmentTemplate = items[id] as EquipmentTemplate;
    expect(equipmentTemplate).toBeInstanceOf(EquipmentTemplate);

    const rng = new MtRand(seed);

    expect(
      equipmentTemplate.isSameItem(
        equipmentTemplate.rollEquipment(rng, chestQuality),
      ),
    ).toBeTruthy();
  },
);

test.each<{
  id: number;
  equipmentType: "ground" | "skell";
  affixIds: number[];
  augmentSlots: number;
  chestQuality: NonMaterialChestQuality;
  expectedProbability: number;
  compareDigits: number;
}>([
  {
    id: 1561, // Ultra Diamond Spatha
    equipmentType: "ground",
    // Melee Attack Up XV, Critical Chance Up XV, Weapon Attack Power Up XV
    affixIds: [115, 1277, 655],
    augmentSlots: 3,
    chestQuality: "gold",
    expectedProbability: 3.6075616e-6 * 0.00135,
    compareDigits: 15,
  },
  {
    id: 1561, // Ultra Diamond Spatha
    equipmentType: "ground",
    // Melee Attack Up XV, Critical Chance Up XV
    affixIds: [115, 1277],
    augmentSlots: 2,
    chestQuality: "silver",
    expectedProbability: 7.9799108e-5 * 0.0182,
    compareDigits: 14,
  },
  {
    id: 3544, // SKM-XXM160SA Beamsaber
    equipmentType: "skell",
    affixIds: [232], // Boost.M-ACC XII (duplicate in table)
    augmentSlots: 0,
    chestQuality: "gold",
    expectedProbability: 0.4841138,
    compareDigits: 6,
  },
  {
    id: 4038, // SSM-XXR550GG Drone (Voltaris)
    equipmentType: "skell",
    affixIds: [],
    augmentSlots: 4,
    chestQuality: "gold",
    expectedProbability: 0.003,
    compareDigits: 4,
  },
])(
  "items[$id] is an EqupmentTemplate and .probabilityOfSatisfying(" +
    "$affixIds, $augmentSlots, $chestQuality) returns $expectedProbability",
  ({
    id,
    equipmentType,
    affixIds,
    augmentSlots,
    chestQuality,
    expectedProbability,
    compareDigits,
  }) => {
    const equipmentTemplate = items[id] as EquipmentTemplate;
    expect(equipmentTemplate).toBeInstanceOf(EquipmentTemplate);

    const affixes = equipmentType === "ground" ? groundAffixes : skellAffixes;

    expect(
      equipmentTemplate.probabilityOfSatisfying(
        affixIds.map((affixId) => affixes[affixId]),
        augmentSlots,
        chestQuality,
      ),
    ).toBeCloseTo(expectedProbability, compareDigits);
  },
);

test.each<{
  referenceTraits: Affix[];
  referenceAugmentSlots: number;
  testTraits: Affix[];
  testAugmentSlots: number;
  expectedSatisfies: boolean;
}>([
  {
    referenceTraits: [],
    referenceAugmentSlots: 0,
    testTraits: [],
    testAugmentSlots: 0,
    expectedSatisfies: true,
  },
  {
    referenceTraits: [groundAffixes[1]],
    referenceAugmentSlots: 0,
    testTraits: [],
    testAugmentSlots: 0,
    expectedSatisfies: true,
  },
  {
    referenceTraits: [],
    referenceAugmentSlots: 0,
    testTraits: [groundAffixes[1]],
    testAugmentSlots: 0,
    expectedSatisfies: false,
  },
  {
    referenceTraits: [],
    referenceAugmentSlots: 1,
    testTraits: [],
    testAugmentSlots: 0,
    expectedSatisfies: true,
  },
  {
    referenceTraits: [],
    referenceAugmentSlots: 0,
    testTraits: [],
    testAugmentSlots: 1,
    expectedSatisfies: false,
  },
  {
    referenceTraits: [skellAffixes[1], skellAffixes[2]],
    referenceAugmentSlots: 0,
    testTraits: [skellAffixes[2]],
    testAugmentSlots: 0,
    expectedSatisfies: true,
  },
  {
    referenceTraits: [skellAffixes[2]],
    referenceAugmentSlots: 0,
    testTraits: [skellAffixes[1], skellAffixes[2]],
    testAugmentSlots: 0,
    expectedSatisfies: false,
  },
  {
    referenceTraits: [skellAffixes[1], skellAffixes[2]],
    referenceAugmentSlots: 1,
    testTraits: [skellAffixes[2], skellAffixes[1]],
    testAugmentSlots: 1,
    expectedSatisfies: true,
  },
])(
  'new Equipment(318, 801, "ground-armor-arm-l", $referenceTraits, ' +
    "$referenceAugmentSlots).satisfies(items[318], $testTraits, $testAugmentSlots) is " +
    "$expectedSatisfies",
  ({
    referenceTraits,
    referenceAugmentSlots,
    testTraits,
    testAugmentSlots,
    expectedSatisfies,
  }) => {
    // id/nameId/type match, but chosen arbitrarily
    const equipment = new Equipment(
      318,
      801,
      "ground-armor-arm-l",
      referenceTraits,
      referenceAugmentSlots,
    );

    expect(
      equipment.satisfies(
        items[318] as EquipmentTemplate,
        testTraits,
        testAugmentSlots,
      ),
    ).toBe(expectedSatisfies);
  },
);

test(
  "new Equipment(...).satisfies(...) with mismatched equipmentTemplate " +
    "equals false",
  () => {
    // id/nameId/type match, but chosen arbitrarily
    const equipment = new Equipment(318, 801, "ground-armor-arm-l", [], 0);

    expect(
      equipment.satisfies(items[319] as EquipmentTemplate, [], 0),
    ).toBeFalsy();
  },
);

test.each<{
  referenceTraits: Affix[];
  referenceAugmentSlots: number;
  testTraits: Affix[];
  testAugmentSlots: number;
  expectedEquals: boolean;
}>([
  {
    referenceTraits: [],
    referenceAugmentSlots: 0,
    testTraits: [],
    testAugmentSlots: 0,
    expectedEquals: true,
  },
  {
    referenceTraits: [groundAffixes[1]],
    referenceAugmentSlots: 0,
    testTraits: [],
    testAugmentSlots: 0,
    expectedEquals: false,
  },
  {
    referenceTraits: [],
    referenceAugmentSlots: 0,
    testTraits: [groundAffixes[1]],
    testAugmentSlots: 0,
    expectedEquals: false,
  },
  {
    referenceTraits: [],
    referenceAugmentSlots: 1,
    testTraits: [],
    testAugmentSlots: 0,
    expectedEquals: false,
  },
  {
    referenceTraits: [],
    referenceAugmentSlots: 0,
    testTraits: [],
    testAugmentSlots: 1,
    expectedEquals: false,
  },
  {
    referenceTraits: [skellAffixes[1], skellAffixes[2]],
    referenceAugmentSlots: 0,
    testTraits: [skellAffixes[2]],
    testAugmentSlots: 0,
    expectedEquals: false,
  },
  {
    referenceTraits: [skellAffixes[2]],
    referenceAugmentSlots: 0,
    testTraits: [skellAffixes[1], skellAffixes[2]],
    testAugmentSlots: 0,
    expectedEquals: false,
  },
  {
    referenceTraits: [skellAffixes[1], skellAffixes[2]],
    referenceAugmentSlots: 1,
    testTraits: [skellAffixes[2], skellAffixes[1]],
    testAugmentSlots: 1,
    expectedEquals: false,
  },
  {
    referenceTraits: [skellAffixes[1], skellAffixes[2]],
    referenceAugmentSlots: 1,
    testTraits: [skellAffixes[1], skellAffixes[2]],
    testAugmentSlots: 1,
    expectedEquals: true,
  },
])(
  'new Equipment(318, 801, "ground-armor-arm-l", $referenceTraits' +
    "$referenceAugmentSlots).equals(items[318], $testTraits, " +
    "$testAugmentSlots) is $expectedEquals",
  ({
    referenceTraits,
    referenceAugmentSlots,
    testTraits,
    testAugmentSlots,
    expectedEquals,
  }) => {
    // id/nameId/type match, but chosen arbitrarily
    const equipment = new Equipment(
      318,
      801,
      "ground-armor-arm-l",
      referenceTraits,
      referenceAugmentSlots,
    );

    expect(
      equipment.equals(
        items[318] as EquipmentTemplate,
        testTraits,
        testAugmentSlots,
      ),
    ).toBe(expectedEquals);
  },
);

test(
  "new Equipment(...).equals(...) with mismatched equipmentTemplate equals " +
    "false",
  () => {
    // id/nameId/type match, but chosen arbitrarily
    const equipment = new Equipment(318, 801, "ground-armor-arm-l", [], 0);

    expect(
      equipment.equals(items[319] as EquipmentTemplate, [], 0),
    ).toBeFalsy();
  },
);
