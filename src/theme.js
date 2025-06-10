import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4880FF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#202124",
      contrastText: "#E8EAED",
    },
    background: {
      default: "#FFFFFF",
      paper: "#E8EAED",
    },
    text: {
      primary: "#000000",
      secondary: "#7A7A7A",
    },
    cherryRedAccent: {
      main: "#E15A51",
    },
    mintAccent: {
      main: "#85E0A3",
    },
    azureLightBlueAccent: {
      main: "#8CC6E7",
    },
    honeyYellowAccent: {
      main: "#FFC700",
    },
    lavenderAccent: {
      main: "#C7B9FF",
    },
  },
  typography: {
    fontFamily: "Nunito, sans-serif",
  },
});

export default theme;