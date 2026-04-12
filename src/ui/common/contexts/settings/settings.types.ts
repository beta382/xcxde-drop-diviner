import type { RequireExactlyOne } from "type-fest";
import type { VoiceLanguage } from "~/common/languages";
import type { DeconstructedMtRandView } from "~/ui/common/contexts/rng/mt-rand-view";
import type { FindSeedControllerCommand } from "~/ui/common/workers/find-seed/find-seed.types";

export type SettingsLatest = SettingsV1;
export type SettingsUpdate = RequireExactlyOne<{
  [K in keyof SettingsLatest]?:
    | SettingsLatest[K]
    | ((oldValue: SettingsLatest[K]) => SettingsLatest[K]);
}>;

export interface SettingsV1 {
  systemType: "switch1" | "switch2";
  playerGender: "female" | "male";
  playerVoice: number;
  playerVoiceLanguage: VoiceLanguage;
  "advanced.numThreads": number | "system";
  "advanced.allowManualSeedStateInput": boolean;
  "advanced.seedFinder.workerType": FindSeedControllerCommand["workerType"];
  "advanced.seedFinder.switch1SystemTickRateHz": number;
  "advanced.seedFinder.switch2SystemTickRateHz": number;
  "advanced.seedFinder.userTimingAdjustmentMsHistory": number[];
  "advanced.seedFinder.minimumVoiceLines": number;
  "advanced.seedFinder.region":
    | "barracks"
    | "noctilumFog"
    | "volitaris"
    | "custom";
  "advanced.seedFinder.barracksStartState": number;
  "advanced.seedFinder.barracksStateSearchDepth": number;
  "advanced.seedFinder.noctilumFogStartState": number;
  "advanced.seedFinder.noctilumFogStateSearchDepth": number;
  "advanced.seedFinder.volitarisStartState": number;
  "advanced.seedFinder.volitarisStateSearchDepth": number;
  "advanced.seedFinder.customStartState": number;
  "advanced.seedFinder.customStateSearchDepth": number;
  "advanced.stateFinder.numUpcomingVoiceLines": number;
  "advanced.stateFinder.minimumVoiceLines": number;
  "advanced.stateFinder.searchDepth": number;
  "advanced.lootFinder.showAllEnemies": boolean;
  "advanced.lootFinder.treasureSensor": number;
  "advanced.lootFinder.assumeOptimalParty": boolean;
  "advanced.lootFinder.offsetStateSearchDepth": number;
  "advanced.lootFinder.searchStateSearchDepth": number;
  "advanced.lootFinder.statesToDisplay": number;
  "hidden.rng": DeconstructedMtRandView | null;
}
