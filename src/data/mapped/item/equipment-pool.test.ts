import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import type { EnemyDropInfo } from "~/data/mapped/chest/drop-info.types";
import { items } from "~/data/mapped/item";
import { EquipmentTemplate } from "~/data/mapped/item/equipment";
import { EquipmentPool } from "~/data/mapped/item/equipment-pool";
import { classes } from "~/data/mapped/party";

// Random test data generated from Hamidu's Java reference impl

test.each<{
  id: number;
  enemyDropInfo: EnemyDropInfo;
  expectedEquipment: string[];
}>([
  {
    id: 308, // Ground Weapons Silver
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedEquipment: [
      "Ultra Nebulan Assault Rifle",
      "Ultra Nebulan Assault Rifle III",
      "Ultra Nebulan Assault Rifle II",
      "Ultra Nebulan Avagar",
      "Ultra Nebulan Sclopetum",
      "Ultra Nebulan Assailer",
      "Ultra Nebulan Rapture",
      "Ultra Transience Raidrifle",
      "Ultra Nebulan Sniper Rifle",
      "Ultra Nebulan Sniper Rifle II",
      "Ultra Nebulan Retic",
      "Ultra Nebulan Sicarius",
      "Ultra Nebulan Trigger",
      "Ultra Nebulan Thwipper",
      "Ultra Transience Deadsight",
      "Ultra Transience Deadsight II",
      "Ultra Nebulan Dual Guns",
      "Ultra Nebulan Dual Guns II",
      "Ultra Nebulan Gemels",
      "Ultra Nebulan Pistolia",
      "Ultra Nebulan Dyads",
      "Ultra Nebulan Dyads III",
      "Ultra Nebulan Dyads II",
      "Ultra Nebulan Bangbangs",
      "Ultra Transience Sidearm",
      "Ultra Nebulan Machine",
      "Ultra Nebulan Machine II",
      "Ultra Nebulan Repethe",
      "Ultra Nebulan Grando II",
      "Ultra Nebulan Grando",
      "Ultra Nebulan Crank",
      "Ultra Nebulan Ratatatta",
      "Ultra Nebulan Ziyse",
      "Ultra Nebulan Raygun",
      "Ultra Nebulan Lastyr",
      "Ultra Nebulan Lastyr II",
      "Ultra Nebulan Lastyr III",
      "Ultra Nebulan Radius",
      "Ultra Nebulan Radius II",
      "Ultra Nebulan Strobe",
      "Ultra Nebulan Faith",
      "Ultra Nebulan Launchers",
      "Ultra Nebulan Psylans",
      "Ultra Nebulan Ruina",
      "Ultra Nebulan Ruina II",
      "Ultra Nebulan Ruina III",
      "Ultra Nebulan Saboteurs",
      "Ultra Nebulan Fwooshers",
      "Ultra Nebulan Zorcyses",
      "Ultra Diamond Sword",
      "Ultra Diamond Sword II",
      "Ultra Diamond Slair",
      "Ultra Diamond Slair II",
      "Ultra Diamond Spatha",
      "Ultra Diamond Pride",
      "Ultra Phenomenon Glaive",
      "Ultra Phenomenon Glaive II",
      "Ultra Diamond Spear",
      "Ultra Diamond Spear II",
      "Ultra Diamond Parce",
      "Ultra Diamond Pilum",
      "Ultra Diamond Pilum II",
      "Ultra Diamond Bolide",
      "Ultra Diamond Jyth",
      "Ultra Phenomenon Lance",
      "Ultra Diamond Blades",
      "Ultra Diamond Blades II",
      "Ultra Diamond Ralzes",
      "Ultra Diamond Gladiis",
      "Ultra Diamond Twins",
      "Ultra Diamond Watxes",
      "Ultra Phenomenon Edges II",
      "Ultra Phenomenon Edges",
      "Ultra Diamond Shield",
      "Ultra Diamond Paive",
      "Ultra Diamond Parma",
      "Ultra Diamond Parma II",
      "Ultra Diamond Haven",
      "Ultra Diamond Haven II",
      "Ultra Diamond Thudclang",
      "Ultra Diamond Honor",
      "Ultra Diamond Knife",
      "Ultra Diamond Knife III",
      "Ultra Diamond Knife II",
      "Ultra Diamond Riv",
      "Ultra Diamond Pugio",
      "Ultra Diamond Pokepoke",
      "Ultra Diamond Iyst",
      "Ultra Diamond Iyst II",
      "Ultra Diamond Saber",
      "Ultra Diamond Fulge",
      "Ultra Diamond Fulge II",
      "Ultra Diamond Candela",
      "Ultra Diamond Candela II",
      "Ultra Diamond Candela III",
      "Ultra Phenomenon Lightblade",
      "Ultra Phenomenon Lightblade II",
    ],
  },
  {
    id: 311, // Ground Armor Gold
    enemyDropInfo: {
      level: 31,
      groundArmorPoolId: 1,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedEquipment: [
      "Worn Valor Headset",
      "Worn Valor Shirt",
      "Worn Valor Sleeve R",
      "Worn Valor Sleeve L",
      "Worn Valor Pants",
      "Advanced Valor Headset",
      "Advanced Valor Shirt",
      "Advanced Valor Sleeve R",
      "Advanced Valor Sleeve L",
      "Advanced Valor Pants",
    ],
  },
  {
    id: 310, // Skell Weapons Silver
    enemyDropInfo: {
      level: 68,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 24,
      skellArmorPoolId: 0,
    },
    expectedEquipment: [
      "SRM-XR460SA Grenade",
      "SRM-XM160ME Dragon",
      "SRM-XR560SA Hyper-Rail",
      "SRM-XR660SA Buster-Launcher",
      "SRM-XR560ME Meteor",
      "SHM-XR260GG Diskbomb",
    ],
  },
])(
  "items[$id] is an EquipmentPool and .getDroppableEquipment($enemyDropInfo) " +
    "returns equipment with English names $expectedEquipment",
  ({ id, enemyDropInfo, expectedEquipment }) => {
    const equipmentPool = items[id] as EquipmentPool;
    expect(equipmentPool).toBeInstanceOf(EquipmentPool);

    expect(
      equipmentPool
        .getDroppableEquipment(enemyDropInfo)
        .map((equipmentTemplate) => equipmentTemplate.getLocalizedName("en")),
    ).toEqual(expectedEquipment);
  },
);

test.each<{
  id: number;
  seed: number;
  classId: number;
  enemyDropInfo: EnemyDropInfo;
  expectedName: string;
}>([
  {
    id: 307,
    seed: 1234,
    classId: 4, // Duelist
    enemyDropInfo: {
      level: 65,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedName: "Ultra Nebulan Retic",
  },
  {
    id: 307,
    seed: 333,
    classId: 4, // Duelist
    enemyDropInfo: {
      level: 65,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedName: "Ultra Cosmic Assault Rifle III",
  },
  {
    id: 309,
    seed: 333,
    classId: 4, // Duelist
    enemyDropInfo: {
      level: 45,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 13,
      skellArmorPoolId: 0,
    },
    expectedName: "SHM-XXR140ME Bladegun",
  },
  {
    id: 311,
    seed: 333,
    classId: 4, // Duelist
    enemyDropInfo: {
      level: 26,
      groundArmorPoolId: 8,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedName: "Advanced Vivid Brax L",
  },
  {
    id: 314,
    seed: 333,
    classId: 4, // Duelist
    enemyDropInfo: {
      level: 1,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 10,
    },
    expectedName: "XSK20ME H-LARM-ATK5",
  },
  {
    id: 308,
    seed: 321,
    classId: 1, // Drifter
    enemyDropInfo: {
      level: 15,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedName: "Advanced Titanium Riv",
  },
  {
    id: 307,
    seed: 312,
    classId: 16, // Galactic Knight
    enemyDropInfo: {
      level: 30,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedName: "Worn Ophidian Psylans",
  },
  {
    id: 307,
    seed: 333,
    classId: 9, // Full Metal Jaguar
    enemyDropInfo: {
      level: 99,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedName: "Ultra Transience Sidearm",
  },
])(
  "items[$id] is an EquipmentPool and .rollEquipmentTemplate(" +
    "new MtRand($seed), $classId, $enemyDropInfo) returns $expectedName",
  ({ id, seed, classId, enemyDropInfo, expectedName }) => {
    const equipmentPool = items[id] as EquipmentPool;
    expect(equipmentPool).toBeInstanceOf(EquipmentPool);

    const rng = new MtRand(seed);

    expect(
      equipmentPool
        .rollEquipmentTemplate(rng, classes[classId], enemyDropInfo)
        .getLocalizedName("en"),
    ).toBe(expectedName);
  },
);

test.each<{
  equipmentPoolId: number;
  targetEquipmentTemplateId: number;
  classId: number;
  optimalParty: boolean;
  enemyDropInfo: EnemyDropInfo;
  expectedProbability: number;
}>([
  {
    equipmentPoolId: 307, // Ground Weapon Gold
    targetEquipmentTemplateId: 1561, // Ultra Diamond Spatha
    classId: 4, //  Duelist
    optimalParty: false,
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedProbability: (0.5 * 0.5 + 0.5 * (1 / 12)) * (1 / 8),
  },
  {
    equipmentPoolId: 307, // Ground Weapon Gold
    targetEquipmentTemplateId: 1561, // Ultra Diamond Spatha
    classId: 4, //  Duelist
    optimalParty: true,
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedProbability: (0.8 * 0.5 + 0.2 * (1 / 12)) * (1 / 8),
  },
  {
    equipmentPoolId: 307, // Ground Weapon Gold
    targetEquipmentTemplateId: 1561, // Ultra Diamond Spatha
    classId: 1, //  Drifter
    optimalParty: false,
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedProbability: 0.5 * (1 / 12) * (1 / 8),
  },
  {
    equipmentPoolId: 307, // Ground Weapon Gold
    targetEquipmentTemplateId: 1561, // Ultra Diamond Spatha
    classId: 1, //  Drifter
    optimalParty: true,
    enemyDropInfo: {
      level: 66,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedProbability: 0.2 * (1 / 12) * (1 / 8),
  },
  {
    equipmentPoolId: 308, // Ground Weapon Silver
    targetEquipmentTemplateId: 2450, // Worn Destroyer Sicarus
    classId: 10, //  Partisan Eagle
    optimalParty: false,
    enemyDropInfo: {
      level: 35,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedProbability: 0.1 * (0.5 * 0.5 + 0.5 * (1 / 12)) * (1 / 8),
  },
  {
    equipmentPoolId: 308, // Ground Weapon Silver
    targetEquipmentTemplateId: 2450, // Worn Destroyer Sicarus
    classId: 10, //  Partisan Eagle
    optimalParty: false,
    enemyDropInfo: {
      level: 30,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedProbability: 0,
  },
  {
    equipmentPoolId: 312, // Ground Armor Silver
    targetEquipmentTemplateId: 815, // Advanced Forza Vizard
    classId: 0,
    optimalParty: false,
    enemyDropInfo: {
      level: 46,
      groundArmorPoolId: 11,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 0,
    },
    expectedProbability: 0.9 / 5,
  },
  {
    equipmentPoolId: 309, // Skell Weapon Gold
    targetEquipmentTemplateId: 3047, // SSM-XXR530GG Drone
    classId: 0,
    optimalParty: false,
    enemyDropInfo: {
      level: 40,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 17,
      skellArmorPoolId: 0,
    },
    expectedProbability: 0.9 / 4,
  },
  {
    equipmentPoolId: 313, // Skell Armor Gold
    targetEquipmentTemplateId: 3812, // XSK20SA H-LEGS-ATK4
    classId: 0,
    optimalParty: false,
    enemyDropInfo: {
      level: 1,
      groundArmorPoolId: 0,
      skellWeaponPoolId: 0,
      skellArmorPoolId: 7,
    },
    expectedProbability: 1 / 10,
  },
])(
  "items[$equipmentPoolId] is an EquipmentPool and " +
    ".probabilityOfEquipmentTemplate(items[$targetEquipmentTemplateId], " +
    "$classId, $optimalParty, $enemyDropInfo) returns $expectedProbability",
  ({
    equipmentPoolId,
    targetEquipmentTemplateId,
    classId,
    optimalParty,
    enemyDropInfo,
    expectedProbability,
  }) => {
    const equipmentPool = items[equipmentPoolId] as EquipmentPool;
    expect(equipmentPool).toBeInstanceOf(EquipmentPool);

    const targetEquipmentTemplate = items[
      targetEquipmentTemplateId
    ] as EquipmentTemplate;
    expect(targetEquipmentTemplate).toBeInstanceOf(EquipmentTemplate);

    expect(
      equipmentPool.probabilityOfEquipmentTemplate(
        targetEquipmentTemplate,
        classes[classId],
        optimalParty,
        enemyDropInfo,
      ),
    ).toBeCloseTo(expectedProbability, 8);
  },
);
