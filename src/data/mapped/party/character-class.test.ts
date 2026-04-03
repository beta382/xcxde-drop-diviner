import { expect, test } from "vitest";
import { classes } from "~/data/mapped/party";

test.each<{
  id: number;
  name: string;
  meleeWeaponId: number;
  rangedWeaponId: number;
}>([
  {
    id: 1,
    name: "Drifter",
    meleeWeaponId: 11,
    rangedWeaponId: 1,
  },
  {
    id: 16,
    name: "Galactic Knight",
    meleeWeaponId: 12,
    rangedWeaponId: 6,
  },
])(
  "classes[$id] to have name=$name, meleeWeaponId=$meleeWeaponId, " +
    "rangedWeaponId=$rangedWeaponId",
  ({ id, name, meleeWeaponId, rangedWeaponId }) => {
    const playableClass = classes[id];

    expect(playableClass.getLocalizedName("en")).toBe(name);
    expect(playableClass.meleeWeaponId).toBe(meleeWeaponId);
    expect(playableClass.rangedWeaponId).toBe(rangedWeaponId);
  },
);

test("classes[17] does not exist", () => {
  expect(17 in classes).toBeFalsy();
});
