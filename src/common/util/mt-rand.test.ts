import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";

// Test data generated from Hamidu's Java reference impl

const sameValuesTestCount = 10_000;

test.each<{
  seed: number;
  startState: number;
  chance: number;
  expected: boolean[];
}>([
  {
    seed: 0,
    startState: 0,
    chance: 50,
    expected: [true, true, false, false, false, false, true, false, true, true],
  },
  {
    seed: 0,
    startState: 1_000_000,
    chance: 50,
    expected: [false, false, true, true, false, false, true, true, false, true],
  },
  {
    seed: 0x5a100f87,
    startState: 336,
    chance: 25,
    expected: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
    ],
  },
])(
  "MtRand($seed).randBoolean($chance) yields the values $expected starting " +
    "from state $startState",
  ({ seed, startState, chance, expected }) => {
    const rng = new MtRand(seed);

    manuallyAdvance(rng, startState);

    const actual = Array.from({ length: expected.length }).map(() =>
      rng.randBoolean(chance),
    );

    expect(actual).toEqual(expected);
  },
);

test.each<{
  seed: number;
  startState: number;
  max: number;
  expected: number[];
}>([
  {
    seed: 0,
    startState: 0,
    max: 2 ** 31,
    expected: [
      1178568022, 1273124119, 1535857466, 1813046880, 1294424481, 1842424189,
      1170127713, 1819459251, 909791748, 1339092841,
    ],
  },
  {
    seed: 0,
    startState: 1_000_000,
    max: 2 ** 31,
    expected: [
      1048751862, 726838180, 729534938, 399811542, 1768953071, 1127234350,
      2112935324, 61665428, 1594359069, 1189590100,
    ],
  },
  {
    seed: 0x5a100f87,
    startState: 336,
    max: 8,
    expected: [6, 5, 2, 1, 3, 0, 7, 6, 0, 7, 7, 1, 4, 1, 2, 3, 1, 7, 6, 4],
  },
])(
  "MtRand($seed).randInt($max) yields the values $expected starting from " +
    "state $startState",
  ({ seed, startState, max, expected }) => {
    const rng = new MtRand(seed);

    manuallyAdvance(rng, startState);

    const actual = Array.from({ length: expected.length }).map(() => {
      const actual = rng.randInt(max);
      expect(actual).toBeLessThan(max);
      return actual;
    });

    expect(actual).toEqual(expected);
  },
);

test.each<{
  seed: number;
  startState: number;
  pow: number;
  expected: number[];
}>([
  {
    seed: 0,
    startState: 0,
    pow: 31,
    expected: [
      1178568022, 1273124119, 1535857466, 1813046880, 1294424481, 1842424189,
      1170127713, 1819459251, 909791748, 1339092841,
    ],
  },
  {
    seed: 0,
    startState: 1_000_000,
    pow: 31,
    expected: [
      1048751862, 726838180, 729534938, 399811542, 1768953071, 1127234350,
      2112935324, 61665428, 1594359069, 1189590100,
    ],
  },
  {
    seed: 0x5a100f87,
    startState: 336,
    pow: 3,
    expected: [6, 5, 2, 1, 3, 0, 7, 6, 0, 7, 7, 1, 4, 1, 2, 3, 1, 7, 6, 4],
  },
])(
  "MtRand($seed).randIntPow2($pow) yields the values $expected starting from " +
    "state $startState",
  ({ seed, startState, pow, expected }) => {
    const rng = new MtRand(seed);

    manuallyAdvance(rng, startState);

    const actual = Array.from({ length: expected.length }).map(() => {
      const actual = rng.randIntPow2(pow);
      expect(actual).toBeLessThan(2 ** pow);
      return actual;
    });

    expect(actual).toEqual(expected);
  },
);

test.each<{
  seed: number;
  startState: number;
  min: number;
  max: number;
  expected: number[];
}>([
  {
    seed: 0,
    startState: 0,
    min: 0,
    max: 2 ** 31,
    expected: [
      1178568022, 1273124119, 1535857466, 1813046880, 1294424481, 1842424189,
      1170127713, 1819459251, 909791748, 1339092841,
    ],
  },
  {
    seed: 0,
    startState: 1_000_000,
    min: 0,
    max: 2 ** 31,
    expected: [
      1048751862, 726838180, 729534938, 399811542, 1768953071, 1127234350,
      2112935324, 61665428, 1594359069, 1189590100,
    ],
  },
  {
    seed: 0x5a100f87,
    startState: 336,
    min: 8,
    max: 16,
    expected: [
      14, 13, 10, 9, 11, 8, 15, 14, 8, 15, 15, 9, 12, 9, 10, 11, 9, 15, 14, 12,
    ],
  },
  {
    seed: 0x5a100f87,
    startState: 336,
    min: 6,
    max: 7,
    expected: new Array<number>(100).fill(6),
  },
])(
  "MtRand($seed).randRange($min, $max) yields the values $expected starting " +
    "from state $startState",
  ({ seed, startState, min, max, expected }) => {
    const rng = new MtRand(seed);

    manuallyAdvance(rng, startState);

    const actual = Array.from({ length: expected.length }).map(() => {
      const actual = rng.randRange(min, max);
      expect(actual).toBeGreaterThanOrEqual(min);
      expect(actual).toBeLessThan(max);
      return actual;
    });

    expect(actual).toEqual(expected);
  },
);

test.each<{ seed: number; startState: number }>([
  { seed: 0, startState: 0 },
  { seed: 0, startState: 1_000_000 },
  { seed: 0x1be5b858, startState: 60_902 },
])(
  "MtRand($seed).copy() at state $startState yields an identical copy tested " +
    `over ${sameValuesTestCount.toString()} randRange() calls`,
  ({ seed, startState }) => {
    const rng = new MtRand(seed);

    manuallyAdvance(rng, startState);

    const copy = rng.copy();

    expect(copy.seed).toBe(rng.seed);
    expect(copy.stateIndex).toBe(rng.stateIndex);

    for (let i = 0; i < sameValuesTestCount; i++) {
      expect(copy.randInt()).toBe(rng.randInt());
    }
  },
);

