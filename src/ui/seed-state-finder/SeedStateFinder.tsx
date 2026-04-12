import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MtRand } from "~/common/util/mt-rand";
import type { KeyedList } from "~/ui/common/common.types";
import { RunButton } from "~/ui/common/components/RunButton";
import { StatusText } from "~/ui/common/components/StatusText";
import { useMutableLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { useMutableRng } from "~/ui/common/contexts/rng/rng-context";
import { useMutableSettings } from "~/ui/common/contexts/settings/settings-context";
import { useBreakpoint, useTimer } from "~/ui/common/hooks";
import {
  createFindSeedController,
  createFindStateController,
} from "~/ui/common/workers";
import type { FindSeedController } from "~/ui/common/workers/find-seed/find-seed.types";
import type { FindStateController } from "~/ui/common/workers/find-state/find-state.types";
import type { ResultType } from "~/ui/common/workers/workers.types";
import { SeedEstimateTimer } from "~/ui/seed-state-finder/SeedEstimateTimer";
import { SeedStateControl } from "~/ui/seed-state-finder/SeedStateControl";
import type { VoiceLineKey } from "~/ui/seed-state-finder/voice-lines";
import { VoiceLinePicker } from "~/ui/seed-state-finder/VoiceLinePicker";

const USER_TIMING_ADJUSTMENT_MS_HISTORY_LENGTH = 10;

export function SeedStateFinder() {
  const [settings, updateSettings] = useMutableSettings();
  const [rng, updateRng] = useMutableRng();
  const [lockout, setLockout] = useMutableLockout("global");

  const [t] = useTranslation();

  const breakpoint = useBreakpoint();

  const [finderState, setFinderState] = useState<
    "awaitingSeedTiming" | "timingSeed" | "awaitingVoiceLines" | "finding"
  >(!rng ? "awaitingSeedTiming" : "awaitingVoiceLines");

  const [seedEstimateMs, setSeedEstimateMs] = useState<number>();

  const [prevVoiceLines, setPrevVoiceLines] =
    useState<KeyedList<VoiceLineKey>>();
  const [voiceLines, setVoiceLines] = useState<KeyedList<VoiceLineKey>>([]);

  const [isFinding, findTimerMs, startFindTimer, stopFindTimer] = useTimer();

  const [statesAdvanced, setStatesAdvanced] = useState<number>();
  const [shouldImmediatelyHideFindTimer, setShouldImmediatelyHideFindTimer] =
    useState(false);
  const [isResultNotFound, setIsResultNotFound] = useState<boolean>();

  const findSeedWorkerRef = useRef<FindSeedController>(null);
  const findStateWorkerRef = useRef<FindStateController>(null);

  const seedTimeAdjustMs =
    settings["advanced.seedFinder.userTimingAdjustmentMsHistory"].reduce(
      (acc, ms) => acc + ms,
      0,
    ) / settings["advanced.seedFinder.userTimingAdjustmentMsHistory"].length;

  const foundSeed = rng !== undefined;

  function msToSeed(ms: number): number {
    return (
      (settings[`advanced.seedFinder.${settings.systemType}SystemTickRateHz`] *
        (ms / 1000)) >>>
      0
    );
  }

  function seedToMs(seed: number): number {
    return (
      (seed /
        settings[
          `advanced.seedFinder.${settings.systemType}SystemTickRateHz`
        ]) *
      1000
    );
  }

  function setFindStartState(): void {
    startFindTimer();

    setLockout(true);
    setFinderState("finding");
    setStatesAdvanced(undefined);
    setShouldImmediatelyHideFindTimer(false);
    setIsResultNotFound(undefined);
  }

  function setFindCanceledState(): void {
    stopFindTimer();

    setLockout(false);
    setFinderState("awaitingVoiceLines");
    setShouldImmediatelyHideFindTimer(true);
    setIsResultNotFound(false);
  }

  function setFindFinishedState(isSuccess: boolean): void {
    setFinderState("awaitingVoiceLines");
    setIsResultNotFound(!isSuccess);
  }

  const findSeedWorkerOnMessageEffectEvent = useEffectEvent(
    ({ data }: MessageEvent<ResultType<FindSeedController>>): void => {
      if (data.type !== "terminalResult") {
        return;
      }

      stopFindTimer();
      setFindFinishedState(!!data.result);
      setLockout(false);

      if (!data.result) {
        return;
      }

      if (seedEstimateMs === undefined) {
        throw new Error("Cannot end Seed Search with no seed estimate");
      }

      const nextRng = new MtRand(data.result);
      updateRng({ type: "setRng", rng: nextRng });
      setPrevVoiceLines(undefined);
      setVoiceLines([]);

      // Timer controls must be locked out during search
      const actualAdjustMs = seedToMs(
        (nextRng.seed - msToSeed(seedEstimateMs)) >> 0,
      );

      updateSettings({
        "advanced.seedFinder.userTimingAdjustmentMsHistory": (
          prevUserTimingAdjustmentMsHistory,
        ) =>
          [...prevUserTimingAdjustmentMsHistory, actualAdjustMs].slice(
            -USER_TIMING_ADJUSTMENT_MS_HISTORY_LENGTH,
          ),
      });
    },
  );

  useEffect(() => {
    findSeedWorkerRef.current = createFindSeedController();

    findSeedWorkerRef.current.onmessage = findSeedWorkerOnMessageEffectEvent;

    return () => {
      findSeedWorkerRef.current?.terminate();
    };
  }, []);

  const findStateWorkerOnMessageEffectEvent = useEffectEvent(
    ({ data }: MessageEvent<ResultType<FindStateController>>): void => {
      if (data.type !== "terminalResult") {
        return;
      }

      stopFindTimer();
      setFindFinishedState(!!data.result);
      setLockout(false);

      // Voice Line controls must be locked out during search
      if (voiceLines.length > 0) {
        setPrevVoiceLines(voiceLines);
      }

      setVoiceLines([]);

      if (!data.result) {
        return;
      }

      const nextRng = new MtRand(data.result);

      updateRng({ type: "snapshotBackupRng" });
      updateRng({ type: "setRng", rng: nextRng });

      // RNG must be defined here
      setStatesAdvanced(nextRng.stateIndex - (rng?.stateIndex ?? 0));
    },
  );

  useEffect(() => {
    findStateWorkerRef.current = createFindStateController();

    findStateWorkerRef.current.onmessage = findStateWorkerOnMessageEffectEvent;

    return () => {
      findStateWorkerRef.current?.terminate();
    };
  }, []);

  function handleStartSeedSearch(): void {
    if (seedEstimateMs === undefined) {
      throw new Error("Cannot start Seed Search with no seed estimate");
    }

    setFindStartState();

    const region = settings["advanced.seedFinder.region"];
    findSeedWorkerRef.current?.postMessage({
      type: "start",
      workerType: settings["advanced.seedFinder.workerType"],
      seedEstimate: msToSeed(seedEstimateMs + seedTimeAdjustMs),
      threads:
        settings["advanced.numThreads"] === "system"
          ? navigator.hardwareConcurrency
          : settings["advanced.numThreads"],
      startState: settings[`advanced.seedFinder.${region}StartState`],
      searchDepth: settings[`advanced.seedFinder.${region}StateSearchDepth`],
      targetSequence: voiceLines,
    });
  }

  function handleStartStateSearch(): void {
    if (!rng) {
      throw new Error("Cannot start State Search with no RNG");
    }

    setFindStartState();

    findStateWorkerRef.current?.postMessage({
      type: "start",
      rng: rng.getRngCopy().deconstruct(),
      searchDepth: settings["advanced.stateFinder.searchDepth"],
      targetSequence: voiceLines,
    });
  }

  function handleCancelSeedSearch(): void {
    findSeedWorkerRef.current?.postMessage({ type: "stop" });
    setFindCanceledState();
  }

  function handleCancelStateSearch(): void {
    findStateWorkerRef.current?.postMessage({ type: "stop" });
    setFindCanceledState();
  }

  return (
    <Paper elevation={8} sx={{ padding: 3, borderRadius: 3, width: "100%" }}>
      <Stack spacing={2}>
        <SeedStateControl
          disabled={finderState === "timingSeed" || finderState === "finding"}
          onSeedSet={() => {
            setFinderState("awaitingVoiceLines");
            setPrevVoiceLines(undefined);
            setVoiceLines([]);
          }}
          onSeedCleared={() => {
            setFinderState("awaitingSeedTiming");
            setPrevVoiceLines(undefined);
            setVoiceLines([]);
          }}
        />

        <Divider />

        <Collapse
          in={!foundSeed}
          // These are needed to prevent the animation from "jumping"
          sx={{
            marginTop: "0!important",
          }}
          slotProps={{
            wrapperInner: {
              sx: { marginTop: 2 },
            },
          }}
        >
          <SeedEstimateTimer
            disabled={!!rng || finderState === "finding"}
            isFresh={finderState === "awaitingSeedTiming"}
            onStartTimer={() => {
              setFinderState("timingSeed");
            }}
            onMakeSeedEstimate={(seedEstimateMs) => {
              setFinderState("awaitingVoiceLines");
              setSeedEstimateMs(seedEstimateMs);
            }}
            onReset={() => {
              setFinderState("awaitingSeedTiming");
            }}
          />
        </Collapse>

        <VoiceLinePicker
          voiceLines={voiceLines}
          onAddVoiceLine={(voiceLine) => {
            setVoiceLines((prevVoiceLines) => [...prevVoiceLines, voiceLine]);
          }}
          disabled={finderState !== "awaitingVoiceLines"}
        />

        <Grid container spacing={2} columns={18}>
          {finderState === "finding" ? (
            <>
              <Grid size={1.5} />
              <Grid
                size={{ mobile: 15, tablet: 9.5 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LinearProgress sx={{ width: "100%" }} />
              </Grid>
              {breakpoint === "mobile" && <Grid size={1.5} />}
            </>
          ) : (
            <>
              {breakpoint !== "mobile" && <Grid size={3} />}
              <Grid size={{ mobile: 9, tablet: 4 }}>
                {voiceLines.length > 0 || prevVoiceLines === undefined ? (
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    disabled={
                      finderState !== "awaitingVoiceLines" ||
                      voiceLines.length <= 0
                    }
                    onClick={() => {
                      setPrevVoiceLines(voiceLines);
                      setVoiceLines([]);
                    }}
                    sx={{ minHeight: "100%" }}
                  >
                    {t(($) => $.seedStateFinder.clearVoiceLinesButton)}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      setPrevVoiceLines(undefined);
                      setVoiceLines(prevVoiceLines);
                    }}
                    sx={{ minHeight: "100%" }}
                  >
                    {t(($) => $.seedStateFinder.restoreVoiceLinesButton)}
                  </Button>
                )}
              </Grid>
              <Grid size={{ mobile: 9, tablet: 4 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  disabled={
                    finderState !== "awaitingVoiceLines" ||
                    voiceLines.length <= 0
                  }
                  onClick={() => {
                    setVoiceLines((voiceLines) => voiceLines.slice(0, -1));
                  }}
                  sx={{ minHeight: "100%" }}
                >
                  {t(($) => $.seedStateFinder.undoVoiceLineButton)}
                </Button>
              </Grid>
            </>
          )}

          {breakpoint === "mobile" && <Grid size={5} />}
          <Grid size={{ mobile: 8, tablet: 4 }}>
            {!foundSeed ? (
              <RunButton
                runText={t(($) => $.seedStateFinder.startSeedSearchButton)}
                isRunning={finderState === "finding"}
                disabled={
                  !(
                    finderState === "awaitingVoiceLines" ||
                    finderState === "finding"
                  ) ||
                  voiceLines.length <
                    settings["advanced.seedFinder.minimumVoiceLines"] ||
                  (lockout && finderState !== "finding")
                }
                onStart={handleStartSeedSearch}
                onCancel={handleCancelSeedSearch}
              />
            ) : (
              <RunButton
                runText={t(($) => $.seedStateFinder.startStateSearchButton)}
                isRunning={finderState === "finding"}
                disabled={
                  !(
                    finderState === "awaitingVoiceLines" ||
                    finderState === "finding"
                  ) ||
                  voiceLines.length <
                    settings["advanced.stateFinder.minimumVoiceLines"] ||
                  (lockout && finderState !== "finding")
                }
                onStart={handleStartStateSearch}
                onCancel={handleCancelStateSearch}
              />
            )}
          </Grid>

          <Grid
            size={{ mobile: 5, tablet: 3 }}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <StatusText
              value={
                statesAdvanced !== undefined
                  ? t(($) => $.seedStateFinder.statesAdvancedLabel, {
                      states: statesAdvanced,
                    })
                  : findTimerMs !== undefined
                    ? t(($) => $.common.seconds, {
                        sec: findTimerMs / 1000,
                        minimumFractionDigits: 3,
                      })
                    : undefined
              }
              errorText={
                (isResultNotFound ?? false)
                  ? t(($) => $.common.searchFailed)
                  : undefined
              }
              isVisible={isFinding}
              shouldImmediatelyHide={shouldImmediatelyHideFindTimer}
            />
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
}
