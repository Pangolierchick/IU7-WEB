import { createTheme } from "@mui/material/styles";

const defaultTheme = createTheme({
  typography: {
    fontFamily: ["Raleway"].join(","),
  },
  palette: {
    primary: {
      main: "#116a7b",
    },
  },
});

export default defaultTheme;
