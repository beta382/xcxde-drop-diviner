import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import type { KeyedList } from "~/ui/common/common.types";
import { useKey, useVoiceLineTranslation } from "~/ui/common/hooks";
import {
  voiceLineKeyForIndex,
  type VoiceLineKey,
} from "~/ui/seed-state-finder/voice-lines";
import { VoiceLineList } from "~/ui/seed-state-finder/VoiceLineList";

export function VoiceLinePicker({
  voiceLines,
  disabled = false,
  onAddVoiceLine,
}: {
  voiceLines: KeyedList<VoiceLineKey>;
  disabled?: boolean;
  onAddVoiceLine: (voiceLine: KeyedList<VoiceLineKey>[number]) => void;
}) {
  const [t] = useTranslation();
  const tVoiceLine = useVoiceLineTranslation();

  const [key, incrementKey] = useKey();

  return (
    <Grid container spacing={2}>
      {voiceLineKeyForIndex.map((voiceLineKey) => {
        return (
          <Grid key={voiceLineKey} size={{ mobile: 6, tablet: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              disabled={disabled}
              onClick={() => {
                onAddVoiceLine({ key, element: voiceLineKey });
                incrementKey();
              }}
              sx={{ minHeight: "100%" }}
            >
              {tVoiceLine(voiceLineKey)}
            </Button>
          </Grid>
        );
      })}
      <Grid size={12}>
        <Stack
          sx={{
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {t(($) => $.seedStateFinder.inputVoiceLinesLabel)}
          </Typography>
          <VoiceLineList voiceLines={voiceLines} />
        </Stack>
      </Grid>
    </Grid>
  );
}
