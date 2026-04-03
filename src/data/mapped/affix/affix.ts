import { Named } from "~/data/mapped/common";

/** Represents Traits/Augments. */
export class Affix extends Named {
  readonly id: number;
  readonly domain: "ground" | "skell";

  constructor(id: number, nameId: number, domain: "ground" | "skell") {
    const nameSource = (() => {
      switch (domain) {
        case "ground":
          return "BattleSkill";
        case "skell":
          return "BattleSkillDl";
        default:
          return domain satisfies never;
      }
    })();

    super(nameId, nameSource);
    this.id = id;
    this.domain = domain;
  }

  get uid(): string {
    return `${this.id.toString()}:${this.domain}`;
  }
}
