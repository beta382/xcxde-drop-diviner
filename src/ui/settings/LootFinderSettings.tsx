import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import { defaultSettings } from "~/ui/common/contexts/settings/settings";
import { useMutableSettings } from "~/ui/common/contexts/settings/settings-context";
import { SettingIntegerField } from "~/ui/settings/util/SettingIntegerField";
import { SettingSwitch } from "~/ui/settings/util/SettingSwitch";

export function LootFinderSettings() {
  const [t] = useTranslation();
  const [settings, updateSettings] = useMutableSettings();

  return (
    <>
      {/* Show All Enemies */}
      <SettingSwitch
        label={t(($) => $.settings.label.lootFinder.showAllEnemies)}
        tooltip={t(($) => $.settings.tooltip.lootFinder.showAllEnemies)}
        checked={settings["advanced.lootFinder.showAllEnemies"]}
        onChange={(nextChecked) => {
          updateSettings({ "advanced.lootFinder.showAllEnemies": nextChecked });
        }}
      />

      {/* Treasure Sensor */}
      <SettingIntegerField
        label={t(($) => $.settings.label.lootFinder.treasureSensor)}
        value={settings["advanced.lootFinder.treasureSensor"]}
        defaultValue={defaultSettings["advanced.lootFinder.treasureSensor"]}
        min={0}
        max={100}
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          updateSettings({ "advanced.lootFinder.treasureSensor": nextValue });
        }}
      />

      <Divider />

      {/* Find Offset Search Depth */}
      <SettingIntegerField
        label={t(($) => $.settings.label.lootFinder.offsetSearchDepth)}
        tooltip={t(($) => $.settings.tooltip.lootFinder.offsetSearchDepth)}
        value={settings["advanced.lootFinder.offsetStateSearchDepth"]}
        defaultValue={
          defaultSettings["advanced.lootFinder.offsetStateSearchDepth"]
        }
        min={1}
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          updateSettings({
            "advanced.lootFinder.offsetStateSearchDepth": nextValue,
          });
        }}
      />

      {/* Search Equipment Search Depth */}
      <SettingIntegerField
        label={t(($) => $.settings.label.lootFinder.searchSearchDepth)}
        tooltip={t(($) => $.settings.tooltip.lootFinder.searchSearchDepth)}
        value={settings["advanced.lootFinder.searchStateSearchDepth"]}
        defaultValue={
          defaultSettings["advanced.lootFinder.searchStateSearchDepth"]
        }
        min={1}
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          updateSettings({
            "advanced.lootFinder.searchStateSearchDepth": nextValue,
          });
        }}
      />

      <Divider />

      {/* States to Display */}
      <SettingIntegerField
        label={t(($) => $.settings.label.lootFinder.statesToDisplay)}
        tooltip={t(($) => $.settings.tooltip.lootFinder.statesToDisplay)}
        value={settings["advanced.lootFinder.statesToDisplay"]}
        defaultValue={defaultSettings["advanced.lootFinder.statesToDisplay"]}
        min={1}
        onChange={(nextValue) => {
          if (nextValue === undefined) {
            return;
          }

          updateSettings({ "advanced.lootFinder.statesToDisplay": nextValue });
        }}
      />

      {/* Assume Optimal Party */}
      <SettingSwitch
        label={t(($) => $.settings.label.lootFinder.assumeOptimalParty)}
        tooltip={t(($) => $.settings.tooltip.lootFinder.assumeOptimalParty)}
        checked={settings["advanced.lootFinder.assumeOptimalParty"]}
        onChange={(nextChecked) => {
          updateSettings({
            "advanced.lootFinder.assumeOptimalParty": nextChecked,
          });
        }}
      />
    </>
  );
}
