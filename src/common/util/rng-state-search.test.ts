import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import { searchRngForSequence } from "~/common/util/rng-state-search";

test.each<{
  seed: number;
  startState: number;
  searchDepth: number;
  min: number;
  max: number;
  targetSequence: number[];
  expectedResult: boolean;
  expectedStateIndex: number;
}>([
  {
    seed: 0,
    startState: 0,
    searchDepth: 0,
    min: 0,
    max: 2 ** 31,
    targetSequence: [],
    expectedResult: true,
    expectedStateIndex: 0,
  },
  {
    seed: 0,
    startState: 0,
    searchDepth: 0,
    min: 0,
    max: 2 ** 31,
    targetSequence: [0],
    expectedResult: false,
    expectedStateIndex: 0,
  },
  {
    seed: 0,
    startState: 0,
    searchDepth: 1,
    min: 0,
    max: 2 ** 31,
    targetSequence: [
      1178568022, 1273124119, 1535857466, 1813046880, 1294424481, 1842424189,
      1170127713, 1819459251, 909791748, 1339092841,
    ],
    expectedResult: true,
    expectedStateIndex: 10,
  },
  {
    seed: 0,
    startState: 0,
    searchDepth: 1,
    min: 0,
    max: 2 ** 31,
    targetSequence: [
      0, 1273124119, 1535857466, 1813046880, 1294424481, 1842424189, 1170127713,
      1819459251, 909791748, 1339092841,
    ],
    expectedResult: false,
    expectedStateIndex: 10,
  },
  {
    seed: 0,
    startState: 0,
    searchDepth: 2,
    min: 0,
    max: 2 ** 31,
    targetSequence: [
      0, 1273124119, 1535857466, 1813046880, 1294424481, 1842424189, 1170127713,
      1819459251, 909791748, 1339092841,
    ],
    expectedResult: false,
    expectedStateIndex: 11,
  },
  {
    seed: 0,
    startState: 0,
    searchDepth: 5,
    min: 0,
    max: 2 ** 31,
    targetSequence: [1842424189, 1170127713, 1819459251, 909791748, 1339092841],
    expectedResult: false,
    expectedStateIndex: 9,
  },
  {
    seed: 0,
    startState: 0,
    searchDepth: 6,
    min: 0,
    max: 2 ** 31,
    targetSequence: [1842424189, 1170127713, 1819459251, 909791748, 1339092841],
    expectedResult: true,
    expectedStateIndex: 10,
  },
  {
    seed: 0x5a100f87,
    startState: 335,
    searchDepth: 2,
    min: 0,
    max: 8,
    targetSequence: [6, 5, 2, 1, 3, 0, 7, 6, 0, 7, 7, 1],
    expectedResult: true,
    expectedStateIndex: 348,
  },
  {
    seed: 0x5a100f87,
    startState: 100,
    searchDepth: 400,
    min: 0,
    max: 8,
    targetSequence: [6, 5, 2, 1, 3, 0, 7, 6, 0, 7, 7, 1],
    expectedResult: true,
    expectedStateIndex: 348,
  },
])(
  "searchRngForSequence(new MtRand($seed)@$startState, $searchDepth, " +
    "(rng) => rng.rangeRange($min, $max), $targetSequence) yields " +
    "$expectedResult with final rng.stateIndex=$expectedStateIndex",
  ({
    seed,
    startState,
    searchDepth,
    min,
    max,
    targetSequence,
    expectedResult,
    expectedStateIndex,
  }) => {
    const rng = new MtRand(seed);

    for (let i = 0; i < startState; i++) {
      rng.randInt();
    }

    const result = searchRngForSequence(
      rng,
      searchDepth,
      (rng) => rng.randRange(min, max),
      targetSequence,
    );

    expect(result).toBe(expectedResult);
    expect(rng.stateIndex).toBe(expectedStateIndex);
  },
);
