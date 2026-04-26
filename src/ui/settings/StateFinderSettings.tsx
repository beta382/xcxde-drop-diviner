import { useTranslation } from "react-i18next";
import { defaultSettings } from "~/ui/common/contexts/settings/settings";
import { useMutableSettings } from "~/ui/common/contexts/settings/settings-context";
import { SettingIntegerField } from "~/ui/settings/util/SettingIntegerField";

export function StateFinderSettings() {
  const [t] = useTranslation();
  const [settings, updateSettings] = useMutableSettings();

  return (
    <>
      {/* Search Depth */}
      <SettingIntegerField
        label={t(($) => $.settings.label.stateFinder.searchDepth)}
        tooltip={t(($) => $.settings.tooltip.stateFinder.searchDepth)}
        value={settings["advanced.stateFinder.searchDepth"]}
        defaultValue={defaultSettings["advanced.stateFinder.searchDepth"]}
        min={1}
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          updateSettings({ "advanced.stateFinder.searchDepth": nextValue });
        }}
      />

      {/* Minimum Voice Lines */}
      <SettingIntegerField
        label={t(($) => $.settings.label.stateFinder.minimumVoiceLines)}
        tooltip={t(($) => $.settings.tooltip.stateFinder.minimumVoiceLines)}
        value={settings["advanced.stateFinder.minimumVoiceLines"]}
        defaultValue={defaultSettings["advanced.stateFinder.minimumVoiceLines"]}
        min={1}
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          updateSettings({
            "advanced.stateFinder.minimumVoiceLines": nextValue,
          });
        }}
      />

      {/* Upcoming Voice Lines */}
      <SettingIntegerField
        label={t(($) => $.settings.label.stateFinder.numUpcomingVoiceLines)}
        tooltip={t(($) => $.settings.tooltip.stateFinder.numUpcomingVoiceLines)}
        value={settings["advanced.stateFinder.numUpcomingVoiceLines"]}
        defaultValue={
          defaultSettings["advanced.stateFinder.numUpcomingVoiceLines"]
        }
        min={1}
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          updateSettings({
            "advanced.stateFinder.numUpcomingVoiceLines": nextValue,
          });
        }}
      />
    </>
  );
}
