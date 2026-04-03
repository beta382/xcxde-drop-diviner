import { Named } from "~/data/mapped/common";

export type ItemType =
  | "ground-armor-head"
  | "ground-armor-body"
  | "ground-armor-arm-r"
  | "ground-armor-arm-l"
  | "ground-armor-legs"
  | "ground-weapon-ranged"
  | "ground-weapon-melee"
  | "skell-armor-head"
  | "skell-armor-body"
  | "skell-armor-arm-r"
  | "skell-armor-arm-l"
  | "skell-armor-legs"
  | "skell-weapon-sidearm"
  | "skell-weapon-back"
  | "skell-weapon-shoulder"
  | "skell-weapon-arm"
  | "skell-weapon-spare"
  | "ground-augment"
  | "skell-augment"
  | "material"
  | "important"
  | "nemesis-fragments"
  | "holofigure"
  | "blueprint";

/** Represents a droppable item */
export class Item extends Named {
  readonly id: number;
  readonly type: ItemType;

  constructor(id: number, nameId: number, type: ItemType) {
    const nameSource = (() => {
      switch (type) {
        case "ground-armor-head":
        case "ground-armor-body":
        case "ground-armor-arm-r":
        case "ground-armor-arm-l":
        case "ground-armor-legs":
          return "AmrPcList";
        case "ground-weapon-ranged":
        case "ground-weapon-melee":
          return "WpnPcList";
        case "skell-armor-head":
        case "skell-armor-body":
        case "skell-armor-arm-r":
        case "skell-armor-arm-l":
        case "skell-armor-legs":
          return "AmrDlList";
        case "skell-weapon-sidearm":
        case "skell-weapon-back":
        case "skell-weapon-shoulder":
        case "skell-weapon-arm":
        case "skell-weapon-spare":
          return "WpnDlList";
        case "ground-augment":
          return "BattleSkill";
        case "skell-augment":
          return "BattleSkillDl";
        case "material":
          return "ItmMaterialList";
        case "important":
          return "ItmPreciousList";
        case "nemesis-fragments":
          return "ItmPieceList";
        case "holofigure":
          return "ItmFigList";
        case "blueprint":
          return "ItmBlueprint";
        default:
          return type satisfies never;
      }
    })();

    super(nameId, nameSource);
    this.id = id;
    this.type = type;
  }

  get uid(): string {
    return `${this.id.toString()}:${this.type}`;
  }

  isSameItem(other: Item): boolean {
    return this.uid === other.uid;
  }
}
