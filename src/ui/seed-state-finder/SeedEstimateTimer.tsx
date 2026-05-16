import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useEffectEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilledIcon } from "~/ui/common/components/FilledIcon";
import { StatusText } from "~/ui/common/components/StatusText";
import { useBreakpoint, useTimer } from "~/ui/common/hooks";

export function SeedEstimateTimer({
  disabled,
  onStartTimer,
  onMakeSeedEstimate,
  onReset,
}: {
  disabled: boolean;
  onStartTimer: () => void;
  onMakeSeedEstimate: (seedEstimateMs: number) => void;
  onReset: () => void;
}) {
  const [t] = useTranslation();

  const breakpoint = useBreakpoint();

  const [isTimingSeed, seedTimerMs, startSeedTimer, stopSeedTimer] = useTimer();
  const [wasReset, setWasReset] = useState(false);

  const [shouldMakeSeedEstimate, setShouldMakeSeedEstimate] = useState(false);

  const onMakeSeedEstimateEffectEvent = useEffectEvent(() => {
    if (seedTimerMs === undefined) {
      throw new Error(
        "Attempted to make seed estimate without having a valid seedTimerMs",
      );
    }

    onMakeSeedEstimate(seedTimerMs);
    setShouldMakeSeedEstimate(false);
  });

  useEffect(() => {
    if (shouldMakeSeedEstimate) {
      onMakeSeedEstimateEffectEvent();
    }
  }, [shouldMakeSeedEstimate]);

  function handleStartTimer(): void {
    startSeedTimer();
    setWasReset(false);

    onStartTimer();
  }

  function handleStopTimer(): void {
    stopSeedTimer();
    setShouldMakeSeedEstimate(true);
  }

  function handleReset(): void {
    setWasReset(true);
    onReset();
  }

  return (
    <Grid container spacing={2}>
      <Grid
        size={{ mobile: 2.75, tablet: 3.5, desktop: 4 }}
        sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}
      >
        <Tooltip
          title={t(($) => $.seedStateFinder.timerTooltip)}
          arrow
          placement={breakpoint === "desktop" ? "left" : "top"}
        >
          <FilledIcon fontSize="small">info</FilledIcon>
        </Tooltip>
      </Grid>
      <Grid size={{ mobile: 6.5, tablet: 5, desktop: 4 }}>
        {isTimingSeed === undefined || wasReset ? (
          <Button
            variant="contained"
            fullWidth
            disabled={disabled}
            onClick={handleStartTimer}
          >
            {t(($) => $.seedStateFinder.timerStartButton)}
          </Button>
        ) : isTimingSeed ? (
          <Button
            variant="contained"
            fullWidth
            disabled={disabled}
            onClick={handleStopTimer}
          >
            {t(($) => $.seedStateFinder.timerStopButton)}
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            disabled={disabled}
            onClick={handleReset}
          >
            {t(($) => $.seedStateFinder.timerResetButton)}
          </Button>
        )}
      </Grid>
      <Grid
        size={{ mobile: 2.75, tablet: 3.5, desktop: 4 }}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <StatusText
          value={
            seedTimerMs !== undefined
              ? t(($) => $.common.seconds, {
                  sec: seedTimerMs / 1000,
                  minimumFractionDigits: 3,
                })
              : undefined
          }
          isVisible={isTimingSeed}
          shouldImmediatelyHide={wasReset}
        />
      </Grid>
    </Grid>
  );
}
