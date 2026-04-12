import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MtRand } from "~/common/util/mt-rand";
import type { KeyedList } from "~/ui/common/common.types";
import { InputIconButtonAdornment } from "~/ui/common/components/InputIconButtonAdornment";
import { IntegerField } from "~/ui/common/components/IntegerField";
import { useMutableLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { useMutableRng } from "~/ui/common/contexts/rng/rng-context";
import { useSettings } from "~/ui/common/contexts/settings/settings-context";
import { useBreakpoint } from "~/ui/common/hooks";
import { createLongStateAdvanceWorker } from "~/ui/common/workers";
import type { LongStateAdvanceWorker } from "~/ui/common/workers/long-state-advance/long-state-advance.types";
import type { ResultType } from "~/ui/common/workers/workers.types";
import {
  voiceLineKeyForIndex,
  type VoiceLineKey,
} from "~/ui/seed-state-finder/voice-lines";
import { VoiceLineList } from "~/ui/seed-state-finder/VoiceLineList";

const MANUAL_STATE_ADVANCE_IS_LONG_THRESHOLD = 10_000_000;

export function SeedStateControl({
  disabled = false,
  onSeedSet,
  onSeedCleared,
}: {
  disabled?: boolean;
  onSeedSet: () => void;
  onSeedCleared: () => void;
}) {
  const settings = useSettings();
  const [rng, updateRng] = useMutableRng();
  const [lockout, setLockout] = useMutableLockout("global");

  const [t] = useTranslation();

  const breakpoint = useBreakpoint();

  const [isResetRngDialogOpen, setIsResetRngDialogOpen] = useState(false);

  const [optimisticRngState, setOptimisticRngState] = useState<number>();

  const longStateAdvanceWorkerRef = useRef<LongStateAdvanceWorker>(null);

  disabled = disabled || lockout;

  const seedFieldDisabled =
    disabled || !settings["advanced.allowManualSeedStateInput"];
  const rngResetDisabled = disabled || rng === undefined;

  const stateFieldDisabled =
    disabled ||
    rng === undefined ||
    !settings["advanced.allowManualSeedStateInput"];
  const stateUndoDisabled = disabled || rng?.backupStateIndex === undefined;

  const prevStateDisabled =
    disabled ||
    rng === undefined ||
    rng.minimumGoToStateIndex >= rng.stateIndex;
  const nextStateDisabled = disabled || rng === undefined;

  const nextVoiceLines: KeyedList<VoiceLineKey> | undefined =
    rng &&
    (() => {
      const tmpRng = rng.getRngCopy();
      return Array.from({
        length: settings["advanced.stateFinder.numUpcomingVoiceLines"],
      }).map(() => ({
        key: tmpRng.stateIndex,
        element: voiceLineKeyForIndex[tmpRng.randIntPow2(3)],
      }));
    })();

  const longStateAdvanceWorkerOnMessageEffectEvent = useEffectEvent(
    ({ data }: MessageEvent<ResultType<LongStateAdvanceWorker>>): void => {
      if (data.type !== "terminalResult") {
        return;
      }

      setLockout(false);
      setOptimisticRngState(undefined);

      if (!data.result) {
        return;
      }

      updateRng({
        type: "setRng",
        rng: new MtRand(data.result.rng),
        keyframe: new MtRand(data.result.keyframe),
      });
    },
  );

  useEffect(() => {
    longStateAdvanceWorkerRef.current = createLongStateAdvanceWorker();

    longStateAdvanceWorkerRef.current.onmessage =
      longStateAdvanceWorkerOnMessageEffectEvent;

    return () => {
      longStateAdvanceWorkerRef.current?.terminate();
    };
  }, []);

  function handleSetSeed(seed: number | undefined): void {
    if (seed === undefined) {
      updateRng({ type: "reset" });
      onSeedCleared();
      return;
    } else {
      updateRng({ type: "setSeedAndResetState", value: seed });
      onSeedSet();
    }
  }

  function handleSetState(state: number | undefined): void {
    updateRng({ type: "snapshotBackupRng" });
    if (rng && state !== undefined) {
      const stateAdvanceCount =
        state - (state >= rng.stateIndex ? rng.stateIndex : 0);
      if (stateAdvanceCount > MANUAL_STATE_ADVANCE_IS_LONG_THRESHOLD) {
        setLockout(true);
        setOptimisticRngState(state);
        longStateAdvanceWorkerRef.current?.postMessage({
          rng: rng.getRngCopy().deconstruct(),
          targetState: state,
        });

        return;
      }
    }

    updateRng({ type: "setState", value: state ?? 0 });
  }

  return (
    <>
      <Grid container spacing={2}>
        {breakpoint !== "mobile" && <Grid size={{ tablet: 2, desktop: 2.5 }} />}
        <Grid size={{ mobile: 6, tablet: 3.5, desktop: 3 }}>
          <IntegerField
            label={t(($) => $.seedStateFinder.seedLabel)}
            placeholder="00000000"
            size="small"
            fullWidth
            disabled={seedFieldDisabled}
            value={rng?.seed}
            min={0}
            max={0xffffffff}
            hex
            onChange={handleSetSeed}
            slotProps={{
              input: {
                endAdornment: (
                  <InputIconButtonAdornment
                    tooltip={t(($) => $.seedStateFinder.discardSeedTooltip)}
                    color="error"
                    filledIcon
                    disabled={rngResetDisabled}
                    onClick={() => {
                      setIsResetRngDialogOpen(true);
                    }}
                  >
                    delete
                  </InputIconButtonAdornment>
                ),
              },
            }}
          />
        </Grid>
        {breakpoint !== "mobile" && <Grid size={{ tablet: 1 }} />}
        <Grid size={{ mobile: 6, tablet: 3.5, desktop: 3 }}>
          <Box
            sx={{
              width: "100%",
              position: "relative",
            }}
          >
            <IntegerField
              label={t(($) => $.seedStateFinder.stateLabel)}
              placeholder="-"
              size="small"
              fullWidth
              disabled={stateFieldDisabled}
              value={
                optimisticRngState === undefined
                  ? rng?.stateIndex
                  : optimisticRngState
              }
              min={0}
              onChange={handleSetState}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  endAdornment: (
                    <InputIconButtonAdornment
                      tooltip={
                        rng?.backupStateIndex !== undefined
                          ? t(($) => $.seedStateFinder.restoreStateTooltip, {
                              prevState: rng.backupStateIndex.toString(),
                            })
                          : undefined
                      }
                      disabled={stateUndoDisabled}
                      onClick={() => {
                        updateRng({ type: "restoreBackupRng" });
                      }}
                    >
                      undo
                    </InputIconButtonAdornment>
                  ),
                },
              }}
            />
            {optimisticRngState !== undefined && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </Grid>
        {breakpoint !== "mobile" && <Grid size={{ tablet: 2, desktop: 2.5 }} />}

        {breakpoint !== "mobile" && <Grid size={{ tablet: 3, desktop: 4 }} />}
        <Grid size={{ mobile: 6, tablet: 3, desktop: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            disabled={prevStateDisabled}
            onClick={() => {
              updateRng({ type: "prevState" });
            }}
            sx={{ minHeight: "100%" }}
          >
            {t(($) => $.seedStateFinder.prevStateButton)}
          </Button>
        </Grid>
        <Grid size={{ mobile: 6, tablet: 3, desktop: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            disabled={nextStateDisabled}
            onClick={() => {
              updateRng({ type: "nextState" });
            }}
            sx={{ minHeight: "100%" }}
          >
            {t(($) => $.seedStateFinder.nextStateButton)}
          </Button>
        </Grid>
        {breakpoint !== "mobile" && <Grid size={{ tablet: 3, desktop: 4 }} />}

        <Grid size={12}>
          <Stack
            sx={{
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              {t(($) => $.seedStateFinder.upcomingVoiceLinesLabel)}
            </Typography>
            <VoiceLineList voiceLines={nextVoiceLines} />
          </Stack>
        </Grid>
      </Grid>

      <ResetConfirmDialog
        open={isResetRngDialogOpen}
        onCancel={() => {
          setIsResetRngDialogOpen(false);
        }}
        onConfirm={() => {
          setIsResetRngDialogOpen(false);

          handleSetSeed(undefined);
        }}
      />
    </>
  );
}

function ResetConfirmDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [t] = useTranslation();

  return (
    <Dialog open={open} disableRestoreFocus onClose={onCancel}>
      <DialogTitle>
        {t(($) => $.seedStateFinder.discardSeedDialog.title)}
      </DialogTitle>
      <DialogContent>
        {t(($) => $.seedStateFinder.discardSeedDialog.body)}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel}>
          {t(($) => $.common.cancel)}
        </Button>
        <Button color="error" onClick={onConfirm}>
          {t(($) => $.common.confirm)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
