import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import {
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";
import type { KeyedList } from "~/ui/common/common.types";
import { RunButton } from "~/ui/common/components/RunButton";
import { StatusText } from "~/ui/common/components/StatusText";
import { useMutableLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { useBreakpoint, useTimer } from "~/ui/common/hooks";
import type { VoiceLineKey } from "~/ui/seed-state-finder/voice-lines";
import { VoiceLinePicker } from "~/ui/seed-state-finder/VoiceLinePicker";

export interface SearchActionResult {
  searchResult: "success" | "failure" | "canceled";
  nextSearchResultStatusText?: string;
  voiceLinesAction?: "clear" | "clearAndBackup";
}

export function VoiceLineSearch({
  voiceLines,
  backupVoiceLines,
  startSearchLabel,
  disabled,
  minimumVoiceLines,
  onChangeVoiceLines,
  onChangeBackupVoiceLines,
  doSearchAction,
  onCancelSearch,
}: {
  voiceLines: KeyedList<VoiceLineKey>;
  backupVoiceLines: KeyedList<VoiceLineKey> | undefined;
  startSearchLabel: string;
  disabled: boolean;
  minimumVoiceLines: number;
  onChangeVoiceLines: Dispatch<SetStateAction<typeof voiceLines>>;
  onChangeBackupVoiceLines: Dispatch<SetStateAction<typeof backupVoiceLines>>;
  doSearchAction: (voiceLines: VoiceLineKey[]) => Promise<SearchActionResult>;
  onCancelSearch: () => void;
}) {
  const [lockout, setLockout] = useMutableLockout("global");

  const [t] = useTranslation();

  const breakpoint = useBreakpoint();

  const [isSearching, startTransition] = useTransition();

  const [
    isSearchTimerRunning,
    searchTimerMs,
    startSearchTimer,
    stopSearchTimer,
  ] = useTimer();
  const [searchResultStatusText, setSearchResultStatusText] =
    useState<string>();
  const [searchResultWasSuccess, setSearchResultWasSuccess] =
    useState<boolean>();
  const [shouldImmediatelyHideStatusText, setShouldImmediatelyHideStatusText] =
    useState(false);

  function handleStartSearch(): void {
    startSearchTimer();
    setLockout(true);

    setSearchResultWasSuccess(undefined);
    setSearchResultStatusText(undefined);
    setShouldImmediatelyHideStatusText(false);

    startTransition(async () => {
      const result = await doSearchAction(
        voiceLines.map((voiceLine) => voiceLine.element),
      );
      startTransition(() => {
        handleFinishSearch(result);
      });
    });
  }

  // This function is called inside a transition callback, so it uses captured
  // values from before the transition (before the search started)
  function handleFinishSearch(result: SearchActionResult): void {
    stopSearchTimer();
    setLockout(false);

    switch (result.searchResult) {
      case "success":
        setSearchResultWasSuccess(true);
        setShouldImmediatelyHideStatusText(false);
        break;
      case "failure":
        setSearchResultWasSuccess(false);
        setShouldImmediatelyHideStatusText(false);
        break;
      case "canceled":
        setSearchResultWasSuccess(true);
        setShouldImmediatelyHideStatusText(true);
        break;
      default:
        return result.searchResult satisfies never;
    }

    setSearchResultStatusText(result.nextSearchResultStatusText);

    if (result.voiceLinesAction) {
      switch (result.voiceLinesAction) {
        case "clear":
          onChangeVoiceLines([]);
          onChangeBackupVoiceLines(undefined);
          break;
        case "clearAndBackup":
          onChangeVoiceLines([]);
          if (voiceLines.length > 0) {
            onChangeBackupVoiceLines(voiceLines);
          }
          break;
        default:
          return result.voiceLinesAction satisfies never;
      }
    }
  }

  return (
    <Stack spacing={2}>
      <VoiceLinePicker
        voiceLines={voiceLines}
        onAddVoiceLine={(voiceLine) => {
          onChangeVoiceLines((prevVoiceLines) => [
            ...prevVoiceLines,
            voiceLine,
          ]);
        }}
        disabled={disabled || isSearching}
      />

      <Grid container spacing={2} columns={18}>
        {isSearching ? (
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
              {voiceLines.length > 0 || backupVoiceLines === undefined ? (
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  disabled={disabled || voiceLines.length <= 0}
                  onClick={() => {
                    onChangeBackupVoiceLines(voiceLines);
                    onChangeVoiceLines([]);
                  }}
                  sx={{ minHeight: "100%" }}
                >
                  {t(($) => $.seedStateFinder.clearVoiceLinesButton)}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  fullWidth
                  disabled={disabled || isSearching}
                  onClick={() => {
                    onChangeBackupVoiceLines(undefined);
                    onChangeVoiceLines(backupVoiceLines);
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
                disabled={disabled || voiceLines.length <= 0}
                onClick={() => {
                  onChangeVoiceLines((prevVoiceLines) =>
                    prevVoiceLines.slice(0, -1),
                  );
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
          <RunButton
            runText={startSearchLabel}
            isRunning={isSearching}
            disabled={
              disabled ||
              voiceLines.length < minimumVoiceLines ||
              (lockout && !isSearching)
            }
            onStart={handleStartSearch}
            onCancel={onCancelSearch}
          />
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
              searchResultStatusText ??
              (searchTimerMs !== undefined
                ? t(($) => $.common.seconds, {
                    sec: searchTimerMs / 1000,
                    minimumFractionDigits: 3,
                  })
                : undefined)
            }
            errorText={
              !(searchResultWasSuccess ?? true)
                ? t(($) => $.common.searchFailed)
                : undefined
            }
            isVisible={isSearchTimerRunning}
            shouldImmediatelyHide={shouldImmediatelyHideStatusText}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
