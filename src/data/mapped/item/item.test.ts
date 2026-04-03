import { expect, test } from "vitest";
import { items, materials } from "~/data/mapped/item";
import { Item } from "~/data/mapped/item/item";

test("All items and materials have unique uids", () => {
  const uids = [...items.flat(), ...materials.flat()]
    .filter((item) => item instanceof Item)
    .map((item) => item.uid);

  expect([...new Set(uids)]).toEqual(uids);
});

test.each<{
  id: number;
  expectedName: string;
}>([
  {
    id: 2589,
    expectedName: "Reflect: Physical",
  },
  {
    id: 2595,
    expectedName: "Reflect.ADD-PHYS",
  },
  {
    id: 1,
    expectedName: "Briggs's Key",
  },
  {
    id: 30,
    expectedName: "Guardian's Skull",
  },
  {
    id: 44,
    expectedName: "Autosentry",
  },
  {
    id: 3874,
    expectedName: "FILE-M0101SS",
  },
])(
  "items[$id] is an Item and has English name $expectedName",
  ({ id, expectedName }) => {
    const item = items[id] as Item;
    expect(item).toBeInstanceOf(Item);

    expect(item.getLocalizedName("en")).toBe(expectedName);
  },
);

test.each<{
  id: number;
  otherId: number;
  expectedSame: boolean;
}>([
  {
    id: 2589,
    otherId: 2589,
    expectedSame: true,
  },
  {
    id: 2589,
    otherId: 2590,
    expectedSame: false,
  },
])(
  "items[$id].isSameItem($items[$otherId]) equals $expectedSame",
  ({ id, otherId, expectedSame }) => {
    const item = items[id] as Item;
    expect(item).toBeInstanceOf(Item);
    const otherItem = items[otherId] as Item;
    expect(otherItem).toBeInstanceOf(Item);

    expect(item.isSameItem(otherItem)).toBe(expectedSame);
  },
);
