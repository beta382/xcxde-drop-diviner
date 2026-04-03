import { getChrClassInfo } from "~/data/bdat/bdat";
import { mapBdat } from "~/data/mapped/common";
import { CharacterClass } from "~/data/mapped/party/character-class";

// Sliced to only the classes equippable by Cross

export const classes: CharacterClass[] = mapBdat(getChrClassInfo(), (row) => {
  return new CharacterClass(row.id, row.name, row.nearWeapon, row.farWeapon);
}).slice(0, 17); // 17 instead of 16 because of the kept empty slot at id 0
