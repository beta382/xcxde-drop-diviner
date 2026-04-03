import { Named } from "~/data/mapped/common";

/** Represents the character classes, e.g. "Drifter" */
export class CharacterClass extends Named {
  readonly id: number;
  readonly meleeWeaponId: number;
  readonly rangedWeaponId: number;

  constructor(
    id: number,
    nameId: number,
    meleeWeaponId: number,
    rangedWeaponId: number,
  ) {
    super(nameId, "ChrClassList");

    this.id = id;
    this.meleeWeaponId = meleeWeaponId;
    this.rangedWeaponId = rangedWeaponId;
  }
}
