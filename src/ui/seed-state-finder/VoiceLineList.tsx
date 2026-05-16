import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import type { KeyedList } from "~/ui/common/common.types";
import { TextList } from "~/ui/common/components/TextList";
import { useSettings } from "~/ui/common/contexts/settings/settings-context";
import { useVoiceLineTranslation } from "~/ui/common/hooks";
import type { VoiceLineKey } from "~/ui/seed-state-finder/voice-lines";

export function VoiceLineList({
  voiceLines,
}: {
  voiceLines: KeyedList<VoiceLineKey> | undefined;
}) {
  const settings = useSettings();

  const [t] = useTranslation();
  const tVoiceLine = useVoiceLineTranslation();

  return voiceLines && voiceLines.length > 0 ? (
    <TextList
      values={voiceLines.map((voiceLine) => ({
        key: voiceLine.key,
        element: !settings["advanced.useXcxwwVoiceLines"]
          ? t(($) => $.common.stringQuote, {
              str: tVoiceLine(voiceLine.element),
            })
          : t(($) => $.vas.xcxww.voiceLines[voiceLine.element]),
      }))}
    />
  ) : (
    <Typography>-</Typography>
  );
}
