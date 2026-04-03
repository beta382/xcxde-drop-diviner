import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import {
  goldTraitTableChoiceProbabilities,
  silverTraitTableChoiceProbabilities,
} from "~/data/mapped/probabilities";

// Random test data generated from Hamidu's Java reference impl

test.each<number>([1, 2, 3])(
  "traitTableChoiceProbabilities[$0] has length $0",
  (id) => {
    expect(
      silverTraitTableChoiceProbabilities[id].traitTable2ChoiceProbabilities,
    ).toHaveLength(id);
    expect(
      goldTraitTableChoiceProbabilities[id].traitTable2ChoiceProbabilities,
    ).toHaveLength(id);
  },
);

test.each<{
  id: number;
  seed: number;
  expectedChoices: ("table1" | "table2")[];
}>([
  {
    id: 1,
    seed: 7864,
    expectedChoices: ["table1"],
  },
  {
    id: 2,
    seed: 1078,
    expectedChoices: ["table1", "table1"],
  },
  {
    id: 3,
    seed: 4580,
    expectedChoices: ["table1", "table2", "table1"],
  },
])(
  "silverTraitTableChoiceProbabilities[$id].rollTraitTableChoices(" +
    "new MtRand($seed)) returns $expectedChoices",
  ({ id, seed, expectedChoices }) => {
    const rng = new MtRand(seed);
    expect(
      silverTraitTableChoiceProbabilities[id].rollTraitTableChoices(rng),
    ).toEqual(expectedChoices);
  },
);

test.each<{
  id: number;
  seed: number;
  expectedChoices: ("table1" | "table2")[];
}>([
  {
    id: 1,
    seed: 7864,
    expectedChoices: ["table2"],
  },
  {
    id: 2,
    seed: 1078,
    expectedChoices: ["table2", "table1"],
  },
  {
    id: 3,
    seed: 4580,
    expectedChoices: ["table2", "table2", "table1"],
  },
])(
  "goldTraitTableChoiceProbabilities[$id].rollTraitTableChoices(" +
    "new MtRand($seed)) returns $expectedChoices",
  ({ id, seed, expectedChoices }) => {
    const rng = new MtRand(seed);
    expect(
      goldTraitTableChoiceProbabilities[id].rollTraitTableChoices(rng),
    ).toEqual(expectedChoices);
  },
);
