import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import { defaultSettings } from "~/ui/common/contexts/settings/settings";
import { useMutableSettings } from "~/ui/common/contexts/settings/settings-context";
import type { SettingsLatest } from "~/ui/common/contexts/settings/settings.types";
import { SettingIntegerField } from "~/ui/settings/util/SettingIntegerField";
import { SettingSelect } from "~/ui/settings/util/SettingSelect";

export function SeedFinderSettings() {
  const [t] = useTranslation();
  const [settings, updateSettings] = useMutableSettings();

  const workerTypes: SettingsLatest["advanced.seedFinder.workerType"][] = [
    "wasm",
    "ts",
  ];
  const regions: SettingsLatest["advanced.seedFinder.region"][] = [
    "barracks",
    "volitaris",
    "noctilumFog",
    "custom",
  ];

  return (
    <>
      {/* Worker Type */}
      <SettingSelect
        label={t(($) => $.settings.label.seedFinder.workerType)}
        tooltip={t(($) => $.settings.tooltip.seedFinder.workerType)}
        valueIndex={workerTypes.indexOf(
          settings["advanced.seedFinder.workerType"],
        )}
        values={workerTypes.map((type) =>
          t(($) => $.settings.options.seedFinder.workerType[type]),
        )}
        onChange={(nextValueIndex) => {
          updateSettings({
            "advanced.seedFinder.workerType": workerTypes[nextValueIndex],
          });
        }}
      />

      {/* Region */}
      <SettingSelect
        label={t(($) => $.settings.label.seedFinder.region)}
        tooltip={t(($) => $.settings.tooltip.seedFinder.region)}
        valueIndex={regions.indexOf(settings["advanced.seedFinder.region"])}
        values={regions.map((region) =>
          t(($) => $.settings.options.seedFinder.region[region]),
        )}
        onChange={(nextValueIndex) => {
          updateSettings({
            "advanced.seedFinder.region": regions[nextValueIndex],
          });
        }}
      />

      {/* Start State */}
      <SettingIntegerField
        label={t(
          ($) =>
            $.settings.label.seedFinder[
              `${settings["advanced.seedFinder.region"]}StartState`
            ],
        )}
        tooltip={t(($) => $.settings.tooltip.seedFinder.startState)}
        value={
          settings[
            `advanced.seedFinder.${settings["advanced.seedFinder.region"]}StartState`
          ]
        }
        defaultValue={
          defaultSettings[
            `advanced.seedFinder.${settings["advanced.seedFinder.region"]}StartState`
          ]
        }
        min={0}
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          // TS chokes on the template literal, so have to do this individually
          switch (settings["advanced.seedFinder.region"]) {
            case "barracks":
              updateSettings({
                "advanced.seedFinder.barracksStartState": nextValue,
              });
              return;
            case "noctilumFog":
              updateSettings({
                "advanced.seedFinder.noctilumFogStartState": nextValue,
              });
              return;
            case "volitaris":
              updateSettings({
                "advanced.seedFinder.volitarisStartState": nextValue,
              });
              return;
            case "custom":
              updateSettings({
                "advanced.seedFinder.customStartState": nextValue,
              });
              return;
            default:
              return settings["advanced.seedFinder.region"] satisfies never;
          }
        }}
      />

      {/* Search Depth */}
      <SettingIntegerField
        label={t(
          ($) =>
            $.settings.label.seedFinder[
              `${settings["advanced.seedFinder.region"]}SearchDepth`
            ],
        )}
        tooltip={t(($) => $.settings.tooltip.seedFinder.searchDepth)}
        value={
          settings[
            `advanced.seedFinder.${settings["advanced.seedFinder.region"]}StateSearchDepth`
          ]
        }
        defaultValue={
          defaultSettings[
            `advanced.seedFinder.${settings["advanced.seedFinder.region"]}StateSearchDepth`
          ]
        }
        min={1}
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          // TS chokes on the template literal, so have to do this individually
          switch (settings["advanced.seedFinder.region"]) {
            case "barracks":
              updateSettings({
                "advanced.seedFinder.barracksStateSearchDepth": nextValue,
              });
              return;
            case "noctilumFog":
              updateSettings({
                "advanced.seedFinder.noctilumFogStateSearchDepth": nextValue,
              });
              return;
            case "volitaris":
              updateSettings({
                "advanced.seedFinder.volitarisStateSearchDepth": nextValue,
              });
              return;
            case "custom":
              updateSettings({
                "advanced.seedFinder.customStateSearchDepth": nextValue,
              });
              return;
            default:
              return settings["advanced.seedFinder.region"] satisfies never;
          }
        }}
      />

      <Divider />

      {/* System Tick Rate (Hz) */}
      <SettingIntegerField
        tooltip={t(($) => $.settings.tooltip.seedFinder.systemTickRateHz)}
        label={t(
          ($) =>
            $.settings.label.seedFinder[
              `${settings.systemType}SystemTickRateHz`
            ],
        )}
        value={
          settings[`advanced.seedFinder.${settings.systemType}SystemTickRateHz`]
        }
        defaultValue={
          defaultSettings[
            `advanced.seedFinder.${settings.systemType}SystemTickRateHz`
          ]
        }
        min={0}
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          // TS chokes on the template literal, so have to do this individually
          switch (settings.systemType) {
            case "switch1":
              updateSettings({
                "advanced.seedFinder.switch1SystemTickRateHz": nextValue,
              });
              return;
            case "switch2":
              updateSettings({
                "advanced.seedFinder.switch2SystemTickRateHz": nextValue,
              });
              return;
            default:
              return settings.systemType satisfies never;
          }
        }}
      />

      {/* User Timing Adjustment (ms) */}
      <SettingIntegerField
        label={t(($) => $.settings.label.seedFinder.userTimingAdjustmentMs)}
        tooltip={t(($) => $.settings.tooltip.seedFinder.userTimingAdjustmentMs)}
        value={Math.round(
          settings["advanced.seedFinder.userTimingAdjustmentMsHistory"].reduce(
            (acc, adjustmentMs) => acc + adjustmentMs,
            0,
          ) /
            settings["advanced.seedFinder.userTimingAdjustmentMsHistory"]
              .length,
        )}
        defaultValue={
          defaultSettings[
            "advanced.seedFinder.userTimingAdjustmentMsHistory"
          ][0]
        }
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          updateSettings({
            "advanced.seedFinder.userTimingAdjustmentMsHistory": [nextValue],
          });
        }}
      />

      <Divider />

      {/* Minimum Voice Lines */}
      <SettingIntegerField
        label={t(($) => $.settings.label.seedFinder.minimumVoiceLines)}
        tooltip={t(($) => $.settings.tooltip.seedFinder.minimumVoiceLines)}
        value={settings["advanced.seedFinder.minimumVoiceLines"]}
        defaultValue={defaultSettings["advanced.seedFinder.minimumVoiceLines"]}
        min={1}
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          updateSettings({
            "advanced.seedFinder.minimumVoiceLines": nextValue,
          });
        }}
      />
    </>
  );
}
