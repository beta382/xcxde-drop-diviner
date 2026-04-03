import { expect, test } from "vitest";
import { chestMaterialDropProbabilities } from "~/data/mapped/probabilities";

test.each<{
  id: number;
  enemyLevels: number[];
  expectedProbabilities: number[];
}>([
  {
    id: 1,
    enemyLevels: [1, 31, 71],
    expectedProbabilities: [100, 75, 25],
  },
  {
    id: 30,
    enemyLevels: [30, 70, 99],
    expectedProbabilities: [30, 40, 50],
  },
])(
  "chestMaterialDropProbabilities[$id].getProbabilityForEnemyLevel(" +
    "enemyLevel) for enemyLevel in $enemyLevels has probabilities " +
    "$expectedProbabilities",
  ({ id, enemyLevels, expectedProbabilities }) => {
    expect(
      enemyLevels.map((enemyLevel) =>
        chestMaterialDropProbabilities[id].getProbability(enemyLevel),
      ),
    ).toEqual(expectedProbabilities);
  },
);
