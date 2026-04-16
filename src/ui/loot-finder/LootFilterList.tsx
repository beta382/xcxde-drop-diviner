import Grid from "@mui/material/Grid";
import type { Dispatch, SetStateAction } from "react";
import type { Enemy } from "~/data/mapped/enemy/enemy";
import type { Item } from "~/data/mapped/item/item";
import type { CharacterClass } from "~/data/mapped/party/character-class";
import type { KeyedList } from "~/ui/common/common.types";
import { useKey } from "~/ui/common/hooks";
import type { LootFilter, Mode } from "~/ui/loot-finder/loot-finder.types";
import { LootFilterBuilder } from "~/ui/loot-finder/LootFilterBuilder";

export function LootFilterList({
  value,
  searchFilterStates,
  items,
  mode,
  enemy,
  crossClass,
  onLootFiltersChange,
}: {
  value: KeyedList<LootFilter>;
  searchFilterStates?: KeyedList<number[]>;
  items: Item[];
  mode: Mode;
  enemy: Enemy | undefined;
  crossClass: CharacterClass;
  onLootFiltersChange: Dispatch<SetStateAction<KeyedList<LootFilter>>>;
}) {
  const [lootFilterKey, incrementLootFilterKey] = useKey();

  function handleLootFilterCreate(nextLootFilter: LootFilter): void {
    onLootFiltersChange((prevLootFilters) => [
      ...prevLootFilters,
      { element: nextLootFilter, key: lootFilterKey },
    ]);
    incrementLootFilterKey();
  }

  function handleLootFilterChange(
    key: number,
    nextLootFilter: LootFilter,
  ): void {
    onLootFiltersChange((prevLootFilters) =>
      prevLootFilters.map((lootFilter) =>
        lootFilter.key !== key ? lootFilter : { element: nextLootFilter, key },
      ),
    );
  }

  function handleLootFilterDelete(key: number) {
    onLootFiltersChange((prevLootFilters) =>
      prevLootFilters.filter((lootFilter) => lootFilter.key !== key),
    );
  }

  return (
    <Grid container spacing={2}>
      {[...value, "add" as const].map((lootFilter, i) => (
        <Grid
          key={lootFilter !== "add" ? lootFilter.key : lootFilterKey}
          size={{ mobile: 12, tablet: 6, desktop: 4 }}
        >
          <LootFilterBuilder
            items={items}
            value={lootFilter !== "add" ? lootFilter.element : null}
            searchFilterStates={
              searchFilterStates?.find(
                (states) =>
                  lootFilter !== "add" && states.key === lootFilter.key,
              )?.element ?? []
            }
            index={i}
            mode={mode}
            enemy={enemy}
            crossClass={crossClass}
            onLootFilterChange={(nextLootFilter) => {
              if (nextLootFilter !== null) {
                if (lootFilter === "add") {
                  handleLootFilterCreate(nextLootFilter);
                } else {
                  handleLootFilterChange(lootFilter.key, nextLootFilter);
                }
              } else {
                if (lootFilter === "add") {
                  throw new Error("Cannot add a null loot filter");
                } else {
                  handleLootFilterDelete(lootFilter.key);
                }
              }
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