test.each<{ seed: number; startState: number }>([
  { seed: 0, startState: 0 },
  { seed: 0, startState: 1_000_000 },
  { seed: 0x1be5b858, startState: 60_902 },
])(
  "MtRand(MtRand($seed).deconstruct()) at state $startState yields an " +
    `identical copy tested over ${sameValuesTestCount.toString()} ` +
    "randRange() calls",
  ({ seed, startState }) => {
    const rng = new MtRand(seed);

    manuallyAdvance(rng, startState);

    const copy = new MtRand(rng.deconstruct());

    expect(copy.seed).toBe(rng.seed);
    expect(copy.stateIndex).toBe(rng.stateIndex);

    for (let i = 0; i < sameValuesTestCount; i++) {
      expect(copy.randInt()).toBe(rng.randInt());
    }
  },
);

test.each<{ seed: number; startState: number; numAdvances: number }>([
  { seed: 0, startState: 0, numAdvances: 0 },
  { seed: 0, startState: 10, numAdvances: 100 },
  { seed: 0, startState: 584_921, numAdvances: 1_000_000 },
  { seed: 0, startState: 1875, numAdvances: 584_921 },
  { seed: 0xe54ff5f7, startState: 0, numAdvances: 0 },
  { seed: 0xe54ff5f7, startState: 10, numAdvances: 100 },
  { seed: 0xe54ff5f7, startState: 584_921, numAdvances: 1_000_000 },
  { seed: 0xe54ff5f7, startState: 1875, numAdvances: 584_921 },
])(
  "MtRand().stateIndex starting from $startState is the expected value after .advance($expectedState)",
  ({ seed, startState, numAdvances }) => {
    const rng = new MtRand(seed);

    manuallyAdvance(rng, startState);

    rng.advance(numAdvances);

    expect(rng.stateIndex).toBe(startState + numAdvances);
  },
);

test.each<{ seed: number; startState: number; numAdvances: number }>([
  { seed: 0, startState: 0, numAdvances: 0 },
  { seed: 0, startState: 10, numAdvances: 100 },
  { seed: 0, startState: 584_921, numAdvances: 1_000_000 },
  { seed: 0, startState: 1875, numAdvances: 584_921 },
  { seed: 0xe54ff5f7, startState: 0, numAdvances: 0 },
  { seed: 0xe54ff5f7, startState: 10, numAdvances: 100 },
  { seed: 0xe54ff5f7, startState: 584_921, numAdvances: 1_000_000 },
  { seed: 0xe54ff5f7, startState: 1875, numAdvances: 584_921 },
])(
  "MtRand($seed).advance($numAdvances) starting from state $startState " +
    "yields the same values as a manually advanced MtRand",
  ({ seed, startState, numAdvances }) => {
    const rng = new MtRand(seed);
    const expectedRng = new MtRand(seed);

    manuallyAdvance(rng, startState);
    manuallyAdvance(expectedRng, startState + numAdvances);

    rng.advance(numAdvances);

    for (let i = 0; i < sameValuesTestCount; i++) {
      expect(rng.randInt()).toBe(expectedRng.randInt());
    }
  },
);

test.each<{ seed: number; startState: number; targetState: number }>([
  { seed: 0, startState: 0, targetState: 1 },
  { seed: 0, startState: 10, targetState: 100 },
  { seed: 0, startState: 1_000_000, targetState: 584_921 },
  { seed: 0, startState: 1875, targetState: 0 },
  { seed: 0xe54ff5f7, startState: 0, targetState: 1 },
  { seed: 0xe54ff5f7, startState: 10, targetState: 100 },
  { seed: 0xe54ff5f7, startState: 1_000_000, targetState: 584_921 },
  { seed: 0xe54ff5f7, startState: 1875, targetState: 0 },
])(
  "MtRand($seed).goTo($targetState).stateIndex starting from $startState is " +
    "$targetState",
  ({ seed, startState, targetState }) => {
    const rng = new MtRand(seed);

    manuallyAdvance(rng, startState);

    rng.goTo(targetState);

    expect(rng.stateIndex).toBe(targetState);
  },
);

test.each<{ seed: number; startState: number; targetState: number }>([
  { seed: 0, startState: 0, targetState: 1 },
  { seed: 0, startState: 10, targetState: 100 },
  { seed: 0, startState: 1_000_000, targetState: 584_921 },
  { seed: 0, startState: 1875, targetState: 0 },
  { seed: 0xe54ff5f7, startState: 0, targetState: 1 },
  { seed: 0xe54ff5f7, startState: 10, targetState: 100 },
  { seed: 0xe54ff5f7, startState: 1_000_000, targetState: 584_921 },
  { seed: 0xe54ff5f7, startState: 1875, targetState: 0 },
])(
  "MtRand($seed).goTo($targetState) starting from state $startState yields " +
    "the same values as a manually advanced MtRand",
  ({ seed, startState, targetState }) => {
    const rng = new MtRand(seed);
    const expectedRng = new MtRand(seed);

    manuallyAdvance(rng, startState);
    manuallyAdvance(expectedRng, targetState);

    rng.goTo(targetState);

    for (let i = 0; i < sameValuesTestCount; i++) {
      expect(rng.randInt()).toBe(expectedRng.randInt());
    }
  },
);

function manuallyAdvance(rng: MtRand, numAdvances: number): void {
  for (let i = 0; i < numAdvances; i++) {
    rng.randInt();
  }
}
