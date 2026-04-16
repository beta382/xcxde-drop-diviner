import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { createFilterOptions } from "@mui/material/useAutocomplete";
import { type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { enemyTemplates } from "~/data/mapped/enemy";
import type { Enemy, EnemyTemplate } from "~/data/mapped/enemy/enemy";
import { CURATED_ENEMY_IDS } from "~/ui/common";
import { useLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { useSettings } from "~/ui/common/contexts/settings/settings-context";

type EnemyTemplateOption = EnemyTemplate | "truncated";

const MAX_NON_CURATED_ENEMIES_TO_LIST = 100;

export function EnemyPicker({
  enemy,
  onEnemyChange,
}: {
  enemy: Enemy | undefined;
  onEnemyChange: (enemy: Enemy | undefined) => void;
}) {
  const settings = useSettings();
  const showAllEnemies = settings["advanced.lootFinder.showAllEnemies"];
  const lockout = useLockout("lootFinder");

  const [t, i18n] = useTranslation();

  const selectedEnemyTemplate = enemy && enemyTemplates[enemy.id];
  const selectedEnemyLevel = enemy && enemy.level;
  const selectedBrokenAppendageIndex =
    enemy && enemy.brokenAppendages[1]?.appendageIndex;

  const filteredEnemyTemplates = showAllEnemies
    ? enemyTemplates
    : enemyTemplates.filter((enemyTemplate) =>
        CURATED_ENEMY_IDS.includes(enemyTemplate.id),
      );

  const enemyLevels =
    selectedEnemyTemplate &&
    ((): { level: number; isHeroicTale: boolean }[] => {
      const levels = selectedEnemyTemplate.levels.map((level) => ({
        level,
        isHeroicTale: false,
      }));
      const heroicTaleLevels = selectedEnemyTemplate.heroicTaleLevels.map(
        (level) => ({ level, isHeroicTale: true }),
      );

      return [...levels, ...heroicTaleLevels].sort(
        (lhs, rhs) => lhs.level - rhs.level,
      );
    })();

  function handleEnemyTemplateChange(
    nextEnemyTemplate: EnemyTemplateOption | null,
  ): void {
    if (nextEnemyTemplate === "truncated") {
      throw Error('"truncated" option should not be selectable');
    }

    if (!nextEnemyTemplate) {
      onEnemyChange(undefined);
    } else {
      onEnemyChange(
        nextEnemyTemplate.createEnemy(nextEnemyTemplate.levels[0], []),
      );
    }
  }

  function handleEnemyLevelChange(
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    onEnemyChange(
      selectedEnemyTemplate?.createEnemy(
        +evt.target.value,
        selectedBrokenAppendageIndex !== undefined
          ? [selectedEnemyTemplate.appendages[selectedBrokenAppendageIndex]]
          : [],
      ),
    );
  }

  function handleEnemyBrokenAppendageChange(
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    onEnemyChange(
      selectedEnemyTemplate?.createEnemy(
        selectedEnemyLevel ?? 0,
        evt.target.value !== "none"
          ? [selectedEnemyTemplate.appendages[+evt.target.value - 1]]
          : [],
      ),
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ mobile: 12, desktop: 5.5 }}>
        <Autocomplete
          options={filteredEnemyTemplates as EnemyTemplateOption[]}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t(($) => $.lootFinder.enemySearchLabel)}
            />
          )}
          size="small"
          fullWidth
          disablePortal
          blurOnSelect
          disabled={lockout}
          value={selectedEnemyTemplate ?? null}
          getOptionLabel={(enemyTemplate) =>
            enemyTemplate !== "truncated"
              ? showAllEnemies
                ? t(($) => $.lootFinder.detailedEnemyLabel, {
                    enemyName: enemyTemplate.getLocalizedName(i18n.language),
                    enemyId: enemyTemplate.id,
                  })
                : enemyTemplate.getLocalizedName(i18n.language)
              : t(($) => $.lootFinder.enemyListTruncatedLabel)
          }
          getOptionKey={(enemyTemplate) =>
            enemyTemplate !== "truncated" ? enemyTemplate.id : "truncated"
          }
          getOptionDisabled={(enemyTemplate) => enemyTemplate === "truncated"}
          isOptionEqualToValue={(option, value) => {
            if (option === "truncated" || value === "truncated") {
              return option === value;
            }

            return option.id === value.id;
          }}
          filterOptions={
            !showAllEnemies
              ? createFilterOptions()
              : (enemyTemplates, state) => {
                  const limit = MAX_NON_CURATED_ENEMIES_TO_LIST;
                  const filteredOptions =
                    createFilterOptions<EnemyTemplateOption>({
                      limit,
                    })(enemyTemplates, state);

                  return filteredOptions.length < limit
                    ? filteredOptions
                    : ([...filteredOptions, "truncated"] as const);
                }
          }
          onChange={(_, nextEnemyTemplate) => {
            handleEnemyTemplateChange(nextEnemyTemplate);
          }}
        />
      </Grid>

      <Grid size={{ mobile: 4, desktop: 2 }}>
        <TextField
          label={t(($) => $.lootFinder.enemyLevelsLabel)}
          size="small"
          fullWidth
          disabled={!selectedEnemyTemplate || lockout}
          value={selectedEnemyLevel ?? ""}
          select
          onChange={handleEnemyLevelChange}
        >
          {enemyLevels ? (
            enemyLevels.map(({ level, isHeroicTale }) => (
              <MenuItem
                key={`${selectedEnemyTemplate.id.toString()}:${level.toString()}`}
                value={level}
              >
                {isHeroicTale
                  ? t(($) => $.lootFinder.enemyHeroicTaleLevelLabel, { level })
                  : level}
              </MenuItem>
            ))
          ) : (
            <MenuItem />
          )}
        </TextField>
      </Grid>

      <Grid size={{ mobile: 8, desktop: 4.5 }}>
        <TextField
          label={t(($) => $.lootFinder.enemyAppendagesLabel)}
          size="small"
          fullWidth
          disabled={!selectedEnemyTemplate || lockout}
          value={
            selectedEnemyTemplate
              ? (selectedBrokenAppendageIndex ?? "none")
              : ""
          }
          select
          onChange={handleEnemyBrokenAppendageChange}
        >
          {selectedEnemyTemplate ? (
            [
              <MenuItem value={"none"}>
                {t(($) => $.lootFinder.enemyBodyOnlyAppendageLabel, {
                  body: selectedEnemyTemplate.body.getLocalizedDisplayName(
                    i18n.language,
                  ),
                })}
              </MenuItem>,
              ...selectedEnemyTemplate.appendages.map((appendage) => (
                <MenuItem
                  key={
                    `${selectedEnemyTemplate.id.toString()}:` +
                    appendage.appendageIndex.toString()
                  }
                  value={appendage.appendageIndex}
                >
                  {t(($) => $.lootFinder.enemyAppendageLabel, {
                    gameName: appendage.getLocalizedDisplayName(i18n.language),
                    debugName: appendage.debugName,
                  })}
                </MenuItem>
              )),
            ]
          ) : (
            <MenuItem />
          )}
        </TextField>
      </Grid>
    </Grid>
  );
}
