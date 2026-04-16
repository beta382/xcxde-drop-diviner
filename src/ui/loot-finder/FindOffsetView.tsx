import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
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
import { FilledIcon } from "~/ui/common/components/FilledIcon";
import { RunButton } from "~/ui/common/components/RunButton";
import { StatusText } from "~/ui/common/components/StatusText";
import { TextList } from "~/ui/common/components/TextList";
import { useMutableLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { useRng } from "~/ui/common/contexts/rng/rng-context";
import { useSettings } from "~/ui/common/contexts/settings/settings-context";
import { useBreakpoint, useKey, useTimer } from "~/ui/common/hooks";
import { createFindEquipmentController } from "~/ui/common/workers";
import type { FindEquipmentController } from "~/ui/common/workers/find-equipment/find-equipment.types";
import type { ResultType } from "~/ui/common/workers/workers.types";
import type {
  LootFilter,
  OffsetHistoryItem,
} from "~/ui/loot-finder/loot-finder.types";
import { LootFilterList } from "~/ui/loot-finder/LootFilterList";

export function FindOffsetView({
  offsetFilters,
  offsetHistory,
  items,
  enemy,
  crossClass,
  onOffsetFiltersChange,
  onOffsetHistoryChange,
}: {
  offsetFilters: KeyedList<LootFilter>;
  offsetHistory: KeyedList<OffsetHistoryItem>;
  items: Item[];
  enemy: Enemy | undefined;
  crossClass: CharacterClass;
  onOffsetFiltersChange: Dispatch<SetStateAction<KeyedList<LootFilter>>>;
  onOffsetHistoryChange: Dispatch<SetStateAction<KeyedList<OffsetHistoryItem>>>;
}) {
  const rng = useRng();
  const settings = useSettings();
  const [globalLockout, setGlobalLockout] = useMutableLockout("global");
  const [lootFinderLockout, setLootFinderLockout] =
    useMutableLockout("lootFinder");

  const [t, i18n] = useTranslation();

  const breakpoint = useBreakpoint();

  const [runKey, incrementRunKey] = useKey();

  const [progress, setProgress] = useState<number>();
  const [isFinding, findTimerMs, startFindTimer, stopFindTimer] = useTimer();
  const [shouldImmediatelyHideFindTimer, setShouldImmediatelyHideFindTimer] =
    useState(false);
  const [isOffsetNotFound, setIsOffsetNotFound] = useState<boolean>();

  const findEquipmentWorkerRef = useRef<FindEquipmentController>(null);

  const isStaleOffsets = !!offsetHistory.find(
    (offset) => offset.element.isStale,
  );

  function setLockouts(nextLockout: boolean): void {
    setGlobalLockout(nextLockout);
    setLootFinderLockout(nextLockout);
  }

  const findEquipmentWorkerOnMessageEffectEvent = useEffectEvent(
    ({ data }: MessageEvent<ResultType<FindEquipmentController>>): void => {
      switch (data.type) {
        case "progress":
          setProgress(data.progress * 100);

          return;
        case "intermediateResult":
          onOffsetHistoryChange((prevOffsetHistory) =>
            mergeKeyedList(
              prevOffsetHistory,
              runKey,
              { offsets: [data.result.offsetIndex], isStale: false },
              (prevElement, nextElement) => ({
                ...prevElement,
                offsets: [...prevElement.offsets, ...nextElement.offsets].sort(
                  (lhs, rhs) => lhs - rhs,
                ),
              }),
            ),
          );

          return;
        case "terminalResult":
          stopFindTimer();

          setIsOffsetNotFound(data.result === null);
          setLockouts(false);
          setProgress(undefined);
          incrementRunKey();

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
    setIsOffsetNotFound(undefined);
    setLockouts(true);

    findEquipmentWorkerRef.current?.postMessage({
      type: "start",
      rng: rng.getRngCopy().deconstruct(),
      exactMatch: true,
      searchDepth: settings["advanced.lootFinder.offsetStateSearchDepth"],
      threads: 1,
      progressNotifyPeriod: 0.1,
      enemy: {
        id: enemy.id,
        level: enemy.level,
        brokenAppendages: enemy.brokenAppendages
          .map((appendage) => appendage.appendageIndex)
          .filter((index) => index !== 0),
      },
      equipmentFilters: offsetFilters.map((filter) => ({
        key: filter.key, // Doesn't actually matter here
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
    setIsOffsetNotFound(false);
    setLockouts(false);
    setProgress(undefined);
    incrementRunKey();
  }

  return (
    <Grid container spacing={2}>
      <Grid
        size={12}
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        <Tooltip
          title={
            offsetHistory.length > 0
              ? t(($) =>
                  isStaleOffsets
                    ? $.lootFinder.offset.clearStaleHistoryTooltip
                    : $.lootFinder.offset.clearHistoryTooltip,
                )
              : undefined
          }
          placement={breakpoint === "desktop" ? "bottom" : "top"}
          arrow
        >
          <span>
            <IconButton
              disabled={lootFinderLockout || offsetHistory.length === 0}
              onClick={() => {
                if (isStaleOffsets) {
                  onOffsetHistoryChange((prevOffsetHistory) =>
                    prevOffsetHistory.filter(
                      (offset) => !offset.element.isStale,
                    ),
                  );
                } else {
                  onOffsetHistoryChange([]);
                }
              }}
              sx={{ marginRight: 0.5 }}
            >
              <FilledIcon
                color={
                  offsetHistory.length > 0
                    ? isStaleOffsets
                      ? "warning"
                      : "error"
                    : "disabled"
                }
              >
                delete
              </FilledIcon>
            </IconButton>
          </span>
        </Tooltip>
        <Typography
          color={isStaleOffsets ? "warning" : undefined}
          sx={{ whiteSpace: "pre" }}
        >
          {t(($) => $.lootFinder.offset.historyLabel)}
        </Typography>
        {offsetHistory.length > 0 ? (
          <TextList
            values={offsetHistory.map((offset) => ({
              key: offset.key,
              element:
                offset.element.offsets.length === 1
                  ? i18n.format(
                      offset.element.offsets[0],
                      "number",
                      i18n.language,
                    )
                  : t(($) => $.lootFinder.offset.multipleOffsetLabel, {
                      offsets: offset.element.offsets
                        .map((offsetValue) =>
                          i18n.format(offsetValue, "number", i18n.language),
                        )
                        .join(t(($) => $.lootFinder.offset.multipleOffsetJoin)),
                    }),
              props: { color: offset.element.isStale ? "warning" : undefined },
            }))}
          />
        ) : (
          <Typography color="textDisabled">
            {t(($) => $.lootFinder.offset.emptyHistoryLabel)}
          </Typography>
        )}
      </Grid>

      <Grid size={12}>
        <LootFilterList
          value={offsetFilters}
          items={items}
          mode={"offset"}
          enemy={enemy}
          crossClass={crossClass}
          onLootFiltersChange={onOffsetFiltersChange}
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
              disabled={offsetFilters.length === 0}
              sx={{ minHeight: "100%" }}
              onClick={() => {
                onOffsetFiltersChange([]);
              }}
            >
              {t(($) => $.lootFinder.offset.clearEquipmentButton)}
            </Button>
          </Grid>
        </>
      )}

      {breakpoint === "mobile" && <Grid size={3} />}
      <Grid size={{ mobile: 6, tablet: 4, desktop: 3 }}>
        <RunButton
          runText={t(($) => $.lootFinder.offset.startSearchButton)}
          cancelText={t(($) => $.lootFinder.endSearchButton)}
          isRunning={isFinding ?? false}
          disabled={
            !rng ||
            !enemy ||
            offsetFilters.length <= 0 ||
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
            (isOffsetNotFound ?? false)
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
