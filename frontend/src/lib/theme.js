import { createTheme } from "@mui/material/styles";

export const colors = {
  ink: "#14161A",
  muted: "#5B6270",
  line: "#E8E6E1",
  surface: "#F6F5F1",
  red: "#D10E14",
  redDark: "#B50B11",
  burgundy: "#7F1226",
  burgundyDark: "#6A0F20",
  blue: "#1D4FB8",
  blueDark: "#1A45A0",
  gold: "#C9A24B",
};

export const displayFont = "var(--font-changa), sans-serif";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: { main: colors.ink },
    text: { primary: colors.ink, secondary: colors.muted },
  },
  typography: {
    fontFamily: "var(--font-plex), sans-serif",
    h1: { fontFamily: displayFont, fontWeight: 800 },
    h2: { fontFamily: displayFont, fontWeight: 700 },
    h3: { fontFamily: displayFont, fontWeight: 700 },
    h4: { fontFamily: displayFont, fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 18, height: 56, fontSize: 17, fontWeight: 600 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 16 } },
    },
  },
});

export default theme;
