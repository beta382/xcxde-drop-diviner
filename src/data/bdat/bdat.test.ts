import { expect, test } from "vitest";
import * as bdat from "~/data/bdat/bdat";
import { getDrpBronzeBoxTable } from "~/data/bdat/bdat";
import type { Bdat, BdatRow } from "~/data/bdat/bdat.types";

test("A selected row has expected values", () => {
  const bdat = getDrpBronzeBoxTable();

  expect(bdat[107]).toEqual({
    id: 107,
    item1: 666,
    item2: 447,
    item3: 446,
    item4: 448,
    item5: 352,
    item6: 294,
    item7: 0,
    item8: 0,
  });
});

const loadModuleTestObj: {
  name: keyof typeof bdat;
  func: () => Bdat<BdatRow>;
}[] = [];
for (const key of Object.keys(bdat) as (keyof typeof bdat)[]) {
  loadModuleTestObj.push({ name: key, func: bdat[key] });
}

test.each(loadModuleTestObj)("$name() has no gaps in its IDs", ({ func }) => {
  const bdat = func();

  for (let i = (0 in bdat) ? 0 : 1; i < bdat.length; i++) {
    expect(bdat[i]).not.toBeNullable();
  }
});

test.each(loadModuleTestObj)("$name() caches its return value", ({ func }) => {
  const bdat1 = func();
  const bdat2 = func();

  expect(bdat2).toBe(bdat1);
});
