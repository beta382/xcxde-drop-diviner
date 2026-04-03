import * as bdat from "~/data/bdat/bdat";
import type { Bdat, BdatRow } from "~/data/bdat/bdat.types";

type NameSource =
  | "AmrDlList"
  | "AmrPcList"
  | "BattleSkill"
  | "BattleSkillDl"
  | "ChrClassList"
  | "ChrEnList"
  | "DefPcList"
  | "ItmBlueprint"
  | "ItmDeviceList"
  | "ItmFigList"
  | "ItmMaterialList"
  | "ItmPieceList"
  | "ItmPreciousList"
  | "WpnDlList"
  | "WpnPcList";

export type Language =
  | "en"
  | "de"
  | "es"
  | "fr"
  | "it"
  | "ja"
  | "ko"
  | "zh-CN"
  | "zh-TW";

const gameShorthands = {
  en: "Us",
  de: "Ge",
  es: "Sp",
  fr: "Fr",
  it: "It",
  ja: "Jp",
  ko: "Kr",
  "zh-CN": "Cn",
  "zh-TW": "Tw",
} as const satisfies Record<Language, string>;

export class Named {
  protected readonly nameId: number;
  readonly #nameSource: NameSource;

  constructor(nameId: number, nameSource: NameSource) {
    this.nameId = nameId;
    this.#nameSource = nameSource;
  }

  getLocalizedName(language: Language): string {
    return bdat[`get${this.#nameSource}${gameShorthands[language]}`]()[
      this.nameId
    ].name;
  }
}

export function mapBdat<I extends BdatRow, O>(
  bdat: Bdat<I>,
  mapper: (row: I) => O,
): O[] {
  return bdat.reduce<O[]>((acc, row) => {
    acc[row.id] = mapper(row);
    return acc;
  }, []);
}
