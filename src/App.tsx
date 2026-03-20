import { ThemeProvider } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import "./App.css";
import { theme } from "./theme";

export function App() {
  useEffect(() => {
    document.title = "XCX: DE - RNG Manipulation";
  }, []);

  return (
    <ThemeProvider theme={theme}>
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
