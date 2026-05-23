import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { KeyedList } from "~/ui/common/common.types";
import { useLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { useRng } from "~/ui/common/contexts/rng/rng-context";
import { useSettings } from "~/ui/common/contexts/settings/settings-context";
import { SeedEstimateTimer } from "~/ui/seed-state-finder/SeedEstimateTimer";
import {
  SeedFilePicker,
  type SeedFile,
} from "~/ui/seed-state-finder/SeedFilePicker";
import { SeedStateControl } from "~/ui/seed-state-finder/SeedStateControl";
import type { VoiceLineKey } from "~/ui/seed-state-finder/voice-lines";
import { VoiceLineSearch } from "~/ui/seed-state-finder/VoiceLineSearch";
import { useSeedFileSearch } from "~/ui/seed-state-finder/worker-hooks/seed-file-search-hook";
import { useSeedSearch } from "~/ui/seed-state-finder/worker-hooks/seed-search-hook";
import { useStateSearch } from "~/ui/seed-state-finder/worker-hooks/state-search-hook";

export function SeedStateFinder() {
  const settings = useSettings();
  const useSeedFile = settings["advanced.seedFinder.useSeedFile"];
  const rng = useRng();

  const lockout = useLockout("global");

  const [t] = useTranslation();

  const [isTimingSeed, setIsTimingSeed] = useState(false);
  const [seedEstimateMs, setSeedEstimateMs] = useState<number>();

  const [seedFile, setSeedFile] = useState<SeedFile>();

  const [voiceLines, setVoiceLines] = useState<KeyedList<VoiceLineKey>>([]);
  const [backupVoiceLines, setBackupVoiceLines] =
    useState<KeyedList<VoiceLineKey>>();

  const [doSeedSearchAction, handleCancelSeedSearch] = useSeedSearch(
    !rng && !useSeedFile,
    seedEstimateMs ?? 0,
  );
  const [doSeedFileSearchAction, handleCancelSeedFileSearch] =
    useSeedFileSearch(!rng && useSeedFile, seedFile?.file);
  const [doStateSearchAction, handleCancelStateSearch] = useStateSearch(!!rng);

  const [prevSeed, setPrevSeed] = useState(rng?.seed);

  if (rng?.seed !== prevSeed) {
    setSeedEstimateMs(undefined);
    setVoiceLines([]);
    setBackupVoiceLines(undefined);

    setPrevSeed(rng?.seed);
  }

  return (
    <Paper elevation={8} sx={{ padding: 3, borderRadius: 3, width: "100%" }}>
      <Stack spacing={2}>
        <SeedStateControl disabled={isTimingSeed || lockout} />

        <Divider />

        <Collapse
          in={!rng}
          unmountOnExit
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
          {!useSeedFile ? (
            <SeedEstimateTimer
              disabled={!!rng || lockout}
              onStartTimer={() => {
                setIsTimingSeed(true);
              }}
              onMakeSeedEstimate={(nextSeedEstimateMs) => {
                setSeedEstimateMs(nextSeedEstimateMs);
                setIsTimingSeed(false);
              }}
              onReset={() => {
                setSeedEstimateMs(undefined);
                setVoiceLines([]);
                setBackupVoiceLines(undefined);
              }}
            />
          ) : (
            <SeedFilePicker
              seedFile={seedFile}
              disabled={!!rng || lockout}
              onChangeSeedFile={setSeedFile}
            />
          )}
        </Collapse>

        <VoiceLineSearch
          voiceLines={voiceLines}
          backupVoiceLines={backupVoiceLines}
          startSearchLabel={t(($) =>
            !rng
              ? $.seedStateFinder.startSeedSearchButton
              : $.seedStateFinder.startStateSearchButton,
          )}
          disabled={
            !rng &&
            (!useSeedFile
              ? seedEstimateMs === undefined
              : seedFile === undefined || seedFile.header.type === "error")
          }
          minimumVoiceLines={
            !rng
              ? !useSeedFile
                ? settings["advanced.seedFinder.minimumVoiceLines"]
                : 12
              : settings["advanced.stateFinder.minimumVoiceLines"]
          }
          onChangeVoiceLines={setVoiceLines}
          onChangeBackupVoiceLines={setBackupVoiceLines}
          doSearchAction={
            !rng
              ? !useSeedFile
                ? doSeedSearchAction
                : doSeedFileSearchAction
              : doStateSearchAction
          }
          onCancelSearch={
            !rng
              ? !useSeedFile
                ? handleCancelSeedSearch
                : handleCancelSeedFileSearch
              : handleCancelStateSearch
          }
        />
      </Stack>
    </Paper>
  );
}
