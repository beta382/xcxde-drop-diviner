import { useReducer, type ReactNode } from "react";
import {
  loadAndMigrateSettings,
  settingsReducer,
} from "~/ui/common/contexts/settings/settings";
import { SettingsContext } from "~/ui/common/contexts/settings/settings-context";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, dispatch] = useReducer(
    settingsReducer,
    undefined,
    loadAndMigrateSettings,
  );

  return (
    <SettingsContext value={{ settings, dispatch }}>{children}</SettingsContext>
  );
}
