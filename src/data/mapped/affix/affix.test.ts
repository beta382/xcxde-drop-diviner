import { expect, test } from "vitest";
import { groundAffixes, skellAffixes } from "~/data/mapped/affix";

test("All ground and skell affixes have unique uids", () => {
  const uids = [...groundAffixes.flat(), ...skellAffixes.flat()].map(
    (affix) => affix.uid,
  );

  expect([...new Set(uids)]).toEqual(uids);
});

test.each<{ id: number; name: string }>([
  {
    id: 1,
    name: "Max HP Up I",
  },
  {
    id: 3667,
    name: "Weather Master XX",
  },
])("groundAffixes[$id] has English name $name", ({ id, name }) => {
  expect(groundAffixes[id].getLocalizedName("en")).toBe(name);
});

test.each<{ id: number; name: string }>([
  {
    id: 1,
    name: "SpecUp.HP-MAX I",
  },
  {
    id: 3117,
    name: "Weather.DAMAGE-RES I",
  },
])("skellAffixes[$id] has English name $name", ({ id, name }) => {
  expect(skellAffixes[id].getLocalizedName("en")).toBe(name);
});
