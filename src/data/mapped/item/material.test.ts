import { expect, test } from "vitest";
import type { ChestDropInfo } from "~/data/mapped/chest/drop-info.types";
import { materials } from "~/data/mapped/item";

test.each<{
  id: number;
  chestDropInfo: ChestDropInfo;
  level: number;
  expectedProbability: number;
}>([
  {
    id: 3,
    chestDropInfo: { quality: "silver", sourceAppendageIndex: 0 },
    level: 99,
    expectedProbability: 5 + 5,
  },
  {
    id: 277,
    chestDropInfo: { quality: "gold", sourceAppendageIndex: 0 },
    level: 69,
    expectedProbability: 75,
  },
  {
    id: 421,
    chestDropInfo: { quality: "gold", sourceAppendageIndex: 4 },
    level: 1,
    expectedProbability: -126,
  },
])(
  "materials[$id].getDropProbability($chestDropInfo, $level) returns " +
    "$expectedProbability",
  ({ id, chestDropInfo, level, expectedProbability }) => {
    const material = materials[id];

    expect(material.getDropProbability(chestDropInfo, level)).toBe(
      expectedProbability,
    );
  },
);

test.each<{
  id: number;
  sourceAppendageIndex: number;
  expected: boolean;
}>([
  {
    id: 3,
    sourceAppendageIndex: 0,
    expected: true,
  },
  {
    id: 3,
    sourceAppendageIndex: 1,
    expected: false,
  },
  {
    id: 341,
    sourceAppendageIndex: 10,
    expected: true,
  },
  {
    id: 399,
    sourceAppendageIndex: 3,
    expected: false,
  },
])(
  "materials[$id].canDropFromAppendageIndex($sourceAppendageIndex) returns " +
    "$expected",
  ({ id, sourceAppendageIndex, expected }) => {
    const material = materials[id];

    expect(material.canDropFromAppendageIndex(sourceAppendageIndex)).toBe(
      expected,
    );
  },
);
