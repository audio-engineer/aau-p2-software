"use client";

import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import orange from "@mui/material/colors/orange";

const roboto = Roboto({ subsets: ["latin"], weight: "500" });

const orangeShade = 300;

const theme = createTheme({
  palette: {
    background: {
      default: orange[orangeShade],
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
