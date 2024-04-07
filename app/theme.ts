"use client";

import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({ subsets: ["latin"], weight: "500" });

const theme = createTheme({
  palette: {
    background: {
      default: "#1A535C",
    },
    primary: {
      main: "#4ECDC4",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
