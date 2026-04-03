import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import { traitTables } from "~/data/mapped/affix";

// Random test data generated from Hamidu's Java reference impl

test.each<{ id: number; expectedTraits: string[] }>([
  {
    id: 1584,
    expectedTraits: [
      "Evasion Boost XIV",
      "Visual Cloaking XIV",
      "Resistance Reducer XIV",
      "Terrain Damage Reducer XIV",
      "Evasion Drive XIV",
      "Untouchable Dash XIV",
    ],
  },
  {
    id: 1585,
    expectedTraits: [
      "SpecUp.M-ACC III",
      "SpecUp.EVA III",
      "SpecUp.M-ATK III",
      "SpecUp.PTL III",
      "AttributeDmg.PHYS III",
      "CritUp.THEROID III",
      "CritUp.INSECTOID III",
      "CritUp.HUMANOID III",
      "CritUp.MECHANOID III",
    ],
  },
  {
    id: 2439,
    expectedTraits: [
      "Boost.M-ACC XII",
      "Boost.EVA XII",
      "Boost.M-ACC XII",
      "AttributeDmg.BEAM XII",
      "CriticalUp XII",
      "PositionDmg.FRONT XII",
      "PositionDmg.SIDE XII",
      "PositionDmg.BACK XII",
      "Reflect.NEG-BEAM XII",
    ],
  },
  {
    id: 2575,
    expectedTraits: [
      "Boost.M-ACC IV",
      "Boost.R-ACC IV",
      "Boost.EVA IV",
      "Boost.M-ATK IV",
      "Boost.R-ATK IV",
      "Damage.APPEND IV",
      "Boost.HP-MAX IV",
      "SpecUp.FUEL-MAX IV",
      "SpecUp.ELEC-RES IV",
      "SpecUp.PHYS-RES IV",
    ],
  },
])(
  "traitTables[$id].traits with English names equals $expectedTraits",
  ({ id, expectedTraits }) => {
    expect(
      traitTables[id].traits.map((trait) => trait.getLocalizedName("en")),
    ).toEqual(expectedTraits);
  },
);

test.each<{ id: number; seed: number; expectedTraits: string[] }>([
  {
    id: 1584,
    seed: 0xe3945ec4,
    expectedTraits: [
      "Evasion Drive XIV",
      "Untouchable Dash XIV",
      "Visual Cloaking XIV",
      "Resistance Reducer XIV",
      "Terrain Damage Reducer XIV",
      "Evasion Boost XIV",
    ],
  },
  {
    id: 1585,
    seed: 0x55073d7e,
    expectedTraits: [
      "CritUp.MECHANOID III",
      "SpecUp.M-ACC III",
      "CritUp.INSECTOID III",
      "CritUp.HUMANOID III",
      "SpecUp.M-ATK III",
      "CritUp.THEROID III",
      "SpecUp.EVA III",
      "SpecUp.PTL III",
      "AttributeDmg.PHYS III",
    ],
  },
  {
    id: 2439, // Has duplicate trait Boost.M-ACC XII (SKM-XXM160SA Beamsaber)
    seed: 0x8b7fdb57,
    expectedTraits: [
      "Boost.EVA XII",
      "Boost.M-ACC XII",
      "Reflect.NEG-BEAM XII",
      "AttributeDmg.BEAM XII",
      "CriticalUp XII",
      "PositionDmg.BACK XII",
      "PositionDmg.FRONT XII",
      "PositionDmg.SIDE XII",
    ],
  },
])(
  "traitTables[$id].rollTrait() with English names for all unique traits " +
    "equals $expectedTraits",
  ({ id, seed, expectedTraits }) => {
    const traitTable = traitTables[id];
    const rng = new MtRand(seed);
    const pickedTraits = new Set<number>();

    const uniqueTraits = new Set(traitTable.traits);
    const actualTraits = Array.from({ length: uniqueTraits.size }).map(() =>
      traitTable.rollTrait(rng, pickedTraits).getLocalizedName("en"),
    );

    expect(actualTraits).toEqual(expectedTraits);
  },
);
