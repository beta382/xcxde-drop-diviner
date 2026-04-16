import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import type { Affix } from "~/data/mapped/affix/affix";
import type { Enemy } from "~/data/mapped/enemy/enemy";
import { EquipmentTemplate } from "~/data/mapped/item/equipment";
import type { Item } from "~/data/mapped/item/item";
import type { CharacterClass } from "~/data/mapped/party/character-class";
import { FilledIcon } from "~/ui/common/components/FilledIcon";
import { TextList } from "~/ui/common/components/TextList";
import { useLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { useRng } from "~/ui/common/contexts/rng/rng-context";
import { useSettings } from "~/ui/common/contexts/settings/settings-context";
import { useKey } from "~/ui/common/hooks";
import { groupKeyForItemType } from "~/ui/loot-finder/item-types";
import type { LootFilter, Mode } from "~/ui/loot-finder/loot-finder.types";

export function LootFilterBuilder({
  items,
  value,
  searchFilterStates,
  index,
  mode,
  enemy,
  crossClass,
  onLootFilterChange,
}: {
  items: Item[];
  value: LootFilter | null;
  searchFilterStates: number[];
  index: number;
  mode: Mode;
  enemy: Enemy | undefined;
  crossClass: CharacterClass;
  onLootFilterChange: (nextLootFilter: LootFilter | null) => void;
}) {
  const settings = useSettings();
  const rng = useRng();
  const lockout = useLockout("lootFinder");

  const [t, i18n] = useTranslation();

  const [traitSelectorKey, incrementTraitSelectorKey] = useKey();

  const selectedItem = value?.item;
  const selectedTraits = value?.traits ?? [];
  const selectedAugmentSlots = value?.augmentSlots ?? 0;

  const isEquipment = selectedItem instanceof EquipmentTemplate;
  const canHaveFourAugmentSlots = isEquipment
    ? (enemy?.averageDropCountForSatisfyingEquipment(
        selectedItem,
        settings["advanced.lootFinder.treasureSensor"],
        crossClass,
        settings["advanced.lootFinder.assumeOptimalParty"],
        [],
        4,
      ) ?? 0) > 0
    : false;

  const distanceToSearchFilterState = searchFilterStates
    .filter((state) => Number.isFinite(state))
    .map((state) => state - (rng?.stateIndex ?? 0))
    .find((state) => state >= 0);

  const killsPerDrop = isEquipment
    ? Math.round(
        1 /
          (enemy?.averageDropCountForSatisfyingEquipment(
            selectedItem,
            settings["advanced.lootFinder.treasureSensor"],
            crossClass,
            settings["advanced.lootFinder.assumeOptimalParty"],
            selectedTraits.map((trait) => trait.element),
            selectedAugmentSlots,
          ) ?? 0),
      )
    : Number.POSITIVE_INFINITY;

  function handleItemChange(nextItem: LootFilter["item"] | null): void {
    onLootFilterChange(
      nextItem && { item: nextItem, traits: [], augmentSlots: 0 },
    );
  }

  function handleSelectedTraitCreate(nextTrait: Affix): void {
    if (value === null) {
      throw Error("value cannot be null here");
    }

    onLootFilterChange({
      ...value,
      traits: [...value.traits, { element: nextTrait, key: traitSelectorKey }],
    });
    incrementTraitSelectorKey();
  }

  function handleSelectedTraitChange(key: number, nextTrait: Affix): void {
    if (value === null) {
      throw Error("value cannot be null here");
    }

    onLootFilterChange({
      ...value,
      traits: value.traits.map((trait) =>
        trait.key !== key ? trait : { element: nextTrait, key },
      ),
    });
  }

  function handleSelectedTraitDelete(key: number): void {
    if (value === null) {
      throw Error("value cannot be null here");
    }

    onLootFilterChange({
      ...value,
      traits: value.traits.filter((trait) => trait.key !== key),
    });
  }

  function handleSelectedAugmentSlotsChange(
    nextSelectedAugmentSlots: number,
  ): void {
    if (value === null) {
      throw Error("value cannot be null here");
    }

    onLootFilterChange({ ...value, augmentSlots: nextSelectedAugmentSlots });
  }

  return (
    <Paper
      elevation={16}
      sx={{
        padding: 1.5,
        borderRadius: 2,
        minWidth: "100%",
        minHeight: mode === "offset" ? "316px" : "424px",
        height: "100%",
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant="h6">
          {t(($) => $.lootFinder[mode].numberHeading, { index: index + 1 })}
        </Typography>
        <Autocomplete
          options={items}
          groupBy={(option) =>
            t(
              ($) =>
                $.lootFinder.itemTypeGroups[groupKeyForItemType[option.type]],
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={t(($) => $.lootFinder.equipmentLabel)}
            />
          )}
          clearIcon={
            <FilledIcon fontSize="small" color="error">
              delete
            </FilledIcon>
          }
          clearText={t(($) => $.common.delete)}
          size="small"
          fullWidth
          disablePortal
          blurOnSelect
          disabled={enemy === undefined || lockout}
          value={value?.item ?? null}
          getOptionLabel={(item) => item.getLocalizedName(i18n.language)}
          getOptionKey={(item) => item.uid}
          isOptionEqualToValue={(option, value) => option.uid === value.uid}
          onChange={(_, nextItem) => {
            handleItemChange(nextItem);
          }}
        />
        {isEquipment && (
          <>
            <Stack spacing="inherit" sx={{ minHeight: "196px" }}>
              {[
                ...selectedTraits,
                ...(selectedTraits.length < 3 ? (["add"] as const) : []),
              ].map((trait, i) => (
                <Autocomplete
                  key={trait !== "add" ? trait.key : traitSelectorKey}
                  options={[
                    ...(trait !== "add" ? [trait.element] : []),
                    // Deduplicate
                    ...[...new Set(selectedItem.traits)].filter(
                      (itemTrait) =>
                        !selectedTraits
                          .map((selectedTrait) => selectedTrait.element)
                          .includes(itemTrait),
                    ),
                  ]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t(
                        ($) =>
                          trait !== "add"
                            ? $.lootFinder[mode].traitsLabel
                            : $.lootFinder[mode].addTraitsLabel,
                        { index: i + 1 },
                      )}
                    />
                  )}
                  clearIcon={
                    <FilledIcon fontSize="small" color="error">
                      delete
                    </FilledIcon>
                  }
                  clearText={t(($) => $.common.delete)}
                  size="small"
                  fullWidth
                  disablePortal
                  blurOnSelect
                  disabled={lockout}
                  value={trait !== "add" ? trait.element : null}
                  getOptionLabel={(trait) =>
                    trait.getLocalizedName(i18n.language)
                  }
                  getOptionKey={(trait) => trait.uid}
                  isOptionEqualToValue={(option, value) =>
                    option.uid === value.uid
                  }
                  onChange={(_, nextTrait) => {
                    if (nextTrait !== null) {
                      if (trait === "add") {
                        handleSelectedTraitCreate(nextTrait);
                      } else {
                        handleSelectedTraitChange(trait.key, nextTrait);
                      }
                    } else {
                      if (trait === "add") {
                        throw new Error("Cannot add a null trait");
                      } else {
                        handleSelectedTraitDelete(trait.key);
                      }
                    }
                  }}
                />
              ))}
              <TextField
                label={t(($) => $.lootFinder[mode].augmentsLabel)}
                size="small"
                fullWidth
                disabled={lockout}
                value={selectedAugmentSlots}
                select
                onChange={(evt) => {
                  handleSelectedAugmentSlotsChange(+evt.target.value);
                }}
              >
                {Array.from({ length: canHaveFourAugmentSlots ? 5 : 4 }).map(
                  (_, i) => (
                    <MenuItem key={i} value={i}>
                      {i}
                    </MenuItem>
                  ),
                )}
              </TextField>
            </Stack>
            {mode === "search" && (
              <>
                <Stack direction="row">
                  <Typography sx={{ whiteSpace: "pre" }}>
                    {t(($) => $.lootFinder.search.statesLabel)}
                  </Typography>

                  {searchFilterStates.length > 0 ? (
                    <TextList
                      values={searchFilterStates.map((state) => ({
                        key: state,
                        element: Number.isFinite(state)
                          ? i18n.format(state, "number", i18n.language)
                          : t(($) => $.lootFinder.search.moreStatesLabel),
                        props: {
                          color:
                            state < (rng?.stateIndex ?? 0)
                              ? "error"
                              : undefined,
                        },
                      }))}
                    />
                  ) : (
                    <Typography color="textDisabled">
                      {t(($) => $.lootFinder.search.awaitingSearchLabel)}
                    </Typography>
                  )}
                </Stack>
                <Stack direction="row">
                  <Typography sx={{ whiteSpace: "pre" }}>
                    {t(($) => $.lootFinder.search.distanceLabel)}
                  </Typography>
                  {searchFilterStates.length > 0 ? (
                    <Typography
                      color={
                        distanceToSearchFilterState !== undefined
                          ? undefined
                          : "error"
                      }
                    >
                      {distanceToSearchFilterState !== undefined
                        ? i18n.format(
                            distanceToSearchFilterState,
                            "number",
                            i18n.language,
                          )
                        : t(($) => $.lootFinder.search.noDistanceLabel)}
                    </Typography>
                  ) : (
                    <Typography color="textDisabled">
                      {t(($) => $.lootFinder.search.awaitingSearchLabel)}
                    </Typography>
                  )}
                </Stack>
                {Number.isFinite(killsPerDrop) ? (
                  <Typography>
                    {t(($) => $.lootFinder.search.dropChanceLabel, {
                      rate: killsPerDrop,
                    })}
                  </Typography>
                ) : (
                  <Typography color="error">
                    {t(($) => $.lootFinder.search.cannotDropLabel)}
                  </Typography>
                )}
              </>
            )}
          </>
        )}
      </Stack>
    </Paper>
  );
}
