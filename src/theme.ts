import { createTheme } from "@mui/material/styles";

const _theme = createTheme({
  palette: {
    mode: "dark",
    tonalOffset: 0.1,
  },
});

export const theme = createTheme(_theme, {
  palette: {
    mode: "dark",
    primary: _theme.palette.augmentColor({
      color: { main: "#059C98", contrastText: "#000000" },
      name: "primary",
    }),
  },
});
