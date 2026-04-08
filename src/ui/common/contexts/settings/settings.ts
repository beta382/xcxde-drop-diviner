import type {
  SettingsLatest,
  SettingsUpdate,
  SettingsV1,
} from "~/ui/common/contexts/settings/settings.types";

const SETTINGS_VERSION_KEY = "settings-version";
const SETTINGS_KEY = "settings";

export const defaultSettings: SettingsLatest = (() => {
  const settings = migrateToV1();
  return settings;
})();

function loadSettings(): unknown {
  const settingsJson = localStorage.getItem(SETTINGS_KEY);
  if (settingsJson === null) {
    throw new Error(`localStorage[${SETTINGS_KEY}] is null`);
  }

  return JSON.parse(settingsJson);
}

function migrateToV1(): SettingsV1 {
  return {
    systemType: "switch1",
    playerGender: "female",
    playerVoice: 0,
    playerVoiceLanguage: "en",
    "advanced.numThreads": "system",
    "advanced.allowManualSeedStateInput": false,
    "advanced.seedFinder.workerType": "wasm",
    "advanced.seedFinder.switch2SystemTickRateHz": 31_250_000,
    "advanced.seedFinder.switch1SystemTickRateHz": 19_200_000,
    "advanced.seedFinder.userTimingAdjustmentMsHistory": [3800],
    "advanced.seedFinder.minimumVoiceLines": 1,
    "advanced.seedFinder.region": "barracks",
    "advanced.seedFinder.barracksStartState": 335,
    "advanced.seedFinder.barracksStateSearchDepth": 2,
    "advanced.seedFinder.noctilumFogStartState": 1034,
    "advanced.seedFinder.noctilumFogStateSearchDepth": 2,
    "advanced.seedFinder.volitarisStartState": 26686,
    "advanced.seedFinder.volitarisStateSearchDepth": 2,
    "advanced.seedFinder.customStartState": 0,
    "advanced.seedFinder.customStateSearchDepth": 1,
    "advanced.stateFinder.numUpcomingVoiceLines": 5,
    "advanced.stateFinder.minimumVoiceLines": 1,
    "advanced.stateFinder.searchDepth": 10_000_000,
    "advanced.lootFinder.showAllEnemies": false,
    "advanced.lootFinder.treasureSensor": 100,
    "advanced.lootFinder.assumeOptimalParty": false,
    "advanced.lootFinder.offsetStateSearchDepth": 100,
    "advanced.lootFinder.searchStateSearchDepth": 30_000_000,
    "advanced.lootFinder.statesToDisplay": 3,
    "hidden.rng": null,
  };
}

function initialize(): { version: 1; settings: SettingsV1 } {
  return { version: 1, settings: migrateToV1() };
}

// function maybeLoadAndMigrate<PrevSettings, NextSettings>(
//   prevVersion: number,
//   prevSettings: PrevSettings | undefined,
//   migration: (settings: PrevSettings) => NextSettings,
// ): { version: number; settings: NextSettings } {
//   return {
//     version: prevVersion + 1,
//     settings: migration(prevSettings ?? (loadSettings() as PrevSettings)),
//   };
// }

function loadOrCommit(
  version: number,
  settings: SettingsLatest | undefined,
): SettingsLatest {
  if (!settings) {
    return loadSettings() as SettingsLatest;
  }

  localStorage.setItem(SETTINGS_VERSION_KEY, version.toString());
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

  return settings;
}

export function settingsReducer(
  prevSettings: SettingsLatest,
  updates: SettingsUpdate,
): SettingsLatest {
  const nextSettings = (
    Object.keys(updates) as (keyof SettingsUpdate)[]
  ).reduce(
    (acc, key) => ({
      ...acc,
      [key]:
        typeof updates[key] === "function"
          ? (
              updates[key] as (
                prevValue: SettingsLatest[typeof key],
              ) => SettingsLatest[typeof key]
            )(prevSettings[key])
          : updates[key],
    }),
    { ...prevSettings },
  );

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));

  return nextSettings;
}

export function loadAndMigrateSettings(): SettingsLatest {
  let version = +(localStorage.getItem(SETTINGS_VERSION_KEY) ?? 0);

  let settings;
  switch (version) {
    case 0:
      ({ version, settings } = initialize());
    // fall through
    // case n:
    //   ({ version, settings } = maybeLoadAndMigrate(
    //     version,
    //     settings,
    //     migrateToVn,
    //   ));
    // // fall through
    case 1:
      settings = loadOrCommit(version, settings);
      break;
    default:
      throw new Error(`Unsupported settings version=${version.toString()}`);
  }

  return settings;
}
