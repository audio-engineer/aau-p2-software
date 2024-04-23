"use client";

import { Roboto } from "next/font/google";
import type { ColorSystemOptions, CssVarsThemeOptions } from "@mui/material";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

const roboto = Roboto({ subsets: ["latin"], weight: "500" });

const commonPalette: ColorSystemOptions = {
  palette: {},
};

const lightPalette: ColorSystemOptions = {
  ...commonPalette,
  palette: {
    primary: {
      main: "#9e8d8d",
    },
  },
};

const darkPalette: ColorSystemOptions = {
  ...commonPalette,
  palette: {},
};

export const cssVarsThemeOptions: CssVarsThemeOptions = {
  colorSchemes: {
    dark: { ...darkPalette },
    light: { ...lightPalette },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
};

export const theme = extendTheme(cssVarsThemeOptions);
