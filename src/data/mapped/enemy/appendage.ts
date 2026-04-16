import type { Language } from "~/common/languages";
import type { DropTable } from "~/data/mapped/chest/drop-table";
import { Named } from "~/data/mapped/common";

/** Represents an enemy appendage */
export class Appendage extends Named {
  readonly dropTable: DropTable;
  readonly appendageIndex: number;
  readonly debugName: string;

  constructor(
    nameId: number,
    dropTable: DropTable,
    appendageIndex: number,
    debugName: string,
  ) {
    super(nameId, "ItmMaterialList");
    this.dropTable = dropTable;
    this.appendageIndex = appendageIndex;
    this.debugName = debugName;
  }

  /**
   * Gets the localized name with surrounding parenthesis stripped.
   *
   * @param language The language
   * @returns The localized name
   */
  getLocalizedDisplayName(language: Language): string {
    return this.getLocalizedName(language).slice(1, -1);
  }
}
