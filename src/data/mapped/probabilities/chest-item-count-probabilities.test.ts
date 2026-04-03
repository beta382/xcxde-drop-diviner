import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import { nonCrownChestItemCountProbabilities } from "~/data/mapped/probabilities";

// Random test data generated from Hamidu's Java reference impl

test.each(nonCrownChestItemCountProbabilities)(
  "Each nonCrownChestItemCountProbabilities.maxItemCount === 3",
  (chestItemCountProbabilities) => {
    expect(chestItemCountProbabilities.maxItemCount).toBe(3);
  },
);

test.each<{ id: number; seed: number; expectedCount: number }>([
  {
    id: 1,
    seed: 1234,
    expectedCount: 1,
  },
  {
    id: 1,
    seed: 99,
    expectedCount: 3,
  },
  {
    id: 2,
    seed: 6554,
    expectedCount: 2,
  },
])(
  "nonCrownChestItemCountProbabilities[$id].rollChestItemCount(" +
    "new MtRand($seed))) to return $expectedCount",
  ({ id, seed, expectedCount }) => {
    expect(
      nonCrownChestItemCountProbabilities[id].rollChestItemCount(
        new MtRand(seed),
      ),
    ).toBe(expectedCount);
  },
);

test.each<{
  id: number;
  counts: number[];
  expectedProbabilities: number[];
}>([
  {
    id: 1,
    counts: [3, 2, 1],
    expectedProbabilities: [0.01, 0.0495, 0.9405],
  },
  {
    id: 2,
    counts: [3, 2, 1],
    expectedProbabilities: [0.05, 0.095, 0.855],
  },
])(
  "nonCrownChestItemCountProbabilities[$id].getProbabilityOfExactly(count) " +
    "for count in $counts returns $expectedProbabilities",
  ({ id, counts, expectedProbabilities }) => {
    expect(
      counts.map((count) =>
        nonCrownChestItemCountProbabilities[id].getProbabilityOfExactly(count),
      ),
    ).toEqual(expectedProbabilities);
  },
);
