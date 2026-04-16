import { expect, test } from "vitest";
import type { Language } from "~/common/languages";
import { enemyTemplates } from "~/data/mapped/enemy";

test.each<{
  enemyId: number;
  appendageIndex: number;
  expectedName: string;
}>([
  {
    enemyId: 3872,
    appendageIndex: 0,
    expectedName: "",
  },
  {
    enemyId: 3872,
    appendageIndex: 1,
    expectedName: "head",
  },
  {
    enemyId: 2061,
    appendageIndex: 5,
    expectedName: "tail_R",
  },
])(
  "enemyTemplates[$enemyId].appendages[$appendageIndex].debugName equals " +
    "$expectedName",
  ({ enemyId, appendageIndex, expectedName }) => {
    const enemy = enemyTemplates[enemyId];
    const appendage =
      appendageIndex == 0 ? enemy.body : enemy.appendages[appendageIndex - 1];

    expect(appendage.debugName).toBe(expectedName);
  },
);

test.each<{
  enemyId: number;
  appendageIndex: number;
  language: Language;
  expectedName: string;
}>([
  {
    enemyId: 3872,
    appendageIndex: 0,
    language: "en",
    expectedName: "Body",
  },
  {
    enemyId: 2061,
    appendageIndex: 5,
    language: "en",
    expectedName: "Tail",
  },
  {
    enemyId: 2061,
    appendageIndex: 5,
    language: "ja",
    expectedName: "尻尾",
  },
])(
  "enemyTemplates[$enemyId].appendages[$appendageIndex]" +
    ".getLocalizedDisplayName($language) equals $expectedName",
  ({ enemyId, appendageIndex, language, expectedName }) => {
    const enemy = enemyTemplates[enemyId];
    const appendage =
      appendageIndex == 0 ? enemy.body : enemy.appendages[appendageIndex - 1];

    expect(appendage.getLocalizedDisplayName(language)).toBe(expectedName);
  },
);
