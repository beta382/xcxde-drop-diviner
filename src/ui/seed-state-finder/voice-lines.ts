import type { Translation } from "~/common/languages";

export type VoiceLineKey = keyof Translation["vas"][
  | "male"
  | "female"][number]["voiceLines"];

export const voiceLineKeyForIndex = [
  "jump",
  "battle",
  "victory",
  "scout",
  "huh",
  "greeting",
  "stagger",
  "topple",
] as const satisfies VoiceLineKey[];

export const indexForVoiceLineKey = voiceLineKeyForIndex.reduce(
  (acc, voiceLine, i) => {
    acc[voiceLine] = i;
    return acc;
  },
  {} as Record<VoiceLineKey, number>,
);
