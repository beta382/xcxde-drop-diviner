import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 750,
      desktop: 1200,
    },
  },
  components: {
    MuiIcon: {
      defaultProps: {
        baseClassName: "material-symbols-outlined",
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.8)",
          "&.Mui-disabled": {
            color: "rgba(255, 255, 255, 0.4)",
          },
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        enterDelay: 300,
        enterTouchDelay: 300,
      },
    },
  },
  palette: {
    mode: "dark",
    contrastThreshold: 3.5,
    tonalOffset: 0.1,
    background: {
      default: "#121212",
    },
    primary: {
      main: "#059C98",
    },
  },
});
