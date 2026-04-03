import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import { materialDropTables } from "~/data/mapped/chest";
import type { ChestDropInfo } from "~/data/mapped/chest/drop-info.types";

// Random test data generated from Hamidu's Java reference impl

test.each<{
  id: number;
  chestDropInfo: ChestDropInfo;
  level: number;
  expectedMaterials: string[];
}>([
  {
    id: 24,
    chestDropInfo: { quality: "gold", sourceAppendageIndex: 0 },
    level: 70,
    expectedMaterials: [
      "Oc-serv Northern Crest",
      "Elemental Cluster",
      "Oc-serv Hand",
      "Elemental Fragment",
      "Upgraded Coil",
      "Standard Coil",
    ],
  },
  {
    id: 24,
    chestDropInfo: { quality: "gold", sourceAppendageIndex: 5 },
    level: 70,
    expectedMaterials: ["Oc-serv Hand"],
  },
  {
    id: 195,
    chestDropInfo: { quality: "gold", sourceAppendageIndex: 2 },
    level: 50,
    expectedMaterials: ["Bone-In Thigh Meat"],
  },
  {
    id: 28,
    chestDropInfo: { quality: "gold", sourceAppendageIndex: 4 },
    level: 1,
    expectedMaterials: [],
  },
])(
  "materialDropTables[$id].getDroppableMaterials($chestDropInfo, $level) " +
    "returns $expectedMaterials",
  ({ id, chestDropInfo, level, expectedMaterials }) => {
    const materialDropTable = materialDropTables[id];

    expect(
      materialDropTable
        .getDroppableMaterials(chestDropInfo, level)
        .map((material) => material.getLocalizedName("en")),
    ).toEqual(expectedMaterials);
  },
);

test.each<{
  id: number;
  seed: number;
  chestDropInfo: ChestDropInfo;
  level: number;
  expectedMaterials: string[];
}>([
  {
    id: 24,
    seed: 283,
    chestDropInfo: { quality: "gold", sourceAppendageIndex: 0 },
    level: 70,
    expectedMaterials: [
      "Oc-serv Northern Crest",
      "Elemental Fragment",
      "Upgraded Coil",
      "Standard Coil",
    ],
  },
  {
    id: 77,
    seed: 534,
    chestDropInfo: { quality: "silver", sourceAppendageIndex: 3 },
    level: 31,
    expectedMaterials: ["Gularthian Flint"],
  },
  {
    id: 91,
    seed: 342,
    chestDropInfo: { quality: "bronze", sourceAppendageIndex: 2 },
    level: 99,
    expectedMaterials: ["Golden Petramand Silk"],
  },
  {
    id: 179,
    seed: 645,
    chestDropInfo: { quality: "silver", sourceAppendageIndex: 0 },
    level: 1,
    expectedMaterials: ["Suid Fillet", "Fleecy Fur"],
  },
  {
    id: 82,
    seed: 19823,
    chestDropInfo: { quality: "bronze", sourceAppendageIndex: 0 },
    level: 55,
    expectedMaterials: [],
  },
])(
  "materialDropTables[$id].rollMaterials(new MtRand($seed), $chestDropInfo, " +
    "$level) returns $expectedMaterials",
  ({ id, seed, chestDropInfo, level, expectedMaterials }) => {
    const materialDropTable = materialDropTables[id];
    const rng = new MtRand(seed);

    expect(
      materialDropTable
        .rollMaterials(rng, chestDropInfo, level)
        .map((material) => material.getLocalizedName("en")),
    ).toEqual(expectedMaterials);
  },
);
