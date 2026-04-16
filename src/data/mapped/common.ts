import { languages, type Language } from "~/common/languages";
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

export class Named {
  protected readonly nameId: number;
  readonly #nameSource: NameSource;

  constructor(nameId: number, nameSource: NameSource) {
    this.nameId = nameId;
    this.#nameSource = nameSource;
  }

  getLocalizedName(language: Language): string {
    return bdat[`get${this.#nameSource}${languages[language].gameShorthand}`]()[
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
