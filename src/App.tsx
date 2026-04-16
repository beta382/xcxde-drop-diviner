import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { languages, muiLocales } from "~/common/languages";
import { theme } from "~/theme";
import "./App.css";

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
      <Content />
    </ThemeProvider>
  );
}

function Content() {
  return (
    <Box
      minHeight="100dvh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Button variant="contained">Make me a Spatha</Button>
    </Box>
  );
}
