import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";
import type { Enemy } from "~/data/mapped/enemy/enemy";
import type { Item } from "~/data/mapped/item/item";
import type { CharacterClass } from "~/data/mapped/party/character-class";
import { mergeKeyedList } from "~/ui/common";
import type { KeyedList } from "~/ui/common/common.types";
import { RunButton } from "~/ui/common/components/RunButton";
import { StatusText } from "~/ui/common/components/StatusText";
import { useMutableLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { useRng } from "~/ui/common/contexts/rng/rng-context";
import { useSettings } from "~/ui/common/contexts/settings/settings-context";
import { useBreakpoint, useTimer } from "~/ui/common/hooks";
import { createFindEquipmentController } from "~/ui/common/workers";
import type { FindEquipmentController } from "~/ui/common/workers/find-equipment/find-equipment.types";
import type { ResultType } from "~/ui/common/workers/workers.types";
import type { LootFilter } from "~/ui/loot-finder/loot-finder.types";
import { LootFilterList } from "~/ui/loot-finder/LootFilterList";

export function SearchEquipmentView({
  searchFilters,
  searchFilterStates,
  items,
  enemy,
  crossClass,
  onSearchFiltersChange,
  onSearchFilterStatesChange,
}: {
  searchFilters: KeyedList<LootFilter>;
  searchFilterStates: KeyedList<number[]>;
  items: Item[];
  enemy: Enemy | undefined;
  crossClass: CharacterClass;
  onSearchFiltersChange: Dispatch<SetStateAction<KeyedList<LootFilter>>>;
  onSearchFilterStatesChange: Dispatch<SetStateAction<KeyedList<number[]>>>;
}) {
  const rng = useRng();
  const settings = useSettings();
  const [globalLockout, setGlobalLockout] = useMutableLockout("global");
  const [lootFinderLockout, setLootFinderLockout] =
    useMutableLockout("lootFinder");

  const [t] = useTranslation();

  const breakpoint = useBreakpoint();

  const [progress, setProgress] = useState<number>();
  const [isFinding, findTimerMs, startFindTimer, stopFindTimer] = useTimer();
  const [shouldImmediatelyHideFindTimer, setShouldImmediatelyHideFindTimer] =
    useState(false);
  const [isNoEquipmentFound, setIsNoEquipmentFound] = useState<boolean>();

  const findEquipmentWorkerRef = useRef<FindEquipmentController>(null);

  const setLockouts = useCallback(
    (nextLockout: boolean): void => {
      setGlobalLockout(nextLockout);
      setLootFinderLockout(nextLockout);
    },
    [setGlobalLockout, setLootFinderLockout],
  );

  const findEquipmentWorkerOnMessageEffectEvent = useEffectEvent(
    ({ data }: MessageEvent<ResultType<FindEquipmentController>>): void => {
      switch (data.type) {
        case "progress":
          setProgress(data.progress * 100);

          return;
        case "intermediateResult":
          onSearchFilterStatesChange((prevSearchFilterStates) =>
            mergeKeyedList(
              prevSearchFilterStates,
              data.result.equipmentFilterIndex,
              [data.result.stateIndex],
              (prevElement, nextElement) => {
                const merged = [...prevElement, ...nextElement].sort(
                  (lhs, rhs) => lhs - rhs,
                );

                const maxStates =
                  settings["advanced.lootFinder.statesToDisplay"];
                return merged.length <= maxStates
                  ? merged
                  : [...merged.slice(0, maxStates), Number.POSITIVE_INFINITY];
              },
            ),
          );

          return;
        case "terminalResult":
          stopFindTimer();

          setIsNoEquipmentFound(data.result === null);
          setLockouts(false);
          setProgress(undefined);

          return;
        default:
          return data satisfies never;
      }
    },
  );

  useEffect(() => {
    findEquipmentWorkerRef.current = createFindEquipmentController();

    findEquipmentWorkerRef.current.onmessage =
      findEquipmentWorkerOnMessageEffectEvent;

    return () => {
      findEquipmentWorkerRef.current?.terminate();
    };
  }, []);

  function handleStartEqupimentSearch(): void {
    if (!rng) {
      throw new Error("Cannot start Equipment Search with no RNG");
    }

    if (!enemy) {
      throw new Error("Cannot start Equipment Search with no Enemy");
    }

    startFindTimer();

    setShouldImmediatelyHideFindTimer(false);
    setIsNoEquipmentFound(undefined);
    setLockouts(true);
    onSearchFilterStatesChange([]);

    findEquipmentWorkerRef.current?.postMessage({
      type: "start",
      rng: rng.getRngCopy().deconstruct(),
      exactMatch: false,
      searchDepth: settings["advanced.lootFinder.searchStateSearchDepth"],
      threads: import.meta.env.DEV
        ? 1 // Dev environment struggles to load the ~/data/mapped modules
        : settings["advanced.numThreads"] === "system"
          ? navigator.hardwareConcurrency
          : settings["advanced.numThreads"],
      progressNotifyPeriod: 0.002,
      enemy: {
        id: enemy.id,
        level: enemy.level,
        brokenAppendages: enemy.brokenAppendages
          .map((appendage) => appendage.appendageIndex)
          .filter((index) => index !== 0),
      },
      equipmentFilters: searchFilters.map((filter) => ({
        key: filter.key,
        id: filter.element.item.id,
        traits: filter.element.traits.map((trait) => ({
          id: trait.element.id,
          domain: trait.element.domain,
        })),
        augmentSlots: filter.element.augmentSlots,
      })),
      treasureSensor: settings["advanced.lootFinder.treasureSensor"],
      crossClassId: crossClass.id,
    });
  }

  function handleCancelEquipmentSearch(): void {
    findEquipmentWorkerRef.current?.postMessage({ type: "stop" });

    stopFindTimer();

    setShouldImmediatelyHideFindTimer(true);
    setIsNoEquipmentFound(false);
    setLockouts(false);
    setProgress(undefined);
  }

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <LootFilterList
          value={searchFilters}
          searchFilterStates={searchFilterStates}
          items={items}
          mode={"search"}
          enemy={enemy}
          crossClass={crossClass}
          onLootFiltersChange={onSearchFiltersChange}
        />
      </Grid>

      {(isFinding ?? false) ? (
        <>
          <Grid size={1} />
          <Grid
            size={{ mobile: 10, tablet: 5 }}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <LinearProgress
              variant={progress !== undefined ? "determinate" : "indeterminate"}
              value={progress ?? 0}
              sx={{ width: "100%" }}
            />
          </Grid>
          {breakpoint === "mobile" && <Grid size={1} />}
        </>
      ) : (
        <>
          {breakpoint !== "mobile" && <Grid size={{ tablet: 2, desktop: 3 }} />}
          <Grid size={{ mobile: 12, tablet: 4, desktop: 3 }}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              disabled={searchFilters.length === 0}
              sx={{ minHeight: "100%" }}
              onClick={() => {
                onSearchFiltersChange([]);
              }}
            >
              {t(($) => $.lootFinder.search.clearEquipmentButton)}
            </Button>
          </Grid>
        </>
      )}

      {breakpoint === "mobile" && <Grid size={3} />}
      <Grid size={{ mobile: 6, tablet: 4, desktop: 3 }}>
        <RunButton
          runText={t(($) => $.lootFinder.search.startSearchButton)}
          cancelText={t(($) => $.lootFinder.endSearchButton)}
          isRunning={isFinding ?? false}
          disabled={
            !rng ||
            !enemy ||
            searchFilters.length <= 0 ||
            ((globalLockout || lootFinderLockout) && isFinding !== true)
          }
          onStart={handleStartEqupimentSearch}
          onCancel={handleCancelEquipmentSearch}
        />
      </Grid>
      <Grid
        size={{ mobile: 3, tablet: 2, desktop: 3 }}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <StatusText
          value={
            findTimerMs !== undefined
              ? t(($) => $.common.seconds, {
                  sec: findTimerMs / 1000,
                  minimumFractionDigits: 3,
                })
              : undefined
          }
          errorText={
            (isNoEquipmentFound ?? false)
              ? t(($) => $.common.searchFailed)
              : undefined
          }
          isVisible={isFinding}
          shouldImmediatelyHide={shouldImmediatelyHideFindTimer}
        />
      </Grid>
    </Grid>
  );
}
