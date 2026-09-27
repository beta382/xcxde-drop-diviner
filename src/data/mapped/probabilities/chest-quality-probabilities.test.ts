import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import { chestQualityProbabilities } from "~/data/mapped/probabilities";
import type { ChestQuality } from "~/data/mapped/probabilities/chest-quality-probabilities";

// Random test data generated from Hamidu's Java reference impl. Heroic Tale
// cases are derived from the non-Heroic Tale cases by applying the in-game
// rank upgrade, as Heroic Tale doesn't affect RNG consumption.

test.each<{
  id: number;
  seed: number;
  treasureSensor: number;
  heroicTale: boolean;
  expectedChestQualities: (ChestQuality | null)[];
}>([
  {
    id: 2,
    seed: 0,
    treasureSensor: 0,
    heroicTale: false,
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
    id: 2,
    seed: 0,
    treasureSensor: 0,
    heroicTale: true,
    expectedChestQualities: [
      "gold",
      "bronze",
      "gold",
      "bronze",
      "bronze",
      "bronze",
      "bronze",
      "bronze",
      "silver",
      "bronze",
    ],
  },
  {
    id: 2,
    seed: 0,
    treasureSensor: 25,
    heroicTale: false,
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
    id: 2,
    seed: 0,
    treasureSensor: 25,
    heroicTale: true,
    expectedChestQualities: [
      "gold",
      "gold",
      "bronze",
      "gold",
      "gold",
      "silver",
      "silver",
      "gold",
      "silver",
      "bronze",
    ],
  },
  {
    // Silver is impossible, so bronze can't be upgraded
    id: 5,
    seed: 0,
    treasureSensor: 0,
    heroicTale: true,
    expectedChestQualities: [
      "bronze",
      "bronze",
      "bronze",
      "bronze",
      "bronze",
      "bronze",
      "bronze",
      "bronze",
      "bronze",
      "bronze",
    ],
  },
  {
    id: 18,
    seed: 0x3eadee18,
    treasureSensor: 100,
    heroicTale: false,
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
  {
    // Gold is impossible, so silver can't be upgraded
    id: 18,
    seed: 0x3eadee18,
    treasureSensor: 100,
    heroicTale: true,
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
  {
    // Gold and bronze are impossible, so nothing can be upgraded
    id: 20,
    seed: 0,
    treasureSensor: 0,
    heroicTale: true,
    expectedChestQualities: [
      "silver",
      null,
      "silver",
      "silver",
      null,
      null,
      "silver",
      null,
      null,
      "silver",
    ],
  },
])(
  "chestQualityProbabilities[$id].rollChestQuality(new MtRand($seed), " +
    "$treasureSensor, $heroicTale) for $expectedChestQualities.length " +
    "trials equals $expectedChestQualities",
  ({ id, seed, treasureSensor, heroicTale, expectedChestQualities }) => {
    const rng = new MtRand(seed);
    const actualChestQualities = Array.from({
      length: expectedChestQualities.length,
    }).map(() =>
      chestQualityProbabilities[id].rollChestQuality(
        rng,
        treasureSensor,
        heroicTale,
      ),
    );

    expect(actualChestQualities).toEqual(expectedChestQualities);
  },
);

test.each<{
  id: number;
  chestQualities: ChestQuality[];
  treasureSensor: number;
  heroicTale: boolean;
  expectedProbabilities: number[];
}>([
  {
    id: 2,
    chestQualities: ["gold", "silver", "bronze"],
    treasureSensor: 0,
    heroicTale: false,
    expectedProbabilities: [0.05, 0.2375, 0.21375],
  },
  {
    id: 2,
    chestQualities: ["gold", "silver", "bronze"],
    treasureSensor: 0,
    heroicTale: true,
    expectedProbabilities: [0.2875, 0.21375, 0.49875],
  },
  {
    id: 2,
    chestQualities: ["gold", "silver", "bronze"],
    treasureSensor: 50,
    heroicTale: false,
    expectedProbabilities: [0.55, 0.3375, 0.09],
  },
  {
    // Silver is impossible, so bronze can't be upgraded
    id: 5,
    chestQualities: ["gold", "silver", "bronze"],
    treasureSensor: 0,
    heroicTale: true,
    expectedProbabilities: [0.08, 0.0, 0.92],
  },
  {
    // Silver is guaranteed if gold fails, and is then upgraded to gold
    id: 11,
    chestQualities: ["gold", "silver", "bronze"],
    treasureSensor: 0,
    heroicTale: true,
    expectedProbabilities: [1.0, 0.0, 0.0],
  },
  {
    id: 16,
    chestQualities: ["gold", "silver", "bronze"],
    treasureSensor: 78,
    heroicTale: false,
    expectedProbabilities: [0.0, 1.0, 0.0],
  },
])(
  "chestQualityProbabilities[$id].probabilityOfExactly(chestQuality, " +
    "$treasureSensor, $heroicTale) for chestQuality in $chestQualities " +
    "~equals $expectedProbabilities",
  ({
    id,
    chestQualities,
    treasureSensor,
    heroicTale,
    expectedProbabilities,
  }) => {
    for (let i = 0; i < chestQualities.length; i++) {
      const actualProbability = chestQualityProbabilities[
        id
      ].probabilityOfExactly(chestQualities[i], treasureSensor, heroicTale);
      expect(actualProbability).toBeCloseTo(expectedProbabilities[i], 10);
    }
  },
);
