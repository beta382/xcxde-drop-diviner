import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Enemy } from "~/data/mapped/enemy/enemy";
import { EquipmentTemplate } from "~/data/mapped/item/equipment";
import { classes } from "~/data/mapped/party";
import { CURATED_ENEMY_IDS } from "~/ui/common";
import type { KeyedList } from "~/ui/common/common.types";
import { FilledIcon } from "~/ui/common/components/FilledIcon";
import { useLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { useRng } from "~/ui/common/contexts/rng/rng-context";
import { useSettings } from "~/ui/common/contexts/settings/settings-context";
import { useBreakpoint } from "~/ui/common/hooks";
import { EnemyPicker } from "~/ui/loot-finder/EnemyPicker";
import { FindOffsetView } from "~/ui/loot-finder/FindOffsetView";
import { itemTypeSort } from "~/ui/loot-finder/item-types";
import type {
  LootFilter,
  Mode,
  OffsetHistoryItem,
} from "~/ui/loot-finder/loot-finder.types";
import { SearchEquipmentView } from "~/ui/loot-finder/SearchEquipmentView";

const defaultClassId = 1;

export function LootFinder() {
  const rng = useRng();
  const settings = useSettings();
  const showAllEnemies = settings["advanced.lootFinder.showAllEnemies"];
  const treasureSensor = settings["advanced.lootFinder.treasureSensor"];
  const lockout = useLockout("lootFinder");

  const [t, i18n] = useTranslation();

  const breakpoint = useBreakpoint();

  const [selectedEnemy, setSelectedEnemy] = useState<Enemy>();
  const [selectedCrossClass, setSelectedCrossClass] = useState(
    classes[defaultClassId],
  );

  const [mode, setMode] = useState<Mode>("offset");

  const [offsetFilters, setOffsetFilters] = useState<KeyedList<LootFilter>>([]);
  const [offsetHistory, setOffsetHistory] = useState<
    KeyedList<OffsetHistoryItem>
  >([]);

  const [searchFilters, setSearchFilters] = useState<KeyedList<LootFilter>>([]);
  const [searchFilterStates, setSearchFilterStates] = useState<
    KeyedList<number[]>
  >([]);

  const [prevSeed, setPrevSeed] = useState(rng?.seed);
  if (rng?.seed !== prevSeed) {
    setSearchFilterStates([]);

    setPrevSeed(rng?.seed);
  }

  const [prevShowAllEnemies, setPrevShowAllEnemies] = useState(showAllEnemies);
  if (showAllEnemies !== prevShowAllEnemies) {
    if (
      selectedEnemy !== undefined &&
      !showAllEnemies &&
      !CURATED_ENEMY_IDS.includes(selectedEnemy.id)
    ) {
      handleEnemyChange(undefined);
    }

    setPrevShowAllEnemies(showAllEnemies);
  }

  const [prevTreasureSensor, setPrevTreasureSensor] = useState(treasureSensor);
  if (treasureSensor !== prevTreasureSensor) {
    setOffsetFilters([]);

    if (selectedEnemy) {
      removeImpossibleSearchFilters(selectedEnemy);
    }
    setSearchFilterStates([]);

    setPrevTreasureSensor(treasureSensor);
  }

  const processedDroppableItems =
    selectedEnemy
      ?.getDroppableItems(treasureSensor)
      .filter((item) => item instanceof EquipmentTemplate)
      .sort(itemTypeSort) ?? [];

  function removeImpossibleSearchFilters(enemy: Enemy) {
    setSearchFilters((prevSearchFilters) =>
      prevSearchFilters.filter(({ element }) =>
        enemy
          .getDroppableItems(treasureSensor)
          .map((item) => item.uid)
          .includes(element.item.uid),
      ),
    );
  }

  function handleEnemyChange(nextSelectedEnemy: Enemy | undefined): void {
    setSelectedEnemy(nextSelectedEnemy);

    setOffsetFilters([]);
    setOffsetHistory((prevOffsetHistory) =>
      prevOffsetHistory.map((offsetHistoryItem) => ({
        ...offsetHistoryItem,
        element: { ...offsetHistoryItem.element, isStale: true },
      })),
    );

    if (
      nextSelectedEnemy === undefined ||
      selectedEnemy?.id !== nextSelectedEnemy.id
    ) {
      setSearchFilters([]);
    } else {
      removeImpossibleSearchFilters(nextSelectedEnemy);
    }

    setSearchFilterStates([]);
  }

  return (
    <Paper elevation={8} sx={{ padding: 3, borderRadius: 3, minWidth: "100%" }}>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          {breakpoint === "desktop" && <Grid size={0.5} />}
          <Grid size={{ mobile: 12, tablet: 7, desktop: 8 }}>
            <EnemyPicker
              enemy={selectedEnemy}
              onEnemyChange={handleEnemyChange}
            />
          </Grid>

          <Grid
            size={{ mobile: 2, tablet: 1 }}
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Tooltip
              title={t(($) => $.lootFinder.classesTooltip)}
              arrow
              placement="top"
            >
              <FilledIcon fontSize="small">error</FilledIcon>
            </Tooltip>
          </Grid>
          <Grid
            size={{ mobile: 8, tablet: 4, desktop: 2 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <TextField
              label={t(($) => $.lootFinder.classesLabel)}
              size="small"
              fullWidth
              disabled={lockout}
              defaultValue={defaultClassId}
              select
              onChange={(evt) => {
                setSelectedCrossClass(classes[+evt.target.value]);
                setSearchFilterStates([]);
              }}
            >
              {classes.map((characterClass, i) => (
                <MenuItem key={i} value={i}>
                  {characterClass.getLocalizedName(i18n.language)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {breakpoint !== "tablet" && (
            <Grid size={{ mobile: 2, desktop: 0.5 }} />
          )}
        </Grid>

        <Divider />

        <Box
          sx={{
            marginTop: "0!important",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={mode}
            onChange={(_, nextTab: Mode) => {
              setMode(nextTab);
            }}
            centered
            variant={breakpoint === "mobile" ? "fullWidth" : "standard"}
          >
            <Tab
              label={t(($) => $.lootFinder.offset.tabLabel)}
              value={"offset" satisfies Mode}
            />
            <Tab
              label={t(($) => $.lootFinder.search.tabLabel)}
              value={"search" satisfies Mode}
            />
          </Tabs>
        </Box>

        <TabPanel thisTabValue="offset" curTabValue={mode}>
          <FindOffsetView
            offsetFilters={offsetFilters}
            offsetHistory={offsetHistory}
            items={processedDroppableItems}
            enemy={selectedEnemy}
            crossClass={selectedCrossClass}
            onOffsetFiltersChange={setOffsetFilters}
            onOffsetHistoryChange={setOffsetHistory}
          />
        </TabPanel>
        <TabPanel thisTabValue="search" curTabValue={mode}>
          <SearchEquipmentView
            searchFilters={searchFilters}
            searchFilterStates={searchFilterStates}
            items={processedDroppableItems}
            enemy={selectedEnemy}
            crossClass={selectedCrossClass}
            onSearchFiltersChange={setSearchFilters}
            onSearchFilterStatesChange={setSearchFilterStates}
          />
        </TabPanel>
      </Stack>
    </Paper>
  );
}

function TabPanel({
  thisTabValue,
  curTabValue,
  children,
}: {
  thisTabValue: Mode;
  curTabValue: Mode;
  children: ReactNode;
}) {
  return (
    <div
      id={`loot-finder-tab-panel-${thisTabValue}`}
      hidden={thisTabValue !== curTabValue}
    >
      {/* Hide, but keep mounted */}
      {children}
    </div>
  );
}
