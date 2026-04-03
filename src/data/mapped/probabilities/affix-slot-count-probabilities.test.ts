import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import { affixSlotCountProbabilities } from "~/data/mapped/probabilities";

// Random test data generated from Hamidu's Java reference impl

test.each<{
  id: number;
  seed: number;
  expectedNumAffixSlots: number[];
}>([
  {
    id: 2,
    seed: 0x5cc9e2a0,
    expectedNumAffixSlots: [1, 2, 2, 3, 2, 1, 3, 1, 2, 3],
  },
  {
    id: 50,
    seed: 0x20332d2c,
    expectedNumAffixSlots: [2, 2, 1, 3, 4, 1, 2, 2, 2, 2],
  },
])(
  "affixSlotCountProbabilities[$id].rollNumAffixSlots(rng) for rng=new " +
    "MtRand($seed) and $expectedNumAffixSlots.length trials equals " +
    "$expectedNumAffixSlots",
  ({ id, seed, expectedNumAffixSlots }) => {
    const rng = new MtRand(seed);
    const actualNumAffixSlots = Array.from({
      length: expectedNumAffixSlots.length,
    }).map(() => affixSlotCountProbabilities[id].rollNumAffixSlots(rng));
    expect(actualNumAffixSlots).toEqual(expectedNumAffixSlots);
  },
);

test.each<{
  id: number;
  counts: number[];
  expectedProbabilities: number[];
}>([
  {
    id: 2,
    counts: [0, 1, 2, 3, 4],
    expectedProbabilities: [0, 0.21, 0.58, 0.21, 0],
  },
  {
    id: 50,
    counts: [0, 1, 2, 3, 4],
    expectedProbabilities: [0, 0.388, 0.497, 0.112, 0.003],
  },
  {
    id: 26,
    counts: [0, 1, 2, 3, 4],
    expectedProbabilities: [0.57715, 0.36705, 0.05445, 0.00135, 0],
  },
])(
  "affixSlotCountProbabilities[$id].probabilityOfExactly(count) for count in " +
    "$counts ~equals $expectedProbabilities",
  ({ id, counts, expectedProbabilities }) => {
    for (let i = 0; i < counts.length; i++) {
      const actualProbability = affixSlotCountProbabilities[
        id
      ].probabilityOfExactly(counts[i]);
      expect(actualProbability).toBeCloseTo(expectedProbabilities[i], 10);
    }
  },
);

test("affixSlotCountProbabilities[id].length === 4 for all ids", () => {
  affixSlotCountProbabilities.forEach((affixSlotCountProbability) => {
    expect(affixSlotCountProbability.length).toBe(4);
  });
});
