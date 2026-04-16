import type { Affix } from "~/data/mapped/affix/affix";
import type { Item } from "~/data/mapped/item/item";
import type { KeyedList } from "~/ui/common/common.types";

export type Mode = "offset" | "search";

export interface LootFilter {
  item: Item;
  traits: KeyedList<Affix>;
  augmentSlots: number;
}

export interface OffsetHistoryItem {
  offsets: number[];
  isStale: boolean;
}
