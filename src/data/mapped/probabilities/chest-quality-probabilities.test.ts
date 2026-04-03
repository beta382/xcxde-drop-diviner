import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import { chestQualityProbabilities } from "~/data/mapped/probabilities";
import type { ChestQuality } from "~/data/mapped/probabilities/chest-quality-probabilities";

// Random test data generated from Hamidu's Java reference impl

test.each<{
  id: number;
  seed: number;
  treasureSensor: number;
  expectedChestQualities: (ChestQuality | null)[];
}>([
  {
    id: 2,
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
    id: 2,
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
    id: 18,
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
  "chestQualityProbabilities[$id].rollChestQuality(new MtRand($seed), " +
    "$treasureSensor) for $expectedChestQualities.length trials equals " +
    "$expectedChestQualities",
  ({ id, seed, treasureSensor, expectedChestQualities }) => {
    const rng = new MtRand(seed);
    const actualChestQualities = Array.from({
      length: expectedChestQualities.length,
    }).map(() =>
      chestQualityProbabilities[id].rollChestQuality(rng, treasureSensor),
    );

    expect(actualChestQualities).toEqual(expectedChestQualities);
  },
);

test.each<{
  id: number;
  chestQualities: ChestQuality[];
  treasureSensor: number;
  expectedProbabilities: number[];
}>([
  {
    id: 2,
    chestQualities: ["gold", "silver", "bronze"],
    treasureSensor: 0,
    expectedProbabilities: [0.05, 0.2375, 0.21375],
  },
  {
    id: 2,
    chestQualities: ["gold", "silver", "bronze"],
    treasureSensor: 50,
    expectedProbabilities: [0.55, 0.3375, 0.09],
  },
  {
    id: 16,
    chestQualities: ["gold", "silver", "bronze"],
    treasureSensor: 78,
    expectedProbabilities: [0.0, 1.0, 0.0],
  },
])(
  "chestQualityProbabilities[$id].probabilityOfExactly(chestQuality, " +
    "$treasureSensor) for chestQuality in $chestQualities ~equals " +
    "$expectedProbabilities",
  ({ id, chestQualities, treasureSensor, expectedProbabilities }) => {
    for (let i = 0; i < chestQualities.length; i++) {
      const actualProbability = chestQualityProbabilities[
        id
      ].probabilityOfExactly(chestQualities[i], treasureSensor);
      expect(actualProbability).toBeCloseTo(expectedProbabilities[i], 10);
    }
  },
);
