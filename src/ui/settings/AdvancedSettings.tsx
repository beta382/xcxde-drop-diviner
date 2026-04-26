import { useTranslation } from "react-i18next";
import { defaultSettings } from "~/ui/common/contexts/settings/settings";
import { useMutableSettings } from "~/ui/common/contexts/settings/settings-context";
import { SettingIntegerField } from "~/ui/settings/util/SettingIntegerField";
import { SettingSwitch } from "~/ui/settings/util/SettingSwitch";

export function AdvancedSettings() {
  const [t] = useTranslation();
  const [settings, updateSettings] = useMutableSettings();

  return (
    <>
      {/* Threads */}
      <SettingIntegerField
        tooltip={t(($) => $.settings.tooltip.numThreads)}
        label={t(($) => $.settings.label.numThreads)}
        value={
          settings["advanced.numThreads"] === "system"
            ? undefined
            : settings["advanced.numThreads"]
        }
        defaultValue={
          defaultSettings["advanced.numThreads"] === "system"
            ? undefined
            : defaultSettings["advanced.numThreads"]
        }
        placeholder={
          settings["advanced.numThreads"] === "system"
            ? navigator.hardwareConcurrency.toString()
            : undefined
        }
        min={0}
        onChange={(nextValue) => {
          updateSettings({ "advanced.numThreads": nextValue ?? "system" });
        }}
      />

      {/* Allow Manual Input */}
      <SettingSwitch
        label={t(($) => $.settings.label.allowManualInput)}
        checked={settings["advanced.allowManualSeedStateInput"]}
        onChange={(nextChecked) => {
          updateSettings({
            "advanced.allowManualSeedStateInput": nextChecked,
          });
        }}
      />
    </>
  );
}
