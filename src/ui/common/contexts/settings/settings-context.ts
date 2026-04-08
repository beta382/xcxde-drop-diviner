import { createContext, type Dispatch, useContext } from "react";
import type {
  SettingsLatest,
  SettingsUpdate,
} from "~/ui/common/contexts/settings/settings.types";

export const SettingsContext = createContext<
  { settings: SettingsLatest; dispatch: Dispatch<SettingsUpdate> } | undefined
>(undefined);

export function useMutableSettings(): [
  SettingsLatest,
  Dispatch<SettingsUpdate>,
] {
  const settingsContext = useContext(SettingsContext);
  if (!settingsContext) {
    throw new Error(
      "useSettings requires SettingsProvider to be higher in the component " +
        "tree",
    );
  }

  return [settingsContext.settings, settingsContext.dispatch];
}

export function useSettings(): SettingsLatest {
  return useMutableSettings()[0];
}
