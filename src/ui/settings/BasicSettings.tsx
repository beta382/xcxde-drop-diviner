import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { languages, type Language } from "~/common/languages";
import { FilledIcon } from "~/ui/common/components/FilledIcon";
import { useMutableSettings } from "~/ui/common/contexts/settings/settings-context";
import type { SettingsLatest } from "~/ui/common/contexts/settings/settings.types";
import { SettingSelect } from "~/ui/settings/util/SettingSelect";

export function BasicSettings() {
  const [t, i18n] = useTranslation();
  const [settings, updateSettings] = useMutableSettings();

  const languageList = Object.keys(languages) as Language[];
  const playerVoiceLanguages: SettingsLatest["playerVoiceLanguage"][] = [
    "en",
    "ja",
  ];
  const playerGenders: SettingsLatest["playerGender"][] = ["female", "male"];
  const systemTypes: SettingsLatest["systemType"][] = ["switch1", "switch2"];

  return (
    <>
      {/* Language */}
      <SettingSelect
        label={t(($) => $.settings.label.siteLanguage)}
        tooltip={t(($) => $.settings.tooltip.siteLanguage)}
        valueIndex={languageList.indexOf(i18n.language)}
        values={languageList.map((language) => (
          <Box sx={{ display: "flex", alignItems: "center", minWidth: "100%" }}>
            <Typography sx={{ flexGrow: 1 }}>
              {languages[language].localName}
            </Typography>
            <FilledIcon
              color={languages[language].uiTranslated ? "success" : "warning"}
              fontSize="small"
            >
              {languages[language].uiTranslated ? "check" : "warning"}
            </FilledIcon>
          </Box>
        ))}
        onChange={(nextValueIndex) =>
          void i18n.changeLanguage(languageList[nextValueIndex])
        }
      />

      {/* Voice Language */}
      <SettingSelect
        label={t(($) => $.settings.label.playerVoiceLanguage)}
        valueIndex={playerVoiceLanguages.indexOf(settings.playerVoiceLanguage)}
        values={playerVoiceLanguages.map(
          (language) => languages[language].localName,
        )}
        onChange={(nextValueIndex) => {
          updateSettings({
            playerVoiceLanguage: playerVoiceLanguages[nextValueIndex],
          });
        }}
      />

      <Divider />

      {/* Cross Gender */}
      <SettingSelect
        label={t(($) => $.settings.label.playerGender)}
        valueIndex={playerGenders.indexOf(settings.playerGender)}
        values={playerGenders.map((gender) =>
          t(($) => $.settings.options.playerGender[gender]),
        )}
        onChange={(nextValueIndex) => {
          updateSettings({ playerGender: playerGenders[nextValueIndex] });
          updateSettings({ playerVoice: 0 });
        }}
      />

      {/* Cross Voice */}
      <SettingSelect
        label={t(($) => $.settings.label.playerVoice)}
        valueIndex={settings.playerVoice}
        values={t(($) => $.vas[settings.playerGender], {
          returnObjects: true,
          lng: settings.playerVoiceLanguage,
          fallbackLng: "en",
        }).map((va) => va.name)}
        onChange={(nextValueIndex) => {
          updateSettings({ playerVoice: nextValueIndex });
        }}
      />

      <Divider />

      {/* System Type */}
      <SettingSelect
        label={t(($) => $.settings.label.systemType)}
        valueIndex={systemTypes.indexOf(settings.systemType)}
        values={systemTypes.map((systemType) =>
          t(($) => $.settings.options.systemType[systemType]),
        )}
        onChange={(nextValueIndex) => {
          updateSettings({ systemType: systemTypes[nextValueIndex] });
        }}
      />
    </>
  );
}
