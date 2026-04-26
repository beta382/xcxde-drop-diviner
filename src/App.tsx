import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { languages, muiLocales } from "~/common/languages";
import { theme } from "~/theme";
import { LockoutProvider } from "~/ui/common/contexts/lockout/LockoutProvider";
import { RngProvider } from "~/ui/common/contexts/rng/RngProvider";
import { SettingsProvider } from "~/ui/common/contexts/settings/SettingsProvider";
import { LootFinder } from "~/ui/loot-finder/LootFinder";
import { SeedStateFinder } from "~/ui/seed-state-finder/SeedStateFinder";
import { TopBar } from "~/ui/TopBar";

export function App() {
  const [t, i18n] = useTranslation();

  useEffect(() => {
    document.title = t(($) => $.title);
  }, [t]);

  const themeWithLocale = createTheme(
    theme,
    muiLocales[languages[i18n.language].muiShorthand],
  );

  return (
    <ThemeProvider theme={themeWithLocale}>
      <SettingsProvider>
        <RngProvider>
          <LockoutProvider>
            <CssBaseline />
            <Content />
          </LockoutProvider>
        </RngProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

function Content() {
  return (
    <>
      <TopBar />

      <Container maxWidth="desktop">
        <Stack
          spacing={3}
          sx={{
            minHeight: "100dvh",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 3,
            marginBottom: 3,
          }}
        >
          <SeedStateFinder />
          <LootFinder />
        </Stack>
      </Container>
    </>
  );
}
